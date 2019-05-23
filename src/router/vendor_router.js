const express = require('express');
const { getVendors } = require('../query/vendor_query');
const { crudGet } = require('../controller/crudBasic');

const router = express.Router();


router.get('/', crudGet(getVendors));
// router.post('/', crudPost(addCustomer));


module.exports = router;
