import React , { Component } from 'react';
import { withRouter } from 'react-router-dom';
import {
    Collapse,
    Navbar,
    NavbarToggler,
    NavbarBrand,
    Nav,
    NavItem,
    NavLink,
    } from 'reactstrap';
import { Link } from 'react-router-dom';

class TopBar extends Component {
    constructor(props){
        super(props);
        this.state = {
            isOpen:false,
        }
    }
    toggle = () =>{
        this.setState({ isOpen: !this.state.isOpen })
    }

    componentDidMount(){
        // this.props.checkLogIn();
    }

    render(){
        let { isOpen } = this.state;
        return(
            <div>
                <Navbar color="dark" dark expand="md">
                    <NavbarBrand href="/">Polling App</NavbarBrand>
                    <NavbarToggler onClick={this.toggle} />
                    <Collapse isOpen={isOpen} navbar>
                        <Nav className="ml-auto" navbar>
                        <NavItem>
                            <NavLink tag={Link} to="/">Home</NavLink>
                        </NavItem>
                        <NavItem>
                            <NavLink tag={Link} to="/poll">Poll</NavLink>
                        </NavItem>
                        <NavItem>
                            <NavLink tag={Link} to="/stats">Stats</NavLink>
                        </NavItem>
                        </Nav>
                    </Collapse>
                </Navbar>
            </div>
        )
    }
}




export default withRouter(TopBar);