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
}

export default alt.createStore(BlogStore);