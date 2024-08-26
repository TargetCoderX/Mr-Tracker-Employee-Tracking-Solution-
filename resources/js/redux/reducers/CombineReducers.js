import { combineReducers } from 'redux';
import LoaderReducer from './LoaderReducer';

const rootReducer = combineReducers({
    loader: LoaderReducer,
    // Add other reducers here
});

export default rootReducer;
