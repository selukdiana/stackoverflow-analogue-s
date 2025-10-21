import { useParams } from 'react-router';
import { useEffect, type FormEvent } from 'react';
import { FaRegTrashAlt } from 'react-icons/fa';

import { useAppDispatch, useAppSelector } from '../../store/hooks';
import {
  changePassword,
  changeUsername,
  deleteUser,
  getUserStatistic,
} from '../../store/slices/accountSlice';
import styles from './AccountPage.module.scss';
import { StatisticItem } from '../../components/StatisticItem';
import { Form } from '../../components/Form';
import { Input } from '../../components/Input';
import { Button } from '../../components/Button';
import { resetStore } from '../../store/rootReducer';
import { useForm } from '../../hooks';

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
  const { username, role, statistic } = accountInfo || {};

  const handleDeleteAccountClick = () => {
    dispatch(deleteUser()).then(() => {
      dispatch(resetStore());
    });
  };

  const handleChangeUsernameClick = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    dispatch(changeUsername(newUsername)).then(() => {
      dispatch(resetStore());
    });
  };

  const handleChangePasswordClick = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (pwd.newPassword !== pwd.confirmNewPassword) return;
    dispatch(
      changePassword({
        oldPassword: pwd.oldPassword,
        newPassword: pwd.newPassword,
      }),
    ).then(() => {
      dispatch(resetStore());
    });
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
        Welcome, <span>{username}</span>
      </h3>
      <div className={styles.user}>
        <div className={styles.userInfo}>
          <h4>{username}</h4>
          <span>Id: {userId}</span>
          <span>Role: {role}</span>
          <button
            className={styles.deleteBtn}
            onClick={handleDeleteAccountClick}
          >
            <FaRegTrashAlt /> DELETE
          </button>
        </div>
        <ul className={styles.userStatistic}>
          <StatisticItem label="Rating" value={statistic?.rating} />
          <StatisticItem label="Snippets" value={statistic?.snippetsCount} />
          <StatisticItem label="Comments" value={statistic?.commentsCount} />
          <StatisticItem label="Likes" value={statistic?.likesCount} />
          <StatisticItem label="Dislikes" value={statistic?.dislikesCount} />
          <StatisticItem label="Questions" value={statistic?.questionsCount} />
          <StatisticItem
            label="Correct Answers"
            value={statistic?.correctAnswersCount}
          />
          <StatisticItem
            label="Regular Answers"
            value={statistic?.regularAnswersCount}
          />
        </ul>
      </div>
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
