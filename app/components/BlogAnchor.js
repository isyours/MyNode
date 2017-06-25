import React from 'react';
import FontIcon from 'material-ui/FontIcon';


class BlogAnchor extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            blogInfo: this.props.blogInfo,
            isToggleOn: true
        };
        this.getAnchorLinkItem = this.getAnchorLinkItem.bind(this);
        this.handleTriggerClick = this.handleTriggerClick.bind(this);
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

    handleTriggerClick() {
        this.setState(prevState => ({
            isToggleOn: !prevState.isToggleOn
        }));
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

        let navStyle = {
            listStyle: "none", paddingLeft: "1em"
        };

        let anchorStyle = {
            backgroundColor: "rgba(211, 237, 208, 0.9)",
            boxShadow: "1px 1px 1px rgba(0,0,0,0.25)",
            marginTop: "1em"
        };

        let navTriggerStyle = {
            paddingLeft: "0.6em",
            paddingTop: "0.1em",
            paddingBottom: "0.1em",
            background: "rgb(3, 169, 244)",
            color: "white",
            fontWeight: 200
        };

        let navTitleStyle = {
            marginLeft: "2em"
        };

        if (!this.state.isToggleOn) {
            navStyle['display'] = "none";
            navTitleStyle['display'] = "none";
            anchorStyle['minHeight'] = '55px';
            anchorStyle['width'] = '45px';
            anchorStyle['backgroundColor'] = 'rgb(3, 169, 244)';
        } else {
            navStyle['display'] = "block";
            navTitleStyle['display'] = "block";
            anchorStyle['minHeight'] = '200px';
            anchorStyle['width'] = '260px';
            anchorStyle['backgroundColor'] = "rgba(211, 237, 208, 0.9)";
        }

        return (
            <div style={anchorStyle}>
                <div style={navTriggerStyle}>
                    <FontIcon className="material-icons" onClick={this.handleTriggerClick}
                              title={this.state.isToggleOn?"隐藏导航栏":"展示导航栏"}
                              style={{top: "0.7em", color: "white", position: "absolute", cursor: "pointer"}}>
                        {this.state.isToggleOn? "toc":"view_headline"}
                    </FontIcon>
                    <p style={navTitleStyle}>文内导航</p>
                </div>
                <ul style={navStyle}>
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