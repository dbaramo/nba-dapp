import React from "react";
import GameInfo from "../game-components/GameInfo";

const OpenBetGameInfo = wager => {
  return (
    <div>
      {GameInfo(wager)}
      <p>Created By: {wager.createdBy}</p>
      <p>
        Contract:{" "}
        <a
          target="_blank"
          href={`https://ropsten.etherscan.io/address/${wager.contractAddress}`}
        >
          {wager.contractAddress}
        </a>
      </p>
      <p>Game Starts at: {wager.startTimeEastern}</p>
    </div>
  );
};

export default OpenBetGameInfo;
