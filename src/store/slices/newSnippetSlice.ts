import {
  createAsyncThunk,
  createSlice,
  type PayloadAction,
} from '@reduxjs/toolkit';

import type { Snippet } from '../types';
import api from '../../api';

interface NewSnippetState {
  languages: string[];
}

const initialState: NewSnippetState = {
  languages: [],
};

export const getLanguages = createAsyncThunk<
  string[],
  undefined,
  { rejectValue: unknown }
>('newSnippet/geLanguages', async (_, { rejectWithValue }) => {
  try {
    const response = await api.get(`/snippets/languages`, {
      withCredentials: true,
    });
    const data = response.data;
    return data.data;
  } catch (err) {
    rejectWithValue(err);
  }
});

export const createSnippet = createAsyncThunk<
  Snippet,
  {
    code: string;
    language: string;
  },
  { rejectValue: unknown }
>('newSnippet/create', async (snippetData, { rejectWithValue }) => {
  try {
    const response = await api.post(`/snippets`, JSON.stringify(snippetData), {
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const data = response.data;
    return data.data;
  } catch (err) {
    rejectWithValue(err);
  }
});

const newSnippetSlice = createSlice({
  name: 'newSnippet',
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder.addCase(
      getLanguages.fulfilled,
      (state, action: PayloadAction<string[]>) => {
        const languagesArr = action.payload;
        state.languages = languagesArr;
      },
    );
    builder.addCase(createSnippet.fulfilled, () => {});
  },
});

export default newSnippetSlice.reducer;
