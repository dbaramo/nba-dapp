import {
  FETCH_WEB3,
  FETCH_ACCOUNT,
  FETCH_NETWORK,
  FETCH_GAMES,
  SET_WAGE_AMOUNT
} from "./constants";
import axios from "axios";
import moment from "moment";
import Web3 from "web3";

var web3 = new Web3(window.web3);

export const fetchAccount = () => async dispatch => {
  const accounts = await web3.eth.getAccounts();

  if (accounts.length === 0) {
    dispatch({
      type: FETCH_ACCOUNT,
      payload: {
        active: false
      }
    });
    return;
  }
  const balance = await web3.eth.getBalance(accounts[0]);
  const endIndex = web3.utils.fromWei(balance).indexOf(".") + 5;
  const accountBalance = web3.utils.fromWei(balance).slice(0, endIndex);
  dispatch({
    type: FETCH_ACCOUNT,
    payload: {
      active: true,
      address: accounts[0],
      accountBalance
    }
  });
};

export const fetchNetwork = () => async dispatch => {
  const network = await web3.eth.net.getId();

  dispatch({
    type: FETCH_NETWORK,
    payload: network
  });
};

export const fetchWeb3 = () => dispatch => {
  if (!web3.givenProvider) {
    return {
      type: FETCH_WEB3,
      payload: false
    };
  }
  dispatch(fetchAccount());
  dispatch(fetchNetwork());
  dispatch({
    type: FETCH_WEB3,
    payload: true
  });
};

export const fetchGames = () => async dispatch => {
  const response = await axios.get("https://nbadapp.com/games");

  const filterCurrentGames = game => {
    const time = game.startTimeUTC;
    return moment(time).valueOf() > Date.now();
  };
  const currentGames = response.data.feed.filter(filterCurrentGames);

  dispatch({
    type: FETCH_GAMES,
    payload: currentGames
  });
};

export const setWageAmount = amount => {
  return {
    type: SET_WAGE_AMOUNT,
    payload: amount
  };
};
