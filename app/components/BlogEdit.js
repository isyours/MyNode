/**
 * Created by chenhaolong on 2017/2/10.
 */
import React from 'react';
import {Editor, EditorState} from 'draft-js';
import BlogStore from '../stores/BlogStore'

class BlogEdit extends React.Component {

    constructor(props) {
        super(props);
        this.blogId = this.props.params.blogId;
        this.onChange = this.onChange.bind(this);
        this.state = BlogStore.getState();
        this.initEditorState();
    }

    onChange(state) {
        console.log(state);
        this.setState(state);
    }

    initEditorState() {
        this.state.editorState = EditorState.createEmpty();
    }
    
    render() {
        let editor = {
            borderTop: '1px solid #ddd',
            cursor: 'text',
            fontSize: 16,
            marginTop: 20,
            minHeight: 400,
            paddingTop: 20
            };
        return (
            <div>
                <h1>Content from blog edit. {this.props.params.blogId}</h1>
                <Editor editorState={this.state.editorState}
                        onChange={this.onChange} placeholder="Write something colorful..." ref="editor" />
            </div>
        );
    }
}

export default BlogEdit;
