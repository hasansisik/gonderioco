import { createReducer } from "@reduxjs/toolkit";
import {
    createTemplate,
    getAllTemplates,
    getTemplate,
    updateTemplate,
    deleteTemplate,
    clearError,
    clearMessage,
} from "../actions/templateActions";

interface TemplateState {
    loading: boolean;
    templates: any[];
    template: any | null;
    error: string | null;
    message: string | null;
}

const initialState: TemplateState = {
    loading: false,
    templates: [],
    template: null,
    error: null,
    message: null,
};

export const templateReducer = createReducer(initialState, (builder) => {
    builder
        // Create Template
        .addCase(createTemplate.pending, (state) => {
            state.loading = true;
        })
        .addCase(createTemplate.fulfilled, (state, action) => {
            state.loading = false;
            state.templates.push(action.payload);
            state.message = "Şablon başarıyla oluşturuldu";
        })
        .addCase(createTemplate.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string;
        })

        // Get All Templates
        .addCase(getAllTemplates.pending, (state) => {
            state.loading = true;
        })
        .addCase(getAllTemplates.fulfilled, (state, action) => {
            state.loading = false;
            state.templates = action.payload || [];
        })
        .addCase(getAllTemplates.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string;
        })

        // Get Template
        .addCase(getTemplate.pending, (state) => {
            state.loading = true;
        })
        .addCase(getTemplate.fulfilled, (state, action) => {
            state.loading = false;
            state.template = action.payload;
        })
        .addCase(getTemplate.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string;
        })

        // Update Template
        .addCase(updateTemplate.pending, (state) => {
            state.loading = true;
        })
        .addCase(updateTemplate.fulfilled, (state, action) => {
            state.loading = false;
            const index = state.templates.findIndex(t => t._id === action.payload._id);
            if (index !== -1) {
                state.templates[index] = action.payload;
            }
            state.message = "Şablon başarıyla güncellendi";
        })
        .addCase(updateTemplate.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string;
        })

        // Delete Template
        .addCase(deleteTemplate.pending, (state) => {
            state.loading = true;
        })
        .addCase(deleteTemplate.fulfilled, (state, action) => {
            state.loading = false;
            state.templates = state.templates.filter(t => t._id !== action.payload);
            state.message = "Şablon başarıyla silindi";
        })
        .addCase(deleteTemplate.rejected, (state, action) => {
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

export default templateReducer;
