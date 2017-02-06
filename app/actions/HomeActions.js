import alt from '../alt';

class HomeActions {
    constructor() {
        this.generateActions(
            'getBlogListSuccess',
            'getBlogListFail'
        );
    }

    getBlogList(page) {
        // qwest.get( '/api/blog/page/' + page, {
        //     page_size: 10
        // }, {
        //     cache: false
        // }).then(function(xhr, resp) {
        //     if(resp) {
        //         this.actions.getBlogListSuccess(data)
        //     }
        // });
        $.ajax({url: '/api/blog/page/' + page + '?size=10'})
            .done((response) => {
                this.actions.getBlogListSuccess(response)
            })
            .fail((jqXhr) => {
                this.actions.getBlogListFail(jqXhr)
            });
    }
}

export default alt.createActions(HomeActions);
