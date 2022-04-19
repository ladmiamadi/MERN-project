import { applyMiddleware, createStore } from 'redux';
import thunk from 'redux-thunk';
import rootReducer from './reducers'; //on a une page index.js
import {composeWithDevTools} from 'redux-devtools-extension';

const store = createStore(
    rootReducer, composeWithDevTools(applyMiddleware(thunk)), 
);

export default store;