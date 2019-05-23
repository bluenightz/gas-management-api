const GasLocal = require('../model/gasLocal');

module.exports = {
  getLocal(name) {
    return GasLocal.findOne({ name })
      .exec();
  },
};
