import {
  createAsyncThunk,
  createSlice,
  type PayloadAction,
} from '@reduxjs/toolkit';

import type { Links, Meta, User } from '../types';
import api from '../../api';

interface UsersState {
  data: User[];
  isLoading: boolean;
  error: null | string;
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
  isLoading: false,
  error: null,
  currentPage: 1,
  totalPages: 1,
};

export const getUsers = createAsyncThunk<
  UsersResponse,
  number,
  { rejectValue: unknown }
>('users/getUsers', async (page, { rejectWithValue }) => {
  try {
    const response = await api.get(
      `/users?page=${page}&limit=15&sortBy=id:ASC`,
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
    builder.addCase(getUsers.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(
      getUsers.fulfilled,
      (state, action: PayloadAction<UsersResponse>) => {
        const { data, meta } = action.payload;
        state.isLoading = false;
        state.data = data;
        state.currentPage = meta.currentPage;
        state.totalPages = meta.totalPages;
      },
    );
    builder.addCase(getUsers.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.error.message || null;
    });
  },
});

export default usersSlice.reducer;
