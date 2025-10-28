import {
  createAsyncThunk,
  createSlice,
  type PayloadAction,
} from '@reduxjs/toolkit';

import type { Links, LoadingStatus, Meta, Snippet } from '../types';
import { addMarkReducers } from './snippetMarks';
import api from '../../api';

interface SnippetsState {
  status: LoadingStatus;
  data: Snippet[];
  currentPage: number;
  totalPages: number;
}

const initialState: SnippetsState = {
  data: [],
  status: 'fullfilled',
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
  } catch (err) {
    rejectWithValue(err);
  }
});

const snippetsSlice = createSlice({
  name: 'snippets',
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder.addCase(getAllSnippets.pending, (state) => {
      state.status = 'pending';
    });

    builder.addCase(
      getAllSnippets.fulfilled,
      (state, action: PayloadAction<SnippetsResponse>) => {
        const { data, meta } = action.payload;
        state.status = 'fullfilled';
        state.data = data;
        state.currentPage = meta.currentPage;
        state.totalPages = meta.totalPages;
      },
    );
    builder.addCase(getAllSnippets.rejected, (state) => {
      state.status = 'rejected';
      state.data = [];
    });
    addMarkReducers(
      builder,
      (state) => state.data,
      (_) => null,
    );
  },
});

export default snippetsSlice.reducer;
