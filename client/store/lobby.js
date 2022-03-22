import axios from 'axios';

/**
 * ACTION TYPES
 */
const SET_LOBBY = 'SET_LOBBY';

/**
 * ACTION CREATORS
 */
const setLobby = (lobby) => ({
  type: SET_LOBBY,
  lobby,
});

/**
 * THUNK CREATORS
 */
export const fetchLobby = (id) => {
  return async (dispatch) => {
    const { data } = await axios.get(`/api/lobby/${id}`);
    dispatch(setLobby(data));
  };
};

/**
 * REDUCER
 */
export default function lobby(state = {}, action) {
  switch (action.type) {
    case SET_LOBBY:
      return action.lobby;
    default:
      return state;
  }
}
