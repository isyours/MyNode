/**
 * Created by chenhaolong on 2017/3/17.
 */
import React from 'react';

class BlogTag extends React.Component {
    constructor(props) {
        super(props);
        console.log("=============", this.props);
        this.state = {
            blogTags: this.props.blogTags
        }
    }

    render() {
        let tagStyle = {
            padding: 5,
            background: '#396fb0',
            borderRadius: 10,
            color: 'white',
            opacity: 0.5,
            margin: 5
        };

        let blogTagsContent;
        if (this.state.blogTags && this.state.blogTags instanceof Array) {
            blogTagsContent = this.state.blogTags.map((name) => {
                return (
                    <span style={tagStyle}>{name}</span>
                )
            });
        } else {
            blogTagsContent = (<span></span>);
        }

        return (
            <div style={{margin: 8}}>{blogTagsContent}</div>
        );
    }
}

export default BlogTag;
