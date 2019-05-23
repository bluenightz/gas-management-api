const mongoose = require('mongoose');
const _ = require('lodash');
const { before, beforeEach } = require('mocha');
const { gasData } = require('./gasData');
const Gas = require('../src/model/gas');
const GasPsiSize = require('../src/model/gasPsiSize');
const Customer = require('../src/model/customer');
const { getCustomers } = require('../src/query/customer_query');
const { getVendor } = require('../src/query/vendor_query');
const { getLocal } = require('../src/query/local_query');
const { getGasPsiSize } = require('../src/query/gas_query');
const CustomerOrder = require('../src/model/customerOrder');
const moment = require('moment');

const DB_URL_TEST = 'mongodb://localhost/gas_management_dbname';

mongoose.Promise = global.Promise;

before((done) => {
  console.log(`${DB_URL_TEST}: connectd`);
  mongoose.connect(DB_URL_TEST);
  mongoose.connection
    .once('open', () => {
      const {
        gas, customerorders,
      } = mongoose.connection.collections;
      // logs.ensureIndex({ expireAt: 1 }, { expireAfterSeconds: 0 });
      
      Promise.all([getVendor('linde'), getCustomers(), getLocal('pattanakarn'), getGasPsiSize('7Q')])
        .then((result) => {
          const [vendor, customers, local, gasPsiSize] = result;
          return { vendor, customers, local, gasPsiSize };
        })
        .then(({ vendor, customers, local, gasPsiSize }) => {
          
          const gasPromises = [];
          console.log(gasPromises);
          gas.drop()
            .then(() => {
              gasData.forEach((ele, index) => {

                // const type = Math.ceil(Math.random() * 3);
                const type = 3;
                let holder;
                let holderType;

                switch (type) {
                  case 1:
                    holder = _.sample(customers)._id;
                    holderType = 'customer';
                    break;
                  case 2:
                    holder = vendor._id;
                    holderType = 'gasVendor';
                    break;
                  case 3:
                    holder = local._id;
                    holderType = 'gasLocal';
                    break;
                  default:
                    holder = _.sample(customers)._id;
                    holderType = 'customer';
                    break;
                }

                const gasTemp = new Gas({
                  holder,
                  holderType,
                  sku: ele,
                  psi: (index < 5) ? 0 : 2000,
                  psiMax: gasPsiSize._id,
                  onModel: holderType,
                });
                gasPromises.push(gasTemp.save());
              });


              Promise.all([...gasPromises])
                .then(() => customerorders.drop())
                .then(() => {
                  done();
                })
                .catch(err => console.log('Error', err));

            });
        });
    })
    .on('error', (err) => {
      console.log('err', err);
      // done()
    });
});

beforeEach(() => {
  // const {
  //   users,
  //   orders,
  //   orderTemps,
  //   logs,
  //   materials
  // } = mongoose.connection.collections

});
