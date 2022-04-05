import React, { useEffect } from 'react';
import Timer from './Timer';
import { useSelector, useDispatch } from 'react-redux';
import { userNewRound } from '../store';

const NonePass = () => {
  const users = useSelector((state) => state.users);
  const room = useSelector((state) => state.room);
  const timer = useSelector((state) => state.timer);
  const dispatch = useDispatch();

  useEffect(() => {
    room.send('startTimer');
  }, []);
  return (
    <div className="congratsFail">
      Womp Womp, unfortunately no one passed all of the tests in this round.
      Your game can continue in{' '}
      {`${Math.floor(timer / 60)}:${String(Math.ceil(timer % 60)).padStart(
        2,
        '0'
      )}`}
      . Please use this time wisely and review some common docs linked below:
      <ul>
        <hr />
        <br />
        <a
          href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Loops_and_iteration"
          target="_blank"
        >
          <li className="nonelinks">Loops and Iteration</li>
        </a>
        <a
          href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Addition_assignment"
          target="_blank"
        >
          <li className="nonelinks">Addition assignment (+=)</li>
        </a>
        <a
          href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/function"
          target="_blank"
        >
          <li className="nonelinks">Function expression</li>
        </a>
        <a
          href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array#"
          target="_blank"
        >
          <li className="nonelinks">Array Methods</li>
        </a>
      </ul>
    </div>
  );
};

export default NonePass;
