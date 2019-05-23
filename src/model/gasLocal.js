const mongoose = require('mongoose');

const { Schema } = mongoose;
const GasLocalSchema = new Schema({
  name: String,
});

const GasLocal = mongoose.model('gasLocal', GasLocalSchema);

module.exports = GasLocal;
