
let redis =require('redis');
let bluebird =require('bluebird');
let config =require('../../config');
let log4js =require('../lib/log');

const logger=log4js.logger('redis');

bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);

/**
 * 创建redis连接
 */
exports.createClient = function (options) {
    var _options={
        db:config.redis_session_db,
        password:config.redis_password
    }

    Object.assign(_options,options);

    let redis_host = process.env.redis_host || config.redis_host;
    var client = redis.createClient(
        config.redis_port,
        redis_host,
        options);
    //错误
    client.on("error",function(err){
       console.log(err);
       logger.error(err.message +"\n"+err.stack);
    })

    return client;
}

