/**
 * Created by chenhaolong on 2017/3/14.
 */
import React from 'react';
import BlogActions from '../actions/BlogActions';
import BlogStore from '../stores/BlogStore';
import BlogMarkdownEditor from './BlogMarkdownEditor';
import ChipInput from 'material-ui-chip-input';
import Dropzone from 'react-dropzone';
import TextField from 'material-ui/TextField';


class BlogEditPage extends React.Component {
    constructor(props) {
        super(props);

        if (this.props.params.blogTitle) {
            BlogActions.getBlogByTitle(this.props.params.blogTitle);
        }

        this.state = {
            blogInfo: {
                blogMarkdownContent: '',
                blogContent: ''
            },
            files: []
        };

        this.handleInputChange = this.handleInputChange.bind(this);
        this.submitCallback = this.submitCallback.bind(this);
        this.handleTagsChange = this.handleTagsChange.bind(this);
        this.onDrop = this.onDrop.bind(this);
        this.onOpenClick = this.onOpenClick.bind(this);
        this._uploadFile = this._uploadFile.bind(this);
        this.onChange = this.onChange.bind(this);
    }

    componentDidMount() {
        BlogStore.listen(this.onChange);
    }

    componentWillUnmount() {
        BlogStore.unlisten(this.onChange);
    }

    onChange(state) {
        this.setState(state);
    }

    handleInputChange(event) {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;

        this.state.blogInfo[name] = value;
        let blogInfo = this.state.blogInfo;
        this.setState({
            blogInfo: blogInfo
        });
    }

    handleTagsChange(chips) {
        this.setState({
            blogTags: chips
        });
    }

    onDrop(file) {
        if (!file || !(file instanceof Array) || file.length == 0) {
            return;
        }
        let uploadFile = file[0];
        for (let i in this.state.files) {
            if (this.state.files[i] && (this.state.files[i].name == uploadFile.name)) {
                return;
            }
        }
        this._uploadFile(uploadFile);
    }

    _uploadFile(file) {
        let fd = new FormData();
        fd.append('fname', file.name);
        fd.append('data', file);
        $.ajax({
            type: 'POST',
            url: '/upload',
            data: fd,
            processData: false,
            contentType: false
        }).done(function(data) {
            this.state.files.push(file);
            let uploadedFiles = this.state.files;
            this.setState({
                files: uploadedFiles
            });
        }.bind(this));
    }

    onOpenClick() {
        this.refs.dropzone.open();
    }

    submitCallback(htmlResultContent, markdownContent) {
        this.state.blogInfo.blogContent = htmlResultContent;
        this.state.blogInfo.blogMarkdownContent = markdownContent;
        let currentTime = new Date();
        this.state.blogInfo.updateTime = currentTime;
        this.state.blogInfo.createTime = currentTime;
        this.state.blogInfo.blogTags = this.state.blogTags;
        BlogActions.addBlog(this.state.blogInfo);
        // document.location.href = "/";
    }

    render() {
        return (
            <div style={{padding: 10}}>
                <h1>当前保存状态：{this.state.saveBlogSuccess?"成功":
                    this.state.errorMsg? "失败:" + this.state.errorMsg:"更新未保存"}</h1>
                <div>
                    <TextField
                        name="blogName"
                        hintText="博客标题"
                        floatingLabelText="博客标题，将出现在主页和博客页"
                        value={this.state.blogInfo.blogName}
                        onChange={this.handleInputChange}
                        style={{ width: '100%' }}
                    />
                </div>
                <div>
                    <TextField
                        name="blogTitle"
                        hintText="博客路由地址"
                        floatingLabelText="博客路由地址，导航Url地址"
                        value={this.state.blogInfo.blogTitle}
                        onChange={this.handleInputChange}
                        style={{ width: '100%' }}
                    />
                </div>
                <div>
                    <TextField
                        name="blogBrief"
                        hintText="博客内容简介"
                        floatingLabelText="博客内容简介，会出现在首页"
                        value={this.state.blogInfo.blogBrief}
                        onChange={this.handleInputChange}
                        style={{ width: '100%' }}
                    />
                </div>
                <div>
                    <TextField
                        name="blogBackground"
                        hintText="博客主题背景"
                        floatingLabelText="博客主题背景，填写url"
                        value={this.state.blogInfo.blogBackground}
                        onChange={this.handleInputChange}
                        style={{ width: '100%' }}
                    />
                </div>
                <div>
                    <ChipInput
                        hintText="博客标签"
                        floatingLabelText="博客标签，回车填写多个"
                        value={this.state.blogInfo.blogTags}
                        onChange={(chips) => this.handleTagsChange(chips)}
                        style={{ width: '100%' }}
                    />
                </div>
                <div>
                    <Dropzone ref="dropzone" onDrop={this.onDrop}>
                        <div>Try dropping some files here, or click to select files to upload.</div>
                    </Dropzone>
                    <button type="button" onClick={this.onOpenClick}>
                        Open Dropzone
                    </button>
                    {this.state.files ? <div>
                        <h2>Uploading {this.state.files.length} files...</h2>
                        <div>{this.state.files.map((file) => {
                            let path = "/img/upload/" + file.name;
                            return (<p key={file.name}>{path}</p>);
                        })}</div>
                        <div>{this.state.files.map((file) => <img  key={file.name} src={file.preview} style={{height: 200, margin: 3}} />)}</div>
                    </div> : null}
                </div>
                <BlogMarkdownEditor  submitCallback={this.submitCallback}
                                     markdownText={this.state.blogInfo.blogMarkdownContent}
                                     htmlContent={this.state.blogInfo.blogContent}/>
            </div>
        );
    }
}

export default BlogEditPage;
