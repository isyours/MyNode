const { wrap: async } = require('co');
const swig  = require('swig');
const Blog = require('../../models/blog');

exports.renderWithArticlesBrafeList = async(function* (req, res, next) {
    Blog.find({}).sort({updateTime: 'desc'}).exec(function (err, blogList) {
        global.logger.info('Render Seo Blog list, Error info', err);
        if (err) return next(err);
        global.logger.info('Render Seo Blog list success');
        let pageName = "Gkwen 玉鲲 内容与摘要";
        let url = global.env.SERVER_URI || "https://www.gkwen.com/";
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