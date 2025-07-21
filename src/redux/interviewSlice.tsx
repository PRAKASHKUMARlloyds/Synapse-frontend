import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

interface Answer {
  question: string;
  answer: string;
}

interface Evaluation {
  score: number;
  feedback: string;
  status: 'pass' | 'fail';
}

interface InterviewState {
  answers: Answer[];
  evaluation?: Evaluation;
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
      state.evaluation = undefined;
    },
    setEvaluation(state, action: PayloadAction<Evaluation>) {
      state.evaluation = action.payload;
    }
  },
});

export const { addAnswer, resetInterview, setEvaluation } = interviewSlice.actions;

export default interviewSlice.reducer;
