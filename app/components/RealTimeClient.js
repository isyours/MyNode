/**
 * Created by chenhaolong on 2017/3/31.
 */
import React from 'react';
import SocketIOClient from 'socket.io-client';

class RealTimeClient extends React.Component {
    constructor(props) {
        super(props);
        this.onReceivedMessage = this.onReceivedMessage.bind(this);
        if (window) {
            this.socket = SocketIOClient(window.location.href);
            this.socket.on('currentUserNum', this.onReceivedMessage);
        }
    }

    onReceivedMessage(messages) {
        console.log('receive message from server ', messages);
    }

    render() {
        return (
            <div></div>
        );
    }
}

export default RealTimeClient;
