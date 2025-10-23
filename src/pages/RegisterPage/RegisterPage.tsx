import { type FormEvent } from 'react';
import { Navigate } from 'react-router';

import styles from './RegisterPage.module.scss';
import { Form } from '../../components/Form';
import { Input } from '../../components/Input';
import { Button } from '../../components/Button';
import { FormLink } from '../../components/FormLink';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { registerUser } from '../../store/slices/authSlice';
import { useForm } from '../../hooks';

export const RegisterPage = () => {
  const dispatch = useAppDispatch();

  const status = useAppSelector((state) => state.auth.status);

  const { values: registerFormState, handleChange: onRegisterFormChange } =
    useForm({
      username: '',
      password: '',
      confirmPassword: '',
    });

  const handleRegisterFormSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (registerFormState.password !== registerFormState.confirmPassword)
      return;
    dispatch(
      registerUser({
        username: registerFormState.username,
        password: registerFormState.password,
      }),
    );
  };

  return status === 'registered' ? (
    <Navigate to="/login" />
  ) : (
    <div className={styles.registerPage}>
      <div className={styles.registerForm}>
        <Form handleFormSubmit={handleRegisterFormSubmit}>
          <Input
            label="Username"
            type="text"
            name="username"
            onChange={onRegisterFormChange}
            value={registerFormState.username}
          />
          <Input
            label="Password"
            type="password"
            name="password"
            onChange={onRegisterFormChange}
            value={registerFormState.password}
          />
          <Input
            label="Confirm password"
            type="password"
            name="confirmPassword"
            onChange={onRegisterFormChange}
            value={registerFormState.confirmPassword}
          />
          <FormLink to="/login">I&apos;ve already have an account.</FormLink>
          <Button>Register</Button>
        </Form>
      </div>
    </div>
  );
};
