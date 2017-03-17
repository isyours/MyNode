/**
 * Created by chenhaolong on 2017/3/17.
 */
import alt from '../alt';

class BlogMessageActions {
    constructor() {
        this.generateActions(
            'getBlogMessageSuccess',
            'getBlogMessageFail',
            'addBlogMessageSuccess',
            'addBlogMessageFail'
        );
    }

    getBlogMessageByBlogId(blogId) {
        $.ajax({
            type: 'GET',
            url: '/api/blog/' + blogId + '/message'
        })
            .done((response) => {
                this.actions.getBlogMessageSuccess(response);
            })
            .fail((jqXhr) => {
                this.actions.getBlogMessageFail(jqXhr.responseJSON.message);
            });
    }

    saveBlogMessage(blogMessage) {
        $.ajax({
            type: 'POST',
            url: '/api/blog-message',
            data: {blogInfo: JSON.stringify(blogMessage)}
        })
            .done((data) => {
                console.log("save msg suc", data);
                this.actions.addBlogMessageSuccess();
            })
            .fail((jqXhr) => {
                this.actions.addBlogMessageFail(jqXhr.responseJSON.message);
            });
    }
}

export default alt.createActions(BlogMessageActions);
