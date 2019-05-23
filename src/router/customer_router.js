const express = require('express');
const { getCustomers, addCustomer } = require('../query/customer_query');
const { crudGet, crudPost } = require('../controller/crudBasic');

const router = express.Router();


router.get('/', crudGet(getCustomers));
router.post('/', crudPost(addCustomer));


module.exports = router;
