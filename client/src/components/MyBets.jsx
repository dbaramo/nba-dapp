import React, { Component } from "react";
import { connect } from "react-redux";
import { Table } from "antd";
import axios from "axios";
import GameInfo from "./game-components/GameInfo";
import ShareLink from "./game-components/ShareLink";
import AmountWaged from "./my-bets-components/AmountWaged";
import MyBetAction from "./my-bets-components/MyBetAction";

const startTimeStyle = {
  marginTop: "10px",
  marginBottom: "0"
};

class MyBets extends Component {
  constructor(props) {
    super(props);
    this.state = {
      myWagers: []
    };
  }

  columns = [
    {
      title: "Games",
      key: "game",
      render: wager => {
        return (
          <div>
            {GameInfo(wager)}
            <a
              target="_blank"
              href={`https://ropsten.etherscan.io/address/${
                wager.contractAddress
              }`}
            >
              {wager.contractAddress}
            </a>
            <p style={startTimeStyle}>Start Time {wager.startTimeEastern}</p>
          </div>
        );
      }
    },
    {
      title: "Amount Waged",
      key: "waged",
      render: wager => <AmountWaged wager={wager} />
    },
    {
      title: "Share Link",
      key: "shareLink",
      render: wager => <ShareLink wager={wager} />
    },
    {
      title: "",
      key: "action",
      render: wager => <MyBetAction wager={wager} fetchBets={this.fetchBets} />
    }
  ];

  fetchBets = async address => {
    const userWagers = await axios.get(`/bets/${address}`);
    if (!userWagers) {
      this.setState({
        myWagers: []
      });
    } else {
      this.setState({
        myWagers: userWagers.data
      });
    }
  };

  componentDidMount() {
    this.fetchBets(this.props.account.address);
  }
  componentWillReceiveProps(nextProps) {
    if (
      this.props.account.address !== nextProps.account.address ||
      this.props.refresh !== nextProps.refresh
    ) {
      this.fetchBets(nextProps.account.address);
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
          columns={this.columns}
          dataSource={this.state.myWagers}
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

export default connect(mapStateToProps)(MyBets);
