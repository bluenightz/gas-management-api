const express = require('express');
const importMatertialCsv = require('../controller/upload');
const { importCsvToDB } = require('../query/material_query');

const router = express.Router();


// router.use(bodyParser.json());
// router.use(bodyParser.urlencoded({
//   extended: true,
// }));


router.post('/import', (req, res) => {
  importMatertialCsv(req, res, () => {
    if (!req.file) {
      res.status(500).send('Please choose your csv file');
    } else {
      importCsvToDB(req.file.path, {
        sku: 'sku',
        quantity: quantity => Number(quantity.replace(',', '')),
        material_name: 'material_name',
        cat_name: 'cat_name',
        count_name: 'count_name',
      })
        .then(() => {
          res.status(200).send('Import Material Success');
        })
        .catch((onRejected) => {
          res.status(500).send(onRejected.message);
        });
    }
  });
});


module.exports = router;
