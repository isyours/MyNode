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
            'addBlogFail'
        );
    }

    addBlog(blog) {
        $.ajax({
            type: 'POST',
            url: '/api/blog',
            data: {blogInfo: blog}
        })
            .done((data) => {
                this.actions.addBlogSuccess(data.message);
            })
            .fail((jqXhr) => {
                this.actions.addBlogFail(jqXhr.responseJSON.message);
            });
    }
}

export default alt.createActions(BlogActions);
