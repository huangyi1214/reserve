var supertest = require('supertest');
var app = require('../src/app');
var should = require("should");
var request = supertest(app);
var support = require('./support/support')


describe('预约接口测试', function () {
    it('获取可预约日期', function (done) {
        request
            .get('/getallday')
            .expect('Content-Type', /json/)
            .expect(200)
            .end(function (err, res) {
                should.not.exist(err);
                res.text.should.containEql('获取成功');
                done();
            });
        // done();
    });
    it('预约日期不能为空', function (done) {
        request
            .post('/setreserve')
            .send({
                date: '',
                time: '11:00'
            })
            .type('form')
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200)
            .end(function (err, res) {
                should.not.exist(err);
                res.text.should.containEql('预约日期不能为空');
                done();
            });
    });
    it('预约时间不能为空', function (done) {
        request
            .post('/setreserve')
            .send({
                date: support.getday(1),
                time: ''
            })
            .type('form')
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200)
            .end(function (err, res) {
                should.not.exist(err);
                res.text.should.containEql('预约时间段不能为空');
                done();
            });
    });
    it('预约成功', function (done) {
        request
            .post('/setreserve')
            .send({
                date: support.getday(3),
                time: '10:00'
            })
            .type('form')
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200)
            .end(function (err, res) {
                should.not.exist(err);
                res.text.should.containEql('预约成功');
                done();
            });
    });

    it('只可以预约未来2天至7天', function (done) {
        request
            .post('/setreserve')
            .send({
                date: support.getday(-1),
                time: '10:00'
            })
            .type('form')
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200)
            .end(function (err, res) {
                should.not.exist(err);
                res.text.should.containEql('只可以预约未来2天至7天');
                done();
            });
    });

    it('预约时间段错误', function (done) {
        request
            .post('/setreserve')
            .send({
                date: support.getday(2),
                time: '18:00'
            })
            .type('form')
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200)
            .end(function (err, res) {
                should.not.exist(err);
                res.text.should.containEql('预约时间段有误，请重新选择预约时间段');
                done();
            });
    });
});
