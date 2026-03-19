import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { server } from "@/config";

export const createCustomerRequest = createAsyncThunk(
    "company/createCustomerRequest",
    async (providerId: string, thunkAPI) => {
        try {
            const token = localStorage.getItem("accessToken");
            const { data } = await axios.post(
                `${server}/companies/request`,
                { providerId },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            return data;
        } catch (error: any) {
            return thunkAPI.rejectWithValue(
                error.response?.data?.message || "Başvuru sırasında bir hata oluştu"
            );
        }
    }
);

export const getPendingCustomerRequests = createAsyncThunk(
    "company/getPendingCustomerRequests",
    async (_, thunkAPI) => {
        try {
            const token = localStorage.getItem("accessToken");
            const { data } = await axios.get(
                `${server}/companies/requests/pending`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            return data.requests;
        } catch (error: any) {
            return thunkAPI.rejectWithValue(
                error.response?.data?.message || "Başvurular alınırken bir hata oluştu"
            );
        }
    }
);

export const respondToCustomerRequest = createAsyncThunk(
    "company/respondToCustomerRequest",
    async ({ requestId, response }: { requestId: string, response: 'accepted' | 'rejected' }, thunkAPI) => {
        try {
            const token = localStorage.getItem("accessToken");
            const { data } = await axios.post(
                `${server}/companies/request/respond`,
                { requestId, response },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            return { requestId, response, ...data };
        } catch (error: any) {
            return thunkAPI.rejectWithValue(
                error.response?.data?.message || "İşlem sırasında bir hata oluştu"
            );
        }
    }
);

export const removeCustomerAssociation = createAsyncThunk(
    "company/removeCustomerAssociation",
    async (companyCode: string, thunkAPI) => {
        try {
            const token = localStorage.getItem("accessToken");
            const { data } = await axios.post(
                `${server}/companies/request/remove`,
                { companyCode },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            return data;
        } catch (error: any) {
            return thunkAPI.rejectWithValue(
                error.response?.data?.message || "İlişki sonlandırılırken bir hata oluştu"
            );
        }
    }
);
