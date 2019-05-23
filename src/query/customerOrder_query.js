const CustomerOrder = require('../model/customerOrder');
const Gas = require('../model/gas');


module.exports = {

  getCustomerOrderDetail(req, res) {
    return CustomerOrder.findOne({ _id: req.params.id })
      .populate('status')
      .populate('customerId')
      .populate('gasList')
      .exec();
  },

  getCustomerOrder() {
    return CustomerOrder.find({}).populate('status').populate('customerId', { name: true, customerCode: true }).exec();
  },

  addCustomerOrder(requestBody, response) {
    const {
      orderNumber,
      orderDate,
      orderReturn,
      gasList,
      gasStatus,
      customerId,
      onModel,
      customerHiddenId,
    } = requestBody.data;


    const gasListStrObjects = [];

    for (value of gasList) {
      const item = {
        sku: value.sku,
        psi: value.psi,
        isLocal: false,
      };

      if (value.newChangedSku) item.newChangedSku = value.newChangedSku;
      if (value.newChangedSku) item.isLocal = true;

      // console.log(item);
      gasListStrObjects.push(item);
    }

    // gasList.forEach((value, index) => {

    //   const item = {
    //     sku: value.sku,
    //     psi: value.psi,
    //     isLocal: false,
    //   };

    //   if (value.newChangedSku) item.newChangedSku = value.newChangedSku;
    //   if (value.newChangedSku) item.isLocal = true;

    //   // console.log(item);
    //   gasListStrObjects.push(item);
    // });


    return CustomerOrder.findOne({ orderNumber })
      .then((order) => {
        if (!order) {
          return new CustomerOrder({
            orderNumber,
            orderDate,
            orderReturn,
            gasList,
            customerId: customerHiddenId,
            status: gasStatus,
            onModel,
          }).save();
        }
        response.status(500).send('OrderNumber already Exist');
      })
      .then((res) => {
        return CustomerOrder
          .findOneAndUpdate(
            { _id: res._id },
            {
              $push:
              {
                skuLog: {
                  orderDate,
                  gasList,
                },
                gasListStr: gasListStrObjects,
              },
            },
            { new: true },
          )
          .exec();
      })
      .then((order) => {
        Gas.updateMany({
          _id: { $in: order.gasList },
        },
        {
          holder: customerHiddenId,
          holderType: 'customer',
          onModel: 'customer',
          status: gasStatus,
        },
        {
          new: true,
        })
          .exec()
        // updateGasHolder(order.gasList);
        return order;
      });
  },
};
