import { configureStore } from '@reduxjs/toolkit';
import rootReducer from './reducers/CombineReducers';

const store = configureStore({
  reducer: rootReducer,
});

export default store;
