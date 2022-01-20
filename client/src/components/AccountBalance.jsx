import React from "react";
import { connect } from "react-redux";

const style = {
  display: "inline-block",
  marginRight: "20px"
};

const AccountBalance = props => {
  if (window.innerWidth < 587) {
    return null;
  } else {
    return (
      <p style={style}>Account Balance: {props.account.accountBalance} ETH</p>
    );
  }
};

const mapStateToProps = state => ({
  account: state.account
});

export default connect(mapStateToProps)(AccountBalance);
