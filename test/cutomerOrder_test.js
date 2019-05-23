const { describe, it } = require('mocha');
const assert = require('assert');
const { addCustomerOrder } = require('../src/query/customerOrder_query');
const { returnGas } = require('../src/query/gas_query');
const CustomerOrder = require('../src/model/customerOrder');
const Gas = require('../src/model/gas');

const orderNumber = `ABC${Math.ceil(Math.random() * 1000)}`;

function createCustomerOrder() {

  it('Customer Order', (done) => {

    const postData = {
      orderNumber,
      customerHiddenId: '5bb33e889f1ffd402c8a89ae',
      customerId: 'BSOE31805041',
      orderDate: 1544516757715,
      orderReturn: 1544585157715,
      gasList: [],
      gasStatus: '5bb32812f56f5f3848aa3032',
      onModel: 'customer',
    };

    let globalGaslist;
    

    Gas.find({ holderType: 'gasLocal' })
      .then((gaslist) => {
        globalGaslist = gaslist;
        postData.gasList.push(gaslist[0]);
        postData.gasList.push(gaslist[1]);
        postData.gasList.push(gaslist[2]);

        addCustomerOrder({ data: postData })
          .then((res) => {
            assert(res.orderNumber === orderNumber, 'orderNumber test');
            assert(res.gasList[0].toString() === gaslist[0]._id.toString(), 'gasList test');
            assert(res.gasList[1].toString() === gaslist[1]._id.toString(), 'gasList test');
            assert(res.gasList[2].toString() === gaslist[2]._id.toString(), 'gasList test');
            return res;
          })
          .then((order) => {
            const data = {};
            data[globalGaslist[0].sku] = true;
            data[globalGaslist[1].sku] = true;
            const req = {
              data,
              orderId: order._id,
            };
            console.log('req', req);
            const res = {

            };
        
            return returnGas(req, res);

          })
          .then(() => done())
          .catch(err => console.log(err));
      });

  });
}

function createLindeOrder() {

  it('Linde Order', (done) => {

    const postData = {
      orderNumber,
      customerHiddenId: '5bb327186e8e6637fcde7add',
      customerId: 'vendor001',
      orderDate: 1544516757715,
      orderReturn: 1544585157715,
      gasList: [],
      gasStatus: '5bd172aa27ab9d6ad7382051',
      onModel: 'gasVendor',
    };

    let globalGaslist;
    

    Gas.find({ holderType: 'gasLocal', psi: 0 })
      .then((gaslist) => {
        globalGaslist = gaslist;

        const item1 = Object.assign({}, gaslist[0]);
        const item2 = Object.assign({}, gaslist[1]);
        item1._doc.newChangedSku = '7Q123';
        item2._doc.newChangedSku = '7Q567';

        // console.log('gaslist[0]', gaslist[0]);
        // console.log('item1', item1._doc);

        postData.gasList.push(item1._doc);
        postData.gasList.push(item2._doc);
        postData.gasList.push(gaslist[2]);


        // console.log('postData', postData);

        addCustomerOrder({ data: postData })
          .then((res) => {
            assert(res.orderNumber === orderNumber, 'orderNumber test');
            assert(res.gasList[0].toString() === gaslist[0]._id.toString(), 'gasList test');
            assert(res.gasList[1].toString() === gaslist[1]._id.toString(), 'gasList test');
            assert(res.gasList[2].toString() === gaslist[2]._id.toString(), 'gasList test');
            return res;
          })
          .then((order) => {
            const data = {};
            data[globalGaslist[0].sku] = true;
            data[globalGaslist[1].sku] = true;

            
            const req = {
              data,
              orderId: order._id,
            };
            const res = {

            };
        
            data[`${globalGaslist[0].sku}___new___`] = '7Q123';
            data[`${globalGaslist[1].sku}___new___`] = '7Q567';

            return returnGas(req, res);

          })
          .then(() => done())
          .catch(err => console.log(err));
      });

  });
}

describe('customerOrder_query Test', () => {

  // it('addCustomerOrder', (done) => {
  //   const postData = {
  //     orderNumber,
  //     customerHiddenId: '5bb33e889f1ffd402c8a89b3',
  //     customerId: 'BSOE31805041',
  //     orderDate: 1539288062148,
  //     orderReturn: 1539288062148,
  //     gasList: [],
  //     gasStatus: '5bb32812f56f5f3848aa3032',
  //   };
    

  //   Gas.find({ holderType: 'gasLocal' })
  //     .then((gaslist) => {

  //       postData.gasList.push(gaslist[0]);
  //       postData.gasList.push(gaslist[1]);
  //       postData.gasList.push(gaslist[2]);

  //       addCustomerOrder({ data: postData })
  //         .then((res) => {
  //           assert(res.orderNumber === orderNumber, 'orderNumber test');
  //           assert(res.gasList[0].toString() === gaslist[0]._id.toString(), 'gasList test');
  //           assert(res.gasList[1].toString() === gaslist[1]._id.toString(), 'gasList test');
  //           assert(res.gasList[2].toString() === gaslist[2]._id.toString(), 'gasList test');
  //           done();
  //         });
  //     });
  // });

  // createCustomerOrder();
  createLindeOrder();

});

