import {
  createAsyncThunk,
  createSlice,
  type PayloadAction,
} from '@reduxjs/toolkit';

import type { Links, LoadingStatus, Meta, Question } from '../types';
import api from '../../api';

interface QuestionsState {
  status: LoadingStatus;
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
  status: 'pending',
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
    builder.addCase(
      getQuestions.fulfilled,
      (state, action: PayloadAction<QuestionsResponse>) => {
        const { data, meta } = action.payload;
        state.status = 'fullfilled';
        state.data = data;
        state.currentPage = meta.currentPage;
        state.totalPages = meta.totalPages;
      },
    );
  },
});

export default questionsSlice.reducer;
