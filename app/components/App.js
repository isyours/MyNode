/**
 * Created by Administrator on 2016/12/27.
 */
import React from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import {grey300, grey900} from 'material-ui/styles/colors';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import {RouteHandler} from 'react-router';
import Footer from './Footer';
import ExecutionEnvironment from 'exenv';


class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {isToggleOn: true};

        // This binding is necessary to make `this` work in the callback
        this.handleScroll = this.handleScroll.bind(this);
    }

    componentDidMount() {
        if (ExecutionEnvironment.canUseDOM) {
            window.addEventListener('scroll', this.handleScroll.bind(this));
        }
    }

    componentWillUnmount() {
        window.removeEventListener('scroll', this.handleScroll.bind(this));
    }

    handleScroll(e) {
        PubSub.publish('TOP_CHANGE_EVENT', $(e.target).scrollTop());
    }

    render() {
        let muiTheme = getMuiTheme({
            palette: {
                primary1Color: grey300
            },
            appBar: {
                height: 50,
                textColor: grey900,
                padding: "15%"
            }
        });
        return (
            <MuiThemeProvider muiTheme={muiTheme}>
                <div>
                    <RouteHandler/>
                    <Footer />
                </div>
            </MuiThemeProvider>
        );
    }
}

export default App;