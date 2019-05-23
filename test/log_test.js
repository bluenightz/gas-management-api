// const assert = require('assert');
// const moment = require('moment');
// const { describe, it } = require('mocha');
// const LogType = require('../src/model/logtype');
// const { createLog, getMyLog } = require('../src/query/log_query');
// const User = require('../src/model/user');

// describe('Log Query', () => {
//   it('create log', (done) => {
//     User.findOne({ name: 'aig' })
//       .then((user) => {
//         const date = new Date();
//         const logObject = {
//           type: 'IMPORT_EXPORT_SIDEMENU',
//           detail: LogType.IMPORT_EXPORT_SIDEMENU,
//           user: user.name,
//           created_time: date.getTime(),
//           expireAt: moment().add(1, 'm').toDate(),
//           work_id: 'abc0001',
//         };
//         return createLog(logObject);
//       })
//       .then((res) => {
//         assert(res.type === 'IMPORT_EXPORT_SIDEMENU', 'IMPORT_EXPORT_SIDEMENU');
//         done();
//       });
//   });

//   it('get logs by user', (done) => {
//     const logSet = [];
//     User.find({})
//       .then((users) => {
//         for (let i = 0; i < 15; i += 1) {
//           const randomIndex = Math.floor(Math.random() * 3);
//           const date = new Date();
//           const p = createLog({
//             type: 'IMPORT_EXPORT_SIDEMENU',
//             detail: LogType.IMPORT_EXPORT_SIDEMENU,
//             user: users[randomIndex].name,
//             created_time: date.getTime(),
//             expireAt: moment().add(i + 1, 'm').toDate(),
//             work_id: 'abc0001',
//           });
//           logSet.push(p);
//         }

//         Promise.all(logSet)
//           .then(() => getMyLog(users[0].name))
//           .then((logs) => {
//             assert(users[0].name === logs[0].user, 'username of log check');
//             done();
//           })
//           .catch(err => console.log(err));
//       })
//       .catch(err => console.log(err));
//   });
// });

// const { describe, it } = require('mocha');
// const assert = require('assert');

// describe('test', () => {
//   it('first test', () => {
//     const val = 1;
//     assert(val === 1);
//   });
// });
