//REDUX STORE FOR CONNECTED USERS
const SET_ROUND_NUMBER = 'SET_ROUND_NUMBER';

export const setRoundNumber = (round) => ({
  type: SET_ROUND_NUMBER,
  round,
});

export default function roundNumberReducer(state = 0, action) {
  switch (action.type) {
    case SET_ROUND_NUMBER:
      return action.round;
    default:
      return state;
  }
}
