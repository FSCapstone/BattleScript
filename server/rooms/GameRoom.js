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
const { VoteSchema, AddVotes } = require('./schemas/vote');

// OVERALL GAME STATE
// users : {key: value}
// question : {}
// gameStatus: 'lobby', 'prompt', 'failvote', 'passvote', 'tally', 'final'
//failAnswers: {clientId: answer}
//passAnswers: {clientId: answer}
//failVotes: {solutionClientId: votes}
//passVotes:  {solutionClientId: votes}

class GameState extends Schema {
  constructor() {
    super();
    //Users Map with key=client.id, value=user object
    this.users = new MapSchema();
    //Questions array
    this.question = new QuestionSchema();
    this.timer = 0;
    this.gameStatus = 'lobby';
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
  timer: 'number',
  gameStatus: 'string',
  messages: [MessagesSchema],
  // answer: map all answers
  failAnswers: { map: AnswerSchema },
  passAnswers: { map: AnswerSchema },
  failVotes: { map: VoteSchema },
  passVotes: { map: VoteSchema },
});

class GameRoom extends colyseus.Room {
  constructor() {
    super();
    this.questions = [];
    this.roundNumber = 1;
    this.timer = 0;
  }

  async onCreate(options) {
    //Set initial game state
    this.setState(new GameState());
    this.dispatcher = new command.Dispatcher(this);
    this.questions = await getQuestions();
    this.maxClients = 5;
    // this.state.roundNumber = this.roundNumber;
    this.gameStatus = 'lobby';
    //CLIENT SENDS MESSAGE TO GET QUESTION, SENDS QUESTION TO CLIENT
    this.onMessage('getPrompt', (client, data) => {
      let prompt = {
        id: this.state.question.id,
        difficulty: this.state.question.difficulty,
        title: this.state.question.title,
        question: this.state.question.question,
        testSpecs: this.state.question.testSpecs,
      };
      this.broadcast('getPrompt', prompt);
    });

    //TIMER
    this.onMessage('startTimer', (client, data) => {
      this.clock.clear();
      //amount of time to answer each question.
      let timeToAnswer = 5000;
      this.state.timer = timeToAnswer / 1000;
      this.clock.setTimeout(() => {
        this.clock.start();
        // this.broadcast('startTimer', timer);
      }, 0);

      this.delayedInterval = this.clock.setInterval(() => {
        console.log(
          'Time now ' +
            new Date(timeToAnswer - this.clock.elapsedTime).getSeconds()
        );
        this.state.timer = new Date(
          timeToAnswer - this.clock.elapsedTime
        ).getSeconds();
        // console.log('time remaining', timer.timeRemaining);
        // this.broadcast('startTimer', timer);
      }, 1000);

      // After 5 seconds clear the timeout;
      // this will *stop and destroy* the timeout completely
      this.clock.setTimeout(() => {
        this.delayedInterval;
        this.clock.stop(() => {
          this.state.timer = 0;
          // this.broadcast('startTimer', timer);
        });
      }, timeToAnswer);
      this.clock.setTimeout(() => {
        this.clock.clear();
        console.log('last clock', this.clock);
      }, timeToAnswer + 1000);
    });
    this.onMessage('start', (client, { gameStatus }) => {
      this.state.gameStatus = gameStatus;
      console.log(client.sessionId, "sent 'action' message: ", gameStatus);
    });
    //CHAT

    this.onMessage('chat', (client, message) => {
      this.dispatcher.dispatch(new AddMessage(), {
        username: this.state.users[client.id].username,
        message,
      });
    });
    //CHAT
    this.onMessage('submit', (client, { answer, testResult }) => {
      this.dispatcher.dispatch(new AddAnswer(), {
        clientId: client.id,
        clientAnswer: answer,
        testResult: testResult,
      });
    });
    this.onMessage('failvote', (client, { solutionId }) => {
      this.dispatcher.dispatch(new AddVotes(), {
        //the client above is the info for the person voting, the solutionId is the id of the person they are voting for. We want to access the object for the person whose answer is voted. i.e. the SolutionId
        clientId: solutionId,
        failVote: 1,
      });
    });
    this.onMessage('passvote', (client, { solutionId }) => {
      console.log('passvote');
      this.dispatcher.dispatch(new AddVotes(), {
        clientId: solutionId,
        passVote: 1,
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
    this.dispatcher.dispatch(new AddUser(), {
      username: options.username,
      clientId: client.id,
    });
    console.log(this.state.question);
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
