/**
 * Created by chenhaolong on 2017/2/10.
 */
import React from 'react';
import {Editor, EditorState, Modifier, RichUtils} from 'draft-js';
import {stateToHTML} from 'draft-js-export-html';
import BlogActions from '../actions/BlogActions';

class BlogEdit extends React.Component {

    constructor(props) {
        super(props);
        this.blogId = this.props.params.blogId;

        this.state = {
            editorState: EditorState.createEmpty(),
            blogInfo: {
                blogId: new Date().getTime() + '',
            }
        };

        this.handleInputChange = this.handleInputChange.bind(this);
        this.focus = () => this.refs.editor.focus();
        this.submit = () => {
            let htmlContent = stateToHTML(this.state.editorState.getCurrentContent());
            console.log("====================================");
            console.log(htmlContent);
            this.state.blogInfo.blogContent = htmlContent;
            let currentTime = new Date();
            this.state.blogInfo.updateTime = currentTime;
            this.state.blogInfo.createTime = currentTime;
            console.log("********************", this.state);
            BlogActions.addBlog(this.state.blogInfo);
        };
        this.onChange = (editorState) => this.setState({editorState});

        this.handleKeyCommand = (command) => this._handleKeyCommand(command);
        this.onTab = (e) => this._onTab(e);
        this.toggleBlockType = (type) => this._toggleBlockType(type);
        this.toggleInlineStyle = (style) => this._toggleInlineStyle(style);
    }

    _handleKeyCommand(command) {
        const {editorState} = this.state;
        const newState = RichUtils.handleKeyCommand(editorState, command);
        if (newState) {
            this.onChange(newState);
            return true;
        }
        return false;
    }

    _onTab(e) {
        const maxDepth = 4;
        this.onChange(RichUtils.onTab(e, this.state.editorState, maxDepth));
    }

    _toggleBlockType(blockType) {
        this.onChange(
            RichUtils.toggleBlockType(
                this.state.editorState,
                blockType
            )
        );
    }

    _toggleInlineStyle(inlineStyle) {
        this.onChange(
            RichUtils.toggleInlineStyle(
                this.state.editorState,
                inlineStyle
            )
        );
    }

    initEditorState() {
        this.state.editorState = EditorState.createEmpty();
    }

    handleInputChange(event) {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;

        this.state.blogInfo[name] = value;
        let bloginfo = this.state.blogInfo;
        this.setState({
            blogInfo: bloginfo
        });
    }

    render() {
        const {editorState} = this.state;

        // If the user changes block type before entering any text, we can
        // either style the placeholder or hide it. Let's just hide it now.
        let className = 'RichEditor-editor';
        let contentState = editorState.getCurrentContent();
        if (!contentState.hasText()) {
            if (contentState.getBlockMap().first().getType() !== 'unstyled') {
                className += ' RichEditor-hidePlaceholder';
            }
        }
        return (
            <div>
                <h1>Content from blog edit. {this.props.params.blogId}</h1>
                <label>
                    Name:
                    <input type="text"  value={this.state.blogInfo.blogName} name="blogName" onChange={this.handleInputChange} />
                </label>
                <label>
                    Title:
                    <input type="text"  value={this.state.blogInfo.blogTitle} name="blogTitle" onChange={this.handleInputChange} />
                </label>

                <div className="RichEditor-root">
                    <BlockStyleControls
                        editorState={editorState}
                        onToggle={this.toggleBlockType}
                    />
                    <InlineStyleControls
                        editorState={editorState}
                        onToggle={this.toggleInlineStyle}
                    />

                    <div className={className} onClick={this.focus}>
                        <Editor
                            blockStyleFn={getBlockStyle}
                            customStyleMap={styleMap}
                            editorState={editorState}
                            handleKeyCommand={this.handleKeyCommand}
                            onChange={this.onChange}
                            onTab={this.onTab}
                            placeholder="Tell a story..."
                            ref="editor"
                            spellCheck={true}
                        />
                    </div>
                    <div>
                        <button onClick={this.submit}>提交</button>
                    </div>
                </div>
            </div>
        );
    }
}

// Custom overrides for "code" style.
const styleMap = {
    CODE: {
        backgroundColor: 'rgba(0, 0, 0, 0.05)',
        fontFamily: '"Inconsolata", "Menlo", "Consolas", monospace',
        fontSize: 16,
        padding: 2,
    },
};

function getBlockStyle(block) {
    switch (block.getType()) {
        case 'blockquote': return 'RichEditor-blockquote';
        default: return null;
    }
}

class BlockStyleButton extends React.Component {
    constructor() {
        super();
        this.onToggle = (e) => {
            e.preventDefault();
            this.props.onToggle(this.props.style);
        };
    }

    render() {
        let className = 'RichEditor-styleButton';
        if (this.props.active) {
            className += ' RichEditor-activeButton';
        }

        return (
            <span className={className} onMouseDown={this.onToggle}>
              {this.props.label}
            </span>
        );
    }
}



const BLOCK_TYPES = [
    {label: 'H1', style: 'header-one'},
    {label: 'H2', style: 'header-two'},
    {label: 'H3', style: 'header-three'},
    {label: 'H4', style: 'header-four'},
    {label: 'H5', style: 'header-five'},
    {label: 'H6', style: 'header-six'},
    {label: 'Blockquote', style: 'blockquote'},
    {label: 'UL', style: 'unordered-list-item'},
    {label: 'OL', style: 'ordered-list-item'},
    {label: 'Code Block', style: 'code-block'},
];

const BlockStyleControls = (props) => {
    const {editorState} = props;
    const selection = editorState.getSelection();
    const blockType = editorState
        .getCurrentContent()
        .getBlockForKey(selection.getStartKey())
        .getType();

    return (
        <div className="RichEditor-controls">
            {BLOCK_TYPES.map((type) =>
                <BlockStyleButton
                    key={type.label}
                    active={type.style === blockType}
                    label={type.label}
                    onToggle={props.onToggle}
                    style={type.style}
                />
            )}
        </div>
    );
};


var INLINE_STYLES = [
    {label: 'Bold', style: 'BOLD'},
    {label: 'Italic', style: 'ITALIC'},
    {label: 'Underline', style: 'UNDERLINE'},
    {label: 'Monospace', style: 'CODE'},
];

const InlineStyleControls = (props) => {
    var currentStyle = props.editorState.getCurrentInlineStyle();
    return (
        <div className="RichEditor-controls">
            {INLINE_STYLES.map(type =>
                <BlockStyleButton
                    key={type.label}
                    active={currentStyle.has(type.style)}
                    label={type.label}
                    onToggle={props.onToggle}
                    style={type.style}
                />
            )}
        </div>
    );
};

export default BlogEdit;