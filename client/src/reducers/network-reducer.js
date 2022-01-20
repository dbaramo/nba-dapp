import { FETCH_NETWORK } from "../actions/constants";

export default (state = null, action) => {
  switch (action.type) {
    case FETCH_NETWORK:
      return action.payload;
    default:
      return state;
  }
};
