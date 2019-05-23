const mongoose = require('mongoose');

const { Schema } = mongoose;
const LogTypeSchema = new Schema({
  name: String,
});

const LogType = mongoose.model('logType', LogTypeSchema);

module.exports = LogType;
