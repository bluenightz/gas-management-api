const express = require('express');
const { getStockBySkus } = require('../query/material_query');
const { verifyToken } = require('../token');

const router = express.Router();


// router.use(bodyParser.json());
// router.use(bodyParser.urlencoded({
//   extended: true,
// }));


router.get('/getStockBySkus/:skus', (req, res) => {
  verifyToken(req.headers.authorization)
    .then(async () => {
      try {
        const mats = await getStockBySkus(req.params.skus);
        res.status(200).json({ data: mats });
      } catch (e) {
        res.status(500).send(`Something not correct ${e}`);
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send(err);
    });
});

module.exports = router;
