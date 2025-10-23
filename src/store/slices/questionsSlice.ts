import {
  createAsyncThunk,
  createSlice,
  type PayloadAction,
} from '@reduxjs/toolkit';
import axios from 'axios';

import type { Links, LoadingStatus, Meta, Question } from '../types';

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
>('questions/geQuestions', async (page, { rejectWithValue }) => {
  try {
    const response = await axios.get(
      `/api/questions?page=${page}&limit=15&sortBy=id:ASC`,
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
