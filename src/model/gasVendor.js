const mongoose = require('mongoose');

const { Schema } = mongoose;
const GasVendorSchema = new Schema({
  customerCode: String,
  name: String,
});

const GasVendor = mongoose.model('gasVendor', GasVendorSchema);

module.exports = GasVendor;
