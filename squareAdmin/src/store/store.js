
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/Auth/AuthSlice';
import coursesReducer from './slices/Courses/coursesSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    courses: coursesReducer,
  },
});

export default store;
