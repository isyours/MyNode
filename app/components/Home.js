/**
 * Created by Administrator on 2016/12/27.
 */
import React from 'react';
import HomeStore from '../stores/HomeStore'
import HomeActions from '../actions/HomeActions';
import {Link} from 'react-router'
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import InfiniteScroll from 'react-infinite-scroller';
import Navbar from './Navbar';
import { StickyContainer, Sticky } from 'react-sticky';


class Home extends React.Component {

    constructor(props) {
        super(props);
        this.state = HomeStore.getState();
        this.onChange = this.onChange.bind(this);
        this.onTopChangeHandler = this.onTopChangeHandler.bind(this);
        this.token = null;
        this.state.headerBackgroundOpacity = 1;
    }

    componentDidMount() {
        HomeStore.listen(this.onChange);
        this.token = PubSub.subscribe('TOP_CHANGE_EVENT', this.onTopChangeHandler)
    }

    componentWillUnmount() {
        HomeStore.unlisten(this.onChange);
        if (this.token) {
            PubSub.unsubscribe(this.token);
        }
    }

    onChange(state) {
        this.setState(state);
    }

    loadBlog(page) {
        HomeActions.getBlogList(page);
    }

    onTopChangeHandler(topic, data) {
        if (!topic || 'TOP_CHANGE_EVENT' !== topic) {
            return;
        }
        let opacity;
        if (data < 300) {
            opacity = 1 - data / 300;
        } else {
            opacity = 0;
        }
        this.setState({
            headerBackgroundOpacity: opacity
        });
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
                            <CardText style={{height: "30%"}} dangerouslySetInnerHTML={{__html: blog.blogContent}}>
                            </CardText>
                        </Card>
                    </Link>
                )
            });
        } else {
            blogListContent = (<p>无内容展示</p>);
        }

        return (
            <div>
                <StickyContainer>
                    <div>
                        <div style={{ background: 'blue', position: 'absolute', width: '100%' }}>
                            <div style={{backgroundImage: 'url("http://paullaros.nl/material-blog-1-1/img/travel/unsplash-1.jpg")',
                                backgroundPosition: 'center 30%', opacity: this.state.headerBackgroundOpacity,
                                position: 'absolute', height: 300, width: '100%' }}></div>
                            <div style={{paddingTop: 250}}>
                                <Sticky>
                                <Navbar />
                                </Sticky>
                            </div>
                        </div>
                    </div>
                    <div style={{marginLeft: "20%", height: "100%", paddingTop: 330, overflow: "auto"}} >
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
                </StickyContainer>
            </div>
        );
    }
}

export default Home;