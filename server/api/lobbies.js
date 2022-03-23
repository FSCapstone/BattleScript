const router = require('express').Router();
const {
  models: { Lobby, User, Question },
} = require('../db');
module.exports = router;

/**
* POST route to create a lobby, also generates a user as host

* lobbyName: Generated lobbyId from front-end
* username : input from user in front-end

* Can later code in difficulty level as a passable req.body, for now, just adding 5 random questions
 */
router.post('/', async (req, res, next) => {
  try {
    const { lobbyName, username } = req.body;
    const newLobby = await Lobby.create({
      name: lobbyName,
      roundId: 1,
    });
    newLobby.loadNewQuestions('all');
    const newUser = await newLobby.createUser({
      username: username,
      isHost: true,
      correctPoints: 0,
      incorrectPoints: 0,
      lobbyId: newLobby.id,
    });
    //HGG - I'm removing this from this call because I've run into issue with one to many async calls in a single request leads to this call actually happening before the others. (This was happening here when I was testing it and nothing was being sent even though the user and lobby were created and I could see them in postico.)
    // const lobbyWithUsers = await Lobby.findOne({
    //   where: { name: newLobby.name },
    //   include: {
    //     model: User,
    //     where: {
    //       lobbyId: lobby.id,
    //     },
    //   },
    // });
    res.json(newLobby);
  } catch (err) {
    next(err);
  }
});
//Route to create and add user to lobby - in lobbies routes because we will add a user and return the lobby with all users eager loaded
router.post('/:lobbyName', async (req, res, next) => {
  try {
    const { lobbyName } = req.params;
    const { username } = req.body;
    const newUser = await User.create({
      username: username,
      isHost: false,
      correctPoints: 0,
      incorrectPoints: 0,
    });
    const currLobby = await Lobby.findOne({ where: { name: lobbyName } });
    await currLobby.addUser(newUser);
    const lobbyWithUsers = await Lobby.findOne({
      where: { name: lobbyName },
      include: { model: User },
    });
    res.json(lobbyWithUsers);
  } catch (err) {
    next(err);
  }
});
//simple get request to get Lobby info, may not need to be used because of sockets
//HGG - we are going to need to use this to get the users in each lobby eager loaded.
router.get('/:lobbyName', async (req, res, next) => {
  try {
    const { lobbyName } = req.params;
    const currLobby = await Lobby.findOne({
      where: { name: lobbyName },
      include: { model: User },
    });
    res.json(currLobby);
  } catch (err) {
    next(err);
  }
});
//Put request to update Lobby round id, and load new user scores
router.put('/:lobbyName', async (req, res, next) => {
  try {
    const { lobbyName } = req.params;
    const { reset } = req.body;
    if (reset) {
      const [updatedRows, updatedLobbies] = await Lobby.update(
        { round: 1 },
        { where: { name: lobbyName }, returning: true }
      );
      console.log(updatedLobbies);
      // NEED TO LOAD NEW QUESTIONS ONTO LOBBY
      updatedLobbies[0].loadNewQuestions('all');
      console.log(updatedLobbies);
      const updatedLobby = await Lobby.findOne({
        where: { name: lobbyName },
        include: [{ model: User }, { model: Question }],
      });
      res.json(updatedLobby);
    } else {
      await Lobby.increment({ round: 1 }, { where: { name: lobbyName } });
      const updatedLobby = await Lobby.findOne({
        where: { name: lobbyName },
        include: [{ model: User }, { model: Question }],
      });
      res.json(updatedLobby);
    }
  } catch (err) {
    next(err);
  }
});
