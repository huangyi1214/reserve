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
const t_vote = db.default.import('../model/t_vote');

const t_voteDetail = db.default.import('../model/t_voteDetail');


import { resolve } from 'dns';




const logger = log4js.logger('vote');
logger.level = 'debug';

const redisClient = redis.createClient({ db: 14 });


/**
 * 
 * 
 * 接口返回对象
 * @typedef {Object} result
 * @property {ErrorCode} code - 返回码 如 0:代表成功 
 * @property {string} msg - 说明
 * @property {Object} data - 数据 如:{}
 */

class vote extends Base {

    /**
     * @ignore
     */
    constructor() {
        super();
    }



    async voteadd(req, res) {
        let t = await db.default.transaction();
        try {
            let vote = {
                title: req.body.title,
                startTime: new Date(req.body.startTime).getTime(),
                endTime: new Date(req.body.endTime).getTime()
            }
            console.log(vote);
            await db.default.models.t_vote.create(vote, { transaction: t });
            t.commit();
            return res.json({ code: 0, message: '新增成功！' });
        } catch (error) {
            t.rollback();
            logger.error('voteadd' + error);
            return res.json({ code: -1000, message: '服务器异常' });
        }
    }

    async voteupdate(req, res) {
        let t = await db.default.transaction();
        try {
            let vote = {
                title: req.body.title,
                startTime: new Date(req.body.startTime).getTime(),
                endTime: new Date(req.body.endTime).getTime()
            }
            await db.default.models.t_vote.update(vote, { where: { voteId: req.body.voteId }, transaction: t });
            t.commit();
            return res.json({ code: 0, message: '修改成功！' });
        } catch (error) {
            t.rollback();
            logger.error('voteupdate:' + error);
            return res.json({ code: -1000, message: '服务器异常' });
        }
    }

    async votedelete(req, res) {
        let t = await db.default.transaction();
        try {
            await db.default.models.t_vote.destroy({ where: { voteId: req.body.voteId }, transaction: t });
            t.commit();
            return res.json({ code: 0, message: '删除成功！' });
        } catch (error) {
            t.rollback();
            logger.error('votedelete:' + error);
            return res.json({ code: -1000, message: '服务器异常' });
        }
    }

    async votesearch(req, res) {

        try {
            let data = await db.default.models.t_vote.findAll();
            return res.json({ code: 0, data: data });
        } catch (error) {
            logger.error('votesearch:' + error);
        }
    }

    async voteDetailAdd(req, res) {
        let t = await db.default.transaction();
        try {
            await db.default.models.t_voteDetail.create({ voteId: req.body.voteId, candidateId: req.body.candidateId });
            t.commit();
            return res.json({ code: 0, message: '新增成功！' });
        } catch (error) {
            t.rollback();
            logger.error('voteDetailAdd:' + error);
            return res.json({ code: -1000, message: '服务器异常' });
        }
    }

    async voteDetaildelete(req, res) {
        let t = await db.default.transaction();
        try {
            await db.default.models.t_voteDetail.destroy({ where: { id: req.body.id } });
            t.commit();
            return res.json({ code: 0, message: '删除成功！' });
        } catch (error) {
            t.rollback();
            logger.error('voteDetaildelete:' + error);
            return res.json({ code: -1000, message: '服务器异常' });
        }
    }

    async votedetailsearch(req, res) {
        let data = await db.default.query("SELECT t_voteDetail.id,t_candidate.id as candidateId,t_candidate.userName\
                                         from t_voteDetail LEFT JOIN t_candidate\
                                          ON t_voteDetail.candidateId=t_candidate.id\
                                           WHERE t_voteDetail.voteId=?", {
                replacements: [req.body.voteId],
                type: db.default.QueryTypes.SELECT
            }
        );
        return res.json({ code: 0, data: data });
    }
}

export default new vote();