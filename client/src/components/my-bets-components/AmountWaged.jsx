import React, { Component } from "react";
import Web3 from "web3";
import { abiArray } from "../../helpers/contract-data";

const web3 = new Web3(window.web3);

class AmountWaged extends Component {
  constructor(props) {
    super(props);
    this.state = {
      wagerValue: null
    };
  }

  componentWillMount() {
    const { contractAddress } = this.props.wager;
    const wagedContract = new web3.eth.Contract(abiArray, contractAddress);
    wagedContract.methods
      .wager()
      .call()
      .then(value => {
        this.setState({ wagerValue: web3.utils.fromWei(value) });
      });
  }
  render() {
    return <p>{this.state.wagerValue} ETH</p>;
  }
}

export default AmountWaged;
