import axios from "axios";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { server } from "@/config";

export interface StaffPayload {
    _id?: string;
    name: string;
    surname: string;
    email: string;
    phoneNumber: string;
    department: string; // Department ID
    username?: string;
    role?: string;
    status?: string;
    password?: string;
}

export const createStaff = createAsyncThunk(
    "staff/create",
    async (staffData: StaffPayload, thunkAPI) => {
        try {
            const token = localStorage.getItem("accessToken");
            const { data } = await axios.post(`${server}/staff`, staffData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            return data.staff;
        } catch (error: any) {
            return thunkAPI.rejectWithValue(error.response?.data?.message || "Personel oluşturulamadı.");
        }
    }
);

export const getAllStaff = createAsyncThunk(
    "staff/getAll",
    async (_, thunkAPI) => {
        try {
            const token = localStorage.getItem("accessToken");
            const { data } = await axios.get(`${server}/staff`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            return data.staff;
        } catch (error: any) {
            return thunkAPI.rejectWithValue(error.response?.data?.message || "Personeller yüklenemedi.");
        }
    }
);

export const updateStaff = createAsyncThunk(
    "staff/update",
    async ({ id, staffData }: { id: string; staffData: StaffPayload }, thunkAPI) => {
        try {
            const token = localStorage.getItem("accessToken");
            const { data } = await axios.patch(`${server}/staff/${id}`, staffData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            return data.staff;
        } catch (error: any) {
            return thunkAPI.rejectWithValue(error.response?.data?.message || "Personel güncellenemedi.");
        }
    }
);

export const deleteStaff = createAsyncThunk(
    "staff/delete",
    async (id: string, thunkAPI) => {
        try {
            const token = localStorage.getItem("accessToken");
            await axios.delete(`${server}/staff/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            return id;
        } catch (error: any) {
            return thunkAPI.rejectWithValue(error.response?.data?.message || "Personel silinemedi.");
        }
    }
);

export const clearError = createAsyncThunk(
    "staff/clearError",
    async () => {
        return null;
    }
);

export const clearMessage = createAsyncThunk(
    "staff/clearMessage",
    async () => {
        return null;
    }
);
