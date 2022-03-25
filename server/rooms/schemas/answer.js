const schema = require('@colyseus/schema');
const Sequelize = require('sequelize');
const Schema = schema.Schema;
const command = require('@colyseus/command');
const { VoteSchema } = require('./vote');

class AnswerSchema extends Schema {
  constructor() {
    super();
    this.clientId;
    this.answer = '';
    this.isCorrect = false;
    //this.votes
  }
}
schema.defineTypes(AnswerSchema, {
  clientId: 'string',
  answer: 'string',
  isCorrect: 'boolean',
});

//Commands

class AddAnswer extends command.Command {
  execute({ clientId, clientAnswer, testResult }) {
    //when an answer is submitted we are adding it to the answers map
    let tempAnswer = new AnswerSchema();
    //creating the Vote Schema so it is ready to render upon the voting round.
    let tempVote = new VoteSchema();
    tempAnswer.clientId = clientId;
    tempAnswer.answer = clientAnswer;
    tempAnswer.isCorrect = testResult;
    tempVote.votes = 0;
    tempVote.clientId = clientId;
    if (!tempAnswer.isCorrect) {
      //failVote round
      this.state.failAnswers.set(clientId, tempAnswer);
      this.state.failVotes.set(clientId, tempAnswer);
    } else {
      //passVote round
      this.state.passAnswers.set(clientId, tempAnswer);
      this.state.passVotes.set(clientId, tempAnswer);
    }
  }
}

module.exports = { AnswerSchema, AddAnswer };