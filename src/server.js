const mongoose = require('mongoose');
const express = require('express');
const bodyParser = require('body-parser');

const server = express();
const http = require('http').Server(server);
const { WHITE_LIST } = require('./config');
const Router = require('./router/api_router');
const customerRouter = require('./router/customer_router');
const vendorRouter = require('./router/vendor_router');
const customerOrderRouter = require('./router/customerOrder_router');
const gasRouter = require('./router/gas_router');
const stockRouter = require('./router/stock_router');
const { DB_URL, DB_PORT, IP_LOCALHOST } = require('./config');

mongoose.Promise = global.Promise;

server.use(bodyParser.json());
server.use(bodyParser.urlencoded({
  extended: true,
}));

process.on('unhandledRejection', (reason, p) => {
  console.log('Unhandled Rejection at: Promise', p, 'reason:', reason);
  // application specific logging, throwing an error, or other logic here
});

server.disable('x-powered-by');

server.all('*', (req, res, next) => {
  if (!req.get('Origin')) return next();
  const { origin } = req.headers;
  if (WHITE_LIST.indexOf(origin) > -1) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }

  res.header('Access-Control-Allow-Methods', 'GET, POST');
  res.header('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type, Authorization');
  res.header('Access-Control-Allow-Credentials', true);

  if (req.method === 'OPTIONS') return res.sendStatus(200);

  next();
  return res;
});

server.use('/api/v1', Router);
server.use('/api/v1/customer', customerRouter);
server.use('/api/v1/vendor', vendorRouter);
server.use('/api/v1/customerOrder', customerOrderRouter);
server.use('/api/v1/gas', gasRouter);
server.use('/api/v1/stock', stockRouter);

mongoose.connect(DB_URL);
mongoose.connection
  .once('open', () => {
    console.log('db connect success', DB_URL);
  })
  .on('error', (err) => {
    console.log(err);
  });

module.exports = {
  startServer: () => {
    http.listen(DB_PORT, IP_LOCALHOST, () => {
      console.log('server run...');
    })
      .on('error', (e) => {
        console.log(e);
      });
  },
};
