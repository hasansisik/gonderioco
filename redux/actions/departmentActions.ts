import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { server } from "@/config";

const API_URL = `${server}/department`;

export const getAllDepartments = createAsyncThunk(
    "department/getAll",
    async (_, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem("accessToken");
            const { data } = await axios.get(`${API_URL}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            return data.departments;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || "Departmanlar yüklenemedi");
        }
    }
);

export const createDepartment = createAsyncThunk(
    "department/create",
    async (departmentData: { name: string; permissions?: string[]; isApprover?: boolean }, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem("accessToken");
            const { data } = await axios.post(`${API_URL}`, departmentData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            return data.department;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || "Departman oluşturulamadı");
        }
    }
);

export const updateDepartment = createAsyncThunk(
    "department/update",
    async ({ id, departmentData }: { id: string; departmentData: { name: string; permissions?: string[]; isApprover?: boolean } }, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem("accessToken");
            const { data } = await axios.patch(`${API_URL}/${id}`, departmentData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            return data.department;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || "Departman güncellenemedi");
        }
    }
);

export const deleteDepartment = createAsyncThunk(
    "department/delete",
    async (id: string, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem("accessToken");
            await axios.delete(`${API_URL}/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            return id;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || "Departman silinemedi");
        }
    }
);
