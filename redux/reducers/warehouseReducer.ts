import { createReducer } from "@reduxjs/toolkit";
import {
    getAllWarehouses,
    createWarehouse,
    updateWarehouse,
    deleteWarehouse,
} from "../actions/warehouseActions";

interface WarehouseState {
    loading: boolean;
    warehouses: any[];
    error: string | null;
    message: string | null;
}

const initialState: WarehouseState = {
    loading: false,
    warehouses: [],
    error: null,
    message: null,
};

export const warehouseReducer = createReducer(initialState, (builder) => {
    builder
        .addCase(getAllWarehouses.pending, (state) => {
            state.loading = true;
        })
        .addCase(getAllWarehouses.fulfilled, (state, action) => {
            state.loading = false;
            state.warehouses = action.payload || [];
        })
        .addCase(getAllWarehouses.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string;
        })
        .addCase(createWarehouse.fulfilled, (state, action) => {
            state.warehouses.push(action.payload);
        })
        .addCase(updateWarehouse.fulfilled, (state, action) => {
            const index = state.warehouses.findIndex(w => w._id === action.payload._id);
            if (index !== -1) {
                state.warehouses[index] = action.payload;
            }
        })
        .addCase(deleteWarehouse.fulfilled, (state, action) => {
            state.warehouses = state.warehouses.filter(w => w._id !== action.payload);
        });
});

export default warehouseReducer;
