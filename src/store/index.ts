import { configureStore } from '@reduxjs/toolkit';

import authReducer from './slices/authSlice';
import snippetsReducer from './slices/snippetsSlice';
import currentSnippetReducer from './slices/currentSnippetSlice';
import accountReducer from './slices/accountSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    snippets: snippetsReducer,
    currentSnippet: currentSnippetReducer,
    account: accountReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
