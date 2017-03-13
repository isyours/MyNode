/**
 * Created by chenhaolong on 2017/3/13.
 */
import React from 'react';
import Paper from 'material-ui/Paper';

class BlogSideBar extends React.Component {
    constructor(props) {
        super(props);
        this.state = this.state = {
            shadow: 1,
        };
        this._type = this.props.type;
        this._title = this.props.title;
        this._content = this.props.content;
    }

}

export default BlogSideBar;
