'use strict';

/**
 * Module dependencies.
 */
// const mongoose = require('mongoose');
const { wrap: async } = require('co');
const innerAsync = require('async');
const config = require('../config/env/development');

const Blog = require('../../models/blog');
const BlogMessage = require('../../models/blogMessage');

exports.getBlogByTitle = async(function* (req, res, next) {
    let blogTitle = req.params.blogTitle + '';
    Blog.findOne({blogTitle: blogTitle}, function(err,obj) {
        if (err) return next(err);
        res.send({
            blogInfo: obj
        })
    });
});

exports.getBlogByPage = async(function*(req, res, next) {
    let pageNum = req.params.pageNum - 0;
    let pageSize = req.query.size - 0;
    pageNum--;
    global.logger.info('Get Blog list, Page is ', pageNum);
    global.logger.info('Get Blog list, Page size is ', pageSize);

    Blog.find({}).sort({updateTime: 'desc'}).skip(pageNum * pageSize).limit(pageSize).exec(function (err, blogList) {
        global.logger.info('Get Blog list, Error info', err);
        if (err) return next(err);
        global.logger.info('Get Blog list, Result info', blogList);
        Blog.count({}).exec(function (err, number) {
            if (err) return next(err);
            global.logger.info('Get Blog list, Result count is', number);
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
exports.create = async(function* (req, res, next) {
    let gender = JSON.parse(req.body.blogInfo);
    global.logger.info("Save new blog ", gender);

    innerAsync.waterfall([
        function(callback) {
            global.logger.info('save new blog waterfall', callback);
            if (callback) {
                callback(null, 'this from upstairs');
            }
        },
        function(message) {
            global.logger.info('Save blog start, message:', message);
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
                global.logger.info('Try to Save blog, blog info:', blog);

                blog.save(function(err) {
                    if (err) {
                        global.logger.error('Save blog fail:', err);
                        return next(err);
                    }
                    global.logger.info('Save blog success!');
                    res.send({ message: 'create obj success!' + JSON.stringify(blog) });
                });
            } catch (e) {
                global.logger.error('Save blog fail:', e);
                res.status(404).send({ message: 'Save new blog fail' });
            }
        }
    ]);
});

exports.search = async(function* (req, res, next) {
    let query = decodeURI(req.params.query) + '';
    global.logger.info('查询关键字', query);
    let regExpression = new RegExp(query, 'i');
    global.logger.info('reg express is', regExpression);
    Blog.find(
        {
            $or : [ //多条件，数组
                {blogName : {$regex : regExpression}},
                {blogContent : {$regex : regExpression}}
            ]
        })
        .sort({createTime: 'desc'}).exec(function (err, blogMsgList) {
        global.logger.info('Get Fuzzy  Blog list, Error info', err);
        if (err) return next(err);
        global.logger.info('Get Blog list, Result info', blogMsgList);
        return res.status(200).send({
            blogMessageList: blogMsgList
        });
    });
});

/**
 * Save picture to server
 */
exports.uploadPic = async(function* (req, res) {
    if (!req.files) {
        global.logger.info('----------No files----------', req);
        return res.status(400).send('No files were uploaded.');
    } else {
        global.logger.info('=========DEBUG==========', req.files.data);
    }

    let uploadFile = req.files.data;
    let src = config.uploadPicPath + uploadFile.name;
    global.logger.info("current upload file name is ", src);
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
exports.comments = async(function* (req, res, next) {
    let blogId = req.params.blogId + '';
    BlogMessage.find({blogId: blogId}).sort({createTime: 'desc'}).exec(function (err, blogMsgList) {
        global.logger.info('Get Blog list, Error info', err);
        if (err) return next(err);
        global.logger.info('Get Blog list, Result info', blogMsgList);
        return res.send({
            blogMessageList: blogMsgList,
            blogId: blogId
        });
    });
});

/**
 * Save new blog message
 */
exports.saveComments = function (req, res, next) {
    let gender = JSON.parse(req.body.blogInfo);
    global.logger.info("Save new blog ", gender);
    innerAsync.waterfall([
        function(callback) {
            global.logger.info('save new blog waterfall', callback);
            if (callback) {
                callback(null, 'this from upstairs');
            }
        },
        function(message) {
            global.logger.info('message:', message);
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
};
