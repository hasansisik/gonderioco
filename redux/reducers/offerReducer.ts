import { createReducer } from "@reduxjs/toolkit";
import {
    createOffer,
    getAllOffers,
    updateOffer,
    deleteOffer,
    approveOfferCustomer,
    rejectOfferCustomer,
    requestRevisionOffer,
    completeOffer,
    rateOffer,
    addOfferQuestion,
    markOfferQuestionsRead,
    approveOfferManager,
    rejectOfferManager,
    clearError,
    clearMessage,
} from "../actions/offerActions";

interface OfferState {
    loading: boolean;
    offers: any[];
    offer: any | null;
    error: string | null;
    message: string | null;
}

const initialState: OfferState = {
    loading: false,
    offers: [],
    offer: null,
    error: null,
    message: null,
};

export const offerReducer = createReducer(initialState, (builder) => {
    builder
        // Create Offer
        .addCase(createOffer.pending, (state) => {
            state.loading = true;
        })
        .addCase(createOffer.fulfilled, (state, action) => {
            state.loading = false;
            state.offers.push(action.payload);
            state.message = "Teklif başarıyla oluşturuldu";
        })
        .addCase(createOffer.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string;
        })

        // Get All Offers
        .addCase(getAllOffers.pending, (state) => {
            state.loading = true;
        })
        .addCase(getAllOffers.fulfilled, (state, action) => {
            state.loading = false;
            state.offers = action.payload || [];
        })
        .addCase(getAllOffers.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string;
        })

        // Update Offer
        .addCase(updateOffer.pending, (state) => {
            state.loading = true;
        })
        .addCase(updateOffer.fulfilled, (state, action) => {
            state.loading = false;
            const index = state.offers.findIndex(o => o._id === action.payload._id);
            if (index !== -1) {
                state.offers[index] = action.payload;
            }
            state.message = "Teklif başarıyla güncellendi";
        })
        .addCase(updateOffer.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string;
        })

        // Delete Offer
        .addCase(deleteOffer.pending, (state) => {
            state.loading = true;
        })
        .addCase(deleteOffer.fulfilled, (state, action) => {
            state.loading = false;
            state.offers = state.offers.filter(o => o._id !== action.payload);
            state.message = "Teklif başarıyla silindi";
        })
        .addCase(deleteOffer.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string;
        })

        // Customer Action: Approve
        .addCase(approveOfferCustomer.pending, (state) => {
            state.loading = true;
        })
        .addCase(approveOfferCustomer.fulfilled, (state, action) => {
            state.loading = false;
            const index = state.offers.findIndex(o => o._id === action.payload._id);
            if (index !== -1) {
                state.offers[index] = action.payload;
            }
            state.message = "Teklif onaylandı";
        })
        .addCase(approveOfferCustomer.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string;
        })

        // Customer Action: Reject
        .addCase(rejectOfferCustomer.pending, (state) => {
            state.loading = true;
        })
        .addCase(rejectOfferCustomer.fulfilled, (state, action) => {
            state.loading = false;
            const index = state.offers.findIndex(o => o._id === action.payload._id);
            if (index !== -1) {
                state.offers[index] = action.payload;
            }
            state.message = "Teklif reddedildi";
        })
        .addCase(rejectOfferCustomer.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string;
        })

        // Customer Action: Revision
        .addCase(requestRevisionOffer.pending, (state) => {
            state.loading = true;
        })
        .addCase(requestRevisionOffer.fulfilled, (state, action) => {
            state.loading = false;
            const index = state.offers.findIndex(o => o._id === action.payload._id);
            if (index !== -1) {
                state.offers[index] = action.payload;
            }
            state.message = "Revizyon talebi iletildi";
        })
        .addCase(requestRevisionOffer.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string;
        })

        // Manager Action: Approve
        .addCase(approveOfferManager.pending, (state) => {
            state.loading = true;
        })
        .addCase(approveOfferManager.fulfilled, (state, action) => {
            state.loading = false;
            const index = state.offers.findIndex(o => o._id === action.payload._id);
            if (index !== -1) {
                state.offers[index] = action.payload;
            }
            state.message = "Teklif yönetici tarafından onaylandı";
        })
        .addCase(approveOfferManager.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string;
        })

        // Manager Action: Reject
        .addCase(rejectOfferManager.pending, (state) => {
            state.loading = true;
        })
        .addCase(rejectOfferManager.fulfilled, (state, action) => {
            state.loading = false;
            const index = state.offers.findIndex(o => o._id === action.payload._id);
            if (index !== -1) {
                state.offers[index] = action.payload;
            }
            state.message = "Teklif yönetici tarafından reddedildi";
        })
        .addCase(rejectOfferManager.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string;
        })

        // Complete Offer
        .addCase(completeOffer.fulfilled, (state, action: any) => {
            const index = state.offers.findIndex(o => o._id === action.payload.offer._id);
            if (index !== -1) {
                state.offers[index] = action.payload.offer;
            }
        })

        // Rate Offer
        .addCase(rateOffer.fulfilled, (state, action) => {
            const index = state.offers.findIndex(o => o._id === action.payload._id);
            if (index !== -1) {
                state.offers[index] = action.payload;
            }
        })

        // Question: Add
        .addCase(addOfferQuestion.fulfilled, (state, action) => {
            const index = state.offers.findIndex(o => o._id === action.payload._id);
            if (index !== -1) {
                state.offers[index] = action.payload;
            }
        })

        // Question: Read
        .addCase(markOfferQuestionsRead.fulfilled, (state, action) => {
            const index = state.offers.findIndex(o => o._id === action.payload._id);
            if (index !== -1) {
                state.offers[index] = action.payload;
            }
        })

        // Error and Message Handling
        .addCase(clearError.fulfilled, (state) => {
            state.error = null;
        })
        .addCase(clearMessage.fulfilled, (state) => {
            state.message = null;
        });
});

export default offerReducer;
