import React from 'react';
import AppBar from 'material-ui/AppBar';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';
import { Link } from 'react-router';
import {grey300} from 'material-ui/styles/colors';


class Navbar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {open: false, background: grey300};
        this.token = null;
        this.onTopChangeHandler = this.onTopChangeHandler.bind(this);
    }

    handleToggle() {
        console.log("CLICK FIRED");
        this.setState({open: !this.state.open});
    }

    handleClose() {
        this.setState({open: false});
    }

    componentDidMount() {
        this.token = PubSub.subscribe('TOP_CHANGE_EVENT', this.onTopChangeHandler)
    }

    componentWillUnmount() {
        if (this.token) {
            PubSub.unsubscribe(this.token);
        }
    }

    onTopChangeHandler(topic, data) {
        if (!topic || 'TOP_CHANGE_EVENT' !== topic) {
            return;
        }
        let backgroundColorVal = grey300;
        if (data < 250) {
            backgroundColorVal = 'none';
        }
        this.setState({
            background: backgroundColorVal
        });
    }

    render() {
        return (
            <div>
                <AppBar
                    title={<Link key={'back_to_main'} style={{textDecoration: 'none', color: 'black'}} to='/'>晨号隆</Link>}
                    iconClassNameRight="muidocs-icon-navigation-expand-more"
                    style={{boxShadow: "none", background: this.state.background}}
                    iconElementLeft={<div></div>}
                    iconElementRight={
                        <Link key={'create_new_btn'} to='/edit/blog'>
                            <FloatingActionButton style={{marginRight: 20, boxShadow: "none"}} mini={true}>
                                <ContentAdd />
                            </FloatingActionButton>
                        </Link>
                    }
                />
            </div>
        );
    }
}

export default Navbar;