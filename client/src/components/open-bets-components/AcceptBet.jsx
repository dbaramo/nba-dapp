import React, { Component } from "react";
import { connect } from "react-redux";
import { message, Button } from "antd";
import Web3 from "web3";
import { abiArray } from "../../helpers/contract-data";
import axios from "axios";
import LoadingModal from "../LoadingModal";

const web3 = new Web3(window.web3);

const overOrUnder = bool => {
  if (bool === true) {
    return "Over";
  }

  if (bool === false) {
    return "Under";
  }
};

class AcceptBet extends Component {
  constructor(props) {
    super(props);
    this.state = {
      overUnderPosition: null,
      wagerAmount: null,
      scoreUrl: null,
      targetScore: null,
      contractState: null,
      visible: false,
      txhash: "",
      contract: null,
      loading: true,
      loadingModalMsg: null,
      errorLoadMessage: null
    };
  }

  getContractData = async () => {
    const { contractAddress } = this.props.wager;
    const wagedContract = new web3.eth.Contract(abiArray, contractAddress);
    const scoreUrl = await wagedContract.methods.scoreUrl().call();
    const wagerAmount = await wagedContract.methods.wager().call();
    const overUnderPosition = await wagedContract.methods.over().call();
    const targetScore = await wagedContract.methods.targetScore().call();
    const contractState = await wagedContract.getPastEvents("contractState", {
      fromBlock: 0,
      toBlock: "latest"
    });

    this.setState({
      scoreUrl,
      targetScore,
      wagerAmount: web3.utils.fromWei(wagerAmount),
      overUnderPosition: !overUnderPosition,
      contractState: contractState[contractState.length - 1].returnValues.state
    });
  };

  acceptWager = async () => {
    const {
      scoreUrl,
      overUnderPosition,
      targetScore,
      wagerAmount
    } = this.state;
    const { contractAddress } = this.props.wager;
    const wagedContract = new web3.eth.Contract(abiArray, contractAddress);

    if (this.props.network !== 3) {
      message.error("Must be connected to the Ropsten Test Network!");
      return;
    }

    if (this.props.account.accountBalance < wagerAmount) {
      message.error("Not enough ETH in your account to cover the transaction!");
      return;
    }

    wagedContract.methods
      .acceptBet(scoreUrl, overUnderPosition, targetScore)
      .send({
        from: this.props.account.address,
        gas: 75806,
        value: web3.utils.toWei(wagerAmount)
      })
      .on("transactionHash", txhash => {
        console.log("txhash:", txhash);

        this.setState({
          visible: true,
          txhash,
          loading: true,
          loadingModalMsg: "Your transaction is being sent"
        });

        axios
          .put("/contract", {
            contractAddress,
            txhash,
            pendingUser: this.props.account.address,
            pending: true
          })
          .then(response => {
            console.log("response", response);
          })
          .catch(error => {
            console.log(error);
          });
      })
      .on('receipt', (receipt) => {
        this.setState({
          loadingModalMsg: "Your accepted the wager",
          loading: false,
          txhash: null,
          contract: receipt.to
        });
      })
      .then(() => {
        console.log("Done");
      })
      .catch(error => {
        if (error.toString().includes("not mined within 50 blocks")) {
          console.log("Agaaaaaaain", error);
          this.setState({
            loading: false,
            loadingModalMsg: "Your transaction is taking a while...",
            errorLoadMessage:
              "Come back later to see if your transaction went through or set a higher gas price"
          });

          return;
        }

        message.error("Your tranaction was not sent");
      });
  };

  componentDidMount() {
    this.getContractData();
  }

  handleOk = e => {
    e.preventDefault();
    this.setState({
      visible: false,
      txhash: null,
      contract: null,
      loadingModalMsg: null,
      errorLoadMessage: null
    });
  };

  render() {
    if (!this.props.web3) {
      return null;
    }
    return (
      <div>
        <Button
          type="primary"
          onClick={this.acceptWager}
          disabled={
            !this.props.web3 ||
            !this.props.account.active ||
            this.props.network !== 3 ||
            this.state.contractState !== "Open"
          }
        >
          {`${overOrUnder(this.state.overUnderPosition)} ${
            this.state.targetScore
          } (${this.state.wagerAmount} ETH)`}
        </Button>
        <LoadingModal
          handleOk={this.handleOk}
          visible={this.state.visible}
          txhash={this.state.txhash}
          loading={this.state.loading}
          contract={this.state.contract}
          loadingModalMsg={this.state.loadingModalMsg}
          errorLoadMessage={this.state.errorLoadMessage}
        />{" "}
      </div>
    );
  }
}
const mapStateToProps = state => ({
  web3: state.web3,
  account: state.account,
  network: state.network
});

export default connect(mapStateToProps)(AcceptBet);
