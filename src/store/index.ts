import { configureStore } from '@reduxjs/toolkit';

import authReducer from './slices/authSlice';
import snippetsReducer from './slices/snippetsSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    snippets: snippetsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
