import React from "react";
import { connect } from "react-redux";
import { Table } from "antd";
import GameInfo from "./game-components/GameInfo";
import CreateBetButtons from "./game-components/CreateBetButtons";
import AmountInput from "./game-components/AmountInput";

const startTimeStyle = {
  marginTop: "10px",
  marginBottom: "0"
};

const columns = [
  {
    title: "Games",
    key: "game",
    render: game => {
      return (
        <div>
          {GameInfo(game)}
          <p style={startTimeStyle}>Start Time {game.startTimeEastern}</p>
        </div>
      );
    }
  },
  {
    title: "Wagers",
    key: "gameWager",
    render: game => <CreateBetButtons game={game} />
  },
  {
    title: "Amount",
    key: "gameAmount",
    render: game => <AmountInput game={game} />
  }
];

const Games = props => (
  <Table
    columns={columns}
    dataSource={props.games}
    rowKey={games => games.gameId}
    size="small"
  />
);
const mapStateToProps = state => ({
  games: state.games
});

export default connect(mapStateToProps)(Games);
