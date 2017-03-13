/**
 * Created by chenhaolong on 2017/3/13.
 */
import React from 'react';
import AutoComplete from 'material-ui/AutoComplete';

class BlogSearchBar extends React.Component {
    constructor(props) {
        super(props);
        this.handleUpdateInput = this.handleUpdateInput.bind(this);
        this.state = {
            dataSource: []
        };
    }

    handleUpdateInput(value) {
        this.setState({
            dataSource: [
                value,
                value + value,
                value + value + value,
            ],
        });
    }

    render() {
        return (
            <AutoComplete
                hintText="Search"
                dataSource={this.state.dataSource}
                floatingLabelText="Search"
                onUpdateInput={this.handleUpdateInput}
            />
        );
    }
}

export default BlogSearchBar;
