import axios from "axios";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { server } from "@/config";

export const getCommissionData = createAsyncThunk(
    "commission/getData",
    async (_, thunkAPI) => {
        try {
            const token = localStorage.getItem("accessToken");
            const { data } = await axios.get(`${server}/commission`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            return data.staff;
        } catch (error: any) {
            return thunkAPI.rejectWithValue(error.response?.data?.message || "Prim verileri yüklenemedi.");
        }
    }
);

export const getPaymentHistory = createAsyncThunk(
    "commission/getHistory",
    async (_, thunkAPI) => {
        try {
            const token = localStorage.getItem("accessToken");
            const { data } = await axios.get(`${server}/commission/history`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            return data.history;
        } catch (error: any) {
            return thunkAPI.rejectWithValue(error.response?.data?.message || "Ödeme geçmişi yüklenemedi.");
        }
    }
);

export const updateStaffCommission = createAsyncThunk(
    "commission/updateStaff",
    async ({ id, commissionRate, commissionIncludeKDV }: { id: string, commissionRate?: number, commissionIncludeKDV?: boolean }, thunkAPI) => {
        try {
            const token = localStorage.getItem("accessToken");
            const { data } = await axios.patch(`${server}/commission/staff/${id}`, { commissionRate, commissionIncludeKDV }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            return data.staff;
        } catch (error: any) {
            return thunkAPI.rejectWithValue(error.response?.data?.message || "Personel prim ayarları güncellenemedi.");
        }
    }
);

export const payCommission = createAsyncThunk(
    "commission/pay",
    async ({ id, notes }: { id: string, notes?: string }, thunkAPI) => {
        try {
            const token = localStorage.getItem("accessToken");
            const { data } = await axios.post(`${server}/commission/${id}/pay`, { notes }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            return { staffId: id, payment: data.payment };
        } catch (error: any) {
            return thunkAPI.rejectWithValue(error.response?.data?.message || "Ödeme kaydedilemedi.");
        }
    }
);

export const updateCommissionSettings = createAsyncThunk(
    "commission/updateSettings",
    async (settings: { commissionSystem?: boolean, showCommissionToStaff?: boolean }, thunkAPI) => {
        try {
            const token = localStorage.getItem("accessToken");
            const { data } = await axios.patch(`${server}/commission/settings`, settings, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            return data.settings;
        } catch (error: any) {
            return thunkAPI.rejectWithValue(error.response?.data?.message || "Prim ayarları güncellenemedi.");
        }
    }
);

export const getMyCommission = createAsyncThunk(
    "commission/getMyData",
    async (_, thunkAPI) => {
        try {
            const token = localStorage.getItem("accessToken");
            const { data } = await axios.get(`${server}/commission/me`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            return data;
        } catch (error: any) {
            return thunkAPI.rejectWithValue(error.response?.data?.message || "Prim verileriniz yüklenemedi.");
        }
    }
);
