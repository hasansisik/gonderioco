import axios from "axios";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { server } from "@/config";

export interface TermPayload {
    _id?: string;
    name: string;
    content: string;
    createdBy?: any;
    isActive?: boolean;
    createdAt?: string;
    updatedAt?: string;
}

export const createTerm = createAsyncThunk(
    "term/create",
    async (termData: TermPayload, thunkAPI) => {
        try {
            const token = localStorage.getItem("accessToken");
            const { data } = await axios.post(`${server}/term`, termData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            return data.term;
        } catch (error: any) {
            return thunkAPI.rejectWithValue(error.response?.data?.message || "Şart oluşturulamadı.");
        }
    }
);

export const getAllTerms = createAsyncThunk(
    "term/getAll",
    async (_, thunkAPI) => {
        try {
            const token = localStorage.getItem("accessToken");
            const { data } = await axios.get(`${server}/term`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            return data.terms;
        } catch (error: any) {
            return thunkAPI.rejectWithValue(error.response?.data?.message || "Şartlar yüklenemedi.");
        }
    }
);

export const getTerm = createAsyncThunk(
    "term/get",
    async (id: string, thunkAPI) => {
        try {
            const token = localStorage.getItem("accessToken");
            const { data } = await axios.get(`${server}/term/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            return data.term;
        } catch (error: any) {
            return thunkAPI.rejectWithValue(error.response?.data?.message || "Şart yüklenemedi.");
        }
    }
);

export const updateTerm = createAsyncThunk(
    "term/update",
    async ({ id, termData }: { id: string; termData: TermPayload }, thunkAPI) => {
        try {
            const token = localStorage.getItem("accessToken");
            const { data } = await axios.patch(`${server}/term/${id}`, termData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            return data.term;
        } catch (error: any) {
            return thunkAPI.rejectWithValue(error.response?.data?.message || "Şart güncellenemedi.");
        }
    }
);

export const deleteTerm = createAsyncThunk(
    "term/delete",
    async (id: string, thunkAPI) => {
        try {
            const token = localStorage.getItem("accessToken");
            await axios.delete(`${server}/term/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            return id;
        } catch (error: any) {
            return thunkAPI.rejectWithValue(error.response?.data?.message || "Şart silinemedi.");
        }
    }
);

export const clearError = createAsyncThunk(
    "term/clearError",
    async () => {
        return null;
    }
);

export const clearMessage = createAsyncThunk(
    "term/clearMessage",
    async () => {
        return null;
    }
);
