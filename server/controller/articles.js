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

let createNewComment = function (blogItem) {
    global.git.gist.createComment(encodeURIComponent(blogItem['blogMarkdownContent']) + '',
        function (err, res) {
            if (!res) {
                global.logger.error('Sync Blog fail, error is:', err);
                return;
            }
            blogItem['gitId'] = res['id'];
            blogItem['gitPath'] = res['url'];
            Blog.findOneAndUpdate({'blogId': blogItem.blogId}, {$set: {
                blogTitle: blogItem.blogTitle,
                blogName: blogItem.blogName,
                blogContent: blogItem.blogContent,
                updateTime: new Date(),
                blogTags: blogItem.blogTags,
                blogBrief: blogItem.blogBrief,
                blogBackground: blogItem.blogBackground,
                blogMarkdownContent: blogItem.blogMarkdownContent,
                gitId: blogItem.gitId,
                gitPath: blogItem.gitPath
            }}, {upsert:true}, function(err) {
                if (err) {
                    global.logger.error('Sync blog fail:', err);
                    return;
                }
                global.logger.info('Sync blog success!');
            });
        });
};

let updateComment = function (blogItem) {
    if (!blogItem || !blogItem['gitId']) {
        return;
    }
    global.git.gist.editComment(blogItem['gitId'], encodeURIComponent(blogItem['blogMarkdownContent']) + '',
        function (err, res) {
            if (!res) {
                global.logger.error('Update Blog comment fail, error is:', err);
                return;
            }
            global.logger.info('Update Blog comment success, res is:', res);
        });
};

if (global.git.needSyncGit) {
    let conditions = {
        $and: [{ gitId: { $exists: false } },
              { gitPath: { $exists: false }}]

    };
    global.logger.info("Sync start!!");
    Blog.find(conditions).sort({updateTime: 'desc'})
        .exec(function (err, blogList) {
            if (err) {
                global.logger.info('Get UnSynced Blog list, Error info', err);
                return;
            }
            global.logger.info('Get UnSynced Blog list, Result info', blogList);
            if (blogList) {
                for (let i=0; i<blogList.length; i++) {
                    let item = blogList[i];
                    createNewComment(item);
                }
            }
        });
}

exports.getBlogByTitle = async(function* (req, res, next) {
    let blogTitle = req.params.blogTitle + '';
    Blog.findOne({blogTitle: blogTitle}, function(err,obj) {
        if (err) return next(err);
        res.send({
            blogInfo: obj
        })
    });
});

exports.validateProxyIp = async(function* (req, res, next) {
    let nginxIp = req.headers['X-Forward-For'] + '';
    res.send({
        ip: nginxIp
    });
});

exports.getBlogByPage = async(function*(req, res, next) {
    let pageNum = req.params.pageNum - 0;
    let pageSize = req.query.size - 0;
    pageNum--;
    global.logger.info('Get Blog list, Page is ', pageNum);
    global.logger.info('Get Blog list, Page size is ', pageSize);

    let blogType = req.query.type;
    let conditions = {};
    if (blogType) {
        conditions['blogType'] = blogType;
    }

    Blog.find(conditions).sort({updateTime: 'desc'}).skip(pageNum * pageSize).limit(pageSize)
        .exec(function (err, blogList) {
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
                    blogType: gender.blogType,
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
                    createNewComment(blog);
                });
            } catch (e) {
                global.logger.error('Save blog fail:', e);
                res.status(404).send({ message: 'Save new blog fail' });
            }
        }
    ]);
});

exports.update = async(function* (req, res, next) {
    let gender = JSON.parse(req.body.blogInfo);
    global.logger.info("Update blog ", gender);
    innerAsync.waterfall([
        function(message) {
            global.logger.info('Update blog start, message:', message);
            try {
                let currentDate = new Date();

                Blog.findOneAndUpdate({'blogId': gender.blogId}, {$set: {
                    blogTitle: gender.blogTitle,
                    blogName: gender.blogName,
                    blogContent: gender.blogContent,
                    updateTime: currentDate,
                    blogTags: gender.blogTags,
                    blogBrief: gender.blogBrief,
                    blogType: gender.blogType,
                    blogBackground: gender.blogBackground,
                    blogMarkdownContent: gender.blogMarkdownContent,
                }},  {upsert: true, returnNewDocument: true}, function(err, model) {
                    if (err) {
                        global.logger.error('Update blog fail:', err);
                        return next(err);
                    }
                    updateComment(model._doc);
                    global.logger.info('Update blog success!');
                    res.send({ message: 'update obj success!' + JSON.stringify(gender) });
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
        function(message) {
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
