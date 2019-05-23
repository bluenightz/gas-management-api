const mongoose = require('mongoose');
const customer = require('./customer');
const gasLocal = require('./gasLocal');
const gasVendor = require('./gasVendor');

const { Schema } = mongoose;
const GasSchema = new Schema({
  sku: String,
  skuHistory: [String],
  psi: Number,
  psiMax: { type: Number, ref: 'gasPsiSize', default: 2000 },
  status: { type: Schema.Types.ObjectId, ref: 'gasStatus', default: null },
  returnDate: Date,
  logs: [{ type: Schema.Types.ObjectId, ref: 'log' }],
  holderType: String,
  holder: { type: Schema.Types.ObjectId, refPath: 'onModel' },
  onModel: {
    type: String,
    required: true,
    enum: ['customer', 'gasLocal', 'gasVendor'],
  },
});

const Gas = mongoose.model('gas', GasSchema);

module.exports = Gas;
