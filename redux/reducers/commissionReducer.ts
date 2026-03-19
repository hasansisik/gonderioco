import { createSlice } from "@reduxjs/toolkit";
import { getCommissionData, getPaymentHistory, updateStaffCommission, payCommission, updateCommissionSettings, getMyCommission } from "../actions/commissionActions";

interface CommissionState {
    staff: any[];
    history: any[];
    myCommission: any | null;
    loading: boolean;
    error: any;
    message: string | null;
}

const initialState: CommissionState = {
    staff: [],
    history: [],
    myCommission: null,
    loading: false,
    error: null,
    message: null,
};

const commissionSlice = createSlice({
    name: "commission",
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
        clearMessage: (state) => {
            state.message = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Get Commission Data
            .addCase(getCommissionData.pending, (state) => {
                state.loading = true;
            })
            .addCase(getCommissionData.fulfilled, (state, action) => {
                state.loading = false;
                state.staff = action.payload;
            })
            .addCase(getCommissionData.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Get History
            .addCase(getPaymentHistory.pending, (state) => {
                state.loading = true;
            })
            .addCase(getPaymentHistory.fulfilled, (state, action) => {
                state.loading = false;
                state.history = action.payload;
            })
            .addCase(getPaymentHistory.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Update Staff
            .addCase(updateStaffCommission.fulfilled, (state, action) => {
                state.staff = state.staff.map(s => s._id === action.payload._id ? { ...s, ...action.payload } : s);
                state.message = "Personel prim ayarları güncellendi.";
            })
            // Pay Commission
            .addCase(payCommission.fulfilled, (state, action) => {
                state.staff = state.staff.map(s => s._id === action.payload.staffId ? { ...s, commissionDebt: 0, offerCount: 0 } : s);
                state.history = [action.payload.payment, ...state.history];
                state.message = "Ödeme başarıyla kaydedildi.";
            })
            // Update Settings
            .addCase(updateCommissionSettings.fulfilled, (state, action) => {
                state.message = "Ayarlar güncellendi.";
            })
            // Get My Commission
            .addCase(getMyCommission.fulfilled, (state, action) => {
                state.myCommission = action.payload;
            });
    },
});

export const { clearError, clearMessage } = commissionSlice.actions;
export default commissionSlice.reducer;
