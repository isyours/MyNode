/*
 * Copyright (C) 2017 Baidu, Inc. All Rights Reserved.
 */

/**
 * Created by chenhaolong on 2017/1/5.
 */
import alt from '../alt';

class BlogActions {
    constructor() {
        this.generateActions(
            'addBlogSuccess',
            'addBlogFail',
            'getBlogSuccess',
            'getBlogFail',
            'searchBlogByKeyWordsSuccess',
            'searchBlogByKeyWordsFail'
        );
    }

    addBlog(blog) {
        let url = '/api/blog';
        if (blog && blog.blogId && blog.blogTitle) {
            url += '/' + blog.blogTitle;
        }
        $.ajax({
            type: 'POST',
            url: url,
            data: {blogInfo: JSON.stringify(blog)}
        })
            .done((data) => {
                this.actions.addBlogSuccess(data.message);
            })
            .fail((jqXhr) => {
                this.actions.addBlogFail(jqXhr.responseJSON.message);
            });
    }

    getBlogByTitle(blogTitle) {
        $.ajax({
            type: 'GET',
            url: '/api/blog/' + blogTitle
        })
            .done((response) => {
                this.actions.getBlogSuccess(response);
            })
            .fail((jqXhr) => {
                this.actions.getBlogFail(jqXhr.responseJSON.message);
            });
    }

    searchBlogByKeyWords(keyWords) {
        if (!keyWords) {
            return;
        }
        if (!String(keyWords).replace(/^\s+|\s+$/gm,'')) {
            return;
        }
        $.ajax({
            type: 'GET',
            url: '/api/blog/search/' + keyWords
        })
            .done((response) => {
                this.actions.searchBlogByKeyWordsSuccess(response);
            })
            .fail((jqXhr) => {
                this.actions.searchBlogByKeyWordsFail(jqXhr.responseJSON.message);
            });
    }
}

export default alt.createActions(BlogActions);
