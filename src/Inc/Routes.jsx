import React, { Component } from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import Questions from '../Components/Questions.jsx';
import Poll from '../Components/Poll.jsx';
import Stats from '../Components/Stats.jsx';
import { loginAction, checkLoginAction } from '../actions/loginActions.js';
import { connect } from 'react-redux'; 
class Routes extends Component {
    constructor(props){
        super(props);
        this.state= {
            loading: false
        }
    }
    componentDidMount(){
        this.setState({
            loading:true
        })
        this.props.checkLogin();
    }
    componentWillReceiveProps(props){
        console.log('login props',props)
        if(props.allStates.loginReducers.isLoggedIn === false){
            this.props._login();
        }else{
            this.setState({ loading: false });
        }
    }
    render() {
        console.log('loading', this.state)
        let { loading } = this.state;
        return (
            <>
            {loading ? (
                <div className="text-center m-auto">
                    <img src={require('../assets/images/spinner.gif')} alt="loading..." />
                </div>
            ) : (

                <BrowserRouter>
                    <Switch>
                        <Route exact path="/" component ={Questions} />
                        <Route path="/poll" component ={Poll} />
                        <Route path="/stats" component ={Stats} />
                    </Switch>
                </BrowserRouter>
            )}
            </>
        );
    }
}


const mapStateToProps = (state) => {
    const allStates = state;
    console.log("State", allStates);
    return { allStates };
  }

const mapDispatchToProps = (dispatch, props) => {
    return {
      _login: () => {
        dispatch(loginAction());
      },
      checkLogin : () => {
          dispatch(checkLoginAction())
      }
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(Routes);
