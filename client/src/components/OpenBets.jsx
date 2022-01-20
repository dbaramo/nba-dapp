import React, { Component } from "react";
import { connect } from "react-redux";
import axios from "axios";
import { Table } from "antd";
import ShareLink from "./game-components/ShareLink";
import AcceptBet from "./open-bets-components/AcceptBet";
import OpenBetGameInfo from "./open-bets-components/OpenBetGameInfo";

const columns = [
  {
    title: "Games",
    key: "game",
    render: wager => {
      return OpenBetGameInfo(wager);
    }
  },
  {
    title: "Accept",
    key: "accept",
    render: wager => <AcceptBet wager={wager} />
  },
  {
    title: "Share Link",
    key: "shareLink",
    render: wager => <ShareLink wager={wager} />
  }
];

class OpenBets extends Component {
  constructor(props) {
    super(props);
    this.state = {
      openBets: []
    };
  }

  fetchOpenBets = async () => {
    const allOpenBets = await axios.get(`/openbets`, {
      params: {
        usersAddress: this.props.account.address
      }
    });
    if (!allOpenBets) {
      this.setState({
        openBets: []
      });
    } else {
      this.setState({
        openBets: allOpenBets.data
      });
    }
  };

  componentDidMount() {
    this.fetchOpenBets();
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.refresh !== nextProps.refresh) {
      this.fetchOpenBets();
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
          dataSource={this.state.openBets}
          rowKey={wager => wager._id}
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

export default connect(mapStateToProps)(OpenBets);
