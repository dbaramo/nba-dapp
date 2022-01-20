import React, { Component } from "react";
import moment from "moment";
import Web3 from "web3";
import axios from "axios";
import { connect } from "react-redux";
import { Button, message } from "antd";
import { abiArray, bytecode } from "../../helpers/contract-data";
import LoadingModal from "../LoadingModal";

const web3 = new Web3(window.web3);
const contract = new web3.eth.Contract(abiArray);

const betButtonStyle = {
  margin: "10px",
  minWidth: "115px"
};

class CreateBetButtons extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      txhash: "",
      contract: "",
      loadingModalMsg: null,
      loading: true,
      errorLoadMessage: null
    };
  }

  render() {
    const { game } = this.props;
    const {
      aTriCode,
      hTriCode,
      overUnder,
      awayTeam,
      homeTeam,
      startTimeEastern
    } = game;

    const disable =
      !this.props.web3 ||
      !this.props.account.active ||
      this.props.network !== 3;

    const handleOk = e => {
      e.preventDefault();
      this.setState({
        visible: false,
        txhash: null,
        contract: null,
        loadingModalMsg: null,
        errorLoadMessage: null
      });
    };

    const createOverUnder = (e, over) => {
      e.preventDefault();

      if (this.props.network !== 3) {
        message.error("Must be connected to the Ropsten Test Network!");
        return;
      }

      const checkMilliseconds =
        moment(game.startTimeUTC)
          .add(4, "h")
          .valueOf() - Date.now();
      const checkSeconds = Math.floor(checkMilliseconds / 1000);
      const gameDate = moment(game.startTimeUTC).format("YYYYMMDD");
      const url = `json(https://nbadapp.com/gamedata/${gameDate}/${
        game.gameId
      }).totalScoresCombined`;

      const contractArguments = [url, over, overUnder, checkSeconds];

      contract
        .deploy({
          data: bytecode,
          arguments: contractArguments
        })
        .send({
          from: this.props.account.address,
          gasPrice: "30000000000",
          gas: "3000000",
          value: web3.utils.toWei(this.props.amount[game.gameId].toString(), "ether")
        })
        .on("transactionHash", transactionHash => {
          console.log("transaction", transactionHash);
          this.setState({
            visible: true,
            txhash: transactionHash,
            loadingModalMsg: "Your transaction is being sent",
            loading: true
          });

          axios
            .post("https://nbadapp.com/pending", {
              txhash: transactionHash,
              createdBy: this.props.account.address,
              pending: true,
              pendingUser: this.props.account.address,
              gameId: game.gameId,
              wageType: "over_under",
              aTriCode,
              awayTeam,
              hTriCode,
              homeTeam,
              overUnder,
              startTimeEastern,
              startTimeUnix: moment(game.startTimeUTC).valueOf(),
              overUnderPosition: over
            })
            .then(response => {
              console.log(response);
            })
            .catch(error => {
              console.llog(error);
            });
        })
        .on("receipt", receipt => {
          axios
            .put(`https://nbadapp.com/pending/${this.state.txhash}`, {
              contractAddress: receipt.contractAddress,
              txhash: null,
              pendingUser: null,
              pending: false
            })
            .then(response => console.log(response))
            .catch(error => {
              console.log(error);
            });
        })
        .then(newContractInstance => {
          this.setState({
            loadingModalMsg: "Your contract was created",
            loading: false,
            txhash: null,
            contract: newContractInstance.options.address
          });
        })
        .catch(error => {
          console.log(error);

          if (error.toString().includes("not mined within 50 blocks")) {
            console.log("Got the error for 50 HEREERERE!");
            this.setState({
              loading: false,
              loadingModalMsg: "Your contract is taking a while...",
              errorLoadMessage:
                "Come back later to see if your transaction went through or set a higher gas price"
            });

            return;
          }

          if (this.state.txhash) {
            this.setState({
              txhash: null
            });
            return;
          }

          message.error("Your contract did not deploy");
        });
    };

    return (
      <div>
        <Button
          disabled={disable}
          style={betButtonStyle}
          type="primary"
          onClick={e => createOverUnder(e, false)}
        >
          UNDER {overUnder}{" "}
        </Button>{" "}
        <Button
          disabled={disable}
          style={betButtonStyle}
          type="primary"
          onClick={e => createOverUnder(e, true)}
        >
          OVER {overUnder}{" "}
        </Button>{" "}
        <LoadingModal
          handleOk={handleOk}
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
  amount: state.amount,
  network: state.network
});

export default connect(mapStateToProps)(CreateBetButtons);
