const SET_TIMER = 'SET_TIMER';

export const setTimer = (timer) => {
  return {
    type: SET_TIMER,
    timer,
  };
};

export default function timerReducer(state = 0, action) {
  switch (action.type) {
    case SET_TIMER:
      return action.timer;
    default:
      return state;
  }
}
