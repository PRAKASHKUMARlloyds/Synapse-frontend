import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

export type ResumeStatus = 'pending' | 'shortlisted' | 'rejected';

export interface ResumeAnalysisResult {
  name: string;
  email: string;
  skills: string[];
  resumeScore: number;
  status: ResumeStatus;
}

interface ResumeAnalysisState {
  result: ResumeAnalysisResult | null;
  loading: boolean;
  error: string | null;
}

const initialState: ResumeAnalysisState = {
  result: null,
  loading: false,
  error: null,
};

const resumeAnalysisSlice = createSlice({
  name: 'resumeAnalysis',
  initialState,
  reducers: {
    // Equivalent to "login" from authentication
    setResumeAnalysis: (state, action: PayloadAction<ResumeAnalysisResult>) => {
      state.result = action.payload;
      state.loading = false;
      state.error = null;
    },
    // Individual fields (like update name/email)
    updateName: (state, action: PayloadAction<string>) => {
      if (!state.result) {
        state.result = { name: '', email: '', skills: [], resumeScore: 0, status: 'pending' };
      }
      state.result.name = action.payload;
    },
    updateEmail: (state, action: PayloadAction<string>) => {
      if (!state.result) {
        state.result = { name: '', email: '', skills: [], resumeScore: 0, status: 'pending' };
      }
      state.result.email = action.payload;
    },
    updateScore: (state, action: PayloadAction<number>) => {
      if (state.result) {
        state.result.resumeScore = action.payload;
      }
    },
    updateSkills: (state, action: PayloadAction<string[]>) => {
      if (state.result) {
        state.result.skills = action.payload;
      }
    },
    updateStatus: (state, action: PayloadAction<ResumeStatus>) => {
      if (state.result) {
        state.result.status = action.payload;
      }
    },
    // Equivalent to "logout"
    clearResumeAnalysis: (state) => {
      state.result = null;
      state.loading = false;
      state.error = null;
    },
    setAnalysisLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setAnalysisError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.loading = false;
    },
  },
});

export const {
  setResumeAnalysis,
  updateName,
  updateEmail,
  updateScore,
  updateSkills,
  updateStatus,
  clearResumeAnalysis,
  setAnalysisLoading,
  setAnalysisError,
} = resumeAnalysisSlice.actions;

export default resumeAnalysisSlice.reducer;
