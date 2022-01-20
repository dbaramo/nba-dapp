import { FETCH_WEB3 } from "../actions/constants";

export default (state = null, action) => {
  switch (action.type) {
    case FETCH_WEB3:
      return action.payload;
    default:
      return state;
  }
};
