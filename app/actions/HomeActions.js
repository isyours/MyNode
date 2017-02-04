import alt from '../alt';
import qwest from 'qwest';

class HomeActions {
    constructor() {
        this.generateActions(
            'getBlogListSuccess',
            'getBlogListFail'
        );
    }

    getBlogList(page) {
        qwest.get( '/api/blog/page/' + page, {
            page_size: 10
        }, {
            cache: false
        }).then(function(xhr, resp) {
            if(resp) {
                this.actions.getBlogListSuccess(data)
            }
        });
        // $.ajax({ url: })
        //     .done((data) => {
        //         this.actions.getBlogListSuccess(data)
        //     })
        //     .fail((jqXhr) => {
        //         this.actions.getBlogListFail(jqXhr)
        //     });
    }
}

export default alt.createActions(HomeActions);
