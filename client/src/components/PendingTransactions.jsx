import React, { Component } from "react";
import { connect } from "react-redux";
import { Table } from "antd";
import axios from "axios";
import GameInfo from "./game-components/GameInfo";
import Transactions from "./my-bets-components/Transactions";
import PendingTxStatus from "./my-bets-components/PendingTxStatus";

const columns = [
  {
    title: "Games",
    key: "game",
    render: wager => GameInfo(wager)
  },
  {
    title: "Transactions",
    key: "transactions",
    render: wager => Transactions(wager)
  },
  {
    title: "Status",
    key: "status",
    render: wager => <PendingTxStatus wager={wager} />
  }
];

class PendingTransactions extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pendingTxs: []
    };
  }

  fetchPendingTxs = async address => {
    const usersPendingTxs = await axios.get(`/pending/${address}`);
    if (!usersPendingTxs) {
      this.setState({
        pendingTxs: []
      });
    } else {
      this.setState({
        pendingTxs: usersPendingTxs.data
      });
    }
  };

  componentDidMount() {
    this.fetchPendingTxs(this.props.account.address);
  }
  componentWillReceiveProps(nextProps) {
    if (
      this.props.account.address !== nextProps.account.address ||
      this.props.refresh !== nextProps.refresh
    ) {
      this.fetchPendingTxs(nextProps.account.address);
    }
  }
  render() {
    if (
      !this.props.web3 ||
      !this.props.account.active ||
      this.props.network !== 3
    ) {
      const warningStyle = {
        textAlign: "center",
        fontWeight: "bold",
        color: "#FF0000"
      };
      return (
        <p style={warningStyle}>
          Must be connected to a web3 wallet and the ropsten test network!{" "}
        </p>
      );
    } else {
      return (
        <Table
          columns={columns}
          dataSource={this.state.pendingTxs}
          rowKey={pending => pending._id}
          size="small"
        />
      );
    }
  }
}

const mapStateToProps = state => ({
  account: state.account,
  web3: state.web3,
  network: state.network
});

export default connect(mapStateToProps)(PendingTransactions);
