import {
  createAsyncThunk,
  createSlice,
  type PayloadAction,
} from '@reduxjs/toolkit';
import axios, { isAxiosError } from 'axios';

import type { Account, LoadingStatus, Error } from '../types';
import { resetStore } from '../appActions';

interface AccountState {
  status: LoadingStatus;
  data: Account;
  errors: Error[];
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
  errors: [],
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
>('account/deleteUser', async (_, { rejectWithValue, dispatch }) => {
  try {
    await axios.delete(`/api/me`, {
      withCredentials: true,
    });
    dispatch(resetStore());
  } catch (err) {
    return rejectWithValue(err);
  }
});

export const changeUsername = createAsyncThunk<
  undefined,
  { username: string },
  { rejectValue: Error[] }
>('account/changeUsername', async (userData, { rejectWithValue, dispatch }) => {
  try {
    await axios.patch(`/api/me`, JSON.stringify(userData), {
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json',
      },
    });
    dispatch(resetStore());
  } catch (err) {
    if (isAxiosError(err) && err.response?.data?.errors) {
      return rejectWithValue(err.response.data.errors);
    }
  }
});

export const changePassword = createAsyncThunk<
  undefined,
  { oldPassword: string; newPassword: string },
  { rejectValue: Error[] | string }
>('account/changePassword', async (userData, { rejectWithValue, dispatch }) => {
  try {
    await axios.patch(`/api/me/password`, JSON.stringify(userData), {
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json',
      },
    });
    dispatch(resetStore());
  } catch (err) {
    if (isAxiosError(err) && err.response?.data?.errors) {
      return rejectWithValue(err.response.data.errors);
    } else if (isAxiosError(err) && err.response?.data?.message) {
      return rejectWithValue(err.response.data.message);
    }
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
    builder.addCase(changeUsername.pending, (state) => {
      state.errors = [];
    });
    builder.addCase(
      changeUsername.rejected,
      (state, action: PayloadAction<Error[] | undefined>) => {
        if (action.payload) {
          state.errors = action.payload;
        }
      },
    );
    builder.addCase(changePassword.pending, (state) => {
      state.errors = [];
    });
    builder.addCase(
      changePassword.rejected,
      (state, action: PayloadAction<Error[] | string | undefined>) => {
        if (action.payload) {
          if (typeof action.payload === 'string') {
            state.errors = [
              {
                failures: [action.payload],
                field: 'oldPassword',
                recievedValue: '',
              },
            ];
          } else {
            state.errors = action.payload;
          }
        }
      },
    );
  },
});

export default accountSlice.reducer;
