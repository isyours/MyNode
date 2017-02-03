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

process.evn = require('init-env')({
    logToConsole: true,
    jsonPath: 'config.envVars',
    filePath: './config/.env.json',
    overwrite: true
});

var app = express();

app.set('port', process.evn.PORT || 3000);
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/api/characters', function(req, res, next) {
    let characters = [{'characterId': 11}, {'characterId': 13}];
    return res.send(characters);
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
