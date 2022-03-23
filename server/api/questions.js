const router = require('express').Router();
const {
  models: { Question, Lobby },
} = require('../db');
module.exports = router;

router.get('/', async (req, res, next) => {
  try {
    const questions = await Question.findAll({});
    res.json(questions);
  } catch (err) {
    next(err);
  }
});

router.get('/:lobbyName', async (req, res, next) => {
  try {
    const lobbyName = req.params.lobbyName;
    const lobby = await Lobby.findOne({
      where: { name: lobbyName },
    });
    const questions = await lobby.getQuestions();
    res.json(questions);
  } catch (err) {
    next(err);
  }
});
