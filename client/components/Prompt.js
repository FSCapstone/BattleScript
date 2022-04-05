import React, { useState, useEffect, useRef } from 'react';
import Editor from '@monaco-editor/react';
import { useSelector, useDispatch } from 'react-redux';
import testSpecs from './mocha/testSpec';
import { addFailedAnswers } from '../store/failAnswers';
import { addPassedAnswers } from '../store/passAnswers';
import { setFailedVotes } from '../store/failVoting';
import { setPassedVotes } from '../store/passVoting';
import { userNewRound } from '../store';
import styles from '../styles/Prompt.module.css';
import { setRoundNumber } from '../store/roundNumber';

const Prompt = () => {
  const dispatch = useDispatch();
  const [userAnswer, setUserAnswer] = useState('');
  const [testHTML, setTestHTML] = useState('');
  const [testResult, setTestResult] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const room = useSelector((state) => state.room);
  const currPrompt = useSelector((state) => state.prompt);
  const failedAnswers = useSelector((state) => state.failedAnswers);
  const passedAnswers = useSelector((state) => state.passedAnswers);
  const timer = useSelector((state) => state.timer);

  const users = useSelector((state) => state.users);
  const round = useSelector((state) => state.round);
  const didMountRef = useRef(false);

  useEffect(() => {
    room.send('startTimer');
    dispatch(userNewRound());
  }, []);

  useEffect(() => {
    room.send('round');
    dispatch(setRoundNumber(round + 1));
  }, []);

  room.state.failVotes.onAdd = (votes, key) => {
    dispatch(setFailedVotes(key, votes));
  };
  room.state.passVotes.onAdd = (votes, key) => {
    dispatch(setPassedVotes(key, votes));
  };
  room.state.failAnswers.onAdd = (answer, key) => {
    dispatch(addFailedAnswers(key, answer));
  };
  room.state.passAnswers.onAdd = (answer, key) => {
    dispatch(addPassedAnswers(key, answer));
  };
  if (timer === 0 && !submitted) {
    createTest();
    setSubmitted(true);
  }
  useEffect(() => {
    //LISTEN FROM LOWER WINDOW FOR UPDATE
    window.addEventListener('message', windowHandler);
    function windowHandler(e) {
      if (typeof e.data === 'string') {
        const result = JSON.parse(e.data);
        if (result === true) {
          setTestResult(true);
          setLoaded(true);
          window.removeEventListener('message', windowHandler);
        } else {
          setTestResult(false);
          setLoaded(true);
          window.removeEventListener('message', windowHandler);
        }
      }
    }
  }, []);
  useEffect(() => {
    if (didMountRef.current) {
      if (submitted && loaded) {
        room.send('submit', { answer: userAnswer, testResult: testResult });
      }
    } else didMountRef.current = true;
  });
  function onChangeHandler(e) {
    setUserAnswer(e);
  }
  function clickHandler() {
    createTest();
    setSubmitted(true);
  }
  async function createTest() {
    let testing = `<html>
      <head>
        <meta charset="utf-8">
        <title>Mocha Tests</title>
        <link href="https://unpkg.com/mocha@4.0.1/mocha.css" rel="stylesheet" />
      </head>
      <body>
        <div id="mocha"></div>
        <script src="https://unpkg.com/chai@4.1.2/chai.js"></script>
        <script src="https://unpkg.com/mocha@4.0.1/mocha.js"></script>

        <script>
        ${testSpecs(currPrompt.testSpecs)}
        ${userAnswer}
        </script>
      </body>
    </html>`;

    setTestHTML(testing);
  }

  return (
    <div className={styles.promptContainer}>
      <div className={styles.promptSolution}>
        <Editor
          defaultLanguage="javascript"
          theme="vs-dark"
          defaultValue={currPrompt.question}
          options={{
            readOnly: true,
            wordWrap: true,
          }}
        />
      </div>

      {submitted ? (
        <div>
          <iframe
            id="mochaTester"
            srcDoc={testHTML}
            sandbox="allow-scripts allow-same-origin"
          />
        </div>
      ) : (
        <div>
          <div className={styles.promptSolution}>
            <Editor
              defaultLanguage="javascript"
              theme="vs-dark"
              defaultValue={currPrompt.starterCode}
              onChange={onChangeHandler}
              options={{
                readOnly: false,
                wordWrap: true,
              }}
            />
          </div>
        </div>
      )}
      <div className={styles.votingSubmitContainer}>
        <div className={styles.finishedSubmissionList}>
          <div className={styles.passedUsers}>
            <h4>Passed</h4>

            {Object.keys(passedAnswers).map((userKey) => {
              return (
                <div key={userKey} className={styles.passedUserContainer}>
                  <img
                    className={styles.avatar}
                    src={users[userKey].avatarURL}
                  />
                  <p className={styles.username}> {users[userKey].username}</p>
                </div>
              );
            })}
          </div>

          <div className={styles.failedUsers}>
            <h4>Failed</h4>

            {Object.keys(failedAnswers).map((userKey) => {
              return (
                <div key={userKey} className={styles.failedUserContainer}>
                  <img
                    className={styles.avatar}
                    src={users[userKey].avatarURL}
                  />
                  <p className={styles.username}> {users[userKey].username}</p>
                </div>
              );
            })}
          </div>
          <div className={styles.divider}></div>
        </div>
        <div className={styles.submitPromptButton}>
          <button
            className={styles.submitBtn}
            disabled={submitted}
            onClick={() => clickHandler()}>
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default Prompt;
