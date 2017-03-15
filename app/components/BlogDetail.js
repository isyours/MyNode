import React from 'react';
import Headroom from 'react-headroom/dist/index';
import BlogActions from '../actions/BlogActions';
import BlogStore from '../stores/BlogStore';
import Navbar from './Navbar';



class BlogDetail extends React.Component {
    constructor(props) {
        super(props);
        if (this.props.params.blogId) {
            BlogActions.getBlogById(this.props.params.blogId);
        } else {
            console.log('blog id not found');
        }
        this.onChange = this.onChange.bind(this);
        this.state = {
            blogInfo: {}
        }
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
                {
                    this.state.blogInfo && this.state.blogInfo.blogId ?
                        <div>
                            <div>
                                <div>{this.state.blogInfo.blogName}</div>
                                <div>{this.state.blogInfo.blogTitle}</div>
                                <div dangerouslySetInnerHTML={{__html: this.state.blogInfo.blogContent}}></div>
                                <div>{this.state.blogInfo.blogBackground}</div>
                            </div>
                            <div>留言区</div>
                        </div>
                        :
                        <div>未找到当前博客内容</div>
                }
            </div>
        );
    }
}

export default BlogDetail;