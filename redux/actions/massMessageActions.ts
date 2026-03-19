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

export const sendMassMessage = createAsyncThunk(
    "massMessage/send",
    async ({ recipientIds, messageContent }: { recipientIds: string[], messageContent: string }, { rejectWithValue }) => {
        try {
            const response = await axios.post(`${API_URL}/mass-messages/send`, { recipientIds, messageContent }, getAuthConfig());
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response.data.message);
        }
    }
);

export const getMassMessageHistory = createAsyncThunk(
    "massMessage/getHistory",
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get(`${API_URL}/mass-messages/history`, getAuthConfig());
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response.data.message);
        }
    }
);
