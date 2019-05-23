const Customer = require('../model/customer');

module.exports = {
  getCustomers() {
    return Customer.find({})
      .exec();
  },

  addCustomer(requestBody) {
    const { name, customerCode } = requestBody.data;
    console.log(requestBody);

    return new Customer({
      name,
      customerCode,
    }).save();
  },
};
