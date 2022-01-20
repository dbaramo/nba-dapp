const axios = require("axios");
const moment = require("moment");
const mongoose = require("mongoose");
const feed = require("../data/team-spread-data");

const Wager = mongoose.model("wagers");
const PendingWager = mongoose.model("pendingWager");

module.exports = app => {
  app.get("/games", async (req, res) => {
    var today = moment().format("YYYYMMDD");

    try {
      const response = await axios.get(
        `https://data.nba.net/data/10s/prod/v1/${today}/scoreboard.json`
      );
      const games = response.data.games;

      for (let i = 0; i < feed.length; i++) {
        for (let j = 0; j < games.length; j++) {
          if (
            feed[i].aTriCode === games[j].vTeam.triCode &&
            feed[i].hTriCode === games[j].hTeam.triCode
          ) {
            feed[i]["gameId"] = games[j].gameId;
            feed[i]["startTimeEastern"] = games[j].startTimeEastern;
            feed[i]["startTimeUTC"] = games[j].startTimeUTC;
            feed[i]["vTeamScore"] = parseInt(games[j].vTeam.score) || 0;
            feed[i]["hTeamScore"] = parseInt(games[j].hTeam.score) || 0;
            feed[i]["totalScoresCombined"] =
              parseInt(games[j].vTeam.score) + parseInt(games[j].hTeam.score) ||
              0;
          }
        }
      }

      res.json({
        feed
      });
    } catch (error) {
      res.send("error occured");
    }
  });

  app.get("/gamedata/:gameDate/:gameId", async (req, res) => {
    // example: http://nbadapp.com/gamedata/20180103/0021700554
    const { gameDate, gameId } = req.params;

    try {
      const response = await axios.get(
        `https://data.nba.net/data/10s/prod/v1/${gameDate}/${gameId}_boxscore.json`
      );
      const gameResult = response.data.basicGameData;
      const { vTeam, hTeam } = gameResult;

      res.json({
        game: `${vTeam.triCode} @ ${hTeam.triCode}`,
        vTeamScore: parseInt(vTeam.score) || 0,
        hTeamScore: parseInt(hTeam.score) || 0,
        totalScoresCombined: parseInt(vTeam.score) + parseInt(hTeam.score) || 0
      });
    } catch (error) {
      res.send("error occured");
    }
  });

  app.get("/bets/:user", (req, res) => {
    const { user } = req.params;

    Wager.find()
      .or([{ createdBy: user }, { acceptedBy: user }])
      .where("pending")
      .equals(false)
      .exec(function(error, response) {
        if (error) {
          console.log(error);
          res.send("Falied");
        } else {
          res.send(response);
        }
      });
  });

  app.get("/pendingtxs", (req, res) => {
    Wager.where("pending")
      .equals(true)
      .exec(function(error, response) {
        if (error) {
          console.log(error);
          res.send("Falied");
        } else {
          res.send(response);
        }
      });
  });

  app.get("/pending/:user", (req, res) => {
    const { user } = req.params;

    Wager.where("pendingUser")
      .equals(user)
      .where("pending")
      .equals(true)
      .exec(function(error, response) {
        if (error) {
          console.log(error);
          res.send("Falied");
        } else {
          res.send(response);
        }
      });
  });

  app.get("/openbets", (req, res) => {
    const { usersAddress } = req.query;
    Wager.where("pending")
      .equals(false)
      .where("betActive")
      .ne(true)
      .where("contractAddress")
      .ne(null)
      .where("createdBy")
      .ne(usersAddress)
      .where("startTimeUnix")
      .gte(Date.now())
      .exec(function(error, response) {
        if (error) {
          console.log(error);
          res.send("Falied");
        } else {
          res.send(response);
        }
      });
  });

  app.get("/contract/:contractAddress", (req, res) => {
    const { contractAddress } = req.params;

    Wager.where("contractAddress")
      .equals(contractAddress)
      .exec(function(error, response) {
        if (error) {
          console.log(error);
          res.status(404).end();
        } else {
          res.status(200).send(response);
        }
      });
  });

  app.put("/createwager", async (req, res) => {
    const txhash = req.body.txhash;

    try {
      const wagerToUpdate = await Wager.find({ txhash });
      const wagerSaved = wagerToUpdate.update(req.body);
      res.send("Succseful");
    } catch (error) {
      console.log(error);
      res.send("Failed/Wager not saved in DB!");
    }
  });

  app.post("/pending", async (req, res) => {
    const pendingtx = Wager(req.body);

    try {
      const pendingtxSaved = await pendingtx.save();
      res.send("Succseful");
    } catch (error) {
      console.log(error);
      res.send("Pending Wager not saved in DB!");
    }
  });

  app.put("/contract", async (req, res) => {
    // Updates DB if bet is active and updates accepted player
    const {
      contractAddress,
      acceptedBy,
      pending,
      pendingUser,
      txhash
    } = req.body;

    if (pending) {
      try {
        await Wager.update(
          { contractAddress },
          { pendingUser, pending, txhash }
        ).exec();
        res.status(200).end();
      } catch (error) {
        console.log(error);
      }
      return;
    }

    try {
      await Wager.update(
        { contractAddress },
        { betActive: true, acceptedBy }
      ).exec();
      res.status(200).end();
    } catch (error) {
      console.log(error);
    }
  });

  app.put("/pending/:txhash", (req, res) => {
    const { txhash } = req.params;
    const data = req.body;

    Wager.update({ txhash }, { $set: data }, function(error, result) {
      if (error) {
        res.status(400).send("Update Pending Tx Failed!");
      } else {
        res.status(200).send("Update Pending Tx Succesful!");
      }
    });
  });

  app.delete("/deletebet", async (req, res) => {
    const { contractAddress } = req.query;

    try {
      await Wager.remove({ contractAddress });
      res.status(200).send("ok");
    } catch (error) {
      res.send("error occured");
    }
  });
};
