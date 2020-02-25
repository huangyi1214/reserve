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
const t_voteAction = db.default.import('../model/t_voteAction');


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

class voteAction extends Base {

    /**
     * @ignore
     */
    constructor() {
        super();
    }



    async uservote(req, res) {
        console.log('http body:' + JSON.stringify(req.body));
        let t = await db.default.transaction();
        try {
            let candidates = req.body.candidates.split('@');
            let arr_candidate = await db.default.models.t_voteDetail.findAll({ where: { voteId: req.body.voteId } });


            console.log('arr_candidate:' + JSON.stringify(arr_candidate))
            if (candidates.length < 2 || candidates.length > 5) {
                t.rollback();
                return res.json({ code: -1, message: '选票数应在2人到5人之间' });
            }
            if (candidates.length > arr_candidate.length / 2) {
                t.rollback();
                return res.json({ code: -1, message: '选票数不应该超过总人数的一半' });
            }

            let vote = await db.default.models.t_vote.findOne({ where: { voteId: req.body.voteId } });
            let now = new Date();
            if (now.getTime() > vote.endTime || now.getTime() < vote.startTime) { 
                t.rollback();
                return res.json({ code: -1, message: '请在规定时间段内投票' });
            }
            for (let i = 0; i < candidates.length; i++) {
                let isexists = await db.default.models.t_voteAction.findOne(
                    {
                        where:
                        {
                            voteId: req.body.voteId,
                            candidateId: candidates[i],
                            userId: req.user.id
                        }
                    });
                console.log(isexists);
                if (!isexists) {
                    let voteAction_t = {
                        voteId: req.body.voteId,
                        candidateId: candidates[i],
                        userId: req.user.id
                    }
                    await db.default.models.t_voteAction.create(voteAction_t, { transaction: t });
                }
            }


            t.commit();
            return res.json({ code: 0, message: '投票成功！' });
        } catch (error) {
            t.rollback();
            logger.error('voteadd' + error);
            console.log(error);
            return res.json({ code: -1000, message: '服务器异常', error: error });
        }
    }

    async voteresult(req, res) {
        let data = await db.default.query("SELECT * from t_candidate \
        left join ( \
        SELECT candidateid,count(1) as num from t_voteAction  \
        WHERE t_voteAction.voteId=? group by candidateid) as action \
        on t_candidate.id=action.candidateid WHERE \
        t_candidate.id in (SELECT candidateId from t_voteDetail \
            WHERE voteId=? ) ORDER BY action.num DESC", {
                replacements: [req.body.voteId, req.body.voteId],
                type: db.default.QueryTypes.SELECT
            }
        );
        return res.json({ code: 0, data: data });
    }

}

export default new voteAction();