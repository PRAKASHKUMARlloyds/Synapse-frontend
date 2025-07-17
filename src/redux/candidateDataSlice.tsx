import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import dayjs from 'dayjs';

interface OnBoardingDetails {
  skills: string[];
  fileName?: string | null;
  description?: string;
}

interface FormDataState {
  onBoardingDetails: OnBoardingDetails;
}

const initialState: FormDataState = {
  onBoardingDetails: {
    description: '',
    skills: [],
    fileName: null,
  },
};

const candidateDataSlice = createSlice({
  name: 'candidateData',
  initialState,
  reducers: {
    setOnBoardingDetails(state, action: PayloadAction<OnBoardingDetails>) {
      state.onBoardingDetails = action.payload;
    },
    setDescription: (state, action: PayloadAction<string>) => {
      state.onBoardingDetails.description = action.payload;
    },
    setFileName(state, action: PayloadAction<string | null>) {
      state.onBoardingDetails.fileName = action.payload;
    },
  },
});

export const { setOnBoardingDetails, setFileName, setDescription } = candidateDataSlice.actions;
export default candidateDataSlice.reducer;
