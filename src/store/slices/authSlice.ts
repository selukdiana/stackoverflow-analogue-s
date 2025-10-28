import {
  createAsyncThunk,
  createSlice,
  type PayloadAction,
} from '@reduxjs/toolkit';
import { isAxiosError } from 'axios';

import type { AuthStatus, User, Error } from '../types';
import api from '../../api';

interface AuthState {
  status: AuthStatus;
  user?: User;
  errors: Error[];
}

const initialState: AuthState = {
  status: 'pending',
  errors: [],
};

export const checkAuth = createAsyncThunk<
  User,
  undefined,
  { rejectValue: unknown }
>('auth/checkAuth', async (_, { rejectWithValue }) => {
  try {
    const response = await api.get('/me', {
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
    const response = await api.post('/auth/login', JSON.stringify(userData), {
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data.data;
  } catch (err) {
    if (isAxiosError(err) && err.response?.data?.message) {
      return rejectWithValue(err.response.data.message);
    }
    if (err instanceof Error) {
      return rejectWithValue(err.message);
    }
    return rejectWithValue('An unknown error occurred.');
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
    const response = await api.post('/register', JSON.stringify(userData), {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const data = response.data.data;
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
>('auth/logoutUser', async (_, { rejectWithValue }) => {
  try {
    await api.post('/auth/logout', {
      withCredentials: true,
    });
  } catch (err) {
    return rejectWithValue(err);
  }
});

const authSlice = createSlice({
  name: 'auth',
  initialState: initialState,
  reducers: {
    clearAuth: (state) => {
      state.status = 'unauthorized';
      state.errors = [];
    },
  },
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
      state.status = 'unauthorized';
    });
    builder.addCase(
      registerUser.rejected,
      (state, action: PayloadAction<Error[] | undefined>) => {
        state.status = 'unauthorized';
        if (action.payload) {
          state.errors = action.payload;
        }
      },
    );
    builder.addCase(logoutUser.pending, (state) => {
      state.status = 'pending';
      state.errors = [];
    });
    builder.addCase(logoutUser.fulfilled, (state) => {
      state.status = 'unauthorized';
    });
    builder.addCase(checkAuth.pending, (state) => {
      state.status = 'pending';
      state.errors = [];
    });
    builder.addCase(
      checkAuth.fulfilled,
      (state, action: PayloadAction<User>) => {
        const user = action.payload;
        state.status = 'authorized';
        state.user = user;
      },
    );
    builder.addCase(checkAuth.rejected, (state) => {
      state.status = 'unauthorized';
    });
  },
});

export const { clearAuth } = authSlice.actions;
export default authSlice.reducer;
