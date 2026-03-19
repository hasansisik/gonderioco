import axios from "axios";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { server } from "@/config";

export interface ProductPayload {
    _id?: string;
    name: string;
    description?: string;
    warehouse?: string;
    stockCode?: string;
    priceVatExcl?: number | string;
    purchasePrice?: number | string;
    vatRate?: number | string;
    profit?: number | string;
    unit?: string;
    currency?: string;
    brand?: string;
    supplier?: string;
    stockAmount?: number | string;
    criticalStockAmount?: number | string;
    barcode?: string;
}

export const createProduct = createAsyncThunk(
    "product/create",
    async (productData: ProductPayload, thunkAPI) => {
        try {
            const token = localStorage.getItem("accessToken");
            const { data } = await axios.post(`${server}/product`, productData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            return data.product;
        } catch (error: any) {
            return thunkAPI.rejectWithValue(error.response?.data?.message || "Ürün oluşturulamadı.");
        }
    }
);

export const getAllProducts = createAsyncThunk(
    "product/getAll",
    async (_, thunkAPI) => {
        try {
            const token = localStorage.getItem("accessToken");
            const { data } = await axios.get(`${server}/product`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            return data.products;
        } catch (error: any) {
            return thunkAPI.rejectWithValue(error.response?.data?.message || "Ürünler yüklenemedi.");
        }
    }
);

export const updateProduct = createAsyncThunk(
    "product/update",
    async ({ id, productData }: { id: string; productData: ProductPayload }, thunkAPI) => {
        try {
            const token = localStorage.getItem("accessToken");
            const { data } = await axios.patch(`${server}/product/${id}`, productData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            return data.product;
        } catch (error: any) {
            return thunkAPI.rejectWithValue(error.response?.data?.message || "Ürün güncellenemedi.");
        }
    }
);

export const deleteProduct = createAsyncThunk(
    "product/delete",
    async (id: string, thunkAPI) => {
        try {
            const token = localStorage.getItem("accessToken");
            await axios.delete(`${server}/product/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            return id;
        } catch (error: any) {
            return thunkAPI.rejectWithValue(error.response?.data?.message || "Ürün silinemedi.");
        }
    }
);

export const clearError = createAsyncThunk(
    "product/clearError",
    async () => {
        return null;
    }
);

export const clearMessage = createAsyncThunk(
    "product/clearMessage",
    async () => {
        return null;
    }
);
