import axios from 'axios';

/**
 * ACTION TYPES
 */
const SET_PLAYERS = 'SET_PLAYERS';

/**
 * ACTION CREATORS
 */
const setPlayers = (players) => ({
  type: SET_PLAYERS,
  players,
});

/**
 * THUNK CREATORS
 */
export const fetchPlayers = () => {
  return async (dispatch) => {
    const { data } = await axios.get(`/api/users`);
    dispatch(setPlayers(data));
  };
};

/**
 * REDUCER
 */
export default function players(state = [], action) {
  switch (action.type) {
    case SET_PLAYERS:
      return action.players;
    default:
      return state;
  }
}
