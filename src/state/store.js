import {createStore, combineReducers, applyMiddleware} from 'redux';
import {composeWithDevTools} from 'redux-devtools-extension';
import thunk from 'redux-thunk';
import sensors from './sensors';

const reducer = combineReducers({
  sensors,
});

export default (initialState) => createStore(reducer, {...initialState}, composeWithDevTools(applyMiddleware(thunk)));