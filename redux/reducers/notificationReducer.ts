import { createSlice } from '@reduxjs/toolkit';
import { getNotifications, markAsRead, markAllAsRead } from '../actions/notificationActions';

interface NotificationState {
    notifications: any[];
    count: number;
    loading: boolean;
    error: string | null;
}

const initialState: NotificationState = {
    notifications: [],
    count: 0,
    loading: false,
    error: null,
};

const notificationSlice = createSlice({
    name: 'notification',
    initialState,
    reducers: {
        clearNotificationError: (state) => {
            state.error = null;
        },
        addNotification: (state, action) => {
            state.notifications.unshift(action.payload);
            state.count += 1;
        }
    },
    extraReducers: (builder) => {
        builder
            // Get Notifications
            .addCase(getNotifications.pending, (state) => {
                state.loading = true;
            })
            .addCase(getNotifications.fulfilled, (state, action) => {
                state.loading = false;
                state.notifications = action.payload.notifications;
                state.count = action.payload.count;
            })
            .addCase(getNotifications.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            // Mark As Read
            .addCase(markAsRead.fulfilled, (state, action) => {
                const index = state.notifications.findIndex(n => n._id === action.payload._id);
                if (index !== -1) {
                    state.notifications[index] = action.payload;
                }
            })
            // Mark All As Read
            .addCase(markAllAsRead.fulfilled, (state, action) => {
                state.notifications = state.notifications.map(n => {
                    if (!action.payload.type || n.type === action.payload.type) {
                        return { ...n, isRead: true };
                    }
                    return n;
                });
            });
    },
});

export const { clearNotificationError, addNotification } = notificationSlice.actions;
export default notificationSlice.reducer;
