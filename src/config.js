const CONFIG = {
  DB_NAME: process.env.DB_NAME,
  DB_PORT: process.env.DB_PORT,
  SECRET: process.env.SECRET,
  LOGIN_SESSION_TIME: '1d',
  IP_LOCALHOST: '0.0.0.0',
  WHITE_LIST: ['http://wholeballoons.com', 'http://www.wholeballoons.com', 'http://localhost:8080', 'https://customer.sheepdigit.com/gasManagement-front', 'https://customer.sheepdigit.com'],
  EXPIRE_DURATION: {
    number: 30,
    durationString: 's',
  },
};

module.exports = {
  ...CONFIG,
  DB_URL: `mongodb://${process.env.DB_HOST}/${CONFIG.DB_NAME}`,
  DB_URL_TEST: `mongodb://localhost/${CONFIG.DB_NAME}`,
};
