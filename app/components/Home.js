/**
 * Created by Administrator on 2016/12/27.
 */
import React from 'react';
import Paper from 'material-ui/Paper';
import HomeStore from '../stores/HomeStore'
import HomeActions from '../actions/HomeActions';
import InfiniteScroll from 'react-infinite-scroller';

class Home extends React.Component {

    constructor(props) {
        super(props);
        this.state = HomeStore.getState();
        this.onChange = this.onChange.bind(this);
    }

    componentDidMount() {
        HomeStore.listen(this.onChange);
    }

    componentWillUnmount() {
        HomeStore.unlisten(this.onChange);
    }

    onChange(state) {
        this.setState(state);
    }

    loadBlog(page) {
        HomeActions.getBlogList(page);
    }

    render() {
        let blogListContent;
        const itemStyle = {
            height: 100,
            width: '80%',
            margin: 20,
            textAlign: 'center'
        };
        if (this.state.blogList && this.state.blogList instanceof Array) {
            blogListContent = this.state.blogList.map((blog) => {
                return (
                    <Paper style={itemStyle} zDepth={2} key={blog.blogId}>
                        {blog.blogName}
                    </Paper>
                )
            });
        } else {
            blogListContent = (<p>无内容展示</p>);
        }

        return (
            <div style={{height: '80%', overflow: 'auto'}}>
                <InfiniteScroll
                    pageStart={0}
                    loadMore={this.loadBlog.bind(this)}
                    hasMore={this.state.hasMoreBlog}
                    loader={<div className="loader">Loading ...</div>}
                    useWindow={false}
                >
                    {blogListContent}
                </InfiniteScroll>
            </div>
        );
    }
}

export default Home;