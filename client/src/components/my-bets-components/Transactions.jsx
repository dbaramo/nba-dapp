import React from "react";

const Transactions = props => {
  return (
    <a target="_blank" href={`https://ropsten.etherscan.io/tx/${props.txhash}`}>
      <p>{props.txhash}</p>
    </a>
  );
};

export default Transactions;
