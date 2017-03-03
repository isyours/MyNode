/**
 * Created by Administrator on 2016/12/27.
 */
import React from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import {grey300} from 'material-ui/styles/colors';
import {grey900} from 'material-ui/styles/colors';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import {RouteHandler} from 'react-router';
import Footer from './Footer';
import ExecutionEnvironment from 'exenv';


class App extends React.Component {

    componentDidMount() {
        console.log('use dom state', ExecutionEnvironment.canUseDOM);
        if (ExecutionEnvironment.canUseDOM) {
            document.documentElement.addEventListener('scroll', this.handleScroll);
        }
    }

    componentWillUnmount() {
        document.documentElement.removeEventListener('scroll', this.handleScroll);
    }

    handleScroll() {
        console.log('app scroll');
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