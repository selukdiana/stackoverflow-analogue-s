import {
  combineReducers,
  createAction,
  type UnknownAction,
} from '@reduxjs/toolkit';

import authReducer from './slices/authSlice';
import snippetsReducer from './slices/snippetsSlice';
import currentSnippetReducer from './slices/currentSnippetSlice';
import accountReducer from './slices/accountSlice';
import newSnippetReducer from './slices/newSnippetSlice';
import questionsReducer from './slices/questionsSlice';
import currentQuestionReducer from './slices/currentQuestionSlice';

const combinedReducer = combineReducers({
  auth: authReducer,
  snippets: snippetsReducer,
  currentSnippet: currentSnippetReducer,
  account: accountReducer,
  newSnippet: newSnippetReducer,
  questions: questionsReducer,
  currentQuestion: currentQuestionReducer,
});
export const resetStore = createAction('app/resetStore');

const rootReducer = (
  state: ReturnType<typeof combinedReducer> | undefined,
  action: UnknownAction,
) => {
  if (action.type === resetStore.type) {
    return combinedReducer(undefined, action);
  }
  return combinedReducer(state, action);
};

export default rootReducer;
