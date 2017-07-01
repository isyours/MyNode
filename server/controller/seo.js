const { wrap: async } = require('co');
const swig  = require('swig');
const Blog = require('../../models/blog');

const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const dom = new JSDOM(`<!DOCTYPE html><p>Hello world</p>`);
const $ = require('jquery')(dom.window);
const url = global.env.SERVER_URI || "https://www.gkwen.com/";

exports.renderWithArticlesBrafeList = async(function* (req, res, next) {
    Blog.find({}).sort({updateTime: 'desc'}).exec(function (err, blogList) {
        global.logger.info('Render Seo Blog list, Error info', err);
        if (err) return next(err);
        global.logger.info('Render Seo Blog list success');
        let pageName = "Gkwen 玉鲲 内容与摘要";
        let list = [];
        if (blogList) {
            blogList.map(function (item) {
                list.push({
                    link: url + 'blog/' + item.blogTitle,
                    content: item.blogBrief
                });
            });
        }

        return res.send(swig.renderFile('views/index.html', {
            pagename: pageName,
            articles: list
        }));
    });
});

exports.renderWithArticleAnchor = async(function* (req, res, next) {
    let blogTitle = req.params.slug;

    Blog.findOne({blogTitle: blogTitle}, function(err,obj) {
        if (err) return next(err);
        let htmlContent = obj.blogContent;
        let renderList = [];
        let pageName = obj.blogName;

        let container = $("<div></div>");
        container.append($(htmlContent));
        let attrs = container.find("h1, h2, h3, h4, h5, h6");
        if (!attrs || attrs.length === 0) {
            return res.send(swig.renderFile('views/index.html', {
                pagename: pageName,
                articles: renderList
            }))
        }

        attrs.map(function(index, item) {
            let jItem = $(item);
            renderList.push({
                link: url + 'blog/' + blogTitle + "#" + jItem.attr("id"),
                content: jItem.text()
            });
        });

        return res.send(swig.renderFile('views/index.html', {
            pagename: pageName,
            articles: renderList
        }))
    });
});