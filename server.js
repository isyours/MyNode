'use strict';

process.evn = require('dotenv').config();

const fs = require('fs');
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const passport = require('passport');
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');
const winston = require('winston');
const app = express();

const VisitorInfo = require('./models/totalVisitorCount');

module.exports = app;

const logHome = process.env.LOG || '.';

require('winston-daily-rotate-file');

var transport = new winston.transports.DailyRotateFile({
    filename: logHome + '/blog.log',
    datePattern: 'yyyy-MM-dd.',
    prepend: true,
    level: process.env.NODE_ENV === 'development' ? 'debug' : 'info'
});

var errorLog = new winston.transports.DailyRotateFile({
    filename: logHome + '/error.log',
    datePattern: 'yyyy-MM-dd.',
    prepend: true,
    level: 'error'
});

global.logger = new (winston.Logger)({
    transports: [
        transport
    ],
    exceptionHandlers: [
        errorLog
    ],
    exitOnError: false
});

global.env = process.env || [];

require('./server/config/passport')(passport);
require('./server/config/express')(app, passport);
require('./server/config/routes')(app, passport);

const http = require('http').Server(app);
const websocket = require('socket.io')(http);

app.set('port', process.evn.PORT || 3000);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, 'public')));
app.use(fileUpload());

http.listen(app.get('port'), function () {
    global.logger.info('Express server listening on port ' + app.get('port'));
});

let onlineUserCounter = 0;

websocket.on('connection', function(socket) {
    let address = socket.handshake.headers['x-forward-for'];
    global.logger.info('user connected ', address);
    onlineUserCounter++;
    websocket.sockets.emit('currentVisitorNum', onlineUserCounter);

    VisitorInfo.find({visitorIp: address}).sort({createTime: 'desc'})
        .limit(1)
        .exec(function (err, latestVisitMsg) {
            if (err) {
                global.logger.error('save visit login info fail', err);
            }
            let currentTime = new Date();
            if (!latestVisitMsg || !latestVisitMsg[0] || !latestVisitMsg[0].createTime
                || currentTime.getTime() - latestVisitMsg[0].createTime.getTime() > 600000) {
                let visitorInfo = new VisitorInfo({
                    infoId: address + '_' + currentTime.getTime(),
                    visitorIp: address,
                    createTime: currentTime,
                    action: 'login',
                    detailActions: {}
                });
                visitorInfo.save(function(err) {
                    global.logger.error('save visit login record fail', err);
                });
            }
        });

    VisitorInfo.count({action: 'login'}).exec(function (err, number) {
        if (err) {
            global.logger.error('save visit count info fail', err);
        }
        socket.emit('totalVisitorRank', number);
    });

    socket.on('disconnect', function(){
        let address = socket.handshake.headers['x-forward-for'];
        global.logger.info('user disconnected ', address);
        onlineUserCounter--;
        websocket.sockets.emit('currentVisitorNum', onlineUserCounter);
        VisitorInfo.find({visitorIp: address}).sort({createTime: 'desc'})
            .limit(1)
            .exec(function (err, latestVisitMsg) {
                if (err) {
                    global.logger.error('save visit logout info fail', err);
                }
                let currentTime = new Date();
                if (!latestVisitMsg || !latestVisitMsg.createTime
                    || currentTime.getTime() - latestVisitMsg.createTime.getTime() > 60000) {
                    let visitorInfo = new VisitorInfo({
                        infoId: address + '_' + currentTime.getTime(),
                        visitorIp: address,
                        createTime: currentTime,
                        action: 'logout',
                        detailActions: {}
                    });
                    visitorInfo.save(function(err) {
                        if (err) {
                            global.logger.error('save logout fail', err);
                        }
                    });
                }
            });
    });
});
