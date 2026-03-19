import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { server } from "@/config";

const API_URL = server;

const getAuthConfig = () => {
    const token = typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;
    return {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };
};

export const getSettings = createAsyncThunk(
    "settings/getSettings",
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get(`${API_URL}/settings`, getAuthConfig());
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response.data.message);
        }
    }
);

export const updateSettings = createAsyncThunk(
    "settings/updateSettings",
    async (settingsData: any, { rejectWithValue }) => {
        try {
            const response = await axios.patch(`${API_URL}/settings`, settingsData, getAuthConfig());
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response.data.message);
        }
    }
);

export const updateCompanyInfo = createAsyncThunk(
    "settings/updateCompanyInfo",
    async (companyInfo: any, { rejectWithValue }) => {
        try {
            const response = await axios.patch(`${API_URL}/settings/company-info`, companyInfo, getAuthConfig());
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response.data.message);
        }
    }
);

export const updateBankAccounts = createAsyncThunk(
    "settings/updateBankAccounts",
    async (bankAccounts: any[], { rejectWithValue }) => {
        try {
            const response = await axios.patch(`${API_URL}/settings/bank-accounts`, bankAccounts, getAuthConfig());
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response.data.message);
        }
    }
);

export const updateLogos = createAsyncThunk(
    "settings/updateLogos",
    async (logos: any, { rejectWithValue }) => {
        try {
            const response = await axios.patch(`${API_URL}/settings/logos`, logos, getAuthConfig());
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response.data.message);
        }
    }
);

export const updateSmtp = createAsyncThunk(
    "settings/updateSmtp",
    async (smtp: any, { rejectWithValue }) => {
        try {
            const response = await axios.patch(`${API_URL}/settings/smtp`, smtp, getAuthConfig());
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response.data.message);
        }
    }
);

export const updatePdfSettings = createAsyncThunk(
    "settings/updatePdfSettings",
    async (pdfSettings: any, { rejectWithValue }) => {
        try {
            const response = await axios.patch(`${API_URL}/settings/pdf-settings`, pdfSettings, getAuthConfig());
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response.data.message);
        }
    }
);

export const updateRejectionReasons = createAsyncThunk(
    "settings/updateRejectionReasons",
    async (rejectionReasons: any[], { rejectWithValue }) => {
        try {
            const response = await axios.patch(`${API_URL}/settings/rejection-reasons`, rejectionReasons, getAuthConfig());
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response.data.message);
        }
    }
);

export const updateEnabledModules = createAsyncThunk(
    "settings/updateEnabledModules",
    async (enabledModules: any, { rejectWithValue }) => {
        try {
            const response = await axios.patch(`${API_URL}/settings/enabled-modules`, enabledModules, getAuthConfig());
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response.data.message);
        }
    }
);

export const getPublicSettings = createAsyncThunk(
    "settings/getPublicSettings",
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get(`${API_URL}/settings/public`);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response.data.message);
        }
    }
);
