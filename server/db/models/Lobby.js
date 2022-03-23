const { Sequelize, DataTypes } = require('sequelize');
const db = require('../db');
const Question = require('./Question');

const Lobby = db.define(
  'lobby',
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: true,
      },
    },
    round: {
      type: DataTypes.INTEGER,
      defaultValue: 1,
      validate: {
        min: 1,
        max: 10,
      },
    },
    userCount: {
      type: DataTypes.INTEGER,
      defaultValue: 1,
      validate: {
        min: 0,
        max: 8,
      },
    },
  },
  { timestamps: false }
);

module.exports = Lobby;

//IN Database Model, add instance method to load questions
Lobby.prototype.loadNewQuestions = async function (type = 'all') {
  let prevQuestions = [];
  let newQuestions = [];
  const currLobby = await Lobby.findOne({
    where: { name: this.name },
    include: { model: Question },
  });
  if (currLobby.questions.length > 0) {
    for (let i = 0; i < currLobby.questions.length; i++) {
      prevQuestions.push(currLobby.questions[i].id);
    }
  }
  function getRandomInt(min, max) {
    return Math.random() * (max - min) + min;
  }
  let questionList;
  switch (type) {
    case 'easy':
      questionList = await Question.findAll({ where: { category: 'easy' } });
      break;
    case 'medium':
      questionList = await Question.findAll({ where: { category: 'medium' } });
      break;
    case 'hard':
      questionList = await Question.findAll({ where: { category: 'hard' } });
      break;
    default:
      questionList = await Question.findAll();
  }

  while (newQuestions.length < 5) {
    if (prevQuestions.length > 0) {
      const randomInt = getRandomInt(0, questionList.length - 1);
      if (
        !prevQuestions.includes(questionList[randomInt].id) &&
        !newQuestions.includes(questionList[randomInt].id)
      ) {
        newQuestions.push(questionList[randomInt].id);
      } else {
        continue;
      }
    }
  }
  this.setQuestions(newQuestions);
};
