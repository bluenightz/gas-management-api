const mongoose = require('mongoose');

const { Schema } = mongoose;
const LogSchema = new Schema({
  type: String,
  detail: String,
  user: String,
  created_time: Date,
  expireAt: Date,
  work_id: String,
});

const Log = mongoose.model('log', LogSchema);

module.exports = Log;
