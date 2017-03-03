import React from 'react';
import Headroom from 'react-headroom/dist/index';
import Navbar from './Navbar';


class BlogDetail extends React.Component {

    render() {
        return (
            <div>
                <Headroom
                    onPin={() => console.log('pinned')}
                    onUnpin={() => console.log('unpinned')}
                    style={{
                        boxShadow: '1px 1px 1px rgba(0,0,0,0.25)',
                        background: 'rgb(57, 111, 176)'
                    }}
                >
                    <Navbar />
                </Headroom>
                <h1>Content from blog detail. {this.props.params.blogId}</h1>
            </div>
        );
    }
}

export default BlogDetail;