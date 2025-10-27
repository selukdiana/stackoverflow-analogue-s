import {
  createAsyncThunk,
  createSlice,
  type PayloadAction,
} from '@reduxjs/toolkit';
import axios from 'axios';

import type { Question } from '../types';

type CurrentQuestionState = Pick<
  Question,
  'title' | 'description' | 'attachedCode'
>;

const initialState: CurrentQuestionState = {
  title: '',
  description: '',
  attachedCode: '',
};

export const getQuestion = createAsyncThunk<
  Question,
  string,
  { rejectValue: unknown }
>('currentQuestion/getQuestion', async (id, { rejectWithValue }) => {
  try {
    const response = await axios.get(`/api/questions/${id}`, {
      withCredentials: true,
    });
    const data = response.data;
    return data.data;
  } catch (err) {
    rejectWithValue(err);
  }
});

export const createQuestion = createAsyncThunk<
  CurrentQuestionState,
  CurrentQuestionState,
  { rejectValue: unknown }
>('currentQuestion/createQuestion', async (question, { rejectWithValue }) => {
  try {
    const response = await axios.post(
      `/api/questions`,
      JSON.stringify(question),
      {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );
    const data = response.data;
    return data.data;
  } catch (err) {
    rejectWithValue(err);
  }
});

export const editQuestion = createAsyncThunk<
  Question,
  { question: CurrentQuestionState; id: string },
  { rejectValue: unknown }
>(
  'currentQuestion/editQuestion',
  async ({ question, id }, { rejectWithValue }) => {
    try {
      const response = await axios.patch(
        `/api/questions/${id}`,
        JSON.stringify(question),
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );
      const data = response.data;
      return data.data;
    } catch (err) {
      rejectWithValue(err);
    }
  },
);

const currentQuestionSlice = createSlice({
  name: 'currentQuestion',
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder.addCase(
      getQuestion.fulfilled,
      (state, action: PayloadAction<Question>) => {
        const { title, description, attachedCode } = action.payload;
        state.title = title;
        state.description = description;
        state.attachedCode = attachedCode;
      },
    );
  },
});

export default currentQuestionSlice.reducer;
