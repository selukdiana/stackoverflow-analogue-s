import {
  createAsyncThunk,
  createSlice,
  type PayloadAction,
} from '@reduxjs/toolkit';
import axios from 'axios';

import { getSnippet } from './currentSnippetSlice';

export interface User {
  id: string;
  username: string;
  role: 'user';
}

interface Mark {
  id: string;
  type: 'like' | 'dislike';
  user: User;
}

export interface Comment {
  id: string;
  content: string;
}

export interface Snippet {
  id: string;
  code: string;
  language: 'JavaScript';
  marks: Mark[];
  user: User;
  comments: Comment[];
}

export interface Meta {
  itemsPerPage: number;
  totalItems: number;
  currentPage: number;
  totalPages: number;
  sortBy: [['id' | 'code' | 'language', 'ASC' | 'DESC']];
}

export interface Links {
  first?: 'string';
  previous?: 'string';
  current?: 'string';
  next?: 'string';
  last?: 'string';
}
interface SnippetsState {
  status: 'pending' | 'fullfilled' | 'rejected';
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
  number,
  { rejectValue: unknown }
>('snippets/getAll', async (page, { rejectWithValue }) => {
  try {
    const response = await axios.get(
      `/api/snippets?page=${page}&limit=15&sortBy=id:ASC`,
    );
    const data = response.data;
    return data.data;
  } catch (err) {
    rejectWithValue(err);
  }
});

export const setSnippetMark = createAsyncThunk<
  undefined,
  { mark: 'like' | 'dislike'; id: string },
  { rejectValue: unknown }
>('snippets/setMark', async ({ mark, id }, { rejectWithValue, dispatch }) => {
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
    rejectWithValue(err);
  }
});

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
  },
});

export default snippetsSlice.reducer;
export const { setNextPage, setPrevPage } = snippetsSlice.actions;
