const Drug = (sequelize, Sequelize) => (
  sequelize.define('drug', {
    id: {
      type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true
    },
    drugNickname: {
      type: Sequelize.STRING, allowNull: false
    },
    drugName: {
      type:Sequelize.STRING, allowNull: false
    },
    memo: {
      type: Sequelize.TEXT
    },
    capa: {
      type: Sequelize.INTEGER(11)
    },
    preCapa: {
      type: Sequelize.INTEGER(11)
    },
    capaWeek: {
      type: Sequelize.INTEGER(11)
    },
    capaDay: {
      type: Sequelize.INTEGER(11)
    },
    expiration: {
      type: Sequelize.DATE
    },
    share: {
      type: Sequelize.BOOLEAN, allowNull: false
    }
  })
);

module.exports = Drug;
