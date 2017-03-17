/**
 * Created by Administrator on 2016/12/26.
 */
import React from 'react';
import {Route} from 'react-router';
import App from './components/App';
import Home from './components/Home';
import BlogDetail from './components/BlogDetail';
import BlogEditPage from './components/BlogEditPage';

export default (
    <Route handler={App}>
        <Route name='mainPage' path='/' handler={Home} />
        <Route name='blogEdit' path='/edit/blog' handler={BlogEditPage}/>
        <Route name='blogDetail' path='/blog/:blogTitle' handler={BlogDetail} />
    </Route>
);