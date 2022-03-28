import { createStore, combineReducers, applyMiddleware } from 'redux';
import { createLogger } from 'redux-logger';
import thunkMiddleware from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';
import roomReducer from './room';
import userReducer from './users';
import gameStatusReducer from './gameStatus';
import promptReducer from './prompt';
import questionReducer from './question';
import answersReducer from './failAnswers';
import failedAnswersReducer from './failAnswers';
import failedVotesReducer from './failVoting';
import passedAnswersReducer from './passAnswers';
import passedVotesReducer from './passVoting';
import auth from './auth';
import messageReducer from './message';
import timerReducer from './timer';

const reducer = combineReducers({
  room: roomReducer,
  users: userReducer,
  gameStatus: gameStatusReducer,
  message: messageReducer,
  prompt: promptReducer,
  question: questionReducer,
  answer: answersReducer,
  failedAnswers: failedAnswersReducer,
  passedAnswers: passedAnswersReducer,
  failedVotes: failedVotesReducer,
  passedVotes: passedVotesReducer,
  timer: timerReducer,
});
const middleware = composeWithDevTools(
  applyMiddleware(thunkMiddleware, createLogger({ collapsed: true }))
);
const store = createStore(reducer, middleware);

export default store;
export * from './auth';
