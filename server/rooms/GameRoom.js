const colyseus = require('colyseus');
const command = require('@colyseus/command');
const schema = require('@colyseus/schema');
const Schema = schema.Schema;
const ArraySchema = schema.ArraySchema;
//const ArraySchema = schema.ArraySchema;
const MapSchema = schema.MapSchema;
const {
  QuestionSchema,
  getQuestions,
  insertQuestion,
} = require('./schemas/question');
const { UserSchema, AddUser, RemoveUser } = require('./schemas/user');
const { MessagesSchema, AddMessage } = require('./schemas/messages');
const { AnswerSchema, AddAnswer } = require('./schemas/answer');
const { AddVotes } = require('./schemas/vote');

// OVERALL GAME STATE
// users : {key: value}
// question : {}
// gameStatus: 'lobby', 'prompt', 'failvote', 'passvote', 'tally', 'final'
//failAnswers: {clientId: answer}
//passAnswers: {clientId: answer}
//failVotes: {solutionClientId: votecount}
//passVotes:  {solutionClientId: votecount}

class GameState extends Schema {
  constructor() {
    super();
    //Users Map with key=client.id, value=user object
    this.users = new MapSchema();
    //Questions array
    this.question = new QuestionSchema();
    this.gameStatus = 'lobby';
    this.hostKey = '';
    this.timer = 1;
    this.round = 0;
    this.messages = new ArraySchema();
    //votes and answers were separate so that the objects being passed back and forth are smaller.
    this.failAnswers = new MapSchema();
    this.passAnswers = new MapSchema();
    this.failVotes = new MapSchema();
    this.passVotes = new MapSchema();
  }
}
schema.defineTypes(GameState, {
  users: { map: UserSchema },
  question: QuestionSchema,
  gameStatus: 'string',
  hostKey: 'string',
  timer: 'number',
  round: 'number',
  messages: [MessagesSchema],
  // answer: map all answers
  failAnswers: { map: AnswerSchema },
  passAnswers: { map: AnswerSchema },
  failVotes: { map: 'number' },
  passVotes: { map: 'number' },
});

class GameRoom extends colyseus.Room {
  constructor() {
    super();
    this.questions = [];
    this.roundNumber = 1;
    this.voteCount = 0;
  }

  async onCreate(options) {
    //Set initial game state
    this.setState(new GameState());
    this.dispatcher = new command.Dispatcher(this);
    this.questions = await getQuestions();
    this.maxClients = 6;
    this.gameStatus = 'lobby';

    //CLIENT SENDS MESSAGE TO GET QUESTION, SENDS QUESTION TO CLIENT
    this.onMessage('round', (client, data) => {
      this.state.round = 0;
      this.broadcast('round', this.state.round);
    });
    this.onMessage('getPrompt', (client, data) => {
      let prompt = {
        id: this.state.question.id,
        difficulty: this.state.question.difficulty,
        title: this.state.question.title,
        question: this.state.question.question,
        testSpecs: this.state.question.testSpecs,
        starterCode: this.state.question.starterCode,
      };
      this.broadcast('getPrompt', prompt);
    });
    //Continue game listener
    this.onMessage('continue', (client, data) => {
      if (this.state.gameStatus === 'nonefail') {
        this.state.gameStatus = 'passvote';
        return;
      } else if (this.state.gameStatus === 'nonepass') {
        this.state.gameStatus = 'tally';
        return;
      }
      this.roundNumber++;
      if (this.roundNumber <= 4) {
        this.dispatcher.dispatch(new insertQuestion(), {
          roundNumber: this.roundNumber,
          questions: this.questions,
        });
        let prompt = {
          id: this.state.question.id,
          difficulty: this.state.question.difficulty,
          title: this.state.question.title,
          question: this.state.question.question,
          testSpecs: this.state.question.testSpecs,
        };
        this.state.failAnswers.clear();
        this.state.passAnswers.clear();
        this.state.failVotes.clear();
        this.state.passVotes.clear();
        this.broadcast('getPrompt', prompt);
        this.state.gameStatus = 'prompt';
      } else {
        this.state.gameStatus = 'final';
      }
    });
    //StartTimer in each round
    this.onMessage('startTimer', (client, data) => {
      this.clock.clear();
      this.state.timer = 1;
      let timeToAnswer;
      if (this.state.gameStatus === 'nonepass') {
        timeToAnswer = 15000;
      } else {
        timeToAnswer = 150000;
      }

      this.state.timer = timeToAnswer / 1000;
      this.clock.setTimeout(() => {
        this.clock.start();
      }, 0);

      this.delayedInterval = this.clock.setInterval(() => {
        console.log(
          'Time now ' +
            Math.floor((timeToAnswer - this.clock.elapsedTime) / 1000)
        );
        this.state.timer = Math.floor(
          (timeToAnswer - this.clock.elapsedTime) / 1000
        );
      }, 1000);

      // After timeToAnswer is finished clear the timeout;
      // this will *stop and destroy* the timeout completely
      this.clock.setTimeout(() => {
        this.delayedInterval;
        this.clock.stop(() => {
          this.state.timer = 1;
        });
      }, timeToAnswer);
      this.clock.setTimeout(() => {
        this.clock.clear();
        if (this.state.gameStatus === 'nonepass') {
          this.state.timer = 0;
        } else {
          this.state.timer = 1;
        }
        console.log('last clock', this.clock);
      }, timeToAnswer + 1000);
    });

    //Reset timer
    this.onMessage('resetTimer', (client, data) => {
      this.clock.clear();
      this.state.timer = 1;
    });

    // START GAME
    this.onMessage('start', (client, { gameStatus }) => {
      this.state.gameStatus = gameStatus;
    });

    //timer's done

    //CHAT
    this.onMessage('chat', (client, message) => {
      this.dispatcher.dispatch(new AddMessage(), {
        username: this.state.users[client.id].username,
        message,
      });
    });
    //SUBMIT ANSWER
    this.onMessage('submit', (client, { answer, testResult }) => {
      this.dispatcher.dispatch(new AddAnswer(), {
        clientId: client.id,
        clientAnswer: answer,
        testResult: testResult,
      });
      /**After submission, check if all users have submitted, if so
       * move onto failvoting round
       */
      if (
        this.state.users.size ===
        this.state.failAnswers.size + this.state.passAnswers.size
      ) {
        if (this.state.failAnswers.size === 0) {
          this.state.gameStatus = 'nonefail';
        } else {
          this.state.gameStatus = 'failvote';
        }
      }
    });
    //FAIL VOTING ROUND
    this.onMessage('failvote', (client, { solutionId }) => {
      this.dispatcher.dispatch(new AddVotes(), {
        //the client above is the info for the person voting, the solutionId is the id of the person they are voting for. We want to access the object for the person whose answer is voted. i.e. the SolutionId
        clientId: solutionId,
        failVote: 1,
      });

      this.voteCount++;
      if (this.voteCount === this.state.users.size) {
        this.voteCount = 0;
        this.state.failVotes.forEach((value, key) => {
          this.state.users[key].incorrectPoints += value * 75;
        });
        if (this.state.passAnswers.size === 0) {
          this.state.gameStatus = 'nonepass';
        } else {
          this.state.gameStatus = 'passvote';
        }
      }
    });
    //PASS VOTING ROUND
    this.onMessage('passvote', (client, { solutionId }) => {
      this.dispatcher.dispatch(new AddVotes(), {
        clientId: solutionId,
        passVote: 1,
      });
      this.voteCount++;
      if (this.voteCount === this.state.users.size) {
        this.voteCount = 0;
        this.state.passVotes.forEach((value, key) => {
          this.state.users[key].correctPoints += value * 250;
        });
        this.state.gameStatus = 'tally';
      }
    });

    this.onMessage('restart', async (client) => {
      this.state.users.forEach((value, key) => {
        this.state.users[key].correctPoints = 0;
        this.state.users[key].incorrectPoints = 0;
      });
      this.state.failAnswers.clear();
      this.state.passAnswers.clear();
      this.state.failVotes.clear();
      this.state.passVotes.clear();
      this.roundNumber = 1;
      this.state.gameStatus = 'lobby';
      this.questions = await getQuestions();
      this.dispatcher.dispatch(new insertQuestion(), {
        roundNumber: this.roundNumber,
        questions: this.questions,
      });
    });

    console.log('Room Created');
    this.dispatcher.dispatch(new insertQuestion(), {
      roundNumber: this.roundNumber,
      questions: this.questions,
    });
  }

  // Authorize client based on provided options before WebSocket handshake is complete
  // onAuth(client, options, request) {}

  // When client successfully join the room
  onJoin(client, options, auth) {
    if (this.state.gameStatus !== 'lobby') {
      throw new Error(
        'Game is ongoing, please try again when the game is finished'
      );
    }
    this.dispatcher.dispatch(new AddUser(), {
      username: options.username,
      clientId: client.id,
    });
  }

  // When a client leaves the room
  onLeave(client, consented) {
    this.dispatcher.dispatch(new RemoveUser(), {
      clientId: client.id,
    });
  }

  // Cleanup callback, called after there are no more clients in the room. (see `autoDispose`)
  async onDispose() {}
}

module.exports = GameRoom;
