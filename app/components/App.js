/**
 * Created by Administrator on 2016/12/27.
 */
import React from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import {grey300} from 'material-ui/styles/colors';
import {grey900} from 'material-ui/styles/colors';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import {RouteHandler} from 'react-router';
import Navbar from './Navbar';
import Footer from './Footer';

class App extends React.Component {

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
                <div style={{height: "100%", width: "100%", float: "left", margin: 0, position: "absolute"}}>
                    <div style={{height: "10%", width: "100%", margin: 0}}>
                        <Navbar />
                    </div>
                    <div style={{height: "80%", width: "100%", margin: 0}}>
                        <RouteHandler />
                    </div>
                    <div style={{height: "10%", width: "100%", margin: 0, overflow: "hidden"}}>
                        <Footer />
                    </div>
                </div>
            </MuiThemeProvider>
        );
    }
}

export default App;