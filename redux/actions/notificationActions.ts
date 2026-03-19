import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { server } from '@/config';

const getAuthHeader = () => {
    const token = localStorage.getItem('accessToken');
    return {
        headers: {
            Authorization: `Bearer ${token}`
        }
    };
};

export const getNotifications = createAsyncThunk(
    'notification/getAll',
    async (type: string | undefined, { rejectWithValue }) => {
        try {
            const url = type ? `${server}/notifications?type=${type}` : `${server}/notifications`;
            const { data } = await axios.get(url, getAuthHeader());
            return data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Bildirimler alınamadı');
        }
    }
);

export const markAsRead = createAsyncThunk(
    'notification/markAsRead',
    async (id: string, { rejectWithValue }) => {
        try {
            const { data } = await axios.patch(`${server}/notifications/${id}/read`, {}, getAuthHeader());
            return data.notification;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Bildirim güncellenemedi');
        }
    }
);

export const markAllAsRead = createAsyncThunk(
    'notification/markAllAsRead',
    async (type: string | undefined, { rejectWithValue }) => {
        try {
            const url = type ? `${server}/notifications/mark-all-read?type=${type}` : `${server}/notifications/mark-all-read`;
            const { data } = await axios.patch(url, {}, getAuthHeader());
            return { type, message: data.message };
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Bildirimler güncellenemedi');
        }
    }
);
