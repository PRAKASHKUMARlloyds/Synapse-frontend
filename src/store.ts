import { configureStore } from "@reduxjs/toolkit";
import authenticationSlice from "./redux/authenticationSlice";
import candidateDataSlice from "./redux/candidateDataSlice";
import interviewSlice from "./redux/interviewSlice";

const store = configureStore({
    reducer: {
        authentiction: authenticationSlice,
        candidateData: candidateDataSlice,
        interview: interviewSlice,
    },
})

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;