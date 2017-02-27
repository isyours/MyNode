var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var swig  = require('swig');
var React = require('react');
var Router = require('react-router');
var ReactDOMServer = require('react-dom/server');
var routes = require('./app/routes');

var mongoose = require('mongoose');
var config = require('./config');
var async = require('async');
var xml2js = require('xml2js');
var request = require('request');

var Blog = require('./models/blog');

process.evn = require('init-env')({
    logToConsole: true,
    jsonPath: 'config.envVars',
    filePath: './config/.env.json',
    overwrite: true
});

mongoose.connect(config.database);
mongoose.connection.on('error', function() {
    console.info('Error: Could not connect to MongoDB. Did you forget to run `mongod`?'.red);
});

var app = express();

app.set('port', process.evn.PORT || 3000);
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/api/blog', function(req, res, next) {
    Blog.find({}).exec(function (err, blogList) {
        console.info('Get Blog list, Error info', err);
        if (err) return next(err);
        console.info('Get Blog list, Result info', blogList);
        return res.send(blogList);
    });
});

app.get('/api/blog/page/:pageNum', function(req, res, next) {
    var pageNum = req.params.pageNum - 0;
    var pageSize = req.query.size - 0;
    pageNum--;
    console.info('Get Blog list, Page is ', pageNum);
    console.info('Get Blog list, Page size is ', pageSize);

    Blog.find({}).skip(pageNum * pageSize).limit(pageSize).exec(function (err, blogList) {
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
                    updateTime: gender.updateTime
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

app.use(function(req, res) {
    Router.run(routes, req.path, function(Handler) {
        var ComponentFactory = React.createFactory(Handler);
        var html = ReactDOMServer.renderToString(ComponentFactory());
        var page = swig.renderFile('views/index.html', { html: html });
        res.send(page);
    });
});

app.listen(app.get('port'), function () {
    console.log('Express server listening on port ' + app.get('port'));
});
