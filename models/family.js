const Family = (sequelize, Sequelize) => (
  sequelize.define('family', {
    id: {
      type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true
    },
    familyName: {
      type: Sequelize.STRING, allowNull: false
    },
    memberId: {
      type: Sequelize.STRING
    }
  }, { timestamps: false })
);



module.exports = Family;
