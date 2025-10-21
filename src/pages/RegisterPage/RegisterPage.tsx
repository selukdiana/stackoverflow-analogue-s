import { type ChangeEvent, type FormEvent, useState } from 'react';
import { Navigate } from 'react-router';

import styles from './RegisterPage.module.scss';
import { Form } from '../../components/Form';
import { Input } from '../../components/Input';
import { Button } from '../../components/Button';
import { FormLink } from '../../components/FormLink';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { registerUser } from '../../store/slices/authSlice';

export const RegisterPage = () => {
  const dispatch = useAppDispatch();

  const status = useAppSelector((state) => state.auth.status);

  const [formState, setFormState] = useState({
    username: '',
    password: '',
    confirmPassword: '',
  });

  const handleRegisterFormSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (formState.password !== formState.confirmPassword) return;
    dispatch(
      registerUser({
        username: formState.username,
        password: formState.password,
      }),
    );
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { value, name } = e.target;
    setFormState((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  return status === 'registered' ? (
    <Navigate to="/login" />
  ) : (
    <div className={styles.registerPage}>
      <Form handleFormSubmit={handleRegisterFormSubmit}>
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
        <Input
          label="Confirm password"
          type="password"
          name="confirmPassword"
          onChange={handleInputChange}
        />
        <FormLink to="/login">I&apos;ve already have an account.</FormLink>
        <Button>Register</Button>
      </Form>
    </div>
  );
};
