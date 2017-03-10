import React from 'react';
import AppBar from 'material-ui/AppBar';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';
import { Link } from 'react-router';
import {lightBlue500} from 'material-ui/styles/colors';
import FontIcon from 'material-ui/FontIcon';
import {BottomNavigation, BottomNavigationItem} from 'material-ui/BottomNavigation';

class Navbar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {open: false, background: 'none', menuBackground: 'white'};
        this.token = null;
        this.onTopChangeHandler = this.onTopChangeHandler.bind(this);
        this.buttonClickAction = this.buttonClickAction.bind(this);
    }

    handleToggle() {
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
        let backgroundColorVal = lightBlue500;
        let menuBackgroundColorVal = lightBlue500;
        if (data < 250) {
            backgroundColorVal = 'none';
            menuBackgroundColorVal = 'white';
        }
        this.setState({
            background: backgroundColorVal,
            menuBackground: menuBackgroundColorVal
        });
    }

    buttonClickAction(url) {
        console.log('current user click ', url);
    }

    render() {

        const blogIcon = <FontIcon className="material-icons md-light md-18">book</FontIcon>;
        const experimentalIcon = <FontIcon className="material-icons md-light md-18">build</FontIcon>;
        const aboutMeIcon = <FontIcon className="material-icons md-light md-18">face</FontIcon>;

        return (
            <div>
                <AppBar
                    title={<Link key={'back_to_main'} style={{textDecoration: 'none', color: 'black', opacity: 0.54}} to='/'>晨号隆</Link>}
                    iconClassNameRight="muidocs-icon-navigation-expand-more"
                    style={{boxShadow: "none", background: this.state.background}}
                    iconElementLeft={
                        <BottomNavigation selectedIndex={this.state.selectedIndex} style={{height: 49,
                            background: this.state.menuBackground}}>
                            <BottomNavigationItem
                                label="博客散文"
                                icon={blogIcon}
                                onTouchTap={() => this.buttonClickAction('blog-btn')}
                            />
                            <BottomNavigationItem
                                label="IT实验室"
                                icon={experimentalIcon}
                                onTouchTap={() => this.buttonClickAction('experimental')}
                            />
                            <BottomNavigationItem
                                label="About Me"
                                icon={aboutMeIcon}
                                onTouchTap={() => this.buttonClickAction('about-me')}
                            />
                        </BottomNavigation>
                    }
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