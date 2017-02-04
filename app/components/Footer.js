/**
 * Created by chenhaolong on 2017/1/5.
 */
import React from 'react';
import FooterStore from '../stores/FooterStore'

class Footer extends React.Component {
    constructor(props) {
        super(props);
        this.state = FooterStore.getState();
        this.onChange = this.onChange.bind(this);
    }

    componentDidMount() {
        FooterStore.listen(this.onChange);
    }

    componentWillUnmount() {
        FooterStore.unlisten(this.onChange);
    }

    onChange(state) {
        this.setState(state);
    }

    render() {
        let yearStr = new Date().getFullYear();
        return (
            <footer>
                <div className='container'>
                    <div className='row'>
                        <div className='col-sm-5'>
                            <h3 className='lead'><strong>Information</strong> and <strong>Copyright</strong></h3>
                            <p>Powered by <strong>Node.js</strong>, <strong>MongoDB</strong> and <strong>React</strong>.</p>
                            <p>You may view the <a href='https://github.com/isyours/MyNode'>Source Code</a> behind this project on GitHub.</p>
                            <p>© {yearStr} Chlde.</p>
                        </div>
                    </div>
                </div>
            </footer>
        );
    }
}

export default Footer;
