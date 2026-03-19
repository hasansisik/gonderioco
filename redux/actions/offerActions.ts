import axios from "axios";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { server } from "@/config";

export interface OfferPayload {
    _id?: string;
    title: string;
    sablon?: string;
    konu?: string;
    musteri?: string; // Client ID
    alici?: string;
    tarih?: string;
    paraBirimi?: string;
    dolarKur?: number | string;
    euroKur?: number | string;
    personel?: string;
    sartlar?: string;
    yoneticiler?: string | string[];
    urunler?: any[];
    evrakIcerigi?: string;
    status?: string;
    revisionNote?: string;
    isCalled?: boolean;
}

export const createOffer = createAsyncThunk(
    "offer/create",
    async (offerData: OfferPayload, thunkAPI) => {
        try {
            console.log("Sending Offer Payload:", JSON.stringify(offerData, null, 2));
            const token = localStorage.getItem("accessToken");
            const { data } = await axios.post(`${server}/offer`, offerData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            return data.offer;
        } catch (error: any) {
            return thunkAPI.rejectWithValue(error.response?.data?.message || "Teklif oluşturulamadı.");
        }
    }
);

export const getAllOffers = createAsyncThunk(
    "offer/getAll",
    async (_, thunkAPI) => {
        try {
            const token = localStorage.getItem("accessToken");
            const { data } = await axios.get(`${server}/offer`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            return data.offers;
        } catch (error: any) {
            return thunkAPI.rejectWithValue(error.response?.data?.message || "Teklifler yüklenemedi.");
        }
    }
);

export const updateOffer = createAsyncThunk(
    "offer/update",
    async ({ id, offerData }: { id: string; offerData: OfferPayload }, thunkAPI) => {
        try {
            const token = localStorage.getItem("accessToken");
            const { data } = await axios.patch(`${server}/offer/${id}`, offerData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            return data.offer;
        } catch (error: any) {
            return thunkAPI.rejectWithValue(error.response?.data?.message || "Teklif güncellenemedi.");
        }
    }
);

export const deleteOffer = createAsyncThunk(
    "offer/delete",
    async (id: string, thunkAPI) => {
        try {
            const token = localStorage.getItem("accessToken");
            await axios.delete(`${server}/offer/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            return id;
        } catch (error: any) {
            return thunkAPI.rejectWithValue(error.response?.data?.message || "Teklif silinemedi.");
        }
    }
);

export const approveOfferCustomer = createAsyncThunk(
    "offer/approve",
    async (id: string, thunkAPI) => {
        try {
            const token = localStorage.getItem("accessToken");
            const { data } = await axios.post(`${server}/offer/${id}/approve`, {}, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            return data.offer;
        } catch (error: any) {
            return thunkAPI.rejectWithValue(error.response?.data?.message || "Teklif onaylanamadı.");
        }
    }
);

export const rejectOfferCustomer = createAsyncThunk(
    "offer/reject",
    async ({ id, notes }: { id: string; notes?: string }, thunkAPI) => {
        try {
            const token = localStorage.getItem("accessToken");
            const { data } = await axios.post(`${server}/offer/${id}/reject`, { notes }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            return data.offer;
        } catch (error: any) {
            return thunkAPI.rejectWithValue(error.response?.data?.message || "Teklif reddedilemedi.");
        }
    }
);

export const approveOfferManager = createAsyncThunk(
    "offer/managerApprove",
    async (id: string, thunkAPI) => {
        try {
            const token = localStorage.getItem("accessToken");
            const { data } = await axios.post(`${server}/offer/${id}/manager-approve`, {}, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            return data.offer;
        } catch (error: any) {
            return thunkAPI.rejectWithValue(error.response?.data?.message || "Teklif onaylanamadı.");
        }
    }
);

export const rejectOfferManager = createAsyncThunk(
    "offer/managerReject",
    async ({ id, notes }: { id: string; notes?: string }, thunkAPI) => {
        try {
            const token = localStorage.getItem("accessToken");
            const { data } = await axios.post(`${server}/offer/${id}/manager-reject`, { notes }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            return data.offer;
        } catch (error: any) {
            return thunkAPI.rejectWithValue(error.response?.data?.message || "Teklif reddedilemedi.");
        }
    }
);

export const requestRevisionOffer = createAsyncThunk(
    "offer/revision",
    async ({ id, notes }: { id: string; notes: string }, thunkAPI) => {
        try {
            const token = localStorage.getItem("accessToken");
            const { data } = await axios.post(`${server}/offer/${id}/revision`, { notes }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            return data.offer;
        } catch (error: any) {
            return thunkAPI.rejectWithValue(error.response?.data?.message || "Revizyon talebi gönderilemedi.");
        }
    }
);

export const completeOffer = createAsyncThunk(
    "offer/complete",
    async (id: string, thunkAPI) => {
        try {
            const token = localStorage.getItem("accessToken");
            const { data } = await axios.post(`${server}/offer/${id}/complete`, {}, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            // Return both offer and companyInfo (needed for the rating dialog)
            return data;
        } catch (error: any) {
            return thunkAPI.rejectWithValue(error.response?.data?.message || "Teklif tamamlanamadı.");
        }
    }
);

export const rateOffer = createAsyncThunk(
    "offer/rate",
    async ({ id, satisfactionRating }: { id: string, satisfactionRating: number }, thunkAPI) => {
        try {
            const token = localStorage.getItem("accessToken");
            const { data } = await axios.post(`${server}/offer/${id}/rate`, { satisfactionRating }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            return data.offer;
        } catch (error: any) {
            return thunkAPI.rejectWithValue(error.response?.data?.message || "Puan kaydedilemedi.");
        }
    }
);

export const clearError = createAsyncThunk(
    "offer/clearError",
    async () => {
        return null;
    }
);

export const addOfferQuestion = createAsyncThunk(
    "offer/addQuestion",
    async ({ id, text }: { id: string, text: string }, thunkAPI) => {
        try {
            const token = localStorage.getItem("accessToken");
            const { data } = await axios.post(`${server}/offer/${id}/question`, { text }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            return data.offer;
        } catch (error: any) {
            return thunkAPI.rejectWithValue(error.response?.data?.message || "Soru gönderilemedi.");
        }
    }
);

export const markOfferQuestionsRead = createAsyncThunk(
    "offer/markQuestionsRead",
    async (id: string, thunkAPI) => {
        try {
            const token = localStorage.getItem("accessToken");
            const { data } = await axios.post(`${server}/offer/${id}/question/read`, {}, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            return data.offer;
        } catch (error: any) {
            return thunkAPI.rejectWithValue(error.response?.data?.message || "Okundu bilgisi güncellenemedi.");
        }
    }
);

export const clearMessage = createAsyncThunk(
    "offer/clearMessage",
    async () => {
        return null;
    }
);
