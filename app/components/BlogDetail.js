import React from 'react';

class BlogDetail extends React.Component {

    render() {
        return (
            <div>
                <h1>Content from blog detail. {this.props.params.blogId}</h1>
            </div>
        );
    }
}

export default BlogDetail;