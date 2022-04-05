const schema = require('@colyseus/schema');
const Sequelize = require('sequelize');
const Schema = schema.Schema;
const command = require('@colyseus/command');
const Question = require('../../db/models/Question');
//Schema
class QuestionSchema extends Schema {
  constructor() {
    super();
    this.id;
    this.difficulty = '';
    this.title = '';
    this.question = '';
    this.testSpecs = '';
    this.solution = ``;
    this.starterCode = ``;
  }
}
schema.defineTypes(QuestionSchema, {
  id: 'number',
  difficulty: 'string',
  title: 'string',
  question: 'string',
  testSpecs: 'string',
  solution: 'string',
  starterCode: 'string',
});

async function getQuestions() {
  let questionList = await Question.findAll({
    // order: [['id', Sequelize.literal('RANDOM')]],
    order: [Sequelize.literal('RANDOM()')],
    limit: 4,
  });
  return questionList;
}
//Commands

class insertQuestion extends command.Command {
  execute({ roundNumber, questions }) {
    let currQuestion = questions[roundNumber - 1];
    let temp = new QuestionSchema();
    temp.id = currQuestion.id;
    temp.difficulty = currQuestion.difficulty;
    temp.title = currQuestion.title;
    temp.question = currQuestion.question;
    temp.testSpecs = currQuestion.testSpecs;
    temp.starterCode = currQuestion.starterCode;
    this.state.question = temp;
  }
}

module.exports = { QuestionSchema, getQuestions, insertQuestion };
