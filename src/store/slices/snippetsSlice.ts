import {
  createAction,
  createAsyncThunk,
  createSlice,
  type PayloadAction,
} from '@reduxjs/toolkit';
import axios from 'axios';

import { getSnippet } from './currentSnippetSlice';
import type { Links, LoadingStatus, Meta, Snippet, User } from '../types';
import type { RootState } from '..';

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
    const response = await axios.get(
      `/api/snippets?page=${page}&limit=15&sortBy=id:ASC${userId ? '&userId=' + userId : ''}`,
    );
    const data = response.data;
    return data.data;
  } catch (err) {
    rejectWithValue(err);
  }
});

export const optimisticMark = createAction<{
  id: string;
  mark: 'like' | 'dislike';
  user: User | undefined;
}>('snippets/optimisticMark');

export const setSnippetMark = createAsyncThunk<
  undefined,
  { mark: 'like' | 'dislike'; id: string },
  { rejectValue: unknown }
>(
  'snippets/setMark',
  async ({ mark, id }, { rejectWithValue, dispatch, getState }) => {
    const user = (getState() as RootState).auth.user;
    if (!user) rejectWithValue('Not authorized!');
    dispatch(optimisticMark({ mark, id, user }));
    try {
      const response = await axios.post(
        `/api/snippets/${id}/mark`,
        JSON.stringify({ mark }),
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );
      const data = response.data;
      dispatch(getSnippet(id));
      return data;
    } catch (err) {
      dispatch(getSnippet(id));
      rejectWithValue(err);
    }
  },
);

const snippetsSlice = createSlice({
  name: 'snippets',
  initialState,
  reducers: {
    setNextPage(state) {
      state.currentPage++;
    },
    setPrevPage(state) {
      state.currentPage--;
    },
  },
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
    builder.addCase(
      getSnippet.fulfilled,
      (state, action: PayloadAction<Snippet>) => {
        const snippet = action.payload;
        state.data = state.data.map((item) => {
          if (item.id === snippet.id) return snippet;
          return item;
        });
      },
    );
    builder.addCase(optimisticMark, (state, action) => {
      const { id, mark, user } = action.payload;
      const snippet = state.data.find((s) => s.id === id);
      if (!snippet || !user) return;
      const existingMarks = snippet.marks.filter((m) => m.user.id !== user.id);
      existingMarks.push({ type: mark, user, id: '' });
      snippet.marks = existingMarks;
    });
  },
});

export default snippetsSlice.reducer;
export const { setNextPage, setPrevPage } = snippetsSlice.actions;
