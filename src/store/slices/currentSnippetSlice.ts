import {
  createAsyncThunk,
  createSlice,
  type PayloadAction,
} from '@reduxjs/toolkit';
import axios from 'axios';

import type { Snippet } from './snippetsSlice';

interface CurrentSnippet {
  status: 'pending' | 'fullfilled' | 'rejected';
  snippet: Snippet;
}
const initialState: CurrentSnippet = {
  snippet: {
    id: '',
    code: '',
    language: 'JavaScript',
    marks: [],
    user: { id: '', username: '', role: 'user' },
    comments: [],
  },
  status: 'pending',
};

export const getSnippet = createAsyncThunk<
  Snippet,
  string,
  { rejectValue: unknown }
>('snippets/getSnippet', async (id, { rejectWithValue }) => {
  try {
    const response = await axios.get(`/api/snippets/${id}`);
    const data = response.data;
    return data.data;
  } catch (err) {
    rejectWithValue(err);
  }
});

const currentSnippetSlice = createSlice({
  name: 'currentSnippet',
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder.addCase(getSnippet.pending, (state) => {
      state.status = 'pending';
      state.snippet = initialState.snippet;
    });

    builder.addCase(
      getSnippet.fulfilled,
      (state, action: PayloadAction<Snippet>) => {
        const snippet = action.payload;
        state.status = 'fullfilled';
        state.snippet = snippet;
      },
    );
    builder.addCase(getSnippet.rejected, (state) => {
      state.status = 'rejected';
      state.snippet = initialState.snippet;
    });
  },
});

export default currentSnippetSlice.reducer;
