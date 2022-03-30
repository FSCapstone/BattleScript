import React, { useState, useEffect, useRef } from 'react';
import Editor from '@monaco-editor/react';
import { useSelector, useDispatch } from 'react-redux';
import testSpecs from './mocha/testSpec';
import IframeResizer from 'iframe-resizer-react';
import { addFailedAnswers } from '../store/failAnswers';
import { addPassedAnswers } from '../store/passAnswers';
import { setFailedVotes } from '../store/failVoting';
import { setPassedVotes } from '../store/passVoting';
import { userNewRound } from '../store';

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
  const didMountRef = useRef(false);

  useEffect(() => {
    room.send('startTimer');
    dispatch(userNewRound());
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
        <script>
          window.iFrameResizer = {
            // for testing on local host
            targetOrigin: 'http://localhost:8080'
            // for deploying on heroku
            // targetOrigin: 'https://capstone-battlescript.herokuapp.com/'
          }
        </script>
        <script src="../iframeResizer.contentWindow.min.js"></script>
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
    <div className="prompt-container">
      {/* <div>
        {submitted ? (
          <iframe
            id="mochaTester"
            srcDoc={testHTML}
            sandbox="allow-scripts allow-same-origin"
          />
        ) : (
          ''
        )}
      </div> */}
      <div className="prompt-solution">
        <Editor
          defaultLanguage="javascript"
          defaultValue={currPrompt.question}
          options={{
            readOnly: true,
            wordWrap: true,
          }}
        />
      </div>

      {submitted ? (
        <div className="prompt-solution">
          <IframeResizer
            id="mochaTester"
            srcDoc={testHTML}
            sandbox="allow-scripts allow-same-origin"
            scrolling="true"
            // for testing on local host
            checkOrigin={[`http://localhost:8080`]}
            // for heroku deployment
            // checkOrigin={[`https://fsa-battlescript.herokuapp.com/`]}
          />
        </div>
      ) : (
        <div className="prompt-solution">
          <Editor
            defaultLanguage="javascript"
            defaultValue="//Code Here"
            onChange={onChangeHandler}
            options={{
              readOnly: false,
              wordWrap: true,
            }}
          />
          <button className="submit-prompt-button" onClick={() => clickHandler()}>
            Submit
          </button>
        </div>
      )}
      <div className="finished-submission-list">
        <div>
          <div>Passed</div>
          <div>
            {Object.keys(passedAnswers).map((userKey) => {
              return <div key={userKey}>{users[userKey].username}</div>;
            })}
          </div>
        </div>
        <div>
          <div>Failed</div>
          <div>
            {Object.keys(failedAnswers).map((userKey) => {
              return <div key={userKey}>{users[userKey].username}</div>;
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Prompt;
