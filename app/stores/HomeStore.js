/**
 * Created by chenhaolong on 2017/2/4.
 */
import alt from '../alt';
import HomeActions from '../actions/HomeActions';

class HomeStore {
    constructor() {
        this.bindActions(HomeActions);
        this.blogList = [];
        this.hasMoreBlog = true;
    }

    onGetBlogListSuccess(data) {
        this.blogList = data;
    }

    onGetBlogListFail(jqXhr) {
        // Handle multiple response formats, fallback to HTTP status code number.
        toastr.error(jqXhr.responseJSON && jqXhr.responseJSON.message || jqXhr.responseText || jqXhr.statusText);
    }
}

export default alt.createStore(HomeStore);