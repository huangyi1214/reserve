/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('t_candidate', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    userName: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    userAge: {
      type: DataTypes.INTEGER(255),
      allowNull: true
    },
    sex: {
      type: DataTypes.BIGINT,
      allowNull: true
    }
  }, {
    tableName: 't_candidate'
  });
};
