import React, { useState, useEffect } from 'react';
import * as Colyseus from 'colyseus.js';
import { useSelector, useDispatch } from 'react-redux';

const Timer = () => {
  const dispatch = useDispatch();
  const users = useSelector((state) => state.users);
  const room = useSelector((state) => state.room);
  const timer = useSelector((state) => state.timer);
  const gameStatus = useSelector((state) => state.gameStatus);

  let completed;

  const container = {
    margin: '10px auto',
    marginTop: '22px',
    width: '75%',
    textAlign: 'center',
    position: 'relative',
  };

  const backgroundBar = {
    borderRadius: '30px',
    backgroundColor: '#2c3437',
    animation: 'gradualshake 0.3s infinite 120s, boldshake 0.3s infinite 135s',
  };
  let containerStyles = {};

  if (gameStatus === 'nonepass') {
    completed = ((15 - timer) / 15) * 100;
    containerStyles = {
      borderRadius: '30px',
      backgroundColor: '#8B0000',
      boxShadow: '0 0 40px #8B0000',
      width: `${completed}%`,
      animation: 'test 15s',
    };
  } else {
    completed = ((150 - timer) / 150) * 100;
    containerStyles = {
      borderRadius: '30px',
      backgroundColor: '#8B0000',
      boxShadow: '0 0 40px #8B0000',
      width: `${completed}%`,
      animation: 'test 150s',
    };
  }

  const fillerStyles = {
    height: '18px',
    borderRadius: '30px',
    transition: 'linear',
    transitionProperty: 'width, backgroundColor',
  };

  const labelStyles = {
    padding: 5,
    color: 'white',
    fontWeight: 'bold',
  };
  return (
    <div>
      <div style={container}>
        <div style={backgroundBar}>
          <div style={containerStyles}>
            <div style={fillerStyles}>
              <span style={labelStyles}>{`${Math.floor(timer / 60)}:${String(
                Math.ceil(timer % 60)
              ).padStart(2, '0')}`}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Timer;
