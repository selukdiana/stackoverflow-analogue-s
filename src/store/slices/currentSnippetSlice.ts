import {
  createAsyncThunk,
  createSlice,
  type PayloadAction,
} from '@reduxjs/toolkit';
import axios from 'axios';

import type { RootState } from '..';
import type { LoadingStatus, Snippet, Comment } from '../types';
import socket from '../../socket';

interface CurrentSnippet {
  status: LoadingStatus;
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
>('currentSnippet/getSnippet', async (id, { rejectWithValue }) => {
  try {
    const response = await axios.get(`/api/snippets/${id}`);
    const data = response.data;
    return data.data;
  } catch (err) {
    rejectWithValue(err);
  }
});

export const sendComment = createAsyncThunk<
  Comment,
  string,
  { rejectValue: unknown }
>(
  'currentSnippet/sendComment',
  async (newCommentContent, { rejectWithValue, getState }) => {
    const snippetId = (getState() as RootState).currentSnippet.snippet.id;
    try {
      const response = await axios.post(
        `/api/comments`,
        JSON.stringify({
          snippetId,
          content: newCommentContent,
        }),
        {
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );
      const data = response.data;
      const comment = data.data as Comment;
      socket.emit('newComment', comment);
      return data.data;
    } catch (err) {
      rejectWithValue(err);
    }
  },
);

const currentSnippetSlice = createSlice({
  name: 'currentSnippet',
  initialState,
  reducers: {
    addComment(state, action: PayloadAction<Comment>) {
      const newComment = action.payload;
      state.snippet.comments.push(newComment);
    },
  },
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
export const { addComment } = currentSnippetSlice.actions;
