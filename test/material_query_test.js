// const assert = require('assert');
// const path = require('path');
// const atob = require('atob');
// const _ = require('lodash');
// const { describe, it } = require('mocha');

// const Material = require('../src/model/material');
// const {
//   importCsvToDB,
//   getMaterials,
//   updateMat,
//   getStockBySkus,
//   getMaterialBySku,
// } = require('../src/query/material_query');

// describe('Material Query', () => {
//   it('can import material correct', (done) => {
//     const file = path.join(__dirname, '../public/upload/csv/material.csv');

//     const init = async () => {
//       const res = await importCsvToDB(file, {
//         sku: 'sku',
//         quantity: quantity => Number(quantity.replace(',', '')),
//         material_name: 'material_name',
//         cat_name: 'cat_name',
//         count_name: 'count_name',
//       });

//       const materials = await Material.find({});
//       assert(res[0].sku === materials[0].sku, 'First material sku test');
//       assert(res[res.length - 1].sku === materials[materials.length - 1].sku, 'Last material sku test');
//       assert(res.length === materials.length, 'Length material test');
//       done();
//     };

//     init();
//   });

//   it('can update quantity of material', (done) => {
//     const mat = {
//       sku: 'AAR125N00T0',
//       quantity: 5,
//     };
//     let prevQty;

//     Material.findOne({ sku: 'AAR125N00T0' })
//       .then((res2) => {
//         prevQty = res2.quantity;
//         return updateMat(mat);
//       })
//       .then(() => Material.findOne({ sku: 'AAR125N00T0' }))
//       .then((updateMaterial) => {
//         assert(updateMaterial.quantity === prevQty + mat.quantity, 'update equality test');
//         done();
//       })
//       .catch(err => console.log(err));
//   });

//   it('can get products correct cat_name', (done) => {
//     const cat_name = 'TAKARA KOSAN';
//     const mat1 = new Material({
//       sku: 'ABA006020A1',
//       quantity: 106,
//       material_name: '22TR HBD Airplane (A)',
//       cat_name: 'ANAGRAM',
//     });
//     const mat2 = new Material({
//       sku: 'ABA006020A2',
//       quantity: 106,
//       material_name: '22TR HBD Airplane (A)',
//       cat_name: 'SEMPERTEX',
//     });
//     const mat3 = new Material({
//       sku: 'ABA006020A3',
//       quantity: 106,
//       material_name: '22TR HBD Airplane (A)',
//       cat_name: 'TAKARA KOSAN',
//     });
//     const mat4 = new Material({
//       sku: 'ABA006020A4',
//       quantity: 106,
//       material_name: '22TR HBD Airplane (A)',
//       cat_name: 'ANAGRAM',
//     });

//     Promise.all([mat1.save(), mat2.save(), mat3.save(), mat4.save()])
//       .then(() => getMaterials(cat_name))
//       .then((res) => {
//         assert(res[0].cat_name === cat_name, 'First material cat_name correct');
//         done();
//       });
//   });

//   it('get Material by sku', (done) => {
//     getMaterialBySku('AFA890870C0')
//       .then((res) => {
//         assert(res.sku === 'AFA890870C0', 'sku is correct');
//         done();
//       });
//   });

//   it('get stock by skus', (done) => {
//     (async () => {
//       const base64 = 'WyJBRkFBMDAwMjNIMCIsIkFGQUEwMDAyMkgwIiwiQUZBQTAwMDIxSDAiLCJBRkFBMDAwMjBIMCIsIkFGQUEwMDAxOUgwIiwiQUZBQTAwMDE4SDAiLCJBRkFBMDAwMTdIMCIsIkFGQUEwMDAxNkgwIiwiQUZBQTAwMDE1SDAiLCJBRkFBMDAwMTRIMCIsIkFGQUEwMDAxM0gwIiwiQUZBQTAwMDEySDAiLCJBRkFBMDAwMTFIMCIsIkFGQUEwMDAxMEgwIiwiQUZBQTAwMDA5SDAiLCJBRkFBMDAwMDhIMCIsIkFGQUEwMDAwN0gwIiwiQUZBQTAwMDA2SDAiLCJBRkFBMDAwMDVIMCIsIkFGQUEwMDAwNEgwIiwiQUZBQTAwMDAzSDAiLCJBRkFBMDAwMDJIMCIsIkFGQUEwMDAwMUgwIl0=';
//       const skus = JSON.parse(atob(base64));
//       try {
//         const mats = await getStockBySkus(base64);
//         if (mats.length > 0) {
//           assert(_.indexOf(skus, mats[0].sku) >= 0, 'find material success');
//           assert(_.isArray(mats), 'result is Array');
//           done();
//         } else {
//           assert.fail('result is Array but not found material');
//         }
//       } catch (e) {
//         assert.fail(e);
//       }
//     })();
//   });
// });
