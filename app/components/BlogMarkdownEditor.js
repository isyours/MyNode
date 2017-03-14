/**
 * Created by chenhaolong on 2017/3/14.
 */
import React from 'react';
import Codemirror from 'react-codemirror';

class BlogMarkdownEditor extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            markdownText: '',
            htmlContent: ''
        };
        this._submitCallback = this.props.submitCallback;
        this.updateCode = this.updateCode.bind(this);
        this.converter =  new showdown.Converter();
        this.handleSubmitBtnClick = this.handleSubmitBtnClick.bind(this);
    }

    updateCode(newCode) {
        this.setState({
            markdownText: newCode,
            htmlContent: this.converter.makeHtml(newCode)
        });
    }

    handleSubmitBtnClick() {
        if (this._submitCallback instanceof Function) {
            this._submitCallback.call(null, this.state.htmlContent, this.state.markdownText);
        } else {
            console.log("markdown submit btn is clicked");
        }
    }

    render() {
        var options = {
            lineNumbers: true,
            readOnly: false,
            mode: 'markdown'
        };
        return (
            <div>
                <div style={{
                    position: 'relative',
                    borderStyle: 'solid',
                    margin: 5
                }}>
                    <Codemirror ref="editor" value={this.state.markdownText} onChange={this.updateCode} options={options} />
                </div>
                <div style={{
                    background: 'white',
                    borderStyle: 'solid',
                    padding: 5,
                    margin: 5
                }} dangerouslySetInnerHTML={{__html: this.state.htmlContent}}>
                </div>
                <button onClick={this.handleSubmitBtnClick}>提交</button>
            </div>
        );
    }
}

export default BlogMarkdownEditor;
