// const assert = require('assert');
// const bcrypt = require('bcryptjs');
// const { describe, it } = require('mocha');

// const User = require('../src/model/user');
// const { createUser } = require('../src/query/user_query');

// describe('User Query', () => {
//   it('test createuser', (done) => {
//     const name = `name${Math.ceil(Math.random() * 500)}`;
//     // const name = 'aig'
//     const userdata = {
//       name,
//       password: '12345',
//     };

//     bcrypt.hash(userdata.password, 5, (err, hash) => {
//       createUser(userdata, hash)
//         .then((user) => {
//           User.findOne({ name })
//             .then((user2) => {
//               assert(user2.name === user.name, 'check name');
//               done();
//             });
//         })
//         .catch(error => console.log(error));
//     });
//   });
// });
