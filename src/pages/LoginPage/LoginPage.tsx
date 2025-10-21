import React, { type ChangeEvent, type FormEvent, useState } from 'react';
import { Navigate } from 'react-router';

import styles from './LoginPage.module.scss';
import { Form } from '../../components/Form';
import { Input } from '../../components/Input';
import { Button } from '../../components/Button';
import { FormLink } from '../../components/FormLink';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { loginUser } from '../../store/slices/authSlice';

export const LoginPage = () => {
  const dispatch = useAppDispatch();

  const [formState, setFormState] = useState({
    username: 'qwertyQWERTY',
    password: 'qwertyQWERTY123!',
  });

  const status = useAppSelector((state) => state.auth.status);

  const handleLoginFormSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    dispatch(loginUser(formState));
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { value, name } = e.target;
    setFormState((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  return status === 'authorized' ? (
    <Navigate to="/" />
  ) : (
    <div className={styles.loginPage}>
      <Form handleFormSubmit={handleLoginFormSubmit}>
        <Input
          label="Username"
          type="text"
          name="username"
          onChange={handleInputChange}
        />
        <Input
          label="Password"
          type="password"
          name="password"
          onChange={handleInputChange}
        />
        <FormLink to="/register">I don&apos;t have an account.</FormLink>
        <Button>Login</Button>
      </Form>
    </div>
  );
};
