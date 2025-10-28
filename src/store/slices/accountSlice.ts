import {
  createAsyncThunk,
  createSlice,
  type PayloadAction,
} from '@reduxjs/toolkit';
import { isAxiosError } from 'axios';

import type { Account, Error } from '../types';
import api from '../../api';
import { clearAuth } from './authSlice';

interface AccountState {
  isLoading: boolean;
  data?: Account;
  error: null | string;
  usernameErrors: Error[];
  passwordErrors: Error[];
}

const initialState: AccountState = {
  isLoading: false,
  error: null,
  usernameErrors: [],
  passwordErrors: [],
};

export const getUserStatistic = createAsyncThunk<
  Account,
  string,
  { rejectValue: unknown }
>('account/getUserStatistic', async (id, { rejectWithValue }) => {
  try {
    const response = await api.get(`/users/${id}/statistic`, {
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
    await api.delete(`/me`, {
      withCredentials: true,
    });
    dispatch(clearAuth());
  } catch (err) {
    return rejectWithValue(err);
  }
});

export const changeUsername = createAsyncThunk<
  undefined,
  { username: string },
  { rejectValue: Error[] | string }
>('account/changeUsername', async (userData, { rejectWithValue, dispatch }) => {
  try {
    await api.patch(`/me`, JSON.stringify(userData), {
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json',
      },
    });
    dispatch(clearAuth());
  } catch (err) {
    if (isAxiosError(err)) {
      if (err.response?.data?.errors)
        return rejectWithValue(err.response.data.errors as Error[]);
      if (err.response?.data?.message)
        return rejectWithValue(err.response.data.message as string);
    }
  }
});

export const changePassword = createAsyncThunk<
  undefined,
  { oldPassword: string; newPassword: string },
  { rejectValue: Error[] | string }
>('account/changePassword', async (userData, { rejectWithValue, dispatch }) => {
  try {
    await api.patch(`/me/password`, JSON.stringify(userData), {
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json',
      },
    });
    dispatch(clearAuth());
  } catch (err) {
    if (isAxiosError(err)) {
      if (err.response?.data?.errors)
        return rejectWithValue(err.response.data.errors as Error[]);
      if (err.response?.data?.message)
        return rejectWithValue(err.response.data.message as string);
    }
  }
});

const accountSlice = createSlice({
  name: 'account',
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder.addCase(getUserStatistic.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(
      getUserStatistic.fulfilled,
      (state, action: PayloadAction<Account>) => {
        const accountStatistic = action.payload;
        state.data = accountStatistic;
        state.isLoading = false;
      },
    );
    builder.addCase(getUserStatistic.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.error.message || null;
    });
    builder.addCase(deleteUser.fulfilled, () => initialState);
    builder.addCase(changeUsername.pending, (state) => {
      state.usernameErrors = [];
    });
    builder.addCase(changeUsername.fulfilled, () => initialState);
    builder.addCase(
      changeUsername.rejected,
      (state, action: PayloadAction<Error[] | string | undefined>) => {
        if (action.payload) {
          if (typeof action.payload === 'string') {
            state.usernameErrors = [
              {
                failures: [action.payload],
                field: 'form',
                recievedValue: '',
              },
            ];
          } else {
            state.usernameErrors = action.payload;
          }
        } else {
          state.usernameErrors = [
            {
              failures: ['An Unknown Error!'],
              field: 'form',
              recievedValue: '',
            },
          ];
        }
      },
    );
    builder.addCase(changePassword.pending, (state) => {
      state.passwordErrors = [];
    });
    builder.addCase(changePassword.fulfilled, () => initialState);
    builder.addCase(
      changePassword.rejected,
      (state, action: PayloadAction<Error[] | string | undefined>) => {
        if (action.payload) {
          if (typeof action.payload === 'string') {
            state.passwordErrors = [
              {
                failures: [action.payload],
                field: 'form',
                recievedValue: '',
              },
            ];
          } else {
            state.passwordErrors = action.payload;
          }
        } else {
          state.passwordErrors = [
            {
              failures: ['An Unknown Error!'],
              field: 'form',
              recievedValue: '',
            },
          ];
        }
      },
    );
  },
});

export default accountSlice.reducer;
