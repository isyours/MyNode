/**
 * Created by Administrator on 2016/12/26.
 */
import React from 'react';
import {Route} from 'react-router';
import App from './components/App';
import Home from './components/Home';
import BlogDetail from './components/BlogDetail';

export default (
    <Route handler={App}>
        <Route path='/' handler={Home} />
        <Route name='blogDetail' path='/blog/:blogId' handler={BlogDetail} />
    </Route>
);