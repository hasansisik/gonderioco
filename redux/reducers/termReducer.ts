import { createReducer } from "@reduxjs/toolkit";
import {
    createTerm,
    getAllTerms,
    getTerm,
    updateTerm,
    deleteTerm,
    clearError,
    clearMessage,
} from "../actions/termActions";

interface TermState {
    loading: boolean;
    terms: any[];
    term: any | null;
    error: string | null;
    message: string | null;
}

const initialState: TermState = {
    loading: false,
    terms: [],
    term: null,
    error: null,
    message: null,
};

export const termReducer = createReducer(initialState, (builder) => {
    builder
        // Create Term
        .addCase(createTerm.pending, (state) => {
            state.loading = true;
        })
        .addCase(createTerm.fulfilled, (state, action) => {
            state.loading = false;
            state.terms.push(action.payload);
            state.message = "Şart başarıyla oluşturuldu";
        })
        .addCase(createTerm.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string;
        })

        // Get All Terms
        .addCase(getAllTerms.pending, (state) => {
            state.loading = true;
        })
        .addCase(getAllTerms.fulfilled, (state, action) => {
            state.loading = false;
            state.terms = action.payload || [];
        })
        .addCase(getAllTerms.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string;
        })

        // Get Term
        .addCase(getTerm.pending, (state) => {
            state.loading = true;
        })
        .addCase(getTerm.fulfilled, (state, action) => {
            state.loading = false;
            state.term = action.payload;
        })
        .addCase(getTerm.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string;
        })

        // Update Term
        .addCase(updateTerm.pending, (state) => {
            state.loading = true;
        })
        .addCase(updateTerm.fulfilled, (state, action) => {
            state.loading = false;
            const index = state.terms.findIndex(t => t._id === action.payload._id);
            if (index !== -1) {
                state.terms[index] = action.payload;
            }
            state.message = "Şart başarıyla güncellendi";
        })
        .addCase(updateTerm.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string;
        })

        // Delete Term
        .addCase(deleteTerm.pending, (state) => {
            state.loading = true;
        })
        .addCase(deleteTerm.fulfilled, (state, action) => {
            state.loading = false;
            state.terms = state.terms.filter(t => t._id !== action.payload);
            state.message = "Şart başarıyla silindi";
        })
        .addCase(deleteTerm.rejected, (state, action) => {
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

export default termReducer;
