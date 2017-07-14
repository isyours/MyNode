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
        let pageInfo = generatePageInfo("玉鲲的博客", "玉鲲想与世界分享技术、美食、宗教与感悟。");
        let list = [];
        if (blogList) {
            blogList.map(function (item) {
                let link = url + 'blog/' + item.blogTitle;
                list.push(generateArticle(link, item.blogBrief, item.blogTitle, "", item.updateTime));
            });
        }

        return res.send(swig.renderFile('views/index.html', {
            page: pageInfo,
            articles: list
        }));
    });
});

exports.renderWithArticleAnchor = async(function* (req, res, next) {
    let blogTitle = req.params.slug;

    Blog.findOne({blogTitle: blogTitle}, function(err,obj) {
        if (err) return next(err);
        // let htmlContent = obj.blogContent;
        let renderList = [];
        let pageInfo = generatePageInfo(obj.blogName, obj.blogBrief);;

        // let container = $("<div></div>");
        // container.append($(htmlContent));
        // let attrs = container.find("h1, h2, h3, h4, h5, h6");
        // if (!attrs || attrs.length === 0) {
        //     return res.send(swig.renderFile('views/index.html', {
        //         page: pageInfo,
        //         articles: renderList
        //     }))
        // }
        //
        // attrs.map(function(index, item) {
        //     let jItem = $(item);
        //     renderList.push(generateArtical(l){
        //         link: url + 'blog/' + blogTitle + "#" + jItem.attr("id"),
        //         content: jItem.text()
        //     });
        // });
        let link = url + 'blog/' + obj.blogTitle;
        renderList.push(generateArticle(link, obj.blogBrief, obj.blogTitle, obj.blogContent, obj.updateTime));

        return res.send(swig.renderFile('views/index.html', {
            page: pageInfo,
            articles: renderList
        }))
    });
});

function generatePageInfo(pageName, pageDescription) {
    return {
        name: pageName,
        description: pageDescription
    }
}

function generateArticle(link, brief, title, content, updateTime) {
    return {
        link: link,
        brief: brief,
        title: title,
        content: content,
        updateTime: updateTime
    }
}
