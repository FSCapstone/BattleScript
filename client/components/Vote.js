import React, { useState, useEffect, useRef } from 'react';
import Editor from '@monaco-editor/react';
import { useSelector, useDispatch } from 'react-redux';
import { setFailedVotes } from '../store/failVoting';
import { setPassedVotes } from '../store/passVoting';
import styles from '../styles/Vote.module.css';

const Vote = () => {
  const editorRef = useRef(null);
  const dispatch = useDispatch();
  const [voted, setVoted] = useState(false);
  const [votedFor, setVotedFor] = useState('');
  const [userFocus, setUserFocus] = useState('');
  const users = useSelector((state) => state.users);
  const room = useSelector((state) => state.room);
  const currPrompt = useSelector((state) => state.prompt);
  const gameStatus = useSelector((state) => state.gameStatus);

  useEffect(() => {
    room.send('resetTimer');
  }, []);
  //Get Current Round's user: vote Object
  const voteList = useSelector((state) => {
    if (state.gameStatus === 'failvote') {
      return state.failedVotes;
    } else if (state.gameStatus === 'passvote') {
      return state.passedVotes;
    }
  });
  //Get current round's user: answer object
  const submissions = useSelector((state) => {
    if (state.gameStatus === 'failvote') {
      return state.failedAnswers;
    } else if (state.gameStatus === 'passvote') {
      return state.passedAnswers;
    }
  });
  // Add listener depending on whether it is failvote or passvote round
  // This listener will later update client state when server state updates vote count
  if (room.state.gameStatus === 'failvote') {
    room.state.failVotes.onChange = (vote, key) => {
      dispatch(setFailedVotes(key, vote));
    };
  } else if (room.state.gameStatus === 'passvote') {
    room.state.passVotes.onChange = (vote, key) => {
      dispatch(setPassedVotes(key, vote));
    };
  }

  //Get editor reference so we can use it later to change contents
  function handleEditorDidMount(editor, monaco) {
    editorRef.current = editor;
  }

  //Changes who's code/vote is being selected based on what the user clicks
  const changeFocus = (userKey) => {
    setUserFocus(userKey);
    editorRef.current.setValue(submissions[userKey].answer);
    console.log(userKey);
  };

  //When user clicks vote, sets voting to true so they cannot vote again,
  //Then, sets votedfor so the user knows who they voted for
  //finally, sends update to server state stating who was voted for
  //Server changes state -> client is listening for changes -> changes client state
  const voteHandler = (e, userFocus, gameStatus) => {
    setVoted(true);
    setVotedFor(users[userFocus].username);
    room.send(gameStatus, { solutionId: userFocus });
  };

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
      <div>
        <div className={styles.promptSolution}>
          <Editor
            defaultLanguage="javascript"
            theme="vs-dark"
            defaultValue="//Select a user from the side to see their code! ----------------->"
            options={{
              readOnly: true,
              wordWrap: true,
            }}
            onMount={handleEditorDidMount}
          />
        </div>
      </div>
      <div className={styles.votingSubmitContainer}>
        <div className={styles.finishedSubmissionList}>
          <h4>
            Vote on your favorite
            {gameStatus == 'failvote'
              ? ' failed solution.'
              : ' passed solution.'}
          </h4>
          <div className={styles.users}>
            {Object.keys(submissions).map((userKey) => {
              return (
                <div
                  key={userKey}
                  className={styles.userContainer}
                  onClick={() => changeFocus(userKey)}>
                  <img
                    className={styles.avatar}
                    src={users[userKey].avatarURL}
                  />
                  <p>
                    {users[userKey].username == '' ? (
                      <br />
                    ) : (
                      users[userKey].username
                    )}
                  </p>
                  <div className={styles.totalVotes}>
                    Total Votes: {voteList[userKey] ? voteList[userKey] : 0}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <div className={styles.submitPromptButton}>
          <button
            className={styles.submitBtn}
            onClick={(e) => voteHandler(e, userFocus, room.state.gameStatus)}
            disabled={userFocus === '' || voted}>
            {voted ? `You've already voted for ${votedFor}!` : 'Vote!'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Vote;
