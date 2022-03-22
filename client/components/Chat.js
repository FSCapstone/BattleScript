import React, { useState, useEffect } from 'react';
import { socket } from './socket';
// import { io } from 'socket.io-client';

const Chat = () => {
  //Hooks on top
  const [messages, setMessages] = useState(['hello', 'mike']);
  const [newMessage, setNewMessage] = useState('');
  const [room, setRoom] = useState('');
  //inside chat so only when on /chat do you connect
  // const socket = io.connect('http://localhost:3000');
  // socket.on('connect', () => {
  //   console.log('clienttttttt conneceted'); //when sockets connect print this out in broswer terminal
  // });
  socket.on('message-from-others', (message) => {
    //when the index.js recieves a message it emits message-from-others back to client
    setMessages([...messages, message]);
  });
  useEffect(() => {
    socket.on('connect', () => {
      console.log('clienttttttt conneceted'); //when sockets connect print this out in broswer terminal
    });

    // const eventHandler = () => setConnected(true);
    // socket.on('WELCOME_FROM_SERVER', eventHandler);
    // // unsubscribe from event for preventing memory leaks
    // return () => {
    //   socket.off('WELCOME_FROM_SERVER', eventHandler);
    // };
  }, []);
  const handleSubmit = (e) => {
    e.preventDefault();
    socket.emit('new-message', newMessage, room);
    setMessages([...messages, newMessage]);
  };

  const handleChange = (e) => {
    setNewMessage(e.target.value);
  };

  const handleRoomSubmit = (e) => {
    e.preventDefault();
    socket.emit('join-room', room);
  };

  const handleRoomChange = (e) => {
    setRoom(e.target.value);
  };

  return (
    <div>
      <h1> ChatScreen </h1>
      <h4>{room}</h4>
      <div>
        {messages.map((message, index) => (
          <div key={index}>{message}</div>
        ))}
      </div>
      <form onSubmit={(e) => handleSubmit(e)}>
        <input
          type="text"
          name="new-message"
          value={newMessage}
          onChange={(e) => handleChange(e)}
        />
        <button type="submit">Send</button>
      </form>
      <form onSubmit={(e) => handleRoomSubmit(e)}>
        <input
          type="text"
          name="room"
          value={room}
          onChange={(e) => handleRoomChange(e)}
        />
        <button type="submit">Join Room</button>
      </form>
    </div>
  );
};

export default Chat;
