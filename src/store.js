
import reducers from './reducers';
import thunk from 'redux-thunk'
import { createStore, applyMiddleware } from 'redux';

const store  = createStore(reducers, applyMiddleware(thunk));

export default store;