import {
  createAsyncThunk,
  createSlice,
  type PayloadAction,
} from '@reduxjs/toolkit';
import axios from 'axios';

import type { Links, LoadingStatus, Meta, User } from '../types';

interface UsersState {
  data: User[];
  status: LoadingStatus;
  currentPage: number;
  totalPages: number;
}

interface UsersResponse {
  data: User[];
  links: Links;
  meta: Meta;
}
const initialState: UsersState = {
  data: [],
  status: 'pending',
  currentPage: 1,
  totalPages: 1,
};

export const getUsers = createAsyncThunk<
  UsersResponse,
  number,
  { rejectValue: unknown }
>('users/getUsers', async (page, { rejectWithValue }) => {
  try {
    const response = await axios.get(
      `/api/users?page=${page}&limit=15&sortBy=id:ASC`,
      {
        withCredentials: true,
      },
    );
    const data = response.data;
    return data.data;
  } catch (err) {
    rejectWithValue(err);
  }
});

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder.addCase(
      getUsers.fulfilled,
      (state, action: PayloadAction<UsersResponse>) => {
        const { data, meta } = action.payload;
        state.status = 'fullfilled';
        state.data = data;
        state.currentPage = meta.currentPage;
        state.totalPages = meta.totalPages;
      },
    );
  },
});

export default usersSlice.reducer;
