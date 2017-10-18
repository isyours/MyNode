'use strict';

/*
 * Module dependencies.
 */

const users = require('../controller/users');
const articles = require('../controller/articles');
const auth = require('../middlewares/authorization');
const seo = require('../controller/seo');
const swig  = require('swig');

/**
 * Route middlewares
 */

const articleAuth = [auth.requiresLogin, auth.article.hasAuthorization];
const commentAuth = [auth.requiresLogin, auth.comment.hasAuthorization];

const fail = {
    failureRedirect: '/login'
};

/**
 * Expose routes
 */

module.exports = function (app, passport) {
    const pauth = passport.authenticate.bind(passport);

    app.get('/', seo.renderWithArticlesBrafeList);
    app.get('/tech', seo.renderWithArticlesBrafeList);
    app.get('/food', seo.renderWithArticlesBrafeList);
    app.get('/religion', seo.renderWithArticlesBrafeList);
    app.get('/life', seo.renderWithArticlesBrafeList);

    app.get('/validate/ip', articles.validateProxyIp);

    // user routes
    app.get('/login', users.login);
    // app.get('/signup', users.signup);
    // app.get('/logout', users.logout);
    // app.post('/users', users.create);
    app.post('/users/session',
        pauth('local', {
            failureRedirect: '/login',
            failureFlash: 'Invalid email or password.'
        }), users.session);
    app.get('/users/:userId', users.show);
    app.param('userId', users.load);

    // article routes
    // app.param('id', articles.load);
    app.get('/api/blog/:blogTitle', articles.getBlogByTitle);
    app.get('/api/blog/page/:pageNum', articles.getBlogByPage);
    app.post('/api/blog', articleAuth, articles.create);
    app.post('/api/blog/:blogTitle', articleAuth, articles.update);
    app.post('/upload', articleAuth, articles.uploadPic);
    app.get('/edit/blog/:blogTitle*?', articleAuth, function (req, res) {
        res.send(swig.renderFile('views/index.html', {
            pagename: "",
            articles: []
        }));
    });
    app.get('/api/blog/:blogId/message', articles.comments);
    app.get('/api/blog/search/:query', articles.search);
    app.post('/api/blog-message', articles.saveComments);
    app.get('/blog/:slug', seo.renderWithArticleAnchor);

    /**
     * Error handling
     */
    app.use(function (err, req, res, next) {
        // treat as 404
        if (err.message
            && (~err.message.indexOf('not found')
            || (~err.message.indexOf('Cast to ObjectId failed')))) {
            global.logger.error("request error", err, req);
            return next();
        }

        global.logger.error(err.stack);

        if (err.stack.includes('ValidationError')) {
            res.status(422).render('422', { error: err.stack });
            return;
        }

        // error page
        // res.status(500).render('500', { error: err.stack });
    });

    // assume 404 since no middleware responded
    app.use(function (req, res) {
        const payload = {
            url: req.originalUrl,
            error: 'Not found'
        };
        if (req.accepts('json')) return res.status(404).json(payload);
        // res.status(404).render('404', payload);
    });
};