import React, { Component } from "react";
import { Table } from "antd";
import { connect } from "react-redux";
import axios from "axios";

import SiteNav from "../components/SiteNav";
import AcceptBet from "../components/open-bets-components/AcceptBet.jsx";
import OpenBetGameInfo from "../components/open-bets-components/OpenBetGameInfo";

const walletWarning = {
  paddingTop: "10px",
  textAlign: "center",
  fontWeight: "bold",
  color: "#FF0000"
};

const columns = [
  {
    title: "Game",
    key: "game",
    render: wager => {
      return OpenBetGameInfo(wager);
    }
  },
  {
    title: "Accept",
    key: "accept",
    render: wager => <AcceptBet wager={wager} />
  }
];

class SingleBetContract extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      contract: null
    };
  }
  componentDidMount() {
    const contractAddress = this.props.match.params.address;
    axios
      .get(`/contract/${contractAddress}`)
      .then(response => {
        this.setState({ contract: response.data });
        console.log(response.data);
      })
      .catch(error => console.log(error));
    this.setState({ loading: false });
  }
  render() {
    if (this.state.loading) {
      return (
        <div style={{ marginTop: "50px" }} className="cssload-loader">
          <div className="cssload-inner cssload-one" />
          <div className="cssload-inner cssload-two" />
          <div className="cssload-inner cssload-three" />
        </div>
      );
    } else if (!this.props.web3 || this.props.network !== 3) {
      const warningStyle = {
        textAlign: "center",
        fontWeight: "bold",
        color: "#FF0000"
      };
      return (
        <div>
          <SiteNav />
          <p style={warningStyle}>
            Must be connected to a web3 wallet and the ropsten test network!{" "}
          </p>
        </div>
      );
    } else {
      return (
        <div>
          <SiteNav />
          {!this.props.account.active && this.props.web3 ? (
            <p style={walletWarning}>Unlock Web3 Wallet</p>
          ) : null}
          <Table
            columns={columns}
            dataSource={this.state.contract}
            rowKey={wager => wager._id}
            size="small"
          />
        </div>
      );
    }
  }
}

const mapStateToProps = state => ({
  web3: state.web3,
  account: state.account,
  network: state.network
});

export default connect(mapStateToProps)(SingleBetContract);
