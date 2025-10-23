import {
  createAsyncThunk,
  createSlice,
  type PayloadAction,
} from '@reduxjs/toolkit';
import axios from 'axios';

import type { Account, LoadingStatus } from '../types';

interface AccountState {
  status: LoadingStatus;
  data: Account;
}

const initialState: AccountState = {
  status: 'pending',
  data: {
    username: '',
    id: '',
    role: 'user',
    statistic: {
      snippetsCount: 0,
      rating: 0,
      commentsCount: 0,
      likesCount: 0,
      dislikesCount: 0,
      questionsCount: 0,
      correctAnswersCount: 0,
      regularAnswersCount: 0,
    },
  },
};

export const getUserStatistic = createAsyncThunk<
  Account,
  string,
  { rejectValue: unknown }
>('account/getUserStatistic', async (id, { rejectWithValue }) => {
  try {
    const response = await axios.get(`/api/users/${id}/statistic`, {
      withCredentials: true,
    });
    const data = response.data;
    return data.data;
  } catch (err) {
    return rejectWithValue(err);
  }
});

export const deleteUser = createAsyncThunk<
  undefined,
  undefined,
  { rejectValue: unknown }
>('account/deleteUser', async (_, { rejectWithValue }) => {
  try {
    const response = await axios.delete(`/api/me`, {
      withCredentials: true,
    });
    const data = response.data;
    return data.data;
  } catch (err) {
    return rejectWithValue(err);
  }
});

export const changeUsername = createAsyncThunk<
  undefined,
  { username: string },
  { rejectValue: unknown }
>('account/changeUsername', async (userData, { rejectWithValue }) => {
  try {
    const response = await axios.patch(`/api/me`, JSON.stringify(userData), {
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const data = response.data;
    return data.data;
  } catch (err) {
    return rejectWithValue(err);
  }
});

export const changePassword = createAsyncThunk<
  undefined,
  { oldPassword: string; newPassword: string },
  { rejectValue: unknown }
>('account/changePassword', async (userData, { rejectWithValue }) => {
  try {
    const response = await axios.patch(
      `/api/me/password`,
      JSON.stringify(userData),
      {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );
    const data = response.data;
    return data.data;
  } catch (err) {
    return rejectWithValue(err);
  }
});

const accountSlice = createSlice({
  name: 'account',
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder.addCase(getUserStatistic.pending, (state) => {
      state.status = 'pending';
    });
    builder.addCase(
      getUserStatistic.fulfilled,
      (state, action: PayloadAction<Account>) => {
        const accountStatistic = action.payload;
        state.data = accountStatistic;
        state.status = 'fullfilled';
      },
    );
    builder.addCase(deleteUser.fulfilled, () => initialState);
  },
});

export default accountSlice.reducer;
