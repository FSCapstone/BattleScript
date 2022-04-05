import React, { useState, useEffect } from 'react';
import * as Colyseus from 'colyseus.js';
import { useSelector, useDispatch } from 'react-redux';
import { setRoundNumber } from '../store/roundNumber';

const HostBar = () => {
  const dispatch = useDispatch();
  const users = useSelector((state) => state.users);
  const room = useSelector((state) => state.room);
  const timer = useSelector((state) => state.timer);
  const hostKey = useSelector((state) => state.hostKey);
  const gameStatus = useSelector((state) => state.gameStatus);
  const round = useSelector((state) => state.round);

  const handleStartGame = () => {
    // ON START, SEND MESSAGE TO SERVER TO GET THE QUESTION
    room.send('getPrompt');
    room.send('start', {
      gameStatus: 'prompt',
    });
    room.send('round');
  };
  const handleContinueGame = () => {
    if (gameStatus === 'tally') {
      room.send('continue');
      room.send('round');
    } else {
      room.send('continue');
    }
  };

  const handleRestartGame = () => {
    room.send('restart');
  };
  const renderSwitch = (gameStatus) => {
    switch (gameStatus) {
      case 'nonepass': {
        if (!timer) {
          return (
            <div className="continue-btn">
              <button className="hostbutton" onClick={handleContinueGame}>
                Continue
              </button>
            </div>
          );
        }
        return;
      }
      case 'tally':
      case 'nonefail': {
        return (
          <div className="continue-btn">
            <button className="hostbutton" onClick={handleContinueGame}>
              Continue
            </button>
          </div>
        );
      }
      case 'lobby': {
        return (
          <div className="start-game-btn ">
            <button className="hostbutton" onClick={handleStartGame}>
              Start Game
            </button>
          </div>
        );
      }
      case 'final': {
        return (
          <div className="restart-game-btn ">
            <button className="hostbutton" onClick={handleRestartGame}>
              Restart Game
            </button>
          </div>
        );
      }
      default: {
        return '';
      }
    }
  };
  // return hostKey === room.sessionId ? (
  //   <div className="hostbar">
  //     <div>{renderSwitch(gameStatus)}</div>
  //     <div className="hostlogo">HOST</div>
  //   </div>
  // ) : (
  //   ''
  // );

  return (
    <div className="hostbar">
      <div className="hostdetails">{`Lobby Id: ${room.id}`}</div>
      <div className="hostdetails">
        {round === undefined ? 'Round: 1' : `Round: ${round}`}{' '}
      </div>
      {hostKey === room.sessionId ? (
        <div className="gameControl">{renderSwitch(gameStatus)}</div>
      ) : (
        ''
      )}
    </div>
  );
};

export default HostBar;
