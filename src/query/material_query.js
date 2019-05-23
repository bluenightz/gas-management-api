const csvtojson = require('csvtojson');
const fs = require('fs');
const _ = require('lodash');
const atob = require('atob');
const Material = require('../model/gas');

/**
 * สำหรับ import file csv เข้าฐานข้อมูล
 *
 * @param {string} filePath - ชื่อพาทที่อยู่ของไฟล์ csv แบบ physical path
 * @param {Object.<string, (string|function)} mapping - ชื่อ mapping กันระหว่าง column
 * ใน csv กับชื่อ field ที่ต้องการให้เพิ่มลงไปในฐานข้อมูล เช่น { 'sku': 'sku' }
 * กรณีที่เป็น Object.<string, function> จะเป็นการนำเอา value ไป modify และ
 * return ออกมานำค่าลงฐานข้อมูลใน field ตามชื่อ Object.key
 * @returns {Array.<Object.<Material>} - รายการทั้งหมดหลังจาก import เข้าไป
 */
const importCsvToDB = async (filePath, mapping) => {
  let result = null;
  if (fs.existsSync(filePath)) {
    const jsonObj = await csvtojson().fromFile(filePath);
    const materials = jsonObj.map((element) => {
      const temp = {};

      _.forIn(mapping, (value, key) => {
        if (typeof value === 'function') {
          temp[key] = value(element[key]);
        } else {
          temp[key] = element[key];
        }
      });
      return temp;
    });
    result = Material.insertMany(materials);
  } else {
    result = new Error('Csv file not found');
  }
  return result;
};


/**
 * สำหรับ update material จาก sku ที่กำหนด
 *
 * @param {{sku: string, quantity: number}} materialInfo - รูปแบบการส่งค่ามาอัพเดทแต่ละครั้ง
 * ในกรณีที่ต้องการจะหัก stock ออก ให้ส่งค่ามาเป็นติดลบ เช่น -1
 * @returns {Promise.resolve(Object.<Material>)}
 */
const updateMat = materialInfo => new Promise((resolve, reject) => {
  Material.findOneAndUpdate({
    sku: materialInfo.sku,
  }, {
    $inc: { quantity: materialInfo.quantity },
  }, {
    new: true,
  }, (err, list) => {
    if (err) {
      reject(err);
    } else {
      resolve(list);
    }
  });
});

/**
 * สำหรับใช้ในการเรียกเอา material ของแต่ละหมวดออกมา
 *
 * @param {string} cat_name - ชื่อของหมวดอิงกับฐานข้อมูล
 * materials.cat_name สามารถใช้คำว่า "all" เพื่อแสดงทั้งหมดได้
 * @returns {{materials: Array.<Object>}}
 */
const getMaterials = (cat_name) => {
  let result;
  if (cat_name === 'all') {
    result = Material.find({})
      .sort({ sku: 1 }).exec();
  } else {
    result = Material.find({ cat_name }).sort({ sku: 1 }).exec();
  }
  return result;
};

/**
 * สำหรับใช้ในการเรียกดูจำนวนในสต็อคที่เหลืออยู่ ตาม skus(base64) ที่ส่งเข้ามา
 *
 * @param {base64} base64 - มาจาก Array.<sku> แล้วนำมา JSON.stringify
 * จากนั้นเข้า btoa เพื่อให้เป็น base64 แล้วค่อยส่งเข้ามา
 * @returns {Array.<Object.<Material[_id,sku,quantity]>>}
 */
const getStockBySkus = (base64) => {
  const skus = JSON.parse(atob(base64));
  return Material.find({ sku: { $in: skus } }, { sku: true, quantity: true, _id: false }).exec();
};

const getMaterialBySku = sku => Material.findOne({ sku }).exec();

module.exports = {
  getMaterialBySku,
  importCsvToDB,
  getMaterials,
  updateMat,
  getStockBySkus,
};
