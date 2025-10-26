import {
  createAsyncThunk,
  createSlice,
  type PayloadAction,
} from '@reduxjs/toolkit';
import axios, { isAxiosError } from 'axios';

import type { AuthStatus, User, Error } from '../types';
import { resetStore } from '../rootReducer';

interface AuthState {
  status: AuthStatus;
  user?: User;
  errors: Error[];
}

const initialState: AuthState = {
  status: 'unauthorized',
  errors: [],
};

export const checkAuth = createAsyncThunk<
  User,
  undefined,
  { rejectValue: unknown }
>('auth/checkAuth', async (_, { rejectWithValue }) => {
  try {
    const response = await axios.get('/api/me', {
      withCredentials: true,
    });
    return response.data.data;
  } catch (err) {
    return rejectWithValue(err);
  }
});

export const loginUser = createAsyncThunk<
  User,
  {
    username: string;
    password: string;
  },
  { rejectValue: string }
>('auth/loginUser', async (userData, { rejectWithValue }) => {
  try {
    const response = await axios.post(
      '/api/auth/login',
      JSON.stringify(userData),
      {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );
    return response.data.data;
  } catch (err) {
    if (isAxiosError(err) && err.response?.data?.message) {
      return rejectWithValue(err.response?.data?.message);
    }
  }
});

export const registerUser = createAsyncThunk<
  User,
  {
    username: string;
    password: string;
  },
  { rejectValue: Error[] }
>('auth/registerUser', async (userData, { rejectWithValue }) => {
  try {
    const response = await axios.post(
      '/api/register',
      JSON.stringify(userData),
      {
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );
    const data = response.data;
    return data;
  } catch (err) {
    if (isAxiosError(err) && err.response?.data?.errors) {
      return rejectWithValue(err.response.data.errors as Error[]);
    }
  }
});

export const logoutUser = createAsyncThunk<
  undefined,
  undefined,
  { rejectValue: unknown }
>('auth/logoutUser', async (_, { rejectWithValue, dispatch }) => {
  try {
    await axios.post('/api/auth/logout', {
      withCredentials: true,
    });
    dispatch(resetStore());
  } catch (err) {
    return rejectWithValue(err);
  }
});

const authSlice = createSlice({
  name: 'auth',
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(loginUser.pending, (state) => {
      state.status = 'pending';
      state.errors = [];
    });
    builder.addCase(
      loginUser.fulfilled,
      (state, action: PayloadAction<User>) => {
        const user = action.payload;
        state.status = 'authorized';
        state.user = user;
        state.errors = [];
      },
    );
    builder.addCase(
      loginUser.rejected,
      (state, action: PayloadAction<string | undefined>) => {
        state.status = 'unauthorized';
        if (action.payload) {
          state.errors = [
            { field: '', recievedValue: '', failures: [action.payload] },
          ];
        }
      },
    );
    builder.addCase(registerUser.pending, (state) => {
      state.status = 'pending';
      state.errors = [];
    });
    builder.addCase(registerUser.fulfilled, (state) => {
      state.status = 'registered';
      state.errors = [];
    });
    builder.addCase(
      registerUser.rejected,
      (state, action: PayloadAction<Error[] | undefined>) => {
        state.status = 'unauthorized';
        state.status = 'unauthorized';
        if (action.payload) {
          state.errors = action.payload;
        }
      },
    );
    builder.addCase(logoutUser.fulfilled, () => initialState);
    builder.addCase(
      checkAuth.fulfilled,
      (state, action: PayloadAction<User>) => {
        const user = action.payload;
        state.status = 'authorized';
        state.user = user;
        state.errors = [];
      },
    );
    builder.addCase(checkAuth.rejected, () => initialState);
  },
});

export default authSlice.reducer;
