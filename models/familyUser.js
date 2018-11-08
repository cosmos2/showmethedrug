const FamilyUser = (sequelize, Sequelize) => (
  sequelize.define('familyUser', {
    id: {
      type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true
    }
  }, { timestamps: false })
);



module.exports = FamilyUser;
