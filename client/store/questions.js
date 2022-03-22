import axios from 'axios';

/**
 * ACTION TYPES
 */
const SET_QUESTIONS = 'SET_QUESTIONS';

/**
 * ACTION CREATORS
 */
const setQuestions = (questions) => ({
  type: SET_QUESTIONS,
  questions,
});

/**
 * THUNK CREATORS
 */
export const fetchQuestions = () => {
  return async (dispatch) => {
    const { data } = await axios.get(`/api/questions`);
    dispatch(setQuestions(data));
  };
};

/**
 * REDUCER
 */
export default function questions(state = [], action) {
  switch (action.type) {
    case SET_QUESTIONS:
      return action.questions;
    default:
      return state;
  }
}
