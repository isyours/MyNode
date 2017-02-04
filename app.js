var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var swig  = require('swig');
var React = require('react');
var Router = require('react-router');
var routes = require('./app/routes');

var mongoose = require('mongoose');
var config = require('./config');

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
    var pageNum = req.params.pageNum;
    var pageSize = req.params.page_size;

    Blog.find({}).skip(pageNum * pageSize).limit(pageSize).exec(function (err, blogList) {
        console.info('Get Blog list, Error info', err);
        if (err) return next(err);
        console.info('Get Blog list, Result info', blogList);
        return res.send(blogList);
    });
});

app.use(function(req, res) {
    Router.run(routes, req.path, function(Handler) {
        var html = React.renderToString(React.createElement(Handler));
        var page = swig.renderFile('views/index.html', { html: html });
        res.send(page);
    });
});

app.listen(app.get('port'), function () {
    console.log('Express server listening on port ' + app.get('port'));
});
