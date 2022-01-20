import React from "react";
import { Link } from "react-router-dom";
import jordanCrying from "../images/jordan_crying.png";
import lebron from "../images/bron_face.png";

const SiteNavStyle = {
  display: "inline-block",
  fontSize: "50px",
  color: "black",
  marginBottom: 0,
  fontFamily: "Anton, sans-serif"
};

const faceStyle = {
  width: "60px",
  height: "60px",
  display: "inline-block",
  marginBottom: "30px",
  marginLeft: "5px",
  marginRight: "5px"
};

const SiteNav = props => {
  return (
    <div style={{ textAlign: "center" }}>
      <Link to="/">
        <img alt="" style={faceStyle} src={jordanCrying} />
        <p style={SiteNavStyle}>NBA DAPP</p>
        <img alt="" style={faceStyle} src={lebron} />
      </Link>
    </div>
  );
};

export default SiteNav;
