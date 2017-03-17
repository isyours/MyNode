/**
 * Created by chenhaolong on 2017/3/17.
 */
import alt from '../alt';
import BlogMessageActions from '../actions/BlogMessageActions';

class BlogMessageStore {
    constructor() {
        this.bindActions(BlogMessageActions);
    }

    onGetBlogMessageSuccess(response) {
        this.blogMessageList = response.blogMessageList;
        this.setState({
            blogMessageList: this.blogMessageList,
            needUpdate: false
        });
    }

    onGetBlogMessageFail(errorMessage) {
        this.helpBlock = errorMessage;
    }

    onAddBlogMessageSuccess() {
        this.setState({
            needUpdate: true
        });
    }

    onAddBlogMessageFail(errorMessage) {
        this.helpBlock = errorMessage;
    }
}

export default alt.createStore(BlogMessageStore);
