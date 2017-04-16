/**
 * Created by chenhaolong on 2017/2/10.
 */
import alt from '../alt';
import BlogActions from '../actions/BlogActions';

class BlogStore {
    constructor() {
        this.bindActions(BlogActions);
    }

    onAddBlogSuccess(successMessage) {
        this.nameValidationState = 'has-success';
        this.helpBlock = successMessage;
    }

    onAddBlogFail(errorMessage) {
        this.nameValidationState = 'has-error';
        this.helpBlock = errorMessage;
    }

    onGetBlogSuccess(response) {
        this.blogInfo = response.blogInfo;
        this.setState({
            blogInfo: this.blogInfo
        });
    }

    onGetBlogFail(errorMessage) {
        this.helpBlock = errorMessage;
    }

    onSearchBlogByKeyWordsSuccess(response) {
        if (!(response.blogMessageList instanceof Array)) {
            console.log('response is', response);
            return;
        }
        let responseDataSource = response.blogMessageList.map(function (item) {
            return {text: item.blogName, value: item.blogTitle};
        });
        this.setState({
            dataSource: responseDataSource,
            blogList: response.blogMessageList
        });
    }

    onSearchBlogByKeyWordsFail(errorMessage) {
        this.helpBlock = errorMessage;
    }
}

export default alt.createStore(BlogStore);