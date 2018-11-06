import React, { Component } from 'react';
import { Provider } from 'react-redux';
import Routes from './Inc/Routes.jsx';
import 'bootstrap/dist/css/bootstrap.min.css';
import './assets/css/custom.css';
import store from './store.js'
class App extends Component {
  render() {
    return (
      <Provider store={ store }>
       <Routes />
      </Provider>
    );
  }
}

export default App;
