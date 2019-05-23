const schedule = require('node-schedule');
const moment = require('moment');
const { EXPIRE_DURATION } = require('./config');
const { ORDER_STATUS_EXPIRE } = require('./model/ordertype');
const {
  getOrderMoreThan,
  changeOrderStatus,
  isOrderNotSetExpired,
  reStockByOrder,
  deleteOrderTemp,
} = require('./query/order_query');

module.exports = {
  startCronJob() {
    schedule.scheduleJob('*/60 * * * * *', () => {
      console.log(moment().format('D MMMM YYYY-HH:mm:ss'));
      console.log('every 1 minute\n');

      getOrderMoreThan(EXPIRE_DURATION)
        .then((orderTemps) => {
          if (orderTemps.length === 0) return [];
          orderTemps.forEach((orderTemp) => {
            isOrderNotSetExpired(orderTemp)
              .then((res) => {
                changeOrderStatus(orderTemp, ORDER_STATUS_EXPIRE);
                if (res) reStockByOrder(orderTemp).catch(err => console.log(err));
              })
              .then(() => {
                deleteOrderTemp(orderTemp);
              });
          });
          return orderTemps;
        })
        .catch(err => console.log(err));
    });
  },
};
