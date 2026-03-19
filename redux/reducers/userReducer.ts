import { createReducer } from "@reduxjs/toolkit";
import {
  register,
  googleRegister,
  googleAuth,
  login,
  customerLogin,
  checkInitialAuth,
  googleLogin,
  loadUser,
  logout,
  verifyEmail,
  againEmail,
  forgotPassword,
  resetPassword,
  editProfile,
  verifyPassword,
  getAllUsers,
  deleteUser,
  updateUserRole,
  updateTheme,
  clearError,
  verifyEmailChange,
} from "../actions/userActions";

interface UserState {
  users: any[];
  user: any;
  loading: boolean;
  error: string | null;
  isAuthenticated?: boolean;
  isVerified?: boolean;
  message?: string | null;
  allUsers: any[];
  userStats: any;
  usersLoading: boolean;
  usersError: string | null;
}

const initialState: UserState = {
  users: [],
  user: {},
  loading: false,
  error: null,
  allUsers: [],
  userStats: null,
  usersLoading: false,
  usersError: null,
};

export const userReducer = createReducer(initialState, (builder) => {
  builder
    // Register
    .addCase(register.pending, (state) => {
      state.loading = true;
    })
    .addCase(register.fulfilled, (state, action) => {
      state.loading = false;
      state.isAuthenticated = false;
      state.user = action.payload;
      state.message = null;
      state.error = null;
    })
    .addCase(register.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    })
    // Google Register
    .addCase(googleRegister.pending, (state) => {
      state.loading = true;
    })
    .addCase(googleRegister.fulfilled, (state, action) => {
      state.loading = false;
      state.isAuthenticated = true;
      state.user = action.payload;
      state.message = null;
      state.error = null;
    })
    .addCase(googleRegister.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    })
    // Google Auth (Unified)
    .addCase(googleAuth.pending, (state) => {
      state.loading = true;
    })
    .addCase(googleAuth.fulfilled, (state, action) => {
      state.loading = false;
      state.isAuthenticated = true;
      state.user = action.payload;
      state.message = null;
      state.error = null;
    })
    .addCase(googleAuth.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    })
    // Login
    .addCase(login.pending, (state) => {
      state.loading = true;
    })
    .addCase(login.fulfilled, (state, action) => {
      state.loading = false;
      state.isAuthenticated = true;
      state.isVerified = true;
      state.user = action.payload;
    })
    .addCase(login.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    })
    // Customer Login
    .addCase(customerLogin.pending, (state) => {
      state.loading = true;
    })
    .addCase(customerLogin.fulfilled, (state, action) => {
      state.loading = false;
      state.isAuthenticated = true;
      state.user = action.payload;
    })
    .addCase(customerLogin.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    })
    // Google Login
    .addCase(googleLogin.pending, (state) => {
      state.loading = true;
    })
    .addCase(googleLogin.fulfilled, (state, action) => {
      state.loading = false;
      state.isAuthenticated = true;
      state.user = action.payload;
    })
    .addCase(googleLogin.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    })
    // Load User
    .addCase(loadUser.pending, (state) => {
      state.loading = true;
    })
    .addCase(loadUser.fulfilled, (state, action) => {
      state.loading = false;
      state.isAuthenticated = true;
      state.user = action.payload;
    })
    .addCase(loadUser.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    })
    // Logout
    .addCase(logout.pending, (state) => {
      state.loading = true;
    })
    .addCase(logout.fulfilled, (state, action) => {
      state.loading = false;
      state.isAuthenticated = false;
      state.isVerified = false;
      state.user = null;
      state.message = action.payload;
    })
    .addCase(logout.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    })
    // Verify Email
    .addCase(verifyEmail.pending, (state) => {
      state.loading = true;
    })
    .addCase(verifyEmail.fulfilled, (state, action) => {
      state.loading = false;
      state.message = action.payload.message;
    })
    .addCase(verifyEmail.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    })
    // Again Email
    .addCase(againEmail.pending, (state) => {
      state.loading = true;
    })
    .addCase(againEmail.fulfilled, (state, action) => {
      state.loading = false;
      state.message = action.payload as string;
    })
    .addCase(againEmail.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    })
    // Forgot Password
    .addCase(forgotPassword.pending, (state) => {
      state.loading = true;
    })
    .addCase(forgotPassword.fulfilled, (state, action) => {
      state.loading = false;
      state.message = action.payload as string;
    })
    .addCase(forgotPassword.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    })
    // Reset Password
    .addCase(resetPassword.pending, (state) => {
      state.loading = true;
    })
    .addCase(resetPassword.fulfilled, (state, action) => {
      state.loading = false;
      state.message = action.payload as string;
    })
    .addCase(resetPassword.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    })
    // Edit Profile
    .addCase(editProfile.pending, (state) => {
      state.loading = true;
    })
    .addCase(editProfile.fulfilled, (state, action) => {
      state.loading = false;
      state.message = action.payload.message || 'Profil başarıyla düzenlendi.';
    })
    .addCase(editProfile.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    })
    // Verify Email Change
    .addCase(verifyEmailChange.pending, (state) => {
      state.loading = true;
    })
    .addCase(verifyEmailChange.fulfilled, (state, action) => {
      state.loading = false;
      state.message = action.payload.message;
      if (state.user && action.payload.email) {
        state.user.email = action.payload.email;
      }
    })
    .addCase(verifyEmailChange.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    })
    // Check Initial Auth
    .addCase(checkInitialAuth.pending, (state) => {
      state.loading = true;
    })
    .addCase(checkInitialAuth.fulfilled, (state, action) => {
      state.loading = false;
      state.isAuthenticated = action.payload.isAuthenticated;
    })
    .addCase(checkInitialAuth.rejected, (state) => {
      state.loading = false;
      state.isAuthenticated = false;
    })
    // Verify Password
    .addCase(verifyPassword.pending, (state) => {
      state.loading = true;
    })
    .addCase(verifyPassword.fulfilled, (state) => {
      state.loading = false;
      state.message = 'Şifre Doğrulaması Başarılı.';
    })
    .addCase(verifyPassword.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    })
    // Get All Users
    .addCase(getAllUsers.pending, (state) => {
      state.usersLoading = true;
    })
    .addCase(getAllUsers.fulfilled, (state, action) => {
      state.usersLoading = false;
      state.allUsers = action.payload.users;
      state.userStats = action.payload.stats;
      state.message = action.payload.message;
    })
    .addCase(getAllUsers.rejected, (state, action) => {
      state.usersLoading = false;
      state.usersError = action.payload as string;
    })
    // Delete User
    .addCase(deleteUser.pending, (state) => {
      state.usersLoading = true;
    })
    .addCase(deleteUser.fulfilled, (state, action) => {
      state.usersLoading = false;
      state.allUsers = state.allUsers.filter(user => user._id !== action.payload.id);
      state.message = action.payload.message;
    })
    .addCase(deleteUser.rejected, (state, action) => {
      state.usersLoading = false;
      state.usersError = action.payload as string;
    })
    // Update User Role
    .addCase(updateUserRole.pending, (state) => {
      state.usersLoading = true;
    })
    .addCase(updateUserRole.fulfilled, (state, action) => {
      state.usersLoading = false;
      const index = state.allUsers.findIndex(user => user._id === action.payload.id);
      if (index !== -1) {
        state.allUsers[index].role = action.payload.role;
      }
      state.message = action.payload.message;
    })
    .addCase(updateUserRole.rejected, (state, action) => {
      state.usersLoading = false;
      state.usersError = action.payload as string;
    })
    // Update Theme
    .addCase(updateTheme.fulfilled, (state, action) => {
      if (state.user) {
        state.user.theme = action.payload.theme;
      }
    })
    // Clear Error
    .addCase(clearError.fulfilled, (state) => {
      state.error = null;
      state.message = null;
      state.usersError = null;
    });
});

export default userReducer;