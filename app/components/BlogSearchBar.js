/**
 * Created by chenhaolong on 2017/3/13.
 */
import React from 'react';
import AutoComplete from 'material-ui/AutoComplete';
import BlogActions from '../actions/BlogActions';
import BlogStore from '../stores/BlogStore';

class BlogSearchBar extends React.Component {
    constructor(props) {
        super(props);
        this.handleUpdateInput = this.handleUpdateInput.bind(this);
        this.onAutoCompleteClose = this.onAutoCompleteClose.bind(this);
        this.onChange = this.onChange.bind(this);
        this.state = {
            dataSource: [],
            searchText: ''
        };
    }

    handleUpdateInput(value) {
        BlogActions.searchBlogByKeyWords(value);
        this.setState({
            searchText: value,
        });
    }

    componentDidMount() {
        BlogStore.listen(this.onChange);
    }

    componentWillUnmount() {
        BlogStore.unlisten(this.onChange);
    }

    onChange(state) {
        this.setState(state);
    }

    onAutoCompleteClose() {
        if (this.state && this.state.blogList && this.state.blogList.length === 1) {
            window.location.href = '/blog/' + this.state.blogList[0].blogTitle;
        }
    }

    render() {
        return (
            <AutoComplete
                hintText="Search"
                dataSource={this.state.dataSource}
                floatingLabelText="Search"
                onUpdateInput={this.handleUpdateInput}
                dataSourceConfig={{text: 'text', value: 'value'}}
                searchText={this.state.searchText}
                onClose={this.onAutoCompleteClose}
            />
        );
    }
}

export default BlogSearchBar;
