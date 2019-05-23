const mongoose = require('mongoose');

const { Schema } = mongoose;
const GasFillOrderSchema = new Schema({
  orderNumber: String,
  createdDate: { type: Date, default: Date.now() },
  orderDate: Date,
  orderReturn: Date,
  gasList: [{ type: Schema.Types.ObjectId, ref: 'gas' }],
  gasVendor: { type: Schema.Types.ObjectId, ref: 'gasVendor' },
  orderBy: { type: Schema.Types.ObjectId, ref: 'user' },
});

const GasFillOrder = mongoose.model('gasFillOrder', GasFillOrderSchema);

module.exports = GasFillOrder;
