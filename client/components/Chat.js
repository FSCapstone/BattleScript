import React, { useState, useEffect, useRef } from 'react';
import * as Colyseus from 'colyseus.js';
import { useSelector, useDispatch } from 'react-redux';
import { addMessage } from '../store/message';
import styles from '../styles/Chat.module.css';
import { useColyseus } from './ColyseusContext';

const AlwaysScrollToBottom = () => {
  const elementRef = useRef();
  useEffect(() => elementRef.current.scrollIntoView());
  return <div ref={elementRef} />;
};

const msgWrap = (msg) => {
  if (msg.length > 60) {
    msg = '-- Message to Long Max Charcters is 60 --';
    return msg;
  }
  if (msg.length < 18 || msg.includes(' ')) {
    return msg;
  }
  if (msg.length >= 18 && !msg.includes(' ')) {
    msg = msg.substring(0, 18) + ' ' + msgWrap(msg.substring(18, msg.length));
    return msg;
  }
};

const Chat = () => {
  const dispatch = useDispatch();
  const [currMessage, setCurrMessage] = useState('');
  const messages = useSelector((state) => state.message);
  const room = useSelector((state) => state.room);
  const users = useSelector((state) => state.users);

  const client = useColyseus();

  const handleSubmit = (e) => {
    e.preventDefault();
    room.send('chat', currMessage);

    setCurrMessage('');
  };
  const handleChange = (e) => {
    e.preventDefault();
    setCurrMessage(e.target.value);
  };

  return (
    <div id={styles.chatComp}>
      <h1 id={styles.partyChat}> BATTLESCRIPT </h1>
      <div id={styles.listDiv}>
        <ul id={styles.chatList}>
          {!messages.length ? (
            <li className={styles.messages}>Trash Talking Encouraged </li>
          ) : (
            messages.map((message, index) => {
              return (
                <li
                  key={index}
                  className={
                    message.username === users[room.sessionId].username
                      ? styles.myMessage
                      : styles.messages
                  }
                >
                  <div className={styles.listUser}>{message.username}</div>
                  <div className={styles.listMessage}>
                    {msgWrap(message.message)}
                  </div>
                  <AlwaysScrollToBottom />
                </li>
              );
            })
          )}
        </ul>
      </div>
      <div id={styles.formDiv}>
        <form id={styles.messageForm} onSubmit={(e) => handleSubmit(e)}>
          <input
            name="newMessage"
            type="text"
            className={styles.input}
            onChange={(e) => handleChange(e)}
            value={currMessage || ''}
          />
          <input className={styles.submit} type="submit" value="Send" />
        </form>
      </div>
    </div>
  );
};

export default Chat;
