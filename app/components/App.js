/**
 * Created by Administrator on 2016/12/27.
 */
import React from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import {RouteHandler} from 'react-router';
import Navbar from './Navbar';
import Footer from './Footer';

class App extends React.Component {
    render() {
        return (
            <MuiThemeProvider>
                <div>
                    <Navbar />
                    <RouteHandler />
                    <Footer />
                </div>
            </MuiThemeProvider>
        );
    }
}

export default App;