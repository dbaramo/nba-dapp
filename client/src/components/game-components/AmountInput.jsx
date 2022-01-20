import React, { Component } from "react";
import { InputNumber } from "antd";
import { connect } from "react-redux";
import * as actions from "../../actions/index";

class AmountInput extends Component {
  constructor(props) {
    super(props);
    this.onChange = this.onChange.bind(this);
  }

  componentWillMount() {
    const gameWager = {};
    gameWager[this.props.game.gameId] = 0.1;
    this.props.setWageAmount(gameWager);
  }

  onChange(value) {
    if (typeof value !== "number") {
      return;
    }
    const gameWager = {};
    gameWager[this.props.game.gameId] = value;
    this.props.setWageAmount(gameWager);
  }

  pStyle = {
    display: "inline-block",
    marginLeft: "5px"
  };
  render() {
    return (
      <div>
        <InputNumber
          min={0.1}
          max={1}
          step={0.1}
          defaultValue={0.1}
          onChange={this.onChange}
          size="small"
          disabled={!window.web3 || this.props.account.active === false}
        />
        <p style={this.pStyle}>ETH</p>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  account: state.account,
  amount: state.amount
});

export default connect(mapStateToProps, actions)(AmountInput);
