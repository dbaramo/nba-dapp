import React from "react";
import { Button, Modal } from "antd";
import ShareLink from "./game-components/ShareLink";

const LoadingModal = props => {
  return (
    <Modal
      title={props.loadingModalMsg}
      visible={props.visible}
      closable={false}
      footer={[
        <Button key={props.txhash} type="primary" onClick={props.handleOk}>
          OK{" "}
        </Button>
      ]}
    >
      {props.loading || props.errorLoadMessage ? (
        <div>
          <div
            style={!props.loading ? { display: "none" } : null}
            className="cssload-loader"
          >
            <div className="cssload-inner cssload-one" />
            <div className="cssload-inner cssload-two" />
            <div className="cssload-inner cssload-three" />
          </div>

          {props.errorLoadMessage ? <p>{props.errorLoadMessage}</p> : null}

          <p style={{ textAlign: "center", marginTop: "20px" }}>
            <a
              target="_blank"
              href={`https://ropsten.etherscan.io/tx/${props.txhash}`}
            >
              Click here to see your transaction
            </a>
          </p>
        </div>
      ) : (
        <div>
          <p>The Contract on Etherscan:</p>
          <a
            target="_blank"
            href={`https://ropsten.etherscan.io/address/${props.contract}`}
          >
            {props.contract}
          </a>
          <p style={{ marginTop: "10px" }}>
            Send a link of your wager:{" "}
            <ShareLink wager={{ contractAddress: props.contract }} />
          </p>
        </div>
      )}
    </Modal>
  );
};

export default LoadingModal;
