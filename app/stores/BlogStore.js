/**
 * Created by chenhaolong on 2017/2/10.
 */
import alt from '../alt';
import BlogActions from '../actions/BlogActions';

class BlogStore {
    constructor() {
        this.bindActions(BlogActions);
    }
}

export default alt.createStore(BlogStore);