/**
 * Created by Administrator on 2016/12/27.
 */
import React from 'react';
import HomeStore from '../stores/HomeStore'
import HomeActions from '../actions/HomeActions';
import BlogThumbnail from './BlogThumbnail';
import {Link} from 'react-router'
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import InfiniteScroll from 'react-infinite-scroller';
import Navbar from './Navbar';
import BlogSearchBar from './BlogSearchBar';
import InfoLoading from './InfoLoading';
import RealTimeClient from './RealTimeClient';
import {StickyContainer, Sticky} from 'react-sticky';
import {lightBlue500} from 'material-ui/styles/colors';


class Home extends React.Component {

    constructor(props) {
        super(props);
        this.state = HomeStore.getState();
        this.onChange = this.onChange.bind(this);
        this.onTopChangeHandler = this.onTopChangeHandler.bind(this);
        this.token = null;
        this.state.headerBackgroundOpacity = 1;
        this.fromTop = 305;
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
        if (data < this.fromTop) {
            opacity = 1 - data / this.fromTop;
        } else {
            opacity = 0;
        }
        let updateTrigger = Math.floor(opacity * 100);
        if (updateTrigger % 2 === 0) {
            this.setState({
                headerBackgroundOpacity: opacity
            });
        }
    }

    render() {
        let blogListContent;
        if (this.state.blogList && this.state.blogList instanceof Array) {
            blogListContent = this.state.blogList.map((blog) => {
                return (
                    <BlogThumbnail
                        blogItem={blog}
                    />
                )
            });
        } else {
            blogListContent = (<p>无内容展示</p>);
        }

        return (
            <div>
                <StickyContainer>
                    <div>
                        <div style={{ background: lightBlue500, position: 'absolute', width: '100%' }}>
                            <div style={{backgroundImage: 'url("./img/unsplash-1.jpg")',
                                backgroundPosition: 'center 30%', opacity: this.state.headerBackgroundOpacity,
                                position: 'absolute', height: this.fromTop + 5, width: '100%' }}></div>
                            <div style={{paddingTop: this.fromTop - 50}}>
                                <Sticky style={{zIndex: 999}}>
                                    <Navbar/>
                                </Sticky>
                            </div>
                        </div>
                    </div>
                    <div className="container" style={{height: "100%", paddingTop: this.fromTop + 30, overflow: "auto"}} >
                        <div className="col-sm-3 col-sm-offset-1">
                            <div>
                                <RealTimeClient />
                                <BlogSearchBar/>
                            </div>
                        </div>
                        <InfiniteScroll
                            pageStart={0}
                            loadMore={this.loadBlog.bind(this)}
                            hasMore={this.state.hasMoreBlog}
                            loader={
                                <div className="loader">
                                    <InfoLoading type='1'/>
                                    内容加载中...
                                </div>}
                            useWindow={false}
                            className="col-sm-8 blog-main"
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