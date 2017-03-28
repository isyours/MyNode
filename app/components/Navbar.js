import React from 'react';
import AppBar from 'material-ui/AppBar';
import { Link } from 'react-router';
import {lightBlue500, grey200, black, white} from 'material-ui/styles/colors';
import FontIcon from 'material-ui/FontIcon';
import {BottomNavigation, BottomNavigationItem} from 'material-ui/BottomNavigation';

class Navbar extends React.Component {
    constructor(props) {
        super(props);
        this._darkIconStyle = {
            fontSize: 24,
            color: black,
            opacity: 0.54
        };
        this._lightIconStyle = {
            fontSize: 24,
            color: white
        };
        this.state = {
            open: false,
            background: 'none',
            menuBackground: grey200,
            iconStyle: this._darkIconStyle,
            menuItemFontStyle: this._darkIconStyle
        };
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
        let iconStyle = this._lightIconStyle;
        let menuItemFontStyle = this._lightIconStyle;
        if (data < 250) {
            backgroundColorVal = 'none';
            menuBackgroundColorVal = grey200;
            iconStyle = this._darkIconStyle;
            menuItemFontStyle = this._darkIconStyle;
        }
        this.setState({
            background: backgroundColorVal,
            menuBackground: menuBackgroundColorVal,
            iconStyle: iconStyle,
            menuItemFontStyle: menuItemFontStyle
        });
    }

    buttonClickAction(url) {
        if (url === 'blog-btn') {
            window.location.href = '/';
        } else {
            console.log('current user click ', url);
        }
    }

    render() {

        const blogIcon = <FontIcon className="material-icons" style={this.state.iconStyle}>book</FontIcon>;
        const experimentalIcon = <FontIcon className="material-icons" style={this.state.iconStyle}>build</FontIcon>;
        const aboutMeIcon = <FontIcon className="material-icons" style={this.state.iconStyle}>face</FontIcon>;

        return (
            <div>
                <AppBar
                    className="container"
                    iconClassNameRight="muidocs-icon-navigation-expand-more"
                    style={{boxShadow: "none", background: this.state.background}}
                    iconElementLeft={
                        <BottomNavigation selectedIndex={this.state.selectedIndex} style={{height: 54,
                            background: this.state.menuBackground}}>
                            <BottomNavigationItem
                                label="博客散文"
                                icon={blogIcon}
                                onTouchTap={() => this.buttonClickAction('blog-btn')}
                                style={this.state.menuItemFontStyle}
                            />
                            <BottomNavigationItem
                                label="IT实验室"
                                icon={experimentalIcon}
                                onTouchTap={() => this.buttonClickAction('experimental')}
                                style={this.state.menuItemFontStyle}
                            />
                            <BottomNavigationItem
                                label="关于博主"
                                icon={aboutMeIcon}
                                onTouchTap={() => this.buttonClickAction('about-me')}
                                style={this.state.menuItemFontStyle}
                            />
                        </BottomNavigation>
                    }
                    iconElementRight={
                        <div></div>
                    }
                />
            </div>
        );
    }
}

export default Navbar;