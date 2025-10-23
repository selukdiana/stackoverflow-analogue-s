import { type FormEvent } from 'react';
import { Navigate } from 'react-router';

import styles from './LoginPage.module.scss';
import { Form } from '../../components/Form';
import { Input } from '../../components/Input';
import { Button } from '../../components/Button';
import { FormLink } from '../../components/FormLink';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { loginUser } from '../../store/slices/authSlice';
import { useForm } from '../../hooks';

export const LoginPage = () => {
  const dispatch = useAppDispatch();

  const { values: loginFormState, handleChange: onLoginFormChange } = useForm({
    username: '',
    password: '',
  });

  const status = useAppSelector((state) => state.auth.status);

  const handleLoginFormSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    dispatch(loginUser(loginFormState));
  };

  return status === 'authorized' ? (
    <Navigate to="/" />
  ) : (
    <div className={styles.loginPage}>
      <div className={styles.loginForm}>
        <Form handleFormSubmit={handleLoginFormSubmit}>
          <Input
            label="Username"
            type="text"
            name="username"
            onChange={onLoginFormChange}
            value={loginFormState.username}
          />
          <Input
            label="Password"
            type="password"
            name="password"
            onChange={onLoginFormChange}
            value={loginFormState.password}
          />
          <FormLink to="/register">I don&apos;t have an account.</FormLink>
          <Button>Login</Button>
        </Form>
      </div>
    </div>
  );
};
