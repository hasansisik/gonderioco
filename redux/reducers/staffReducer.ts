import { createReducer } from "@reduxjs/toolkit";
import {
    createStaff,
    getAllStaff,
    updateStaff,
    deleteStaff,
    clearError,
    clearMessage,
} from "../actions/staffActions";

interface StaffState {
    loading: boolean;
    staffList: any[];
    staff: any | null;
    error: string | null;
    message: string | null;
}

const initialState: StaffState = {
    loading: false,
    staffList: [],
    staff: null,
    error: null,
    message: null,
};

export const staffReducer = createReducer(initialState, (builder) => {
    builder
        // Create Staff
        .addCase(createStaff.pending, (state) => {
            state.loading = true;
        })
        .addCase(createStaff.fulfilled, (state, action) => {
            state.loading = false;
            state.staffList.push(action.payload);
            state.message = "Personel başarıyla oluşturuldu";
        })
        .addCase(createStaff.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string;
        })

        // Get All Staff
        .addCase(getAllStaff.pending, (state) => {
            state.loading = true;
        })
        .addCase(getAllStaff.fulfilled, (state, action) => {
            state.loading = false;
            state.staffList = action.payload || [];
        })
        .addCase(getAllStaff.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string;
        })

        // Update Staff
        .addCase(updateStaff.pending, (state) => {
            state.loading = true;
        })
        .addCase(updateStaff.fulfilled, (state, action) => {
            state.loading = false;
            const index = state.staffList.findIndex(s => s._id === action.payload._id);
            if (index !== -1) {
                state.staffList[index] = action.payload;
            }
            state.message = "Personel başarıyla güncellendi";
        })
        .addCase(updateStaff.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string;
        })

        // Delete Staff
        .addCase(deleteStaff.pending, (state) => {
            state.loading = true;
        })
        .addCase(deleteStaff.fulfilled, (state, action) => {
            state.loading = false;
            state.staffList = state.staffList.filter(s => s._id !== action.payload);
            state.message = "Personel başarıyla silindi";
        })
        .addCase(deleteStaff.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string;
        })

        // Error and Message Handling
        .addCase(clearError.fulfilled, (state) => {
            state.error = null;
        })
        .addCase(clearMessage.fulfilled, (state) => {
            state.message = null;
        });
});

export default staffReducer;
