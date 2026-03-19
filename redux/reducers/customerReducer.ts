import { createReducer } from "@reduxjs/toolkit";
import {
    createCustomer,
    getAllCustomers,
    updateCustomer,
    deleteCustomer,
    clearError,
    clearMessage,
} from "../actions/customerActions";

interface CustomerState {
    loading: boolean;
    customers: any[];
    customer: any | null;
    error: string | null;
    message: string | null;
}

const initialState: CustomerState = {
    loading: false,
    customers: [],
    customer: null,
    error: null,
    message: null,
};

export const customerReducer = createReducer(initialState, (builder) => {
    builder
        // Create Customer
        .addCase(createCustomer.pending, (state) => {
            state.loading = true;
        })
        .addCase(createCustomer.fulfilled, (state, action) => {
            state.loading = false;
            state.customers.push(action.payload);
            state.message = "Müşteri başarıyla oluşturuldu";
        })
        .addCase(createCustomer.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string;
        })

        // Get All Customers
        .addCase(getAllCustomers.pending, (state) => {
            state.loading = true;
        })
        .addCase(getAllCustomers.fulfilled, (state, action) => {
            state.loading = false;
            state.customers = action.payload || [];
        })
        .addCase(getAllCustomers.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string;
        })

        // Update Customer
        .addCase(updateCustomer.pending, (state) => {
            // Remove full-screen loading for background updates
        })
        .addCase(updateCustomer.fulfilled, (state, action) => {
            state.loading = false;
            const index = state.customers.findIndex(c => c._id === action.payload._id);
            if (index !== -1) {
                state.customers[index] = action.payload;
            }
            state.message = "Müşteri başarıyla güncellendi";
        })
        .addCase(updateCustomer.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string;
        })

        // Delete Customer
        .addCase(deleteCustomer.pending, (state) => {
            // Remove full-screen loading for background updates
        })
        .addCase(deleteCustomer.fulfilled, (state, action) => {
            state.loading = false;
            state.customers = state.customers.filter(c => c._id !== action.payload);
            state.message = "Müşteri başarıyla silindi";
        })
        .addCase(deleteCustomer.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string;
        })

        // Error and Message Handling
        .addCase(clearError.fulfilled, (state) => {
            state.error = null;
        })
        .addCase(clearMessage.fulfilled, (state) => {
            state.message = null;
        });
});

export default customerReducer;
