/**
 * Created by chenhaolong on 2017/3/13.
 */
import React from 'react';
import {Link} from 'react-router'
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import BlogTag from './BlogTag';
import {FormattedDate, FormattedRelative} from 'react-intl';


class BlogThumbnail extends React.Component {

    constructor(props) {
        super(props);
        this.blogItem = this.props.blogItem ? this.props.blogItem : {};
        this.state = {
            shadow: 1,
        };
        this.blogItem.blogBackground = this.blogItem.blogBackground ? this.blogItem.blogBackground:
            "http://paullaros.nl/material-blog-1-1/img/travel/unsplash-2.jpg";
        this.onMouseOver = this.onMouseOver.bind(this);
        this.onMouseOut = this.onMouseOut.bind(this);
    }

    onMouseOver() {
        this.setState({shadow: 3});
    }

    onMouseOut() {
        this.setState({shadow: 1});
    }

    render() {
        const updateTipsStyle = {
            color: "gray",
            fontSize: "small",
            fontWeight: 200,
            opacity: 0.6,
            paddingBottom: "3px"
        };

        let updateTimeTips;
        if (this.blogItem.createTime !== this.blogItem.updateTime) {
            updateTimeTips = (
                <div style={updateTipsStyle}>
                    update by <FormattedRelative value={this.blogItem.updateTime}/>
                </div>
            );
        } else {
            updateTimeTips = (<div></div>);
        }

        return (
            <Link key={this.blogItem.blogId} to='blogDetail' params={{blogTitle: this.blogItem.blogTitle}}  style={{textDecoration: 'none', color: 'black'}}>
            <Card
                onMouseOver={this.onMouseOver}
                onMouseOut={this.onMouseOut}
                zDepth={this.state.shadow}
                style={{width: "90%", zIndex: 100, marginBottom: 15}}>
                <CardTitle title={this.blogItem.blogName} style={{height: "30%", position: "inherit"}} />
                <div>
                    <span style={{float: 'right', paddingRight: 10, fontWeight: 'bold'}}>
                        <FormattedDate
                            value={this.blogItem.createTime}
                            year='numeric'
                            month='2-digit'
                            day='2-digit'
                        />
                        { updateTimeTips }
                    </span>
                </div>
                <BlogTag blogTags={this.blogItem.blogTags}/>

                <CardMedia style={{height: "40%", position: "inherit"}} >
                    <img src = {this.blogItem.blogBackground} />
                </CardMedia>
                <CardText style={{height: "30%", position: "inherit"}}>
                    {this.blogItem.blogBrief}
                </CardText>
            </Card>
            </Link>
        );
    }
}


export default BlogThumbnail;
