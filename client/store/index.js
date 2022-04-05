import { createStore, combineReducers, applyMiddleware } from 'redux';
import { createLogger } from 'redux-logger';
import thunkMiddleware from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';
import roomReducer from './room';
import userReducer from './users';
import gameStatusReducer from './gameStatus';
import promptReducer from './prompt';
import answersReducer from './failAnswers';
import failedAnswersReducer from './failAnswers';
import failedVotesReducer from './failVoting';
import passedAnswersReducer from './passAnswers';
import passedVotesReducer from './passVoting';
import messageReducer from './message';
import timerReducer from './timer';
import hostKeyReducer from './hostKey';
import roundNumberReducer from './roundNumber';
const USER_LEAVE_ROOM = 'USER_LEAVE_ROOM';
const USER_NEW_ROUND = 'USER_NEW_ROUND';
export const userLeaveRoom = (action) => {
  return {
    type: USER_LEAVE_ROOM,
    action,
  };
};
export const userNewRound = (action) => {
  return {
    type: USER_NEW_ROUND,
    action,
  };
};
const rootReducer = (state, action) => {
  switch (action.type) {
    case USER_LEAVE_ROOM:
      return reducer(undefined, action);
    case USER_NEW_ROUND: {
      const {
        room,
        users,
        gameStatus,
        message,
        prompt,
        answer,
        timer,
        hostKey,
        round,
      } = state;
      state = {
        room,
        users,
        gameStatus,
        message,
        prompt,
        answer,
        timer,
        hostKey,
        round,
      };
      return reducer(state, action);
    }
    default:
      return reducer(state, action);
  }
};
const reducer = combineReducers({
  room: roomReducer,
  users: userReducer,
  gameStatus: gameStatusReducer,
  message: messageReducer,
  prompt: promptReducer,
  answer: answersReducer,
  failedAnswers: failedAnswersReducer,
  passedAnswers: passedAnswersReducer,
  failedVotes: failedVotesReducer,
  passedVotes: passedVotesReducer,
  timer: timerReducer,
  hostKey: hostKeyReducer,
  round: roundNumberReducer,
});
const middleware = composeWithDevTools(
  applyMiddleware(thunkMiddleware, createLogger({ collapsed: true }))
);
const store = createStore(rootReducer, middleware);

export default store;
export * from './auth';
