const mongoose = require('mongoose');

const { Schema } = mongoose;
const GasPsiSizeSchema = new Schema({
  name: String,
  psi: Number,
});

const GasPsiSize = mongoose.model('gasPsiSize', GasPsiSizeSchema);

module.exports = GasPsiSize;
