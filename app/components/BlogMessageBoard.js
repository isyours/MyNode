/**
 * Created by chenhaolong on 2017/3/17.
 */
import React from 'react';
import BlogMessageActions from '../actions/BlogMessageActions';
import BlogMessageStore from '../stores/BlogMessageStore';

class BlogMessageBoard extends React.Component {
    constructor(props) {
        super(props);
        this.blogId = this.props.blogId;
        this.state = {
            needUpdate: true,
            blogMessageList: [],
            userInfo: {},
            newMessage: {
                blogId: this.blogId
            }
        };
        BlogMessageActions.getBlogMessageByBlogId(this.blogId);
        this.onChange = this.onChange.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.submitMessage = this.submitMessage.bind(this);
    }

    componentDidMount() {
        BlogMessageStore.listen(this.onChange);
    }

    componentWillUnmount() {
        BlogMessageStore.unlisten(this.onChange);
    }

    onChange(state) {
        this.setState(state);
        if (this.state.needUpdate) {
            BlogMessageActions.getBlogMessageByBlogId(this.blogId);
        }
    }

    renderMessageList() {
        let messageContent;
        if (this.state.blogMessageList) {
            messageContent = this.state.blogMessageList.map((messageItem) => {
                return (
                    <div>
                        <div>{messageItem.userName}</div>
                        <div>{messageItem.createTime}</div>
                        <div>{messageItem.messageContent}</div>
                    </div>
                )
            });
        } else {
            messageContent = (<div>暂无留言</div>);
        }
        return messageContent;
    }

    handleInputChange(event) {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;

        this.state.newMessage[name] = value;
        let msgInfo = this.state.newMessage;
        this.setState({
            newMessage: msgInfo
        });
    }

    submitMessage() {
        BlogMessageActions.saveBlogMessage(this.state.newMessage);
    }

    render() {
        return (
            <div>
                <div>{this.renderMessageList()}</div>
                <div>
                    <div>
                        UserName:
                        <input type="text"  value={this.state.newMessage.userName}
                               name="userName" onChange={this.handleInputChange} />
                    </div>
                    <div>
                        Email:
                        <input type="text"  value={this.state.newMessage.email}
                               name="email" onChange={this.handleInputChange} />
                    </div>
                    <div>
                        MessageContent:
                        <input type="text"  value={this.state.newMessage.messageContent}
                               name="messageContent" onChange={this.handleInputChange} />
                    </div>
                    <div><button onClick={this.submitMessage}>提交</button></div>
                </div>
            </div>
        );
    }
}

export default BlogMessageBoard;
