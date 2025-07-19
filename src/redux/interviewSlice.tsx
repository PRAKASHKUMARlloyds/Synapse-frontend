// interviewSlice.ts
import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

interface Answer {
  question: string;
  answer: string;
}

interface InterviewState {
  answers: Answer[];
}

const initialState: InterviewState = {
  answers: [],
};

const interviewSlice = createSlice({
  name: 'interview',
  initialState,
  reducers: {
    addAnswer(state, action: PayloadAction<Answer>) {
      state.answers.push(action.payload);
    },
    resetInterview(state) {
      state.answers = [];
    }
  },
});

export const { addAnswer, resetInterview } = interviewSlice.actions;

export default interviewSlice.reducer;
