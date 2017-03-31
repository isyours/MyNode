import React from 'react';
import AppBar from 'material-ui/AppBar';
import { Link } from 'react-router';
import {lightBlue500, grey200, black, white} from 'material-ui/styles/colors';
import FontIcon from 'material-ui/FontIcon';
import RealTimeClient from './RealTimeClient';
import {BottomNavigation, BottomNavigationItem} from 'material-ui/BottomNavigation';

class Navbar extends React.Component {
    constructor(props) {
        super(props);
        let outerType = this.props.type ? this.props.type: 'auto';
        this._darkIconStyle = {
            fontSize: 24,
            color: black,
            opacity: 0.54
        };
        this._lightIconStyle = {
            fontSize: 24,
            color: white
        };
        this._changeFlag = true;
        if (outerType !== 'auto') {
            this._changeFlag = false;
        }

        this.onTopChangeHandler = this.onTopChangeHandler.bind(this);
        this.buttonClickAction = this.buttonClickAction.bind(this);
        this.getStyleConfig = this.getStyleConfig.bind(this);

        let styleConfig = this.getStyleConfig(outerType);
        this.state = {
            open: false,
            styleConfig: styleConfig
        };
        this.token = null;
    }

    getStyleConfig(type) {
        let ret = {
            background: 'none',
            menuBackground: grey200,
            iconStyle: this._darkIconStyle,
            menuItemFontStyle: this._darkIconStyle
        };
        if (type === 'light') {
            ret = {
                background: lightBlue500,
                menuBackground: lightBlue500,
                iconStyle: this._lightIconStyle,
                menuItemFontStyle: this._lightIconStyle
            };
        }
        return ret;
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
        let styleConfig;
        if (data < 250 && this._changeFlag) {
            styleConfig = this.getStyleConfig('dark');
        } else {
            styleConfig = this.getStyleConfig('light');
        }
        this.setState({
            styleConfig: styleConfig
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

        const blogIcon = <FontIcon className="material-icons" style={this.state.styleConfig.iconStyle}>book</FontIcon>;
        const experimentalIcon = <FontIcon className="material-icons" style={this.state.styleConfig.iconStyle}>build</FontIcon>;
        const aboutMeIcon = <FontIcon className="material-icons" style={this.state.styleConfig.iconStyle}>face</FontIcon>;

        return (
            <div>
                <RealTimeClient />
                <AppBar
                    className="container"
                    iconClassNameRight="muidocs-icon-navigation-expand-more"
                    style={{boxShadow: "none", background: this.state.styleConfig.background}}
                    iconElementLeft={
                        <BottomNavigation selectedIndex={this.state.selectedIndex} style={{height: 54,
                            background: this.state.styleConfig.menuBackground}}>
                            <BottomNavigationItem
                                label="博客散文"
                                icon={blogIcon}
                                onTouchTap={() => this.buttonClickAction('blog-btn')}
                                style={this.state.styleConfig.menuItemFontStyle}
                            />
                            <BottomNavigationItem
                                label="IT实验室"
                                icon={experimentalIcon}
                                onTouchTap={() => this.buttonClickAction('experimental')}
                                style={this.state.styleConfig.menuItemFontStyle}
                            />
                            <BottomNavigationItem
                                label="关于博主"
                                icon={aboutMeIcon}
                                onTouchTap={() => this.buttonClickAction('about-me')}
                                style={this.state.styleConfig.menuItemFontStyle}
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