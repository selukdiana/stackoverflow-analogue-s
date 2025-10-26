import {
  createAction,
  createAsyncThunk,
  type ActionReducerMapBuilder,
  type Draft,
  type PayloadAction,
} from '@reduxjs/toolkit';
import axios from 'axios';

import type { User, Mark, Snippet } from '../types';
import type { RootState } from '..';

export interface OptimisticPayload {
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
  void,
  { mark: 'like' | 'dislike'; id: string },
  { rejectValue: unknown }
>(
  'snippets/setMark',
  async ({ mark, id }, { dispatch, getState, rejectWithValue }) => {
    const user = (getState() as RootState).auth.user;
    if (!user) return rejectWithValue('Not authorized');
    const allSnips = (getState() as RootState).snippets.data;
    const currentSnip = (getState() as RootState).currentSnippet.snippet;
    const snippet =
      allSnips.find((s) => s.id === id) ??
      (currentSnip.id === id ? currentSnip : undefined);
    if (!snippet) return rejectWithValue('Snippet not found');
    const previousMark =
      snippet.marks.find((m) => m.user.id === user.id) ?? null;
    const payload: OptimisticPayload = { id, mark, user, previousMark };
    dispatch(optimisticMark(payload));
    try {
      await axios.post(`/api/snippets/${id}/mark`, JSON.stringify({ mark }), {
        withCredentials: true,
        headers: { 'Content-Type': 'application/json' },
      });
    } catch (err) {
      dispatch(undoOptimisticMark(payload));
      return rejectWithValue(err);
    }
  },
);

export function addMarkReducers<S>(
  builder: ActionReducerMapBuilder<S>,
  getSnippetList: (state: Draft<S>) => Snippet[] | null,
  getSingleSnippet: (state: Draft<S>) => Snippet | null,
) {
  builder
    .addCase(
      optimisticMark,
      (state: Draft<S>, action: PayloadAction<OptimisticPayload>) => {
        const { id, mark, user } = action.payload;
        const list = getSnippetList(state);
        const single = getSingleSnippet(state);
        const target =
          list?.find((s) => s.id === id) ??
          (single && single.id === id ? single : undefined);
        if (!target) return;
        const filtered = target.marks.filter((m) => m.user.id !== user.id);
        filtered.push({ type: mark, user, id: '' });
        target.marks = filtered;
      },
    )
    .addCase(
      undoOptimisticMark,
      (state: Draft<S>, action: PayloadAction<OptimisticPayload>) => {
        const { id, previousMark, user, mark } = action.payload;
        const list = getSnippetList(state);
        const single = getSingleSnippet(state);
        const target =
          list?.find((s) => s.id === id) ??
          (single && single.id === id ? single : undefined);
        if (!target) return;
        if (previousMark) {
          const filtered = target.marks.filter((m) => m.user.id !== user.id);
          filtered.push(previousMark);
          target.marks = filtered;
        } else {
          target.marks = target.marks.filter(
            (m) => !(m.user.id === user.id && m.type === mark),
          );
        }
      },
    );
}
