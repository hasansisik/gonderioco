import axios from "axios";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { server } from "@/config";

export interface TemplatePayload {
    _id?: string;
    name: string;
    content: string;
    createdBy?: any;
    isActive?: boolean;
    createdAt?: string;
    updatedAt?: string;
}

export const createTemplate = createAsyncThunk(
    "template/create",
    async (templateData: TemplatePayload, thunkAPI) => {
        try {
            const token = localStorage.getItem("accessToken");
            const { data } = await axios.post(`${server}/template`, templateData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            return data.template;
        } catch (error: any) {
            return thunkAPI.rejectWithValue(error.response?.data?.message || "Şablon oluşturulamadı.");
        }
    }
);

export const getAllTemplates = createAsyncThunk(
    "template/getAll",
    async (_, thunkAPI) => {
        try {
            const token = localStorage.getItem("accessToken");
            const { data } = await axios.get(`${server}/template`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            return data.templates;
        } catch (error: any) {
            return thunkAPI.rejectWithValue(error.response?.data?.message || "Şablonlar yüklenemedi.");
        }
    }
);

export const getTemplate = createAsyncThunk(
    "template/get",
    async (id: string, thunkAPI) => {
        try {
            const token = localStorage.getItem("accessToken");
            const { data } = await axios.get(`${server}/template/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            return data.template;
        } catch (error: any) {
            return thunkAPI.rejectWithValue(error.response?.data?.message || "Şablon yüklenemedi.");
        }
    }
);

export const updateTemplate = createAsyncThunk(
    "template/update",
    async ({ id, templateData }: { id: string; templateData: TemplatePayload }, thunkAPI) => {
        try {
            const token = localStorage.getItem("accessToken");
            const { data } = await axios.patch(`${server}/template/${id}`, templateData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            return data.template;
        } catch (error: any) {
            return thunkAPI.rejectWithValue(error.response?.data?.message || "Şablon güncellenemedi.");
        }
    }
);

export const deleteTemplate = createAsyncThunk(
    "template/delete",
    async (id: string, thunkAPI) => {
        try {
            const token = localStorage.getItem("accessToken");
            await axios.delete(`${server}/template/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            return id;
        } catch (error: any) {
            return thunkAPI.rejectWithValue(error.response?.data?.message || "Şablon silinemedi.");
        }
    }
);

export const clearError = createAsyncThunk(
    "template/clearError",
    async () => {
        return null;
    }
);

export const clearMessage = createAsyncThunk(
    "template/clearMessage",
    async () => {
        return null;
    }
);
