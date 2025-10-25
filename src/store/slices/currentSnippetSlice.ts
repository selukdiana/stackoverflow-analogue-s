import {
  createAction,
  createAsyncThunk,
  createSlice,
  type PayloadAction,
} from '@reduxjs/toolkit';
import axios from 'axios';

import type { RootState } from '..';
import type { LoadingStatus, Snippet, Comment, User, Mark } from '../types';
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
interface OptimisticPayload {
  id: string;
  mark: 'like' | 'dislike';
  user: User;
  previousMark: Mark | null;
}
export const optimisticMark = createAction<OptimisticPayload>(
  'snippets/optimisticMark',
);

export const undoOptimisticMark = createAction<OptimisticPayload>(
  'snippets/undoOptimisticMark',
);

export const setSnippetMark = createAsyncThunk<
  undefined,
  { mark: 'like' | 'dislike'; id: string },
  { rejectValue: unknown }
>(
  'snippets/setMark',
  async ({ mark, id }, { rejectWithValue, dispatch, getState }) => {
    const user = (getState() as RootState).auth.user;
    if (!user) return rejectWithValue('Not authorized!');

    const snippet = (getState() as RootState).currentSnippet.snippet;
    if (!snippet) return rejectWithValue('Snippet not found!');
    const previousMark =
      snippet.marks.find((m) => m.user.id === user.id) || null;
    const optimisticPayload = { mark, id, user, previousMark };
    dispatch(optimisticMark(optimisticPayload));
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
      return data;
    } catch (err) {
      dispatch(undoOptimisticMark(optimisticPayload));
      rejectWithValue(err);
    }
  },
);

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
    builder.addCase(optimisticMark, (state, action) => {
      const { mark, user } = action.payload;
      const snippet = state.snippet;
      if (!snippet || !user) return;
      const existingMarks = snippet.marks.filter((m) => m.user.id !== user.id);
      existingMarks.push({ type: mark, user, id: '' });
      snippet.marks = existingMarks;
    });
    builder.addCase(undoOptimisticMark, (state, action) => {
      const { previousMark, user } = action.payload;
      const snippet = state.snippet;
      if (!snippet || !user) return;

      if (previousMark) {
        const existingMarks = snippet.marks.filter(
          (m) => m.user.id !== user.id,
        );
        existingMarks.push(previousMark);
        snippet.marks = existingMarks;
      } else {
        snippet.marks = snippet.marks.filter(
          (m) => !(m.user.id === user.id && m.type === action.payload.mark),
        );
      }
    });
  },
});

export default currentSnippetSlice.reducer;
export const { addComment } = currentSnippetSlice.actions;
