import {
  createAsyncThunk,
  createSlice,
  type PayloadAction,
} from '@reduxjs/toolkit';
import axios from 'axios';

import type { User } from './snippetsSlice';

interface AuthState {
  status: 'unauthorized' | 'registered' | 'authorized' | 'pending';
  user?: {
    username: string;
    id: string;
  };
}

const initialState: AuthState = {
  status: 'unauthorized',
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
  { username: string; id: string },
  {
    username: string;
    password: string;
  },
  { rejectValue: unknown }
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
    return rejectWithValue(err);
  }
});

export const registerUser = createAsyncThunk<
  {
    id: number;
    username: string;
    role: string;
  },
  {
    username: string;
    password: string;
  },
  { rejectValue: unknown }
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
    return rejectWithValue(err);
  }
});

export const logoutUser = createAsyncThunk<
  undefined,
  undefined,
  { rejectValue: unknown }
>('auth/logoutUser', async (_, { rejectWithValue }) => {
  try {
    const response = await axios.post('/api/auth/logout', {
      withCredentials: true,
    });
    const data = response.data;
    return data;
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
    });
    builder.addCase(
      loginUser.fulfilled,
      (state, action: PayloadAction<{ username: string; id: string }>) => {
        const { username, id } = action.payload;
        state.status = 'authorized';
        state.user = { username, id };
      },
    );
    builder.addCase(loginUser.rejected, (state) => {
      state.status = 'unauthorized';
    });
    builder.addCase(registerUser.pending, (state) => {
      state.status = 'pending';
    });
    builder.addCase(registerUser.fulfilled, (state) => {
      state.status = 'registered';
    });
    builder.addCase(registerUser.rejected, (state) => {
      state.status = 'unauthorized';
    });
    builder.addCase(logoutUser.fulfilled, () => initialState);
    builder.addCase(
      checkAuth.fulfilled,
      (state, action: PayloadAction<User>) => {
        const { id, username } = action.payload;
        state.status = 'authorized';
        state.user = { id, username };
      },
    );
    builder.addCase(checkAuth.rejected, () => initialState);
  },
});

export default authSlice.reducer;
