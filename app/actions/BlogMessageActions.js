/**
 * Created by chenhaolong on 2017/3/17.
 */
import alt from '../alt';

class BlogMessageActions {
    constructor() {
        this.ajaxStatusIsBusy = false;
        this.generateActions(
            'getBlogMessageSuccess',
            'getBlogMessageFail',
            'addBlogMessageSuccess',
            'addBlogMessageFail'
        );
    }

    getBlogMessageByBlogId(blogId) {
        if (this.ajaxStatusIsBusy) {
            return;
        }
        this.ajaxStatusIsBusy = true;
        $.ajax({
            type: 'GET',
            global: true,
            url: '/api/blog/' + blogId + '/message'
        })
            .done((response) => {
                this.actions.getBlogMessageSuccess(response);
            })
            .fail((jqXhr) => {
                this.actions.getBlogMessageFail(jqXhr.responseJSON.message);
            })
            .always(function() {
                this.ajaxStatusIsBusy = false;
            }.bind(this));
    }

    saveBlogMessage(blogMessage, startFn, finishedFn) {
        if (this.ajaxStatusIsBusy) {
            return;
        }
        this.ajaxStatusIsBusy = true;
        if (startFn) {
            startFn.call();
        }
        $.ajax({
            type: 'POST',
            url: '/api/blog-message',
            global: true,
            data: {blogInfo: JSON.stringify(blogMessage)}
        })
            .done((data) => {
                console.log("save msg suc", data);
                this.actions.addBlogMessageSuccess();
            })
            .fail((jqXhr) => {
                this.actions.addBlogMessageFail(jqXhr.responseJSON.message);
            })
            .always((jqXhr) => {
                this.ajaxStatusIsBusy = false;
                if (finishedFn) {
                    finishedFn.call();
                }
            });
    }
}

export default alt.createActions(BlogMessageActions);
