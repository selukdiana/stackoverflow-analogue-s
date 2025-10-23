import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter } from 'react-router';
import { Provider } from 'react-redux';
import { RouterProvider } from 'react-router/dom';

import { Layout } from './pages/Layout';
import { HomePage } from './pages/HomePage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { PrivateRoutes } from './pages/PrivateRoutes';
import store from './store';
import './index.scss';
import { SnippetPage } from './pages/SnippetPage';
import { AccountPage } from './pages/AccountPage';
import { CreateSnippetPage } from './pages/CreateSnippetPage';
import { QuestionsPage } from './pages/QuestionsPage';
import { QuestionPage } from './pages/QuestionPage';

const router = createBrowserRouter([
  {
    path: '/',
    Component: Layout,
    children: [
      {
        index: true,
        Component: HomePage,
      },
      {
        path: '/login',
        Component: LoginPage,
      },
      {
        path: '/register',
        Component: RegisterPage,
      },
      {
        Component: PrivateRoutes,
        children: [
          {
            path: '/snippet/:snippetId',
            Component: SnippetPage,
          },
          { path: '/account/:userId', Component: AccountPage },
          { path: '/snippet/new', Component: CreateSnippetPage },
          { path: '/snippets', Component: HomePage },
          { path: '/questions', Component: QuestionsPage },
          { path: '/question', Component: QuestionPage },
        ],
      },
    ],
  },
]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </StrictMode>,
);
