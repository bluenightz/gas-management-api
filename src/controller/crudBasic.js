const { verifyToken } = require('../token');

module.exports = {

  crudGet(callback) {
    return async (request, response) => {
      let result;
      try {
        result = await verifyToken(request.headers.authorization);
        if (result) {
          const data = await callback(request, response);
          response.status(200).json({ data });
        }
      } catch (err) {
        response.status(500).json(err);
        throw new Error(err);
      }
    };
  },
  crudPost(callback) {
    return async (request, response) => {
      let result;
      try {
        result = await verifyToken(request.headers.authorization);
        if (result) {
          const data = await callback(request.body, response);
          response.status(200).json({ data });
        }
      } catch (err) {
        response.status(500).json(err);
        throw new Error(err);
      }
    };
  },
};
