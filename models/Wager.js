const mongoose = require('mongoose');
const { Schema } = mongoose;

const wagerSchema = new Schema({
  createdBy: String,
  acceptedBy: String,
  gameId: String,
  wageType: String,
  contractAddress: String,
  aTriCode: String,
  awayTeam: String,
  hTriCode: String,
  homeTeam: String,
  startTimeEastern: String,
  startTimeUnix: Number,
  overUnder: Number,
  overUnderPosition: Boolean,
  betActive: Boolean,
  txhash: String,
  pendingUser: String,
  pending: Boolean
});

mongoose.model('wagers', wagerSchema);