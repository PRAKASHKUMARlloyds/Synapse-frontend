// src/redux/interviewScheduleSlice.ts
import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

export interface Interview {
  id: number;
  candidate: string;
  position: string;
  date: string;
  experience: string;
}

interface InterviewState {
  interviews: Interview[];
}

const initialState: InterviewState = {
  interviews: [
    {
      id: 1,
      candidate: 'Aakar Sharma',
      position: 'Software Engineer',
      date: '2023-08-15',
      experience: '1 year',
    },
    {
      id: 2,
      candidate: 'Priya Verma',
      position: 'Product Manager',
      date: '2023-08-16',
      experience: '3 years',
    },
    {
      id: 3,
      candidate: 'Rakesh Mehta',
      position: 'UX Designer',
      date: '2023-08-17',
      experience: '4 years',
    },
    {
      id: 4,
      candidate: 'Sneha Iyer',
      position: 'QA Engineer',
      date: '2023-08-18',
      experience: '5 years',
    },
    {
      id: 5,
      candidate: 'Karan Patel',
      position: 'DevOps Engineer',
      date: '2023-08-19',
      experience: '7 years',
    },
  ],
};

const interviewScheduleSlice = createSlice({
  name: 'interviewSchedule',
  initialState,
  reducers: {
    addInterview: (state, action: PayloadAction<Interview>) => {
      state.interviews.push(action.payload);
    },
    updateInterviewDate: (state, action: PayloadAction<{ id: number; date: string }>) => {
      const interview = state.interviews.find((item) => item.id === action.payload.id);
      if (interview) {
        interview.date = action.payload.date;
      }
    },
  },
});

export const { addInterview, updateInterviewDate } = interviewScheduleSlice.actions;
export default interviewScheduleSlice.reducer;
