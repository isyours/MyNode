/**
 * Created by chenhaolong on 2017/1/5.
 */
import alt from '../alt';
import FooterActions from '../actions/FooterActions';

class FooterStore {
    constructor() {
        this.bindActions(FooterActions);
    }
}

export default alt.createStore(FooterStore);