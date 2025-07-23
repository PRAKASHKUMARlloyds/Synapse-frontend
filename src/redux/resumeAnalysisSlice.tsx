import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

interface ResumeAnalysisResult {
  name: string;
  emailId: string;
  skills: string[];
  resumeScore: number;
  status: 'Passed' | 'Rejected' | '';
}

const initialState: ResumeAnalysisResult = {
  name: '',
  emailId: '',
  skills: [],
  resumeScore: 0,
  status: '',
};
const resumeAnalysisSlice = createSlice({
  name: 'resumeAnalysis',
  initialState,
  reducers: {
    setName: (state, action: PayloadAction<string>) => {
      state.name = action.payload;
    },
    setEmailId: (state, action: PayloadAction<string>) => {
      state.emailId = action.payload;
    },
    setSkills: (state, action: PayloadAction<string[]>) => {
      state.skills = action.payload;
    },
    setResumeScore: (state, action: PayloadAction<number>) => {
      state.resumeScore = action.payload;
    },
    setStatus: (state, action: PayloadAction<ResumeAnalysisResult['status']>) => {
      state.status = action.payload;
    },
    setCandidateData: (state, action: PayloadAction<ResumeAnalysisResult>) => {
      return { ...state, ...action.payload };
    },
    resetresumeAnalysis: () => initialState,
  },
});

export const {
  setName,
  setEmailId,
  setSkills,
  setResumeScore,
  setStatus,
  setCandidateData,
  resetresumeAnalysis,
} = resumeAnalysisSlice.actions;

export default resumeAnalysisSlice.reducer;
