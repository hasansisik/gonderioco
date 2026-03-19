import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { server } from "@/config";

const API_URL = `${server}/warehouse`;

export const getAllWarehouses = createAsyncThunk(
    "warehouse/getAll",
    async (_, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem("accessToken");
            const { data } = await axios.get(`${API_URL}/all`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            return data.warehouses;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || "Depolar yüklenemedi");
        }
    }
);

export const createWarehouse = createAsyncThunk(
    "warehouse/create",
    async (warehouseData: { name: string; code?: string; address?: string; city?: string; district?: string; zipCode?: string; note?: string }, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem("accessToken");
            const { data } = await axios.post(`${API_URL}/create`, warehouseData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            return data.warehouse;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || "Depo oluşturulamadı");
        }
    }
);

export const updateWarehouse = createAsyncThunk(
    "warehouse/update",
    async ({ id, warehouseData }: { id: string; warehouseData: { name: string; code?: string; address?: string; city?: string; district?: string; zipCode?: string; note?: string } }, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem("accessToken");
            const { data } = await axios.put(`${API_URL}/update/${id}`, warehouseData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            return data.warehouse;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || "Depo güncellenemedi");
        }
    }
);

export const deleteWarehouse = createAsyncThunk(
    "warehouse/delete",
    async (id: string, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem("accessToken");
            await axios.delete(`${API_URL}/delete/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            return id;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || "Depo silinemedi");
        }
    }
);
