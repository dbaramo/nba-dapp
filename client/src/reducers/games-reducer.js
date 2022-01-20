import { FETCH_GAMES } from "../actions/constants";

export default (state = null, action) => {
  switch (action.type) {
    case FETCH_GAMES:
      return action.payload;
    default:
      return state;
  }
};
