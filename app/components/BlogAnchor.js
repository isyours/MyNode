import React from 'react';
import FontIcon from 'material-ui/FontIcon';


class BlogAnchor extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            blogInfo: this.props.blogInfo
        };
        this.getAnchorLinkItem = this.getAnchorLinkItem.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.blogInfo !== this.state.blogInfo) {
            this.setState({ blogInfo: nextProps.blogInfo });
        }
    }

    getAnchorLinkItem(baseUrl, item) {
        let classNameStr = 'anchor anchor_' + item['tagName'];
        let hrefLink = baseUrl + "#" + item['linkId'];
        return (
            <li className={classNameStr}><a href={hrefLink}>{item['textContent']}</a></li>
        );
    }

    renderAnchorLink(htmlContent) {
        let styleObj={
            padding: "1em"
        };
        let linkList = [];
        if (!htmlContent) {
            return (
                <div style={styleObj}>
                    注意看文章，不要看这里
                </div>
            );
        }
        let container = $("<div></div>");
        container.append($(htmlContent));
        let attrs = container.find("h1, h2, h3, h4, h5, h6");
        if (!attrs || attrs.length === 0) {
            return (
                <div style={styleObj}>
                    注意看文章，不要看这里
                </div>
            );
        }
        attrs.map(function(idx, item) {
            let jItem = $(item);
            let id = jItem.attr("id");
            let tagName = jItem.prop("tagName");
            let textContent = jItem.text();
            if (id && tagName && textContent) {
                linkList.push({
                    linkId: id,
                    tagName: tagName.toLocaleLowerCase(),
                    textContent: textContent
                });
            }
        });

        let resultArr = [];
        let baseUrl = location.origin + location.pathname;

        linkList.map((item) => {
            resultArr.push(this.getAnchorLinkItem(baseUrl, item));
        });

        return (
            <div>
                <div style={{paddingLeft: "0.6em",
                             paddingTop: "0.1em",
                             paddingBottom: "0.1em",
                             background: "rgb(3, 169, 244)",
                             color: "white",
                             fontWeight: 200}}>
                    <FontIcon className="material-icons"
                              style={{top: "0.7em", color: "white", position: "absolute"}}>label_outline</FontIcon>
                    <p style={{marginLeft: "2em"}}>文内导航</p>
                </div>
                <ul style={{listStyle: "none", paddingLeft: "1em"}}>
                    {
                        resultArr.map((item) => { return item })
                    }
                </ul>
            </div>
        );
    }

    renderShareArea(blogMeta) {
        return (
            <div>

            </div>
        );
    }

    render() {
        return (
            <div className="blog_anchor">
                {this.renderAnchorLink(this.state.blogInfo.blogContent)}
                {this.renderShareArea(this.state.blogInfo)}
            </div>
        );
    }
}


export default BlogAnchor;