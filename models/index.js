const Sequelize = require('sequelize');
const DrugModel = require('./drug');
const UserModel = require('./user');
const FamilyModel = require('./family');
const FamilyUserModel = require('./familyUser');
const cfg = require('../config/config').db;

const sequelize = new Sequelize(cfg.dbName, cfg.user, cfg.pw, {
  host: cfg.host,
  dialect: cfg.dialect,
  operatorsAliases: false,

  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
});

const db = {};

const Drug = DrugModel(sequelize, Sequelize);
const User = UserModel(sequelize, Sequelize);
const Family = FamilyModel(sequelize, Sequelize);
const FamilyUser = FamilyUserModel(sequelize, Sequelize);

User.hasMany(Drug);
User.hasMany(FamilyUser);
Family.hasMany(FamilyUser);
// User.belongsToMany(User, {as: 'familyMembers', through: 'family'});
sequelize.sync().then(() => {
  console.log('DB is working!');
});

db.sequelize =sequelize;
db.User = User;
db.Drug = Drug;
db.Family = Family;
db.FamilyUser = FamilyUser;

module.exports = db;
