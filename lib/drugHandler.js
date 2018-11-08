const db = require('../models/index');
const request = require('request');
const jwt = require('jsonwebtoken');
const cfg = require('../config/config');
const User = db.User;
const Drug = db.Drug;


exports.drugCreate = async (req, res) => {
  const loginId = jwt.verify(req.token, cfg.jwtSecret).loginId;
  let {drugName, drugNickname, memo, capa, expiration, share, capaWeek, capaDay, preCapa} = req.body;

  try {
    const user = await User.findOne({ where: { loginId }});
    let userId = user.dataValues.id;

    if (expiration === 'select expiration date') {
      expiration = null;
    }

    const drug = await Drug.create({drugName, drugNickname, memo, capa, expiration, share, userId, capaWeek, capaDay, preCapa});
    res.status(201);
    res.json(drug);
  } catch(err) {
    console.log(err);
    throw new Error(err);
  }
};


// need paramsId

exports.drugGet = async (req, res) => {

  const drugId = req.params.id;

  const options = {
    url: 'https://openapi.naver.com/v1/search/encyc.json',
    headers: {'X-Naver-Client-Id':cfg.navCID, 'X-Naver-Client-Secret': cfg.navCSec},
    method: 'get',
    encoding: "UTF-8",
    qs: {
      query: 'drug',
      display: 3
    }
  };

  try {
    const drug = await Drug.findById(drugId)
    options.qs.query = drug.dataValues.drugName;
    let result = drug.dataValues;
    const user = await User.findById(result.userId);
    let username = user.dataValues.name;
    result.username = username;

    request(options, (err, response, body) => {
      if (err) { return console.log(err); }
      body = JSON.parse(body);
      let detail = body.items;
      if (detail.length === 0) {
        detail.push({
          title: '네이버 지식백과',
          link: 'https://terms.naver.com/'
        });
      }
      res.status(200);
      res.json({ result, detail });
    });

  } catch(err) {
    console.log(err);
    throw new Error(err);
  }
};


exports.drugUpdate = async (req, res) => {
  const drugId = req.params.id;
  let {drugName, drugNickname, memo, capa, expiration, share, capaWeek, capaDay, preCapa} = req.body;

  try {
    const drug = await Drug.findById(drugId);
    await drug.update({drugName, drugNickname, memo, capa, expiration, share, capaWeek, capaDay, preCapa});
    res.status(201);
    res.json(true);

  } catch(err) {
    console.log(err);
    throw new Error(err);
  }
};


exports.drugDelete = async (req, res) => {
  const drugId = req.params.id;

  try {
    await Drug.destroy({ where: { id: drugId }})
    console.log('drug is removed!');
    res.status(204);
    res.json(true);

  } catch(err) {
    console.log(err);
    throw new Error(err);
  }
};



