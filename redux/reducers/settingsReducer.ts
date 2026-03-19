import { createSlice } from "@reduxjs/toolkit";
import {
    getSettings,
    updateSettings,
    updateCompanyInfo,
    updateBankAccounts,
    updateLogos,
    updateSmtp,
    updatePdfSettings,
    updateRejectionReasons,
    getPublicSettings
} from "../actions/settingsActions";

interface SettingsState {
    settings: any;
    loading: boolean;
    error: string | null;
    success: boolean;
}

const initialState: SettingsState = {
    settings: null,
    loading: false,
    error: null,
    success: false,
};

const settingsSlice = createSlice({
    name: "settings",
    initialState,
    reducers: {
        clearSettingsError: (state) => {
            state.error = null;
        },
        clearSettingsSuccess: (state) => {
            state.success = false;
        },
    },
    extraReducers: (builder) => {
        builder
            // Get Settings
            .addCase(getSettings.pending, (state) => {
                state.loading = true;
            })
            .addCase(getSettings.fulfilled, (state, action) => {
                state.loading = false;
                state.settings = action.payload.settings;
            })
            .addCase(getPublicSettings.fulfilled, (state, action) => {
                state.loading = false;
                if (!state.settings) {
                    state.settings = { logos: action.payload.logos };
                } else {
                    state.settings.logos = action.payload.logos;
                }
            })
            .addCase(getSettings.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            // Update Settings (Generic)
            .addCase(updateSettings.pending, (state) => {
                state.loading = true;
                state.success = false;
            })
            .addCase(updateSettings.fulfilled, (state, action) => {
                state.loading = false;
                state.settings = action.payload.settings;
                state.success = true;
            })
            .addCase(updateSettings.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
                state.success = false;
            })
            // Specialized updates
            .addMatcher(
                (action) => action.type.endsWith('/fulfilled') && action.type.startsWith('settings/update'),
                (state, action: any) => {
                    state.loading = false;
                    state.settings = action.payload.settings;
                    state.success = true;
                }
            )
            .addMatcher(
                (action) => action.type.endsWith('/pending') && action.type.startsWith('settings/update'),
                (state) => {
                    state.loading = true;
                    state.success = false;
                    state.error = null;
                }
            )
            .addMatcher(
                (action) => action.type.endsWith('/rejected') && action.type.startsWith('settings/update'),
                (state, action: any) => {
                    state.loading = false;
                    state.error = action.payload as string;
                    state.success = false;
                }
            );
    },
});

export const { clearSettingsError, clearSettingsSuccess } = settingsSlice.actions;
export default settingsSlice.reducer;
