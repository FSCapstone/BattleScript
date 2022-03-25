//REDUX STORE FOR CONNECTED USERS
const SET_PASSED_ANSWERS = 'SET_PASSED_ANSWERS';

export const setPassedAnswers = (key, passedAnswers) => ({
  type: SET_PASSED_ANSWERS,
  passedAnswers,
  key,
});

export default function passedAnswersReducer(state = {}, action) {
  switch (action.type) {
    case SET_PASSED_ANSWERS:
      return { ...state, [action.key]: action.passedAnswers };

    default:
      return state;
  }
}
