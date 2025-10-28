import { configureStore } from '@reduxjs/toolkit';

import authReducer from './slices/authSlice';
import snippetsReducer from './slices/snippetsSlice';
import currentSnippetReducer from './slices/currentSnippetSlice';
import accountReducer from './slices/accountSlice';
import newSnippetReducer from './slices/newSnippetSlice';
import questionsReducer from './slices/questionsSlice';
import currentQuestionReducer from './slices/currentQuestionSlice';
import usersReducer from './slices/usersSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    snippets: snippetsReducer,
    currentSnippet: currentSnippetReducer,
    account: accountReducer,
    newSnippet: newSnippetReducer,
    questions: questionsReducer,
    currentQuestion: currentQuestionReducer,
    users: usersReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
