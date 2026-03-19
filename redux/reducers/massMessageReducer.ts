import { createSlice } from "@reduxjs/toolkit";
import { sendMassMessage, getMassMessageHistory } from "../actions/massMessageActions";

interface MassMessageState {
    history: any[];
    loading: boolean;
    error: string | null;
    success: boolean;
}

const initialState: MassMessageState = {
    history: [],
    loading: false,
    error: null,
    success: false,
};

const massMessageSlice = createSlice({
    name: "massMessage",
    initialState,
    reducers: {
        clearMassMessageState: (state) => {
            state.error = null;
            state.success = false;
        },
    },
    extraReducers: (builder) => {
        builder
            // Send Mass Message
            .addCase(sendMassMessage.pending, (state) => {
                state.loading = true;
                state.success = false;
                state.error = null;
            })
            .addCase(sendMassMessage.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.history.unshift(action.payload.massMessage);
            })
            .addCase(sendMassMessage.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
                state.success = false;
            })
            // Get History
            .addCase(getMassMessageHistory.pending, (state) => {
                state.loading = true;
            })
            .addCase(getMassMessageHistory.fulfilled, (state, action) => {
                state.loading = false;
                state.history = action.payload.massMessages;
            })
            .addCase(getMassMessageHistory.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

export const { clearMassMessageState } = massMessageSlice.actions;
export const massMessageReducer = massMessageSlice.reducer;
