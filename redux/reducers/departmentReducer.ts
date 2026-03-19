import { createReducer } from "@reduxjs/toolkit";
import {
    getAllDepartments,
    createDepartment,
    updateDepartment,
    deleteDepartment,
} from "../actions/departmentActions";

interface DepartmentState {
    loading: boolean;
    departments: any[];
    error: string | null;
    message: string | null;
}

const initialState: DepartmentState = {
    loading: false,
    departments: [],
    error: null,
    message: null,
};

export const departmentReducer = createReducer(initialState, (builder) => {
    builder
        .addCase(getAllDepartments.pending, (state) => {
            state.loading = true;
        })
        .addCase(getAllDepartments.fulfilled, (state, action) => {
            state.loading = false;
            state.departments = action.payload || [];
        })
        .addCase(getAllDepartments.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string;
        })
        .addCase(createDepartment.fulfilled, (state, action) => {
            state.departments.unshift(action.payload);
        })
        .addCase(updateDepartment.fulfilled, (state, action) => {
            const index = state.departments.findIndex(d => d._id === action.payload._id);
            if (index !== -1) {
                state.departments[index] = action.payload;
            }
        })
        .addCase(deleteDepartment.fulfilled, (state, action) => {
            state.departments = state.departments.filter(d => d._id !== action.payload);
        });
});

export default departmentReducer;
