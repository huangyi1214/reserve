'use strict';
let db = require('../models/db');
let fs = require('fs');

let request = require('request');
let util = require('util');
let redis = require('../lib/redis');
let config = require('../../config');
let utils = require('../lib/utils');
let nodemailer = require('nodemailer');
let Redlock = require('Redlock');

let log4js = require('../lib/log');
const logger = log4js.logger('oauth');
logger.level = 'debug';

const t_user = db.default.import('../model/t_user');
const t_bdc_reserve = db.default.import('../model/t_bdc_reserve')



const redisClient = redis.createClient({ db: 14 });
const redisClient_reserve = redis.createClient({ db: 13 });

var redlock = new Redlock(
    // you should have one client for each independent redis node
    // or cluster
    [redisClient_reserve],
    {
        driftFactor: 0.01, // time in ms

        retryCount: 10,

        retryDelay: 200, // time in ms

        retryJitter: 200 // time in ms
    }
);

redlock.on('clientError', function (err) {
    console.error('redis错误信息:', err);
});


/**
 * 
 * 
 * 接口返回对象
 * @typedef {Object} result
 * @property {ErrorCode} code - 返回码 如 0:代表成功  1000:服务端错误 2000:参数有误 等
 * @property {string} msg - 说明
 * @property {Object} data - 数据 如:{}
 */

/**
 * 用户登录、注册、授权相关接口
 * @class
 * @extends Base 
 * @classdesc 用户登录、注册、授权相关接口
 */
class OAuth {

    /**
     * @ignore
     */
    constructor() {
        //super();
    }


    /**
     * 忘记密码接口
     */
    async forget(req, res, next) {


    }





    /** GET 发送验证短信  */
    async sendMsg(req, res, next) {
        try {
            console.log('body:' + JSON.stringify(req.body));
            if (utils.isNull(req.body.username) || utils.isNull(req.body.password)) {
                return res.json({ code: -1, message: '用户名或密码不能为空' });
            }
            if (!utils.isemail(req.body.email)) {
                return res.json({ code: -1, message: '用户邮箱不能为空且格式正确！' });
            }

            let user1 = await db.default.models.t_user.findOne({ where: { email: req.body.email } });

            if (user1) {
                return res.json({ code: -1, message: '用户已存在，请勿重复注册' });
            }
            let transporter = nodemailer.createTransport({
                host: 'smtp.qq.com',
                service: 'qq',
                port: 465, // SMTP 端口
                secureConnection: true, // 使用了 SSL
                auth: {
                    user: '240342413@qq.com',
                    pass: 'yigkkdjosnnjbgbd',
                }
            });

            let user = {
                username: req.body.username,
                password: utils.md5(req.body.password + 'demo2018'),
                email: req.body.email
            }
            let token = utils.md5(req.body.email + utils.randomString(6));

            let mailOptions = {
                from: '黄毅 <240342413@qq.com>', // sender address
                to: req.body.email, // list of receivers
                subject: 'XXX系统注册', // Subject line
                html: '<b>欢迎注册XXX投票系统，请点击以下链接进行继续注册</b><a href="' + config.redirect_uri + '?token=' + token + '">请点击注册:' + config.redirect_uri + '?token=' + token + '</a>'
            };

            // send mail with defined transport object
            transporter.sendMail(mailOptions, async (error, info) => {
                if (error) {
                    console.log(error);
                    return res.json({ code: -1, message: '邮件发送失败' })
                }
                console.log('Message sent: %s', info.messageId);
                // Message sent: <04ec7731-cc68-1ef6-303c-61b0f796b78f@qq.com>
                redisClient.set(token, JSON.stringify(user), 'EX', 300);
                return res.json({ code: 0, message: '邮件发送成功！' });
            });


        } catch (e) {
            return res.json({ code: -1, message: '服务器异常' + e.message });
        }

    }


    async checkemail(req, res) {
        let user = await redisClient.getAsync(req.query.token);
        if (user) {
            let user_obj = JSON.parse(user)
            let t = await db.default.transaction();
            try {
                await db.default.models.t_user.create(user_obj, { transaction: t });
                t.commit()
                return res.json({ code: 1, message: '注册成功' });
            } catch (e) {
                console.log(e);
                t.rollback();
                return res.json({ code: -1, message: '注册失败' });
            }
        }
        else {
            return res.json({ code: -1, message: '邮箱验证失败' });
        }
    }

    /**
     * 登录接口
     * @param {string} phone 手机号
     * @param {string} password 密码
     */
    async login(req, res, next) {


        console.log('login:' + JSON.stringify(req.body));
        const email = req.body.email;
        const password = req.body.password;
        try {
            // db.default.models.t_bdc_customer.create(req.body);
            if (utils.isNull(email) || utils.isNull(password)) {
                return res.json({ code: -1003, message: '邮箱或密码不能为空' });
            }
            let user = await db.default.models.t_user.find({
                where: {
                    email: email,
                    password: utils.md5(password + 'demo2018'),
                }
            });
            if (!user) {
                return res.json({ code: -1, message: '邮箱或密码错误' });
            }
            let token = utils.md5(user.id + Date.now().toString());

            redisClient.set(token, JSON.stringify(user)); //设置用户缓存
            logger.debug('登录成功！' + JSON.stringify(user));



            res.json({ code: 0, message: '登录成功', token: token });
        } catch (e) {
            console.log(e);
            logger.debug('登录失败！' + JSON.stringify(e.message));
            res.json({ code: -1000, message: '登录失败' });
        }

    }


    /**
     * 后台登录接口
     * @param {string} phone 手机号
     * @param {string} password 密码
     */
    async login_admin(req, res) {


        console.log('login:' + JSON.stringify(req.body));
        const username = req.body.username;
        const password = req.body.password;
        try {
            // db.default.models.t_bdc_customer.create(req.body);
            if (utils.isNull(username) || utils.isNull(password)) {
                return res.json({ code: -1003, message: '用户名或密码不能为空' });
            }
            let user = await db.default.models.t_user.find({
                where: {
                    '$or': [
                        {
                            username: username,
                            password: utils.md5(password + 'demo2018')
                        },
                        {
                            email: username,
                            password: utils.md5(password + 'demo2018'),
                        }
                    ]
                }
            });
            if (!user) {
                return res.json({ code: -1, message: '用户名或密码错误' });
            }
            let token = utils.md5(user.id + Date.now().toString());

            redisClient.set(token, JSON.stringify(user)); //设置用户缓存
            logger.debug('登录成功！' + JSON.stringify(user));



            res.json({ code: 0, message: '登录成功', token: token });
        } catch (e) {
            console.log(e);
            logger.debug('登录失败！' + JSON.stringify(e.message));
            res.json({ code: -1000, message: '登录失败' });
        }

    }

    async getUserInfo(req, res) {
        try {
            let user = await db.default.models.t_user.findOne({ where: { id: req.user.id } });

            if (user.IsAdmin == 1) {
                return res.json({ code: 0, data: { user: user, roles: ['admin'] } });
            }
            else {
                return res.json({ code: 0, data: { user: user, roles: ['candidate'] } })
            }
        } catch (error) {
            logger.error('getuserinfo' + error.debug);
            res.json({ code: -1000, message: '服务器异常' });
        }
    }

    async useroauth(req, res, next) {
        let token;
        if (req.headers.hasOwnProperty('x-token')) {

            token = req.headers['x-token'];
        }
        else {
            token = req.method == "POST" ? req.body.token : req.query.token
        }
        //console.log('token:' + token);
        let user = await redisClient.getAsync(token);



        if (user) {
            req.user = JSON.parse(user);
            next();
        }
        else {
            res.json({ code: -2000, message: '用户登录失败，请重新登录！' });
        }

    }
    async logout(req, res) {
        await redisClient.del(req.body.token);
        return res.json({ code: 0, message: '退出成功!' })
    }

    async getallday(req, res) {
        let day1 = new Date();
        day1.setTime(day1.getTime() + 24 * 60 * 60 * 1000);
        let day2 = new Date();
        day2.setTime(day2.getTime() + 24 * 60 * 60 * 1000 * 6);
        let s3 = day1.getFullYear() + "-" + (day1.getMonth() + 1) + "-" + day1.getDate();
        let s4 = day2.getFullYear() + "-" + (day2.getMonth() + 1) + "-" + day2.getDate();

        let days = utils.getallday(s3, s4);
        return res.json({ code: 0, message: '获取成功！', data: days });
    }

    async getreserve(req, res) {
        let data = await db.default.query("select c.date,c.time, case when d.num is null then 0 else d.num end num from (select b.date,a.time from t_bdc_time a\
            join \
            (SELECT  DATE_FORMAT(DATE_add(NOW(), INTERVAL xc day\
            ), '%Y-%m-%d') as date\
            FROM ( \
                        SELECT @xi:=@xi+1 as xc from \
                        (SELECT 1 UNION SELECT 2 ) xc1, \
                        (SELECT 1 UNION SELECT 2 UNION SELECT 3 ) xc2, \
                        (SELECT @xi:=0) xc0 \
            ) a) b) c left join t_bdc_reserve d on c.date=d.date and c.time=d.time\
            ", {
            replacements: [],
            type: db.default.QueryTypes.SELECT
        }
        );
        return res.json({ code: 0, data: data });
    }
    async setreserve(req, res) {

        if (utils.isNull(req.body.date)) {
            return res.json({ code: 401, message: '预约日期不能为空' });
        }
        if (utils.isNull(req.body.time)) {
            return res.json({ code: 402, message: '预约时间段不能为空' });
        }
        let reservedate = new Date(req.body.date);
        let startdate = new Date(utils.getday(1));
        let enddate = new Date(utils.getday(7));
        if (reservedate.getTime() < startdate.getTime() || reservedate.getTime() > enddate.getTime()) {
            return res.json({ code: 403, message: '只可以预约未来2天至7天' });
        }
        let arr_times = utils.gettimeArray();
        if (!arr_times.includes(req.body.time)) {
            return res.json({ code: 405, message: '预约时间段有误，请重新选择预约时间段' });
        }
        let lock = undefined;
        let t;

        try {
            lock = await redlock.lock(req.body.date + '||' + req.body.time, 1000);
            let reservenum = await redisClient_reserve.getAsync(req.body.date + '&' + req.body.time);
            //盘点当前时间节点在redis中是否有记录
            if (reservenum) {
                t = await db.default.transaction()
                if (parseInt(reservenum) < 6) {
                    let reserve = {
                        date: req.body.date,
                        time: req.body.time,
                        num: parseInt(reservenum) + 1
                    };
                    await db.default.models.t_bdc_reserve.update(reserve, { where: { date: req.body.date, time: req.body.time }, transaction: t });
                    t.commit();
                    redisClient_reserve.set(req.body.date + '&' + req.body.time, parseInt(reservenum) + 1);
                    //lock.unlock();
                    return res.json({ code: 0, message: '预约成功' });
                }
                else {
                    //超过6次预约上限
                    t.rollback();
                    lock.unlock();
                    return res.json({ code: 406, message: '已达到该时间段预约上限，相同时间段内最多预约6次' })
                }


            }
            else {
                t = await db.default.transaction()
                let reserve = {
                    date: req.body.date,
                    time: req.body.time,
                    num: 1
                };
                await db.default.models.t_bdc_reserve.create(reserve, { transaction: t });
                t.commit();
                redisClient_reserve.set(req.body.date + '&' + req.body.time, 1);
                lock.unlock();

                return res.json({ code: 0, message: '预约成功' });

            }
        }
        catch (e) {
            if (t) t.rollback();
            if (lock) lock.unlock();
            return res.json({ code: 408, message: '服务器异常，预约失败:' });

        }

    }
}
let oauth1 = new OAuth();
module.exports = oauth1;
//export default new OAuth();