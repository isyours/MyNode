import alt from '../alt';

class HomeActions {
    constructor() {
        this.generateActions(
            'getBlogListSuccess',
            'getBlogListFail'
        );
    }

    getBlogList(page, type) {
        let urlTml = '/api/blog/page/' + page + '?size=10';
        if (type) {
            urlTml += '&type=' + type;
        }

        $.ajax({url: urlTml})
            .done((response) => {
                this.actions.getBlogListSuccess(response)
            })
            .fail((jqXhr) => {
                this.actions.getBlogListFail(jqXhr)
            });
    }
}

export default alt.createActions(HomeActions);
