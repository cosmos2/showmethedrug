const db = require('../models/index');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cfg = require('../config/config');
const User = db.User;


exports.loginForm = async (req, res) => {

  let loginId = req.body.loginId;
  let password = req.body.password;
 
  User.findOne({ where: { loginId }}).then(result => {
    if (!result) {
      console.log('Invalid ID');
      res.status(401);
      return res.json(false);
    }
    let userData = result.dataValues;
    bcrypt.compare(password, result.dataValues.password).then(result => {
      if (!result) {
        console.log('Invalid PW');
        res.status(403);
        return res.json(false);  
      }
      jwt.sign({
        id: userData.id,
        loginId: userData.loginId,
        name: userData.name
      }, cfg.jwtSecret, { expiresIn: '24h' }, (err, token) => {
        res.header('Authorization', `Bearer ${token}`);
        res.status(200);
        res.json(token);
      })
    })
  })
  .catch(err => {console.log(err)});
 };
 

 exports.signupForm = (req, res) => {
 
  let loginId = req.body.loginId;
  let password = req.body.password;
  let name = req.body.name;
  
  User.findOne({ where: { loginId }}).then(result => {
    if(result) {
      console.log('Existed ID');
      res.status(403);
      return res.json(false);
    }
    bcrypt.genSalt(cfg.saltRounds)
      .then(salt => {
        return bcrypt.hash(password, salt)
      })
      .then(result => {
        return User.create({ loginId, password: result, name })
      })
      .then(result => {
          res.status(201);
          res.json(result);
      })
      .catch(err => {console.log(err)});
  })
  .catch(err => {console.log(err)});
 };