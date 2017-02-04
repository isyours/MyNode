/**
 * Created by Administrator on 2016/12/26.
 */
import React from 'react';
import Router from 'react-router';
import routes from './routes';
import injectTapEventPlugin from 'react-tap-event-plugin';

injectTapEventPlugin();

Router.run(routes, Router.HistoryLocation, function(Handler) {
    React.render(<Handler />, document.getElementById('app'));
});