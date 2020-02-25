/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('t_vote', {
    voteId: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    startTime: {
      type: DataTypes.DECIMAL,
      allowNull: false
    },
    endTime: {
      type: DataTypes.DECIMAL,
      allowNull: false
    }
  }, {
    tableName: 't_vote'
  });
};
