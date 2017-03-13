/**
 * Created by chenhaolong on 2017/3/13.
 */
import React from 'react';
import {Link} from 'react-router'
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';


class BlogThumbnail extends React.Component {

    constructor(props) {
        super(props);
        this.blogItem = this.props.blogItem ? this.props.blogItem : {};
        this.state = {
            shadow: 1,
        };
        this.blogItem.picLink = this.blogItem.picLink ? this.blogItem.picLink:
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
        return (
            <Link key={this.blogItem.blogId} to='blogDetail' params={{blogId: this.blogItem.blogId}}  style={{textDecoration: 'none', color: 'black'}}>
            <Card
                onMouseOver={this.onMouseOver}
                onMouseOut={this.onMouseOut}
                zDepth={this.state.shadow}
                style={{width: "90%", zIndex: 100, marginBottom: 15}}>
                <CardTitle title={this.blogItem.blogName} subtitle={this.blogItem.blogTitle} style={{height: "30%", position: "inherit"}} />
                <CardMedia style={{height: "40%", position: "inherit"}} >
                    <img src = {this.blogItem.picLink} />
                </CardMedia>
                <CardText style={{height: "30%", position: "inherit"}} dangerouslySetInnerHTML={{__html: this.blogItem.blogContent}}>
                </CardText>
            </Card>
            </Link>
        );
    }
}


export default BlogThumbnail;
