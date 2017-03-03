import React from 'react';
import AppBar from 'material-ui/AppBar';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';
import { Link } from 'react-router';


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
                    title={<Link key={'back_to_main'} style={{textDecoration: 'none', color: 'black'}} to='/'>晨号隆</Link>}
                    iconClassNameRight="muidocs-icon-navigation-expand-more"
                    style={{boxShadow: "none"}}
                    iconElementLeft={<div></div>}
                    iconElementRight={
                        <Link key={'create_new_btn'} to='/edit/blog'>
                            <FloatingActionButton style={{marginRight: 20, boxShadow: "none"}} mini={true}>
                                <ContentAdd />
                            </FloatingActionButton>
                        </Link>
                    }
                />
            </div>
        );
    }
}

export default Navbar;