import axios from "axios";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { server } from "@/config";

export interface CustomerPayload {
    _id?: string;
    company?: string;
    person?: string;
    phone?: string;
    website?: string;
    email?: string;
    address?: string;
    taxNumber?: string;
    taxOffice?: string;
    city?: string;
    district?: string;
    zip?: string;
    country?: string;
    billingAddress?: string;
    billingCity?: string;
    billingDistrict?: string;
    billingZip?: string;
    billingCountry?: string;
    shippingAddress?: string;
    shippingCity?: string;
    shippingDistrict?: string;
    shippingZip?: string;
    shippingCountry?: string;
    status?: 'Aktif' | 'Pasif';
}

export const createCustomer = createAsyncThunk(
    "customer/create",
    async (customerData: CustomerPayload, thunkAPI) => {
        try {
            const token = localStorage.getItem("accessToken");
            const { data } = await axios.post(`${server}/customer`, customerData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            return data.customer;
        } catch (error: any) {
            return thunkAPI.rejectWithValue(error.response?.data?.message || "Müşteri oluşturulamadı.");
        }
    }
);

export const getAllCustomers = createAsyncThunk(
    "customer/getAll",
    async (_, thunkAPI) => {
        try {
            const token = localStorage.getItem("accessToken");
            const { data } = await axios.get(`${server}/customer`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            return data.customers;
        } catch (error: any) {
            return thunkAPI.rejectWithValue(error.response?.data?.message || "Müşteriler yüklenemedi.");
        }
    }
);

export const updateCustomer = createAsyncThunk(
    "customer/update",
    async ({ id, customerData }: { id: string; customerData: CustomerPayload }, thunkAPI) => {
        try {
            const token = localStorage.getItem("accessToken");
            const { data } = await axios.patch(`${server}/customer/${id}`, customerData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            return data.customer;
        } catch (error: any) {
            return thunkAPI.rejectWithValue(error.response?.data?.message || "Müşteri güncellenemedi.");
        }
    }
);

export const deleteCustomer = createAsyncThunk(
    "customer/delete",
    async (id: string, thunkAPI) => {
        try {
            const token = localStorage.getItem("accessToken");
            await axios.delete(`${server}/customer/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            return id;
        } catch (error: any) {
            return thunkAPI.rejectWithValue(error.response?.data?.message || "Müşteri silinemedi.");
        }
    }
);

export const createCustomerAccount = createAsyncThunk(
    "customer/createAccount",
    async ({ id, email, password }: { id: string; email: string; password: string }, thunkAPI) => {
        try {
            const token = localStorage.getItem("accessToken");
            const { data } = await axios.post(`${server}/customer/${id}/create-account`,
                { email, password },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            return data;
        } catch (error: any) {
            return thunkAPI.rejectWithValue(error.response?.data?.message || "Müşteri hesabı oluşturulamadı.");
        }
    }
);

export const clearError = createAsyncThunk(
    "customer/clearError",
    async () => {
        return null;
    }
);

export const clearMessage = createAsyncThunk(
    "customer/clearMessage",
    async () => {
        return null;
    }
);
