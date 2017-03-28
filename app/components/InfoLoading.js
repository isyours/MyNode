/**
 * Created by chenhaolong on 2017/3/28.
 */
import React from 'react';
import CircularProgress from 'material-ui/CircularProgress';
import LinearProgress from 'material-ui/LinearProgress';

class InfoLoading extends React.Component {
    constructor(props) {
        super(props);
        this.viewType = this.props.type ? this.props.type: '1';
        this.completed = this.props.completed ? this.props.completed: 0;
        console.log('current loading type is', this.viewType);
        this.state = {
            type: this.viewType,
            completed: this.completed
        }
    }

    render() {
        return (
            <div>
                {
                    this.state.type === '1'?
                    <CircularProgress size={80} thickness={5} />:
                    <LinearProgress mode="determinate" value={this.state.completed} />
                }
            </div>
        );
    }
}

export default InfoLoading;
