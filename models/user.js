const User = (sequelize, Sequelize) => (
  sequelize.define('user', {
    id: {
      type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true
    },
    loginId: {
      type: Sequelize.STRING(20), allowNull: false, unique: true
    },
    password: {
      type: Sequelize.STRING, allowNull: false
    },
    name: {
      type: Sequelize.STRING(20), allowNull: false
    }
  })
);

module.exports = User;