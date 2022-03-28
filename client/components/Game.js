import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { addUser, removeUser } from '../store/users';
import { addMessage } from '../store/message';
import { useColyseus } from './ColyseusContext';
import * as Colyseus from 'colyseus.js';
import { setGameStatus } from '../store/gameStatus';
import { setPrompt } from '../store/prompt';
import { setTimer } from '../store/timer';
import Lobby from './Lobby';
import Prompt from './Prompt';
import Chat from './Chat';
import Tally from './Tally';
import Timer from './Timer';

/**
 * MAIN GAME INSTANCE, THIS COMPONENT WILL RENDER OTHER COMPONENTS
 * DEPENDING ON GAME STATE.  ALSO HOLDS COLYSEUS ROOM STATE/SYNC LOGIC
 * SO THAT SCENES/COMPONENTS CAN BE RENDERED AND USED DEPENDING ON STATE
 * OF THE GAME
 */
const Game = () => {
  const dispatch = useDispatch();
  const client = useColyseus();
  // const client = useSelector((state) => state.client);
  const room = useSelector((state) => state.room);
  const users = useSelector((state) => state.users);

  const gameStatus = useSelector((state) => state.gameStatus);
  const timer = useSelector((state) => state.timer);

  room.state.users.onAdd = (user, key) => {
    dispatch(addUser(key, user));
    console.log(user, 'has been added at', key);
  };

  room.state.users.onRemove = (user, key) => {
    delete users[key];

    dispatch(removeUser(users));
  };
  room.state.listen('gameStatus', (curr, prev) => {
    dispatch(setGameStatus(curr));
  });
  //AFTER SENDING GETQUESTION(lobby.js) TO SERVER, LISTENS FOR BROADCAST,
  //SET QUESTION TO CLIENT STATE
  room.onMessage('getPrompt', (prompt) => {
    dispatch(setPrompt(prompt));
  });
  room.state.listen('timer', (curr, prev) => {
    // console.log(curr);
    dispatch(setTimer(curr));
  });
  const renderSwitch = (gameStatus) => {
    switch (gameStatus) {
      case 'lobby': {
        return (
          <div>
            {/* <Timer /> */}
            <Lobby />
          </div>
        );
      }
      case 'prompt': {
        return (
          <div>
            {/* <Timer /> */}
            <Prompt />
          </div>
        );
      }

      case 'tally': {
        return (
          <div>
            {/* <Timer /> */}
            <Tally />;
          </div>
        );
      }

      default: {
        return <div>'loading'</div>;
      }
    }
  };

  return (
    <div>
      {/* <div>
        <Timer />
      </div> */}
      <div>{renderSwitch(gameStatus)}</div>
      <div>
        <Chat />
      </div>
    </div>
  );
};

export default Game;
