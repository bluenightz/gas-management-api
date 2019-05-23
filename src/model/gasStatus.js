const mongoose = require('mongoose');

const { Schema } = mongoose;
const GasStatusSchema = new Schema({
  name: String,
  alt: String,
});

const GasStatus = mongoose.model('gasStatus', GasStatusSchema);

module.exports = GasStatus;
