/**
 * Created by chenhaolong on 2017/3/31.
 */
import React from 'react';
import SocketIOClient from 'socket.io-client';

class RealTimeClient extends React.Component {
    constructor(props) {
        super(props);
        this.onReceivedVisitorStatus = this.onReceivedVisitorStatus.bind(this);
        this.onReceivedRankStatus = this.onReceivedRankStatus.bind(this);
        if (window) {
            this.socket = SocketIOClient(window.location.href);
            this.socket.on('currentVisitorNum', this.onReceivedVisitorStatus);
            this.socket.on('totalVisitorRank', this.onReceivedRankStatus);
        }
        this.state = {
            currentVisitorNum: 0,
            totalVisitorNum: 0
        };
    }

    onReceivedVisitorStatus(response) {
        if (!response) {
            return;
        }
        this.setState({
            currentVisitorNum: response
        });
    }

    onReceivedRankStatus(response) {
        if (!response) {
            return;
        }
        this.setState({
            totalVisitorNum: response
        });
    }

    render() {
        return (
            <div>
                <div>
                    <span>当前在线访客：</span>
                    <span>{this.state.currentVisitorNum}</span>
                </div>
                <div>
                    <span>您是第{this.state.totalVisitorNum}位访客</span>
                </div>
            </div>
        );
    }
}

export default RealTimeClient;
