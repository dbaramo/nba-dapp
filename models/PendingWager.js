const mongoose = require('mongoose');
const { Schema } = mongoose;

const pendingSchema = new Schema({
    txhash: String,
    createdBy: String,
    acceptedBy: String,
    pending: Boolean
});

mongoose.model('pendingWager', pendingSchema);