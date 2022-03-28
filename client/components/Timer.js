import React, { useState, useEffect } from 'react';
import * as Colyseus from 'colyseus.js';
import { useSelector, useDispatch } from 'react-redux';
import { addMessage } from '../store/message';

const Timer = () => {
  const dispatch = useDispatch();
  const users = useSelector((state) => state.users);
  const room = useSelector((state) => state.room);
  const timer = useSelector((state) => state.timer);
  //
  const handleStartGame = () => {
    // ON START, SEND MESSAGE TO SERVER TO GET THE QUESTION
    // room.send('startTimer');
  };

  return (
    <div>
      <div className="start-game-btn ">
        <button onClick={handleStartGame}>Timer</button>
      </div>
    </div>
  );
};

export default Timer;
