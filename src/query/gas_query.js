const Gas = require('../model/gas');
const GasPsiSize = require('../model/gasPsiSize');
const GasStatus = require('../model/gasStatus');
const Customer = require('../model/customer');
const GasLocal = require('../model/gasLocal');
const CustomerOrder = require('../model/customerOrder');
const { getLocal } = require('../query/local_query');
const _ = require('lodash');
// const Customer = require('../model/customer');

function extractSku(sku) {
  return sku.toString().replace(/___new___/, '');
}

module.exports = {
  returnGas(requestBody, response) {

    const skus = [];
    const gasListStrUpdate = [];

    const newChangedSkuObj = {};
    const newChangedSkus = [];

    _.forIn(requestBody.data, (value, sku) => {
      if (value === true) {
        skus.push(sku);
      } else {
        const extractedSku = extractSku(sku);
        newChangedSkuObj[extractedSku] = value;
        newChangedSkus.push(extractedSku);
      }
    });


    return Promise.all([CustomerOrder.findOne({ _id: requestBody.orderId }), getLocal('pattanakarn')])
      // .then(([order, local]) => local._id)
      .then(([order, { _id }]) => {

        // _.forIn(requestBody.data, (value, sku) => {
        //   _.forEach(order.gasListStr, (gasListStrElem, index) => {

        //     if (sku === gasListStrElem.sku) {
        //       gasListStrUpdate.push({ _id: gasListStrElem.id, sku: gasListStrElem.sku, psi: gasListStrElem.psi, isLocal: value });
        //     } else {
        //       gasListStrUpdate.push(gasListStrElem);
        //     }
        //   });
        // });

        _.forEach(order.gasListStr, (gasListStrElem, index) => {
          console.log('forEach...', gasListStrElem, newChangedSkuObj);
          if (_.indexOf(skus, gasListStrElem.sku) >= 0) {
            const item = {
              _id: gasListStrElem.id,
              sku: gasListStrElem.sku,
              psi: gasListStrElem.psi,
              isLocal: requestBody.data[gasListStrElem.sku],
            };
            if (newChangedSkuObj[gasListStrElem.sku]) item.newChangedSku = newChangedSkuObj[gasListStrElem.sku];
            gasListStrUpdate.push(item);
          } else {
            gasListStrUpdate.push(gasListStrElem);
          }
        });

        return Promise.all([
          Gas.updateMany({ sku: { $in: skus } }, { holder: _id, holderType: 'gasLocal', onModel: 'gasLocal' })
            .exec(),
          CustomerOrder
            .findOneAndUpdate(
              { _id: requestBody.orderId },
              {
                $set: { gasListStr: [] },
              },
              { new: true },
            )
            .exec(),
          Gas.updateMany({ sku: { $in: newChangedSkus } }, { holder: _id, holderType: 'gasVendor', onModel: 'gasVendor' })
            .exec(),
        ]);
      })
      .then(([gaslist, order]) => {
        return CustomerOrder
          .findOneAndUpdate(
            { _id: requestBody.orderId },
            {
              $push: {
                gasListStr: {
                  $each: gasListStrUpdate,
                },
              },
            },
            {
              new: true,
            },
          )
          .exec();
      })
      .then((order) => {
        // console.log(order);
      })
      .catch(err => console.log(err));

  },

  getGas() {
    return Gas.find({})
      .populate('holder')
      .exec();
  },

  addGas(requestBody, response) {
    const { sku, psi } = requestBody.data;
    console.log(requestBody, sku);

    return Gas.findOne({ sku })
      .exec()
      .then((gas) => {
        if (gas) {
          response.status(500).json({ message: 'รหัสถังแก๊สซ้ำกับที่มีอยู่' });
          throw new Error('');
        }
        return getLocal('pattanakarn');
      })
      .then((local) => {
        return new Gas({
          sku,
          psi,
          holderType: 'gasLocal',
          onModel: 'gasLocal',
          holder: local._id,
        }).save();
      });
  },

  getFullGas() {
    return Gas.find({
      holderType: 'gasLocal',
      psi: { '$gt': 0 },
    })
      .populate('holder')
      .exec();
  },

  getNotFullGas() {
    return Gas.find({
      holderType: 'gasLocal',
    })
      .exec()
      .then(gas => gas.filter(ele => ele.psi < ele.psiMax));
  },

  getGasPsiSize() {
    // if (size) return GasPsiSize.findOne({ name: size }).exec();
    return GasPsiSize.find({})
      .exec();
  },

  getGasStatus() {
    return GasStatus.find({}).exec();
  },


  updateGasHolder(gasList) {
    
  },

  doReplaceGas(data) {
    const customerCode = data.customerName.split(' ')[0];

    return Promise.all([Customer.findOne({ customerCode }), GasLocal.findOne({ name: 'pattanakarn' })])
      .then(([customer, local]) => {
        const replaceGas = Gas.findOneAndUpdate({ sku: data.replaceGasCode }, { $set: { psi: 0, holder: local._id, holderType: 'gasLocal', onModel: 'gasLocal' } }, { new: true })
          .exec();
        const newGas = Gas.findOneAndUpdate({ sku: data.newGasCode }, { $set: { holder: customer._id, holderType: 'customer', onModel: 'customer' } }, { new: true })
          .exec();

        return [
          replaceGas, newGas,
        ];
      });
    // Promise.all([replaceGas, newGas, customer])
    //   .then(([_replaceGas, _newGas, _customer]) => {
    //     console.log(_replaceGas);
    //     console.log(_newGas);
    //     console.log(_customer);
    //   });
  },
};
