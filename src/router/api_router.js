const express = require('express');
const bcrypt = require('bcryptjs');
const CONFIG = require('../config');

const router = express.Router();

const { createToken, verifyToken } = require('../token.js');
const User = require('../model/user');

const { createUser, getUser } = require('../query/user_query');
const { getMyLog } = require('../query/log_query');

// router.use(bodyParser.json());
// router.use(bodyParser.urlencoded({
//   extended: true,
// }));

router.get('/tokenCheck', async (req, res) => {
  try {
    const userInfo = await verifyToken(req.headers.authorization);
    res.status(200).json({ status: { message: 'success' }, userInfo });
  } catch (err) {
    res.status(500).json({ status: err });
  }
});

router.get('/logs/:user', (req, res) => {
  if (req.params.user === 'me') {
    verifyToken(req.headers.authorization)
      .then(info => User.findOne({ name: info.name }, { name: true }))
      .then(user => getMyLog(user.name))
      .then(logs => res.status(200).json({ data: logs }))
      .catch((err) => {
        res.status(500).send(err);
      });
  }
});

router.get('/status', (req, res) => {
  res.status(200).send('OK');
});

router.post('/register', (req, res) => {
  bcrypt.hash(req.body.password, 5, (err, hash) => {
    createUser(req.body, hash)
      .then((user) => {
        console.log('created user');
        res.status(200).json({
          status: 'Create user success',
          token: createToken({
            name: user.name,
          }, CONFIG.SECRET, { expiresIn: CONFIG.LOGIN_SESSION_TIME }),
        });
      })
      .catch(_err => res.status(500).json({ status: _err.message }));
  });
});

router.post('/login', (req, res) => {
  console.log(req.body);
  const loginInfo = req.body.data;
  User.findOne({ name: loginInfo.name })
    .then((user) => {
      bcrypt.compare(loginInfo.password, user.password, (err, result) => {
        const token = createToken({
          name: user.name,
        }, CONFIG.SECRET, { expiresIn: CONFIG.LOGIN_SESSION_TIME });
        if (result) {
          res.status(200).json({
            token,
            status: 'Login success',
          });
        } else {
          res.status(500).json({
            status: 'Username or password not correct',
          });
        }
      });
    })
    .catch(() => {
      res.status(500).json({
        status: 'Username or password not correct',
      });
    });
});

router.post('/users', (req, res) => {
  console.log(req.body);
  createUser(req.body)
    .then(() => {
      console.log('create user success');
      res.status(200).send('create user success');
    })
    .catch((err) => {
      console.log('create user fail');
      res.status(500).send(err);
    });
});

router.get('/users', (req, res) => {
  getUser()
    .then((users) => {
      console.log('get user success');
      res.status(200).json({ users });
    })
    .catch((err) => {
      console.log('get user fail');
      res.status(500).send(err);
    });
});

module.exports = router;
