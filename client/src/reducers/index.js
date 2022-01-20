import { combineReducers } from "redux";
import web3Reducer from "./web3-reducer";
import accountReducer from "./account-reducer";
import networkReducer from "./network-reducer";
import gamesReducer from "./games-reducer";
import amountReducer from "./amount-reducer";

export default combineReducers({
  web3: web3Reducer,
  account: accountReducer,
  network: networkReducer,
  games: gamesReducer,
  amount: amountReducer
});
