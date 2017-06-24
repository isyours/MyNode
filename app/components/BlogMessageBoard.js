/**
 * Created by chenhaolong on 2017/3/17.
 */
import React from 'react';
import BlogMessageActions from '../actions/BlogMessageActions';
import BlogMessageStore from '../stores/BlogMessageStore';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentReply from 'material-ui/svg-icons/content/reply';
import Divider from 'material-ui/Divider';
import {FormattedDate} from 'react-intl';
import InfoLoading from './InfoLoading';
import RaisedButton from 'material-ui/RaisedButton';
import Formsy from 'formsy-react';
import { FormsyText } from 'formsy-material-ui/lib';

class BlogMessageBoard extends React.Component {
    constructor(props) {
        super(props);
        this.blogId = this.props.blogId;
        this.state = {
            needUpdate: true,
            blogId: this.blogId,
            blogMessageList: [],
            userInfo: {},
            newMessage: {
                blogId: this.blogId
            },
            canSubmit: false
        };
        BlogMessageActions.getBlogMessageByBlogId(this.blogId);
        this.onChange = this.onChange.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.submitMessage = this.submitMessage.bind(this);
        this.replyBtnClick = this.replyBtnClick.bind(this);
        this.enableButton = this.enableButton.bind(this);
        this.disableButton = this.disableButton.bind(this);
    }

    componentDidMount() {
        BlogMessageStore.listen(this.onChange);
        $('#_message_board').hide();
        $('#_message_board_list').hide();
    }

    componentWillUnmount() {
        BlogMessageStore.unlisten(this.onChange);
    }

    enableButton() {
        this.setState({
            canSubmit: true,
        });
    }

    disableButton() {
        this.setState({
            canSubmit: false,
        });
    }

    notifyFormError(data) {
        console.error('Form error:', data);
    }

    onChange(state) {
        this.setState(state);
        if (this.state.needUpdate) {
            $('#_message_board_list').show();
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
                            <span><i>{messageItem.userName}</i></span>
                            <span> 说：</span>
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
        BlogMessageActions.saveBlogMessage(this.state.newMessage, this.loadingStart, this.loadingFinished);
    }

    loadingStart() {
        $('#_message_board').show();
    }

    loadingFinished() {
        $('#_message_board').hide();
    }

    render() {
        let loadingStyle = {
            position: 'absolute',
            background: 'white',
            width: '40%',
            height: 300,
            zIndex: 999,
            opacity: 0.9,
            paddingTop: 100,
            paddingLeft: '30%',
            borderRadius: '20'
        };
        return (
            <div style={{padding: 10}}>
                <div style={{marginTop: 10, padding: 10}}>
                    {this.renderMessageList()}
                </div>
                <div id="_message_board" style={loadingStyle}>
                    <InfoLoading type='1'/>
                    留言保存中...
                </div>
                <div id="_message_board_list" style={loadingStyle}>
                    <InfoLoading type='1'/>
                    留言列表更新中...
                </div>
                <div style={{marginTop: 10, padding: 10, background: "#faffbd"}}>
                    <h1>请给我留言</h1>
                    <Formsy.Form
                        onValid={this.enableButton}
                        onInvalid={this.disableButton}
                        onValidSubmit={this.submitMessage}
                        onInvalidSubmit={this.notifyFormError}
                    >
                        <div>
                            <FormsyText
                                name="userName"
                                validations="isWords"
                                validationError={"English only"}
                                required
                                hintText="您的昵称？"
                                floatingLabelText="昵称"
                                value={this.state.newMessage.userName}
                                onChange={this.handleInputChange}
                            />
                        </div>
                        <div>
                            <FormsyText
                                name="email"
                                validations="isEmail"
                                validationError={"Email pattern is illegal, @ is needed"}
                                required
                                hintText="Email"
                                floatingLabelText="Email"
                                updateImmediately
                                value={this.state.newMessage.email}
                                onChange={this.handleInputChange}
                            />
                        </div>
                        <div>
                            <FormsyText
                                name="messageContent"
                                validationError={"必填内容"}
                                required
                                hintText="留言内容"
                                floatingLabelText="请输入留言内容"
                                value={this.state.newMessage.messageContent}
                                onChange={this.handleInputChange}
                                multiLine={true}
                                rows={2}
                            />
                        </div>
                        <div>
                            <RaisedButton
                                style={{marginTop: 32}}
                                type="submit"
                                label="提交"
                                disabled={!this.state.canSubmit}
                                primary={true}
                            />
                        </div>
                    </Formsy.Form>
                </div>
            </div>
        );
    }
}

export default BlogMessageBoard;
