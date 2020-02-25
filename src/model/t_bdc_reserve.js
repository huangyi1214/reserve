/* jshint indent: 2 */

module.exports = function (sequelize, DataTypes) {
    return sequelize.define('t_bdc_reserve', {
        id: {
            type: DataTypes.INTEGER(10).UNSIGNED,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        date: {
            type: DataTypes.STRING(255),
            allowNull: false,
            primaryKey: true
        },
        time: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        num: {
            type: DataTypes.INTEGER(10),
            allowNull: true
        }
    }, {
        tableName: 't_bdc_reserve'
    });
};
