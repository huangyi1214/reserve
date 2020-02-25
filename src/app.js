'use strict'
// let express = require('express');
// let path = require('path');
// let bodyParser = require('body-parser');
// let ejs_mate = require('ejs-mate');
// //import cors from 'cors';
// let cookieParser = require('cookie-parser');

// let oauth=require('../src/controllers/oauth')

// let config = require('../config');

// let log4js = require('./lib/log');
// let router=require('./router');



// const logger = log4js.logger('app');
// const app = express();


// //跨域
// //app.use(cors());

// app.all('*', function (req, res, next) {

//     res.header("Access-Control-Allow-Origin", "*");
//     res.header("Access-Control-Allow-Headers", "Content-Type,X-token");
//     // res.header("Access-Control-Allow-Headers", "X-token");
//     res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
//     res.header("X-Powered-By", ' 3.2.1')
//     res.header("Content-Type", "application/json;charset=utf-8");
//     //if (req.getMethod().equals("OPTIONS")) {
//     // HttpUtil.setResponse(response, HttpStatus.OK.value(), null);
//     // return;
//     //}

//     next();
// });


// //视图引擎
// app.set('views', path.join(__dirname, 'views'))
// app.set('view engine', 'html');
// app.engine('html', ejs_mate);

// //静态资源 缓存 
// app.use('/public', express.static(path.join(__dirname, 'public')))

// //请求参数转json格式
// app.use(bodyParser.urlencoded({ extended: false }));

// app.use(bodyParser.text({ type: '*/xml' }));




// //路由
//  app.use('/', router)


// //404错，即无匹配请求地址
// app.use(function (req, res, next) {
//     res.json({
//         code: ErrorCode.NotFound,
//         msg: '请求的接口地址有误'
//     });
// });

// //记录错误日志
// app.use(function (err, req, res, next) {
//     var status = err.status || 500;
//     logger.error('【error】', 'status:', status, 'message:', err.message || '');
//     logger.error('【stack】\n ', err.stack || '');
//     next(err);
// });

// //异常处理
// app.use(function (err, req, res, next) {
//     var status = err.status || 500;
//     res.status(status);
//     res.json({
//         code: ErrorCode.SystemError,
//         msg: err.message
//     });
// })

// app.listen(config.port, function () {
//     console.log(`API服务已启动,监听端口:${config.port} ...`)
// })
let express = require('express');
let path = require('path');
let bodyParser = require('body-parser');
let ejs_mate = require('ejs-mate');
let cors =require('cors');
let cookieParser = require('cookie-parser');

let oauth=require('../src/controllers/oauth')

let config = require('../config');

let log4js = require('./lib/log');
let router=require('./router');



const logger = log4js.logger('app');
const app = express();
app.use(cors());

app.all('*', function (req, res, next) {

    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Content-Type,X-token");
    // res.header("Access-Control-Allow-Headers", "X-token");
    res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
    res.header("X-Powered-By", ' 3.2.1')
    res.header("Content-Type", "application/json;charset=utf-8");
    //if (req.getMethod().equals("OPTIONS")) {
    // HttpUtil.setResponse(response, HttpStatus.OK.value(), null);
    // return;
    //}

    next();
});


//视图引擎
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'html');
app.engine('html', ejs_mate);

//静态资源 缓存 
app.use('/public', express.static(path.join(__dirname, 'public')))

//请求参数转json格式
app.use(bodyParser.urlencoded({ extended: false }));

app.use(bodyParser.text({ type: '*/xml' }));

app.use('/', router);

app.listen(config.port, function () {
    console.log("listening on port ", config.port);
});

module.exports = app;







