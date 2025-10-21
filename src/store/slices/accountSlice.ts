import {
  createAsyncThunk,
  createSlice,
  type PayloadAction,
} from '@reduxjs/toolkit';
import axios from 'axios';

import type { Account, LoadingStatus } from '../types';

interface AccountState {
  status: LoadingStatus;
  data?: Account;
}

const initialState: AccountState = {
  status: 'pending',
};

export const getUserStatistic = createAsyncThunk<
  Account,
  string,
  { rejectValue: unknown }
>('auth/getUserStatistic', async (id, { rejectWithValue }) => {
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
  },
});

export default accountSlice.reducer;
