// store.js
import { configureStore } from '@reduxjs/toolkit';
import venueReducer from './venueSlice';
//Added necessary imports
import avReducer from './avSlice';
import mealsReducer from './mealsSlice';


export default configureStore({
  reducer: {
    venue: venueReducer,
    //Added all reducers
    av: avReducer,
    meals: mealsReducer,
  },
});
