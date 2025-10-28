import { type FormEvent } from 'react';
import { useNavigate } from 'react-router';

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
  const navigate = useNavigate();
  const errors = useAppSelector((state) => state.auth.errors);

  const { values: registerFormState, handleChange: onRegisterFormChange } =
    useForm({
      username: '',
      password: '',
      confirmPassword: '',
    });

  const isRegisterBtnDisabled =
    !registerFormState.username ||
    !registerFormState.password ||
    !registerFormState.confirmPassword ||
    registerFormState.password !== registerFormState.confirmPassword;

  const handleRegisterFormSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (registerFormState.password !== registerFormState.confirmPassword)
      return;
    await dispatch(
      registerUser({
        username: registerFormState.username,
        password: registerFormState.password,
      }),
    );
    navigate('/login');
  };

  return (
    <div className={styles.registerPage}>
      <div className={styles.registerForm}>
        <Form handleFormSubmit={handleRegisterFormSubmit}>
          <Input
            label="Username"
            type="text"
            name="username"
            onChange={onRegisterFormChange}
            value={registerFormState.username}
            error={
              errors.find((error) => error.field === 'username')?.failures[0]
            }
          />
          <Input
            label="Password"
            type="password"
            name="password"
            onChange={onRegisterFormChange}
            value={registerFormState.password}
            error={
              errors.find((error) => error.field === 'password')?.failures[0]
            }
          />
          <Input
            label="Confirm password"
            type="password"
            name="confirmPassword"
            onChange={onRegisterFormChange}
            value={registerFormState.confirmPassword}
          />
          <FormLink to="/login">I&apos;ve already have an account.</FormLink>
          <Button disabled={isRegisterBtnDisabled}>Register</Button>
        </Form>
      </div>
    </div>
  );
};
