import React, { Component } from "react";
import { message, Button } from "antd";
import Web3 from "web3";
import { abiArray } from "../../helpers/contract-data";
import { connect } from "react-redux";

const web3 = new Web3(window.web3);

class MyBetAction extends Component {
  constructor(props) {
    super(props);
    this.state = {
      player1: null,
      betActive: null,
      contractState: null,
      winnerState: null
    };
  }

  componentDidMount() {
    this.fetchContractState();
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.account.address !== nextProps.account.address) {
      this.fetchContractState();
    }
  }

  fetchContractState = () => {
    const { contractAddress } = this.props.wager;
    const wagedContract = new web3.eth.Contract(abiArray, contractAddress);
    wagedContract.methods
      .player1()
      .call()
      .then(player1 => {
        wagedContract.methods
          .betActive()
          .call()
          .then(betActive => {
            this.setState({ player1, betActive });
          });
      });

    wagedContract
      .getPastEvents("contractState", {
        fromBlock: 0,
        toBlock: "latest"
      })
      .then(events => {
        this.setState({
          contractState: events[events.length - 1].returnValues.state
        });
      });

    wagedContract
      .getPastEvents("winner", {
        fromBlock: 0,
        toBlock: "latest"
      })
      .then(events => {
        if (events.length < 1) {
          return;
        }

        const { winningAddress } = events[0].returnValues;

        if (winningAddress === "0x0000000000000000000000000000000000000000") {
          this.setState({
            winnerState: "No Winner (Tie/Canceled/Refund)"
          });

          return;
        }

        if (winningAddress === this.props.account.address) {
          this.setState({
            winnerState: "You Won"
          });
        }

        if (winningAddress !== this.props.account.address) {
          this.setState({
            winnerState: "You Lost"
          });
        }
      });
  };

  render() {
    const { player1 } = this.state;
    const { account } = this.props;

    const canelBet = () => {
      const { contractAddress } = this.props.wager;
      const wagedContract = new web3.eth.Contract(abiArray, contractAddress);
      wagedContract.methods
        .cancelBet()
        .send({ from: account.address })
        .on("transactionHash", txhash => {
          message.loading("Canceling your wager (May take a few Minutes)...");
        })
        .then(result => {
          console.log("result", result);
          message.success("Your wager was canceled");
          setTimeout(() => {
            this.props.fetchBets(account.address);
          }, 4000);
        })
        .catch(error => {
          console.log(error);
          message.error("Error Occured/Wager may have not been canceled");
          setTimeout(() => {
            this.props.fetchBets(account.address);
          }, 4000);
        });
    };

    if (player1 === account.address && this.state.contractState === "Open") {
      return (
        <Button
          onClick={canelBet}
          type="danger"
          style={{ color: "#fff", background: "#E23C39" }}
        >
          Cancel
        </Button>
      );
    } else {
      return this.state.winnerState ? (
        <p>{this.state.winnerState}</p>
      ) : (
        <p>{this.state.contractState}</p>
      );
    }
  }
}

const mapStateToProps = state => ({
  account: state.account
});

export default connect(mapStateToProps)(MyBetAction);
