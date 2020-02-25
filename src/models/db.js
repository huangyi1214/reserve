
let Sequelize =require('sequelize');
let config =require('../../config');

let mysql_host = config.mysql_host;
let mysql_db=config.mysql_db
let user_name =  'root';
let mysql_password = 'Hy321976';

const defaults = new Sequelize(mysql_db, user_name, mysql_password,{
    host: mysql_host,
    dialect: 'mysql',
    port:10057,
    pool:{
        max:5,
        min:0,
        idle:30000
    },
    define: {
        timestamps: false,
    }
});

const history=new Sequelize(config.mysql_history_db,config.mysql_history_userid,config.mysql_history_password,{
    host:config.mysql_history_host,
    dialect:'mysql',
    pool:{
        max:5,
        min:0,
        idle:30000
    }
});
module.exports.default = defaults;
