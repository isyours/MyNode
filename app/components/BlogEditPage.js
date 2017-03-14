/**
 * Created by chenhaolong on 2017/3/14.
 */
import React from 'react';
import BlogActions from '../actions/BlogActions';
import BlogMarkdownEditor from './BlogMarkdownEditor';
import ChipInput from 'material-ui-chip-input';
import Dropzone from 'react-dropzone';
import _ from 'lodash';

class BlogEditPage extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            blogInfo: {
                blogId: new Date().getTime() + '',
            },
            uploadFiles: {
            },
            files: []
        };

        this.handleInputChange = this.handleInputChange.bind(this);
        this.submitCallback = this.submitCallback.bind(this);
        this.handleTagsChange = this.handleTagsChange(this);
        this.onDrop = this.onDrop.bind(this);
        this.onOpenClick = this.onOpenClick.bind(this);
        this._uploadFile = this._uploadFile.bind(this);
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

    onDrop(files) {
        console.log('Received files: ', files);
        for (let i in files) {
            console.log("===================", i);
            if (!this.state.uploadFiles[i]) {
                this._uploadFile(i, files[i]);
            }
        }
        this.setState({
            files: files
        })
    }

    _uploadFile(index, file) {
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
            console.log("===upload success===", data);
            let uploadedFiles = this.state.uploadFiles;
            uploadedFiles[index] = file;
            this.setState({
                uploadFiles: uploadedFiles
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
        console.log("blog save", this.state.blogInfo);
        BlogActions.addBlog(this.state.blogInfo);
        document.location.href = "/";
    }

    render() {
        return (
            <div>
                <div>
                    Name:
                    <input type="text"  value={this.state.blogInfo.blogName} name="blogName" onChange={this.handleInputChange} />
                </div>
                <div>
                    Title:
                    <input type="text"  value={this.state.blogInfo.blogTitle} name="blogTitle" onChange={this.handleInputChange} />
                </div>
                <div>
                    Pic:
                    <input type="text"  value={this.state.blogInfo.blogBackground} name="blogBackground" onChange={this.handleInputChange} />
                </div>
                <div>
                    Tags:
                    <ChipInput
                        defaultValue={this.state.blogInfo.blogTags}
                        onChange={(chips) => this.handleTagsChange(chips)}
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
                            return (<p>{path}</p>);
                        })}</div>
                        <div>{this.state.files.map((file) => <img src={file.preview} style={{height: 200}} />)}</div>
                    </div> : null}
                </div>
                <BlogMarkdownEditor submitCallback={this.submitCallback}/>
            </div>
        );
    }
}

export default BlogEditPage;
