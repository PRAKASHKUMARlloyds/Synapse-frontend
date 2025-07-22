// src/redux/feedbackSlice.ts
import { createSlice} from '@reduxjs/toolkit';
import  type {PayloadAction} from '@reduxjs/toolkit';

export type FeedbackEntry = {
  name: string;
  email: string;
  skills: string;
  resumeScore: number | string;
  status: 'Passed' | 'Rejected' | 'Pending';
  videoUrl?: string;
  aiTrigger: 'AI Trigger' | 'No Trigger';
};

interface FeedbackState {
  entries: FeedbackEntry[];
}

const initialState: FeedbackState = {
  entries: [
    {
      name: 'Akansha Sharma',
      email: 'akansha@gmail.com',
      skills: 'React, Node.js',
      resumeScore: 'N/A',
      status: 'Passed',
      videoUrl: 'https://www.youtube.com/watch?v=video1',
      aiTrigger: 'No Trigger'
    },
    {
      name: 'Priya Verma',
      email: 'priya.verma@gmail.com',
      skills: 'Python, Django',
      resumeScore: 25,
      status: 'Passed',
      videoUrl: 'https://www.youtube.com/watch?v=video2',
      aiTrigger: 'No Trigger'
    },
    {
      name: 'Ronit Mehta',
      email: 'ronit.mehta@gmail.com',
      skills: 'Java, Spring',
      resumeScore: 30,
      status: 'Rejected',
      videoUrl: 'https://www.youtube.com/watch?v=video3',
      aiTrigger: 'AI Trigger'
    },
    {
      name: 'Sneha Iyer',
      email: 'sneha.iyer@gmail.com',
      skills: 'QA, Selenium',
      resumeScore: 18,
      status: 'Pending',
      videoUrl: 'https://www.youtube.com/watch?v=video4',
      aiTrigger: 'AI Trigger'
    }
  ]
};

const feedbackSlice = createSlice({
  name: 'feedback',
  initialState,
  reducers: {
    setFeedbacks(state, action: PayloadAction<FeedbackEntry[]>) {
      state.entries = action.payload;
    }
  }
});

export const { setFeedbacks } = feedbackSlice.actions;
export default feedbackSlice.reducer;