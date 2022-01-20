import React, { Component } from "react";
import Web3 from "web3";

const web3 = new Web3(window.web3);
const failedStyleText = {
  color: "#FF0000",
  fontWeight: "bold"
};
class PendingTxStatus extends Component {
  constructor(props) {
    super(props);
    this.state = {
      receipt: null
    };
  }
  componentDidMount() {
    this.getRecieptData();
  }

  getRecieptData = async () => {
    const receipt = await web3.eth.getTransactionReceipt(
      this.props.wager.txhash
    );

    this.setState({
      receipt
    });

    console.log(this.state.receipt);
  };

  render() {
    if (!this.state.receipt) {
      return <p>Pending</p>;
    } else if (this.state.receipt.status === "0x0") {
      return <p style={failedStyleText}>Failed</p>;
    } else {
      return null;
    }
  }
}

export default PendingTxStatus;
