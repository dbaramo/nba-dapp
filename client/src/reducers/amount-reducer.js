import { SET_WAGE_AMOUNT } from "../actions/constants";

export default (state = "", action) => {
  switch (action.type) {
    case SET_WAGE_AMOUNT:
      return Object.assign({}, state, action.payload);
    default:
      return state;
  }
};
