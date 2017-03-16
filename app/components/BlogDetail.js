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
        let backgroundUrl = this.state.blogInfo.blogBackground ? this.state.blogInfo.blogBackground:
            'http://localhost:3001/blog/1489648251510';
        let styleInfo = {
            backgroundImage: 'url("' + backgroundUrl + '")',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            height: '100%',
            width: '100%',
            position: 'absolute',
            zIndex: 1,
            opacity: 0.5
        };
        let headerStyle = {
            margin: 0,
            padding: 0,
            border: 0,
            outline: 0,
            verticalAlign: 'baseline',
            background: '0 0',
            textAlign: "center"
        };

        return (
            <div>
                <Headroom
                    onPin={() => console.log('pinned')}
                    onUnpin={() => console.log('unpinned')}
                    style={{
                        boxShadow: '1px 1px 1px rgba(0,0,0,0.25)',
                        background: 'rgb(57, 111, 176)',
                        zIndex: 999
                    }}
                >
                    <Navbar />
                </Headroom>
                {
                    this.state.blogInfo && this.state.blogInfo.blogId ?
                        <div>
                            <div style={styleInfo}></div>
                            <article className="container" style={{
                                backgroundColor: 'rgba(240, 241, 221, 0.9)',
                                height: '100%',
                                padding: 15,
                                paddingTop: 30,
                                position: 'relative',
                                zIndex: 999
                            }}>
                                <div style={headerStyle}><h1>{this.state.blogInfo.blogName}</h1></div>
                                <div>{this.state.blogInfo.blogTitle}</div>
                                <div dangerouslySetInnerHTML={{__html: this.state.blogInfo.blogContent}}></div>
                            </article>
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