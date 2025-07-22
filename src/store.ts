import { configureStore, combineReducers } from '@reduxjs/toolkit';

import authenticationSlice from './redux/authenticationSlice';
import candidateDataSlice from './redux/candidateDataSlice';
import interviewSlice from './redux/interviewSlice';
import interviewScheduleSlice from './redux/interviewScheduleSlice';
import FeedbackSlice from './redux/feedbackSlice';
import resumeAnalysisSlice from './redux/resumeAnalysisSlice';

const rootReducer = combineReducers({
  authentiction: authenticationSlice,
  candidateData: candidateDataSlice,
  interview: interviewSlice,
  interviewSchedule: interviewScheduleSlice,
  feedback: FeedbackSlice,
  resumeAnalysis: resumeAnalysisSlice,
});

const store = configureStore({
  reducer: rootReducer,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
