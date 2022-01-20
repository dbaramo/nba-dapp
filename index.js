const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const moment = require("moment");
const cors = require("cors");
const path = require('path');
const teamNameData = require("./data/team-name-data");
const feed = require("./data/team-spread-data");
const config = require("./config");
require("./models/Wager");
require("./models/PendingWager");
require("./data/web3Poll");

// *******************APP
const app = express();
app.use(bodyParser.json(), cors("*"), express.static("client/build"));

// Database
mongoose.Promise = global.Promise;
mongoose.connect(config.dbUrl);

// Routes
require("./routes/index")(app);

// Serve up production assets
app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
});

const PORT = 5000;
app.listen(PORT);
