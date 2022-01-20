import React, { Component } from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import { connect } from "react-redux";
import * as actions from "./actions";
import { Alert } from "antd";
import Home from "./routes/Home";
import SingleBetContract from "./routes/SingleBetContract";

class App extends Component {
  componentDidMount() {
    setInterval(this.props.fetchWeb3, 100);
    this.props.fetchGames();
  }
  render() {
    return (
      <div className="container">
        <BrowserRouter>
          <div>
            {!this.props.web3 ? (
              <Alert
                message="No Web3 Wallet was found :("
                type="warning"
                showIcon={true}
              />
            ) : null}
            {this.props.network !== 3 && this.props.web3 ? (
              <Alert
                message="Must be connected to the Ropsten Test Network!"
                type="warning"
                showIcon={true}
              />
            ) : null}
            <Switch>
              <Route path="/" exact component={Home} />
              <Route
                path="/contract/:address"
                exact
                component={SingleBetContract}
              />
              <Route
                path="*"
                component={() => (
                  <p style={{ textAlign: "center" }}>Page Not Found</p>
                )}
              />
            </Switch>
          </div>
        </BrowserRouter>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  web3: state.web3,
  network: state.network
});

export default connect(mapStateToProps, actions)(App);
