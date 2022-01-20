import React from "react";
import teamImg from "../../helpers/team-images";

const GameInfo = game => {
  const imgStyle = {
    width: "30px",
    height: "30px"
  };

  const gameTitleStyle = {
    display: "inline-block",
    margin: "10px"
  };

  return (
    <div>
      <img alt="" style={imgStyle} src={teamImg[game.aTriCode]} />
      <p style={gameTitleStyle}>{`${game.awayTeam} @ ${game.homeTeam}`}</p>
      <img alt="" style={imgStyle} src={teamImg[game.hTriCode]} />
    </div>
  );
};

export default GameInfo;
