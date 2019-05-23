const mongoose = require('mongoose');

const { Schema } = mongoose;
const CustomerSchema = new Schema({
  name: String,
  customerCode: String,
  currentOrder: { type: Schema.Types.ObjectId, ref: 'customerOrder' },
  orderHistory: [{ type: Schema.Types.ObjectId, ref: 'customerOrder' }],
});

const Customer = mongoose.model('customer', CustomerSchema);

module.exports = Customer;
