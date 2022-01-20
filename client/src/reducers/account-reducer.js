import { FETCH_ACCOUNT } from "../actions/constants";

var initialState = {
  status: false
};

export default (state = initialState, action) => {
  switch (action.type) {
    case FETCH_ACCOUNT:
      return action.payload;
    default:
      return state;
  }
};
