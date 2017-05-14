var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var swig  = require('swig');
var Router = require('react-router');
var routes = require('./app/routes');

var mongoose = require('mongoose');
var config = require('./config');
var async = require('async');
var xml2js = require('xml2js');
var request = require('request');
var fileUpload = require('express-fileupload');

var Blog = require('./models/blog');
var BlogMessage = require('./models/blogMessage');
var VisitorInfo = require('./models/totalVisitorCount');

process.evn = require('init-env')({
    logToConsole: true,
    jsonPath: 'config.envVars',
    filePath: './config/.env.json.json',
    overwrite: true
});

mongoose.connect(config.database);
mongoose.connection.on('error', function() {
    console.info('Error: Could not connect to MongoDB. Did you forget to run `mongod`?'.red);
});

var app = express();
var http = require('http').Server(app);
var websocket = require('socket.io')(http);

app.set('port', process.evn.PORT || 3000);
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'public')));
app.use(fileUpload());

app.get('/api/blog', function(req, res, next) {
    Blog.find({}).exec(function (err, blogList) {
        console.info('Get Blog list, Error info', err);
        if (err) return next(err);
        console.info('Get Blog list, Result info', blogList);
        return res.send(blogList);
    });
});

/**
 * Get blog by blogId
 */
app.get('/api/blog/:blogTitle', function (req, res, next) {
    var blogTitle = req.params.blogTitle + '';
    Blog.findOne({blogTitle: blogTitle}, function(err,obj) {
        if (err) return next(err);
        res.send({
            blogInfo: obj
        })
    });
});

app.get('/api/blog/page/:pageNum', function(req, res, next) {
    var pageNum = req.params.pageNum - 0;
    var pageSize = req.query.size - 0;
    pageNum--;
    console.info('Get Blog list, Page is ', pageNum);
    console.info('Get Blog list, Page size is ', pageSize);

    Blog.find({}).sort({updateTime: 'desc'}).skip(pageNum * pageSize).limit(pageSize).exec(function (err, blogList) {
        console.info('Get Blog list, Error info', err);
        if (err) return next(err);
        console.info('Get Blog list, Result info', blogList);
        Blog.count({}).exec(function (err, number) {
            if (err) return next(err);
            console.info('Get Blog list, Result count is', number);
            let hasMore = true;
            if (number - pageNum * pageSize < pageSize) hasMore = false;
            return res.send({
                docs: blogList,
                total: number,
                hasMore: hasMore
            });
        });
    });
});

/**
 * Save new blog
 */
app.post('/api/blog', function(req, res, next) {
    let gender = JSON.parse(req.body.blogInfo);
    console.log("Save new blog ", gender);

    async.waterfall([
        function(callback) {
            console.log('save new blog waterfall', callback);
            if (callback) {
                callback(null, 'this from upstairs');
            }
        },
        function(message) {
            console.log('message:', message);
            try {
                let currentDate = new Date();
                let blog = new Blog({
                    blogId: currentDate.getTime() + '',
                    blogName: gender.blogName,
                    blogTitle: gender.blogTitle,
                    blogContent: gender.blogContent,
                    createTime: gender.createTime,
                    updateTime: gender.updateTime,
                    blogTags: gender.blogTags,
                    blogBrief: gender.blogBrief,
                    blogBackground: gender.blogBackground,
                    blogMarkdownContent: gender.blogMarkdownContent,
                });

                blog.save(function(err) {
                    if (err) return next(err);
                    res.send({ message: 'create obj success!' + JSON.stringify(blog) });
                });
            } catch (e) {
                res.status(404).send({ message: 'Save new blog fail' });
            }
        }
    ]);
});

/**
 * Save picture to server
 */
app.post('/upload', function(req, res) {
    if (!req.files) {
        return res.status(400).send('No files were uploaded.');
    } else {
        console.log('=========DEBUG==========', req.files.data);
    }

    let uploadFile = req.files.data;
    let src = config.uploadPicPath + uploadFile.name;
    console.log("current upload file name is ", src);
    uploadFile.mv(src, function(err) {
        if (err) {
            return res.status(500).send(err);
        }
        res.send('File uploaded!');
    });
});

/**
 * Get message list by blogId
 */
app.get('/api/blog/:blogId/message', function (req, res) {
    let blogId = req.params.blogId + '';
    BlogMessage.find({blogId: blogId}).sort({createTime: 'desc'}).exec(function (err, blogMsgList) {
        console.info('Get Blog list, Error info', err);
        if (err) return next(err);
        console.info('Get Blog list, Result info', blogMsgList);
        return res.send({
            blogMessageList: blogMsgList,
            blogId: blogId
        });
    });
});

app.get('/api/blog/search/:query', function (req, res) {
    let query = decodeURI(req.params.query) + '';
    console.log('查询关键字', query);
    let regExpression = new RegExp(query, 'i');
    console.log('reg express is', regExpression);
    Blog.find(
        {
            $or : [ //多条件，数组
                {blogName : {$regex : regExpression}},
                {blogContent : {$regex : regExpression}}
            ]
        })
        .sort({createTime: 'desc'}).exec(function (err, blogMsgList) {
            console.info('Get Fuzzy  Blog list, Error info', err);
            if (err) return next(err);
            console.info('Get Blog list, Result info', blogMsgList);
            return res.status(200).send({
                blogMessageList: blogMsgList
            });
    });
});

/**
 * Save new blog message
 */
app.post('/api/blog-message', function(req, res, next) {
    let gender = JSON.parse(req.body.blogInfo);
    console.log("Save new blog ", gender);
    async.waterfall([
        function(callback) {
            console.log('save new blog waterfall', callback);
            if (callback) {
                callback(null, 'this from upstairs');
            }
        },
        function(message) {
            console.log('message:', message);
            try {
                let currentDate = new Date();
                let blogMessage = new BlogMessage({
                    messageId: currentDate.getTime() + '',
                    blogId: gender.blogId,
                    userName: gender.userName,
                    userIp: req.connection.remoteAddress,
                    email: gender.email,
                    messageContent: gender.messageContent,
                    createTime: currentDate.getTime()
                });

                blogMessage.save(function(err) {
                    if (err) return next(err);
                    res.send({ message: 'create obj success!' + JSON.stringify(blogMessage) });
                });
            } catch (e) {
                res.status(404).send({ message: 'Save new blog message fail' });
            }
        }
    ]);
});

app.use(function(req, res) {
    Router.run(routes, '/', function(Handler) {
        // var ComponentFactory = React.createFactory(Handler);
        // var html = ReactDOMServer.renderToString(ComponentFactory());
        // var page = swig.renderFile('views/index.html', { html: html });
        var page = swig.renderFile('views/index.html');
        res.send(page);
    });
});

http.listen(app.get('port'), function () {
    console.log('Express server listening on port ' + app.get('port'));
});

var onlineUserCounter = 0;

websocket.on('connection', function(socket) {
    let address = socket.handshake.headers['x-forward-for'];
    console.log('user connected ', address);
    onlineUserCounter++;
    websocket.sockets.emit('currentVisitorNum', onlineUserCounter);

    VisitorInfo.find({visitorIp: address}).sort({createTime: 'desc'})
        .limit(1)
        .exec(function (err, latestVisitMsg) {
            if (err) {
                console.log('save visit login info fail', err);
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
                    console.log('save visit login record fail', err);
                });
            }
        });

    VisitorInfo.count({action: 'login'}).exec(function (err, number) {
        if (err) {
            console.log('save visit count info fail', err);
        }
        socket.emit('totalVisitorRank', number);
    });

    socket.on('disconnect', function(){
        let address = socket.handshake.headers['x-forward-for'];
        console.log('user disconnected ', address);
        onlineUserCounter--;
        websocket.sockets.emit('currentVisitorNum', onlineUserCounter);
        VisitorInfo.find({visitorIp: address}).sort({createTime: 'desc'})
            .limit(1)
            .exec(function (err, latestVisitMsg) {
                if (err) {
                    console.log('save visit logout info fail', err);
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
                            console.log('save logout fail', err);
                        }
                    });
                }
            });
    });
});
