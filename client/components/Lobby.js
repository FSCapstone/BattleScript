import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { addUser } from '../store/users';

const Lobby = () => {
  const dispatch = useDispatch();
  const users = useSelector((state) => state.users);
  const room = useSelector((state) => state.room);
  //
  const handleStartGame = () => {
    // ON START, SEND MESSAGE TO SERVER TO GET THE QUESTION
    room.send('getPrompt');
    room.send('start', {
      gameStatus: 'prompt',
    });
    //when pressing start game you also start the timer for the first round.
    room.send('startTimer');
  };
  console.log(room.users);

  return (
    <div>
      <div className="lobby-container">
        <p>Room ID: {room.id}</p>
        {Object.keys(users).map((clientId) => {
          return (
            <div key={clientId} className="player">
              <p>{users[clientId].username}</p>
              <img
                src={
                  'https://as1.ftcdn.net/v2/jpg/03/53/11/00/1000_F_353110097_nbpmfn9iHlxef4EDIhXB1tdTD0lcWhG9.jpg'
                }
                className="player-avatar"
              />
            </div>
          );
        })}
      </div>
      <div className="start-game-btn ">
        <button onClick={handleStartGame}>Start Game</button>
      </div>
    </div>
  );
};

// return (
//   <div>
//     <div>Room Code: {room.id}</div>
//     {Object.keys(users).map((key) => {
//       return <div key={key}>Hello {users[key].username}</div>;
//     })}
//   </div>
// );

export default Lobby;
