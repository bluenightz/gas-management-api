const User = require('../model/user');

const createUser = (userProps, hash) => (
  new Promise((resolve, reject) => {
    const {
      name,
      // age,
      // password,
      // role
    } = userProps;

    User.findOne({ name })
      .then((user) => {
        if (!user) {
          const newuser = new User({ ...userProps, password: hash });
          resolve(newuser.save());
        } else {
          reject(new Error('User already exist'));
        }
      });
  }));

const getUser = () => User.find({});

module.exports = {
  createUser,
  getUser,
};
