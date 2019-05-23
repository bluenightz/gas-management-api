const express = require('express');
const { getGas, addGas, getFullGas, doReplaceGas, getGasPsiSize, getNotFullGas, getGasStatus, returnGas } = require('../query/gas_query');
const { crudGet, crudPost } = require('../controller/crudBasic');
const { verifyToken } = require('../token');
const Gas = require('../model/gas');

const router = express.Router();


router.get('/', crudGet(getGas));
router.post('/', crudPost(addGas));
router.post('/return', crudPost(returnGas));
router.get('/getGasStatus', crudGet(getGasStatus));
router.get('/getFullGas', crudGet(getFullGas));
router.get('/getNotFullGas', crudGet(getNotFullGas));
router.get('/getGasPsiSize', crudGet(getGasPsiSize));

router.post('/replace', async (request, response) => {
  let result;
  try {
    result = await verifyToken(request.headers.authorization);
    if (result) {
      doReplaceGas(JSON.parse(request.body.data))
        .then(promises => Promise.all(promises))
        .then(() => Gas.find({}).exec())
        .then(gas => response.status(200).json({ status: 'OK', gas }));
    }
  } catch (err) {
    response.status(500).json(err);
    throw new Error(err);
  }
});

module.exports = router;
