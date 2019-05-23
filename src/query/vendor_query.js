const GasVendor = require('../model/gasVendor');

module.exports = {
  getVendor(name) {
    return GasVendor.findOne({ name })
      .exec();
  },
  getVendors() {
    return GasVendor.find({})
      .exec();
  },
};
