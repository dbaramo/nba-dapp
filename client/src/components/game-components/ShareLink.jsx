import React, { Component } from "react";
import { Icon, Tooltip } from "antd";

const shareStyleHover = {
  fontSize: "1.3rem",
  color: "#fff",
  padding: ".5rem",
  background: "#3E90F7",
  borderRadius: ".6rem"
};

const shareStyle = {
  fontSize: "1.3rem",
  color: "#3E90F7",
  padding: ".5rem"
};

class ShareLink extends Component {
  constructor(props) {
    super(props);
    this.state = {
      style: shareStyle,
      tipVisible: false
    };
  }
  share = () => {
    const link = `https://nbadapp.com/contract/${
      this.props.wager.contractAddress
    }`;
    const dummy = document.createElement("input");
    document.body.appendChild(dummy);
    dummy.setAttribute("value", link);
    dummy.select();
    document.execCommand("copy");
    document.body.removeChild(dummy);
    this.setState({ tipVisible: true });
  };
  render() {
    return (
      <Tooltip title="Copied" visible={this.state.tipVisible}>
        <Icon
          style={this.state.style}
          type="link"
          onClick={this.share}
          onMouseEnter={() => this.setState({ style: shareStyleHover })}
          onMouseLeave={() => {
            this.setState({ style: shareStyle, tipVisible: false });
          }}
        />
      </Tooltip>
    );
  }
}

export default ShareLink;
