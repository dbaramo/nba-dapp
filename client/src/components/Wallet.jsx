import React from "react";
import { connect } from "react-redux";
import { Avatar, Popover } from "antd";
import AccountBalance from "./AccountBalance";
import metamask from "../images/metamask.png";
import fool from "../images/fool.png";

const avatarStyle = {
  marginRight: "15px",
  background: "transparent",
  width: "40px",
  height: "40px"
};

const metamaskStyle = {
  height: "36px",
  width: "120px",
  marginRight: "10px"
};

const walletMessageStyle = {
  marginRight: "20px",
  fontWeight: "bold",
  color: "#FF0000"
};

function isMobileDevice() {
  return (
    typeof window.orientation !== "undefined" ||
    navigator.userAgent.indexOf("IEMobile") !== -1
  );
}

const Wallet = props => {
  if (props.web3) {
    return !props.account.active ? (
      <p style={walletMessageStyle}>Unlock Ethereum Wallet To Use Site</p>
    ) : (
      <div>
        <AccountBalance />
        <div className="wallet">
          <Popover
            placement="topLeft"
            content={props.account.address}
            trigger="click || hover"
          >
            <Avatar style={avatarStyle} src={fool} />
          </Popover>
        </div>
      </div>
    );
  } else {
    return isMobileDevice() ? (
      <p style={walletMessageStyle}>No Web3 Wallet Found</p>
    ) : (
      <a target="_blank" rel="noopener noreferrer" href="https://metamask.io/">
        <img alt="" style={metamaskStyle} src={metamask} />
      </a>
    );
  }
};

const mapStateToProps = state => ({
  web3: state.web3,
  account: state.account
});

export default connect(mapStateToProps)(Wallet);
