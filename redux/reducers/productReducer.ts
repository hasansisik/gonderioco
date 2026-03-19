import { createReducer } from "@reduxjs/toolkit";
import {
    createProduct,
    getAllProducts,
    updateProduct,
    deleteProduct,
    clearError,
    clearMessage,
} from "../actions/productActions";

interface ProductState {
    loading: boolean;
    products: any[];
    product: any | null;
    error: string | null;
    message: string | null;
}

const initialState: ProductState = {
    loading: false,
    products: [],
    product: null,
    error: null,
    message: null,
};

export const productReducer = createReducer(initialState, (builder) => {
    builder
        // Create Product
        .addCase(createProduct.pending, (state) => {
            state.loading = true;
        })
        .addCase(createProduct.fulfilled, (state, action) => {
            state.loading = false;
            state.products.push(action.payload);
            state.message = "Ürün başarıyla oluşturuldu";
        })
        .addCase(createProduct.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string;
        })

        // Get All Products
        .addCase(getAllProducts.pending, (state) => {
            state.loading = true;
        })
        .addCase(getAllProducts.fulfilled, (state, action) => {
            state.loading = false;
            state.products = action.payload || [];
        })
        .addCase(getAllProducts.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string;
        })

        // Update Product
        .addCase(updateProduct.pending, (state) => {
            state.loading = true;
        })
        .addCase(updateProduct.fulfilled, (state, action) => {
            state.loading = false;
            const index = state.products.findIndex(p => p._id === action.payload._id);
            if (index !== -1) {
                state.products[index] = action.payload;
            }
            state.message = "Ürün başarıyla güncellendi";
        })
        .addCase(updateProduct.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string;
        })

        // Delete Product
        .addCase(deleteProduct.pending, (state) => {
            state.loading = true;
        })
        .addCase(deleteProduct.fulfilled, (state, action) => {
            state.loading = false;
            state.products = state.products.filter(p => p._id !== action.payload);
            state.message = "Ürün başarıyla silindi";
        })
        .addCase(deleteProduct.rejected, (state, action) => {
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

export default productReducer;
