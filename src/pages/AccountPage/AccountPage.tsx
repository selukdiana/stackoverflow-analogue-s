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
import { resetStore } from '../../store/rootReducer';
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

  const { status, data: accountInfo } = useAppSelector(
    (state) => state.account,
  );

  const handleChangeUsernameClick = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await dispatch(changeUsername(newUsername));
    dispatch(resetStore());
  };

  const handleChangePasswordClick = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (pwd.newPassword !== pwd.confirmNewPassword) return;
    await dispatch(
      changePassword({
        oldPassword: pwd.oldPassword,
        newPassword: pwd.newPassword,
      }),
    );
    dispatch(resetStore());
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
          ></Input>
          <Button>Change username</Button>
        </Form>
        <Form handleFormSubmit={handleChangePasswordClick}>
          <Input
            label="Old password:"
            type="password"
            name="oldPassword"
            value={pwd.oldPassword}
            onChange={onPwdChange}
          />
          <Input
            label="New password:"
            type="password"
            name="newPassword"
            value={pwd.newPassword}
            onChange={onPwdChange}
          />
          <Input
            label="Confirm password:"
            type="password"
            name="confirmNewPassword"
            value={pwd.confirmNewPassword}
            onChange={onPwdChange}
          />
          <Button>Change password</Button>
        </Form>
      </div>
    </>
  );
};
