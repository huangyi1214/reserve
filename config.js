
/* 配置 */

var config = {


    /**
     * 程序运行的端口
     */
    port: 3000,


    /**
     * socket.io端口
     */
    io_port: 9002,
    io_mangerport: 9003,
    io_dailiport: 9004,

    /**
     * 限制用户唯一登录
     */
    only_sign: true,

    //mysql 数据库配置
    mysql_host: 'cdb-b0tbse4t.gz.tencentcdb.com',
    mysql_db: 'demo',
    mysql_userid: 'root',
    mysql_password: 'Hy321976',

    //redis 配置
    redis_host: '127.0.0.1',
    redis_port: 6379,
    redis_password: '',
    redis_session_db: 14,

    /**token 值 redis key前缀 */
    session_token_prefix: "UserID",
    /**用户session redis key前缀 */
    session_user_prefix: "SessionID",

    session_secret: 'fkjc_secret',


    session_pay: 'FKJC_DEPOSITTOKEN',
    session_withdraw: 'FKJCtokenforwithdraw',
    session_RegisterSMSCode: 'RegisterSMSCode',
    session_ForgetSMSCode: 'ForgetSMSCode',
    session_ForgetzjSMSCode: 'ForgetzjSMSCode',
    /**过期时间 */
    session_ttl: 60 * 30, //过期时间



    //日志
    logfile: './logs/',


    qrcode: 'http://www.baidu.com',





    redirect_uri: "http://127.0.0.1:80/checkemail",
    token: "rsq",

}

module.exports = config;