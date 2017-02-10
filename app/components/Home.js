/**
 * Created by Administrator on 2016/12/27.
 */
import React from 'react';
import HomeStore from '../stores/HomeStore'
import HomeActions from '../actions/HomeActions';
import { Link } from 'react-router'
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
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
        if (this.state.blogList && this.state.blogList instanceof Array) {
            blogListContent = this.state.blogList.map((blog) => {
                return (
                    <Link key={blog.blogId} to='blogDetail' params={{blogId: blog.blogId}}
                          style={{textDecoration: 'none', color: 'black'}}>
                        <Card style={{width: "90%"}}>
                            <CardTitle title={blog.blogName} subtitle={blog.blogTitle} style={{height: "30%"}} />
                            <CardMedia style={{height: "40%"}} >
                                <img src="http://www.material-ui.com/images/nature-600-337.jpg" />
                            </CardMedia>
                            <CardText style={{height: "30%"}}>
                                {blog.blogContent}
                            </CardText>
                        </Card>
                    </Link>
                )
            });
        } else {
            blogListContent = (<p>无内容展示</p>);
        }

        return (
                <InfiniteScroll
                    pageStart={0}
                    loadMore={this.loadBlog.bind(this)}
                    hasMore={this.state.hasMoreBlog}
                    loader={<div className="loader">Loading ...</div>}
                    useWindow={false}
                >
                    {blogListContent}
                </InfiniteScroll>
        );
    }
}

export default Home;