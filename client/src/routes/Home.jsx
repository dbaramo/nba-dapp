import React, { Component } from "react";
import { Tabs } from "antd";
import SiteNav from "../components/SiteNav";
import Wallet from "../components/Wallet";
import Games from "../components/Games";
import MyBets from "../components/MyBets";
import PendingTransactions from "../components/PendingTransactions";
import OpenBets from "../components/OpenBets";

const TabPane = Tabs.TabPane;

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      refresh: 0
    };
  }

  setRefresh = () => {
    this.setState((prevState, props) => ({
      refresh: prevState.refresh + 1
    }));
  };

  render() {
    return (
      <div>
        <SiteNav />
        <Tabs
          onTabClick={this.setRefresh}
          value="large"
          tabBarExtraContent={<Wallet />}
        >
          <TabPane tab="Create A Bet" key="1">
            <Games />
          </TabPane>
          <TabPane tab="Open Bets" key="2">
            <OpenBets refresh={this.state.refresh} />
          </TabPane>
          <TabPane tab="My Bets" key="3">
            <MyBets refresh={this.state.refresh} />
          </TabPane>
          <TabPane tab="Pending Transactions" key="4">
            <PendingTransactions refresh={this.state.refresh} />
          </TabPane>
        </Tabs>
      </div>
    );
  }
}

export default Home;
