import React from 'react';
import AppBar from 'material-ui/AppBar';

class Navbar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {open: false};
    }

    handleToggle() {
        console.log("CLICK FIRED");
        this.setState({open: !this.state.open});
    }

    handleClose() {
        this.setState({open: false});
    }

    render() {
        return (
            <div>
                <AppBar
                    title="晨号隆"
                    iconClassNameRight="muidocs-icon-navigation-expand-more"
                    style={{boxShadow: "none"}}
                />
            </div>
        );
    }
}

export default Navbar;