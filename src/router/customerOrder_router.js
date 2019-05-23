const express = require('express');
const { addCustomerOrder, getCustomerOrder, getCustomerOrderDetail } = require('../query/customerOrder_query');
const { crudGet, crudPost } = require('../controller/crudBasic');

const router = express.Router();


router.get('/:id', crudGet(getCustomerOrderDetail));
router.get('/', crudGet(getCustomerOrder));
router.post('/', crudPost(addCustomerOrder));


module.exports = router;
