const db = require('../models/index');
const jwt = require('jsonwebtoken');
const cfg = require('../config/config');
const User = db.User;
const Drug = db.Drug;
const Family = db.Family;
const FamilyUser = db.FamilyUser;


exports.familyListUp = async (req, res) => {
  const userId = jwt.verify(req.token, cfg.jwtSecret).id;

  try {
    const familyUser = await FamilyUser.findAll({ where: { userId } });
    let familyId = familyUser.map(obj => obj.familyId);
    const family = await Family.findAll({ where: {id: familyId} })
    res.status(200);
    res.json(family);
  } catch(err) {
    console.log(err);
    throw new Error(err);
  }
};


exports.familyAdd = async (req, res) => {
  const loginId = jwt.verify(req.token, cfg.jwtSecret).loginId;
  const familyName = req.body.familyName;

  try {
    const user = await User.findOne({ where: { loginId }});
    let userId = user.dataValues.id;
    const family = await Family.create({ familyName, memberId: `${userId}`});
    let familyId = family.dataValues.id;
    const familyUser = await FamilyUser.create({userId, familyId});
    res.status(201);
    res.json(familyUser);
  } catch(err) {
    console.log(err);
    throw new Error(err);
  }
};

// paramsId 필요 


exports.familyDrugGet = async (req, res) => {
  const myFamily = req.params.id;
  const userData = jwt.verify(req.token, cfg.jwtSecret);

  try {
    const family = await Family.findById(myFamily);
    let familyName = family.dataValues.familyName;
    let famMembers = family.dataValues.memberId.split(';').map(x => Number(x));

    const user = await User.findAll({ where: { id: famMembers } });
    let members = user.map(item => item.dataValues);
    
    const myDrugs = Drug.findAll({ where: { userId: userData.id } });

    let others = famMembers.slice();
    others.splice(famMembers.indexOf(userData.id), 1);
    const otherDrugs = await Drug.findAll({ where: { userId: others, share: true }});

    res.status(200);
    res.json({ familyName, members, myDrugs, otherDrugs });

  } catch(err) {
    console.log(err);
    throw new Error(err);
  }
};


exports.familyMemberAdd = async (req, res) => {
  const myFamily = req.params.id;
  const addMember = req.body.memberId;

  try {
    const user = await User.findOne({where: {loginId: addMember}});
    if (!user) {
      res.status(404);
      return res.json('user is not found');
    }
    let member = user.dataValues.id;
    const family = await Family.findById(myFamily);
    const updatedFamily = await family.update({memberId: `${family.memberId};${member}`});
    let familyId = updatedFamily.dataValues.id;

    const familyuser = await FamilyUser.create({userId: member, familyId});
    res.status(201);
    res.send(familyuser);

  } catch(err) {
    console.log(err);
    throw new Error(err);
  }
};

// 특정 가족에서 내가 나가는 경우
exports.familySelfout = async (req, res) => {
  const myFamily = req.params.id;
  const userData = jwt.verify(req.token, cfg.jwtSecret);

  try {
    const family = await Family.findById(myFamily);
    let famliyMembers = family.dataValues.memberId.split(';').map(x => Number(x));
    let index = famliyMembers.indexOf(userData.id);
    famliyMembers.splice(index, 1);
    let memberId = famliyMembers.join(';');
    
    await family.update({ memberId });
    await FamilyUser.destroy({ where: { userId: userData.id, familyId: myFamily }});

    if (famliyMembers.length === 0) {
      await Family.destroy({where: {id: myFamily}})
      console.log('family removed!!')
      res.status(204);
      return res.json(true);
    }  
    res.status(204);
    res.json(true);
    
  } catch(err) {
    console.log(err);
    throw new Error(err);
  }
};

// 가족 폭파
exports.familyDelete = async (req, res) => {
  const myFamily = req.params.id;

  try {
    const family = await Family.findById(myFamily);
    await family.destroy();
    await FamilyUser.destroy({where: { familyId: null }});
    res.json('family is removed!');

  } catch(err) {
    console.log(err);
    throw new Error(err);
  }
};