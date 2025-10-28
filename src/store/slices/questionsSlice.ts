import {
  createAsyncThunk,
  createSlice,
  type PayloadAction,
} from '@reduxjs/toolkit';

import type { Links, Meta, Question } from '../types';
import api from '../../api';

interface QuestionsState {
  isLoading: boolean;
  error: null | string;
  currentPage: number;
  totalPages: number;
  data: Question[];
}

interface QuestionsResponse {
  data: Question[];
  links: Links;
  meta: Meta;
}
const initialState: QuestionsState = {
  data: [],
  isLoading: false,
  error: null,
  currentPage: 1,
  totalPages: 1,
};

export const getQuestions = createAsyncThunk<
  QuestionsResponse,
  number,
  { rejectValue: unknown }
>('questions/getQuestions', async (page, { rejectWithValue }) => {
  try {
    const response = await api.get(
      `/questions?page=${page}&limit=15&sortBy=id:DESC`,
      {
        withCredentials: true,
      },
    );
    const data = response.data;
    return data.data;
  } catch (err) {
    rejectWithValue(err);
  }
});

const questionsSlice = createSlice({
  name: 'questions',
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder.addCase(getQuestions.pending, (state) => {
      state.error = null;
      state.isLoading = true;
    });
    builder.addCase(
      getQuestions.fulfilled,
      (state, action: PayloadAction<QuestionsResponse>) => {
        const { data, meta } = action.payload;
        state.isLoading = false;
        state.data = data;
        state.currentPage = meta.currentPage;
        state.totalPages = meta.totalPages;
      },
    );
    builder.addCase(getQuestions.rejected, (state, action) => {
      state.error = action.error.message || null;
      state.isLoading = false;
    });
  },
});

export default questionsSlice.reducer;
