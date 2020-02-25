/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('voteDetail', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    voteId: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    candidateId: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    }
  }, {
    tableName: 'voteDetail'
  });
};
