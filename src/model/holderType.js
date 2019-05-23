const mongoose = require('mongoose');

const { Schema } = mongoose;
const HolderTypeSchema = new Schema({
  name: String,
});

const HolderType = mongoose.model('holderType', HolderTypeSchema);

module.exports = HolderType;
