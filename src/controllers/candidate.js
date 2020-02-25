'use strict';
import captchapng from 'captchapng';
import db from '../models/db';
import fs from 'fs'

import request from 'request';
import util from 'util';
import redis from '../lib/redis';
import config from '../../config';
import utils from '../lib/utils';
import nodemailer from 'nodemailer'

import Base from '../lib/base';
import { APIError, ErrorCode } from '../lib/APIError';
import log4js from '../lib/log';
const t_candidate = db.default.import('../model/t_candidate');


import { resolve } from 'dns';




const logger = log4js.logger('oauth');
logger.level = 'debug';

const redisClient = redis.createClient({ db: 14 });


/**
 * 
 * 
 * 候选人维护
 * @typedef {Object} result
 * @property {ErrorCode} code - 返回码 如 0:代表成功 
 * @property {string} msg - 说明
 * @property {Object} data - 数据 如:{}
 */

class candidate extends Base {

    /**
     * @ignore
     */
    constructor() {
        super();
    }


    
    async candidateadd(req, res) {
        let t = await db.default.transaction();
        try {
            let candidate = {
                userName: req.body.userName,
                userAge: req.body.userAge,
                sex:req.body.sex
            }
            console.log(candidate);
            await db.default.models.t_candidate.create(candidate, {transaction:t});
            t.commit();
            return res.json({ code: 0, message: '候选人新增成功！' });
        } catch (error) {
            t.rollback();
            logger.error('candidateadd' + error);
            return res.json({ code: -1000, message: '服务器异常' });
        }
    }
    
    async candidateupdate(req, res) {
        let t = await db.default.transaction();
        try {
            let candidate = {
                userName: req.body.userName,
                userAge: req.body.userAge,
                sex:req.body.sex
            }
            await db.default.models.t_candidate.update(candidate, { where: { id: req.body.id } ,transaction:t});
            t.commit();
            return res.json({ code: 0, message: '候选人修改成功！' });
        } catch (error) {
            t.rollback();
            logger.error('candidateupdate:' + error);
            return res.json({ code: -1000, message: '服务器异常' });
        }
    }

    async candidatedelete(req, res) {
        let t = await db.default.transaction();
        try {
            await db.default.models.t_candidate.destroy({ where: { id: req.body.id }, transaction: t });
            t.commit();
            return res.json({ code: 0, message: '候选人删除成功！' });
        } catch (error) {
            t.rollback();
            logger.error('candidatedelete:' + error);
            return res.json({ code: -1000, message: '服务器异常' });
        }
    }

    async candidatesearch(req, res) {
        
        try {
            let data = await db.default.models.t_candidate.findAll();
            return res.json({code:0,data:data})
        } catch (error) {
            logger.error('candidatesearch:'+error);
        }
    }

}

export default new candidate();