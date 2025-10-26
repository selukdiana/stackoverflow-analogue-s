import { useParams } from 'react-router';
import { useEffect, type FormEvent } from 'react';

import { useAppDispatch, useAppSelector } from '../../store/hooks';
import {
  changePassword,
  changeUsername,
  getUserStatistic,
} from '../../store/slices/accountSlice';
import styles from './AccountPage.module.scss';
import { Form } from '../../components/Form';
import { Input } from '../../components/Input';
import { Button } from '../../components/Button';
import { useForm } from '../../hooks';
import { UserInfo } from '../../components/UserInfo';

export const AccountPage = () => {
  const dispatch = useAppDispatch();
  const { userId } = useParams();
  const { values: pwd, handleChange: onPwdChange } = useForm({
    oldPassword: '',
    newPassword: '',
    confirmNewPassword: '',
  });

  const { values: newUsername, handleChange: onUsernameChange } = useForm({
    username: '',
  });

  const {
    status,
    data: accountInfo,
    errors,
  } = useAppSelector((state) => state.account);

  const isChangePasswordBtnDisabled =
    !pwd.oldPassword ||
    !pwd.newPassword ||
    !pwd.confirmNewPassword ||
    pwd.newPassword !== pwd.confirmNewPassword;

  const isChangeUsernameBtnDisabled = !newUsername.username;

  const handleChangeUsernameClick = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    dispatch(changeUsername(newUsername));
  };

  const handleChangePasswordClick = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (pwd.newPassword !== pwd.confirmNewPassword) return;
    dispatch(
      changePassword({
        oldPassword: pwd.oldPassword,
        newPassword: pwd.newPassword,
      }),
    );
  };

  useEffect(() => {
    if (!userId) return;
    dispatch(getUserStatistic(userId));
  }, [userId, dispatch]);

  if (status === 'pending') return 'Loading...';
  if (status === 'rejected') return 'Error';
  return (
    <>
      <h3 className={styles.username}>
        Welcome, <span>{accountInfo.username}</span>
      </h3>
      <UserInfo {...accountInfo} />
      <div className={styles.accountForms}>
        <Form handleFormSubmit={handleChangeUsernameClick}>
          <Input
            label="Change your username:"
            type="text"
            name="username"
            onChange={onUsernameChange}
            value={newUsername.username}
            error={
              errors.find((error) => error.field === 'username')?.failures[0]
            }
          ></Input>
          <Button disabled={isChangeUsernameBtnDisabled}>
            Change username
          </Button>
        </Form>
        <Form handleFormSubmit={handleChangePasswordClick}>
          <Input
            label="Old password:"
            type="password"
            name="oldPassword"
            value={pwd.oldPassword}
            onChange={onPwdChange}
            error={
              errors.find((error) => error.field === 'oldPassword')?.failures[0]
            }
          />
          <Input
            label="New password:"
            type="password"
            name="newPassword"
            value={pwd.newPassword}
            onChange={onPwdChange}
            error={
              errors.find((error) => error.field === 'newPassword')?.failures[0]
            }
          />
          <Input
            label="Confirm password:"
            type="password"
            name="confirmNewPassword"
            value={pwd.confirmNewPassword}
            onChange={onPwdChange}
          />
          <Button disabled={isChangePasswordBtnDisabled}>
            Change password
          </Button>
        </Form>
      </div>
    </>
  );
};
