import {
  createAsyncThunk,
  createSlice,
  type PayloadAction,
} from '@reduxjs/toolkit';

import type { Links, Meta, Snippet } from '../types';
import { addMarkReducers } from './snippetMarks';
import api from '../../api';

interface SnippetsState {
  isLoading: boolean;
  error: null | string;
  data: Snippet[];
  currentPage: number;
  totalPages: number;
}

const initialState: SnippetsState = {
  data: [],
  isLoading: false,
  error: null,
  currentPage: 1,
  totalPages: 1,
};

interface SnippetsResponse extends SnippetsState {
  meta: Meta;
  links: Links;
}

export const getAllSnippets = createAsyncThunk<
  SnippetsResponse,
  { page: number; userId: string | null },
  { rejectValue: unknown }
>('snippets/getAll', async ({ page, userId }, { rejectWithValue }) => {
  try {
    const response = await api.get(
      `/snippets?page=${page}&limit=15&sortBy=id:ASC${userId ? '&userId=' + userId : ''}`,
    );
    const data = response.data;
    return data.data;
  } catch (e) {
    return rejectWithValue(e);
  }
});

const snippetsSlice = createSlice({
  name: 'snippets',
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder.addCase(getAllSnippets.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });

    builder.addCase(
      getAllSnippets.fulfilled,
      (state, action: PayloadAction<SnippetsResponse>) => {
        const { data, meta } = action.payload;
        state.isLoading = false;
        state.data = data;
        state.currentPage = meta.currentPage;
        state.totalPages = meta.totalPages;
      },
    );
    builder.addCase(getAllSnippets.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.error.message || 'Error';
    });
    addMarkReducers(
      builder,
      (state) => state.data,
      (_) => null,
    );
  },
});

export default snippetsSlice.reducer;
