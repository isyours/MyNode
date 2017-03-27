/**
 * Created by chenhaolong on 2017/3/17.
 */
import React from 'react';
import TextField from 'material-ui/TextField';
import BlogMessageActions from '../actions/BlogMessageActions';
import BlogMessageStore from '../stores/BlogMessageStore';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentReply from 'material-ui/svg-icons/content/reply';
import Divider from 'material-ui/Divider';
import {FormattedDate} from 'react-intl';

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
        this.replyBtnClick = this.replyBtnClick.bind(this);
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

    replyBtnClick(state) {
        console.log('reply click event', state);
    }

    renderMessageList() {
        const replyBtnStyle = {
            marginRight: 20,
            boxShadow: 'none',
            float: 'right'
        };
        let messageContent;
        if (this.state.blogMessageList) {
            messageContent = this.state.blogMessageList.map((messageItem) => {
                return (
                    <div style={{padding: 5}}>
                        <Divider style={{backgroundColor: '#b4dcae', margin: '15px 0px 15px'}}/>
                        <div>
                            <span>{messageItem.userName}</span>
                            <span style={{float: 'right'}}>
                                <FormattedDate
                                    value={messageItem.createTime}
                                    year='numeric'
                                    month='long'
                                    day='2-digit'
                                />
                            </span>
                        </div>
                        <div>{messageItem.messageContent}</div>
                        <div style={{height: 50}}>
                            <FloatingActionButton
                                mini={true}
                                style={replyBtnStyle}
                                onTouchTap={this.replyBtnClick}
                                backgroundColor='rgba(211, 237, 208, 0.7)'
                            >
                                <ContentReply style={{fill: '#9c9b84'}} />
                            </FloatingActionButton>
                        </div>
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
            <div style={{padding: 10}}>
                <div style={{marginTop: 10, padding: 10}}>
                    <h1>留言</h1>
                    {this.renderMessageList()}
                </div>
                <div style={{marginTop: 10, padding: 10, background: "#faffbd"}}>
                    <h1>请给我留言</h1>
                    <div>
                        <TextField hintText="UserName" defaultValue={this.state.newMessage.userName}
                                   floatingLabelText="UserName"
                                   name="userName" onChange={this.handleInputChange}/>
                    </div>
                    <div>
                        <TextField hintText="Email" defaultValue={this.state.newMessage.email}
                                   floatingLabelText="Email"
                                   name="text" onChange={this.handleInputChange}/>
                    </div>
                    <div>
                        <TextField hintText="Message Content" defaultValue={this.state.newMessage.messageContent}
                                   floatingLabelText="Message Content"
                                   name="messageContent" onChange={this.handleInputChange}
                                   multiLine={true}
                                   rows={2}/>
                    </div>
                    <div><button onClick={this.submitMessage}>提交</button></div>
                </div>
            </div>
        );
    }
}

export default BlogMessageBoard;
