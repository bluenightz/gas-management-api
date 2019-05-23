const mongoose = require('mongoose');

const { Schema } = mongoose;
const SkuLogSchema = new Schema({
  orderDate: Date,
  gasList: [{ type: Schema.Types.ObjectId, ref: 'gas' }],
});

const GasListStrSchema = new Schema({
  sku: String,
  psi: Number,
  isLocal: Boolean,
  newChangedSku: String,
});

const CustomerOrderSchema = new Schema({
  orderNumber: String,
  status: { type: Schema.Types.ObjectId, ref: 'gasStatus', default: null },
  // customerId: { type: Schema.Types.ObjectId, ref: 'customer' },
  customerId: { type: Schema.Types.ObjectId, refPath: 'onModel' },
  createdDate: { type: Date, default: Date.now() },
  orderDate: Date,
  orderReturn: Date,
  gasList: [{ type: Schema.Types.ObjectId, ref: 'gas' }],
  gasListStr: [GasListStrSchema],
  skuLog: [SkuLogSchema],
  onModel: {
    type: String,
    required: true,
    enum: ['customer', 'gasVendor', 'gasLocal'],
  },
});

const CustomerOrder = mongoose.model('customerOrder', CustomerOrderSchema);

module.exports = CustomerOrder;
