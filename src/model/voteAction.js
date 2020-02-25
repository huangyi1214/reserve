/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('voteAction', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    voteId: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    candidateId: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    userId: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    }
  }, {
    tableName: 'voteAction'
  });
};
