import axios, { AxiosError, AxiosResponse } from "axios";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { server } from "@/config";

// Add axios interceptor to suppress 404 errors in console
axios.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError) => {
    if (error.response?.status === 404 && error.config?.url?.includes('/auth/me')) {
      return Promise.reject(error);
    }
    return Promise.reject(error);
  }
);

export interface RegisterPayload {
  name: string;
  surname: string;
  email: string;
  password: string;
  picture?: string;
  company?: string;
  taxNumber?: string;
  userType?: "buyer" | "provider" | "customer";
  companyCode?: string;
  sectors?: string[];
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface ResetPasswordPayload {
  email: string;
  passwordToken: string;
  newPassword: string;
}

export interface VerifyEmailPayload {
  email: string;
  verificationCode: string;
}

export interface AgainEmailPayload {
  email: string;
}

export interface VerifyPasswordPayload {
  password: string;
}

export interface EditProfilePayload {
  name?: string;
  surname?: string;
  email?: string;
  password?: string;
  picture?: string;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    postalCode?: string;
    country?: string;
  };
  phoneNumber?: string;
  theme?: string;
  showOnlineStatus?: boolean;
  offerStatusNotificationSettings?: {
    department: string;
    duration: number;
    enabled: boolean;
  };
}

export interface GoogleLoginPayload {
  email: string;
  name: string;
  surname: string;
  googleId: string;
  birthDate?: string;
}

export const register = createAsyncThunk(
  "user/register",
  async ({ name, surname, email, password, picture, company, taxNumber, userType, companyCode, sectors }: RegisterPayload, thunkAPI) => {
    try {
      const { data } = await axios.post(`${server}/auth/register`, {
        name,
        surname,
        email,
        password,
        picture,
        company,
        taxNumber,
        userType,
        companyCode,
        sectors
      });

      if (data.user && data.user.token) {
        localStorage.setItem("accessToken", data.user.token);
      }

      return data.user;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || "Kayıt işlemi başarısız oldu.");
    }
  }
);

export const login = createAsyncThunk(
  "user/login",
  async ({ email, password }: LoginPayload, thunkAPI) => {
    try {
      const { data } = await axios.post(`${server}/auth/login`, {
        email,
        password,
      });

      if (data.user && data.user.token) {
        localStorage.setItem("accessToken", data.user.token);
        localStorage.setItem("userEmail", data.user.email);
      }
      return data.user;
    } catch (error: any) {
      if (error.response?.data?.requiresVerification) {
        return thunkAPI.rejectWithValue({
          message: error.response.data.message,
          requiresVerification: true,
          email: error.response.data.email,
        });
      }
      return thunkAPI.rejectWithValue(error.response?.data?.message || "Giriş yapılamadı.");
    }
  }
);

export const customerLogin = createAsyncThunk(
  "user/customerLogin",
  async ({ email, password }: LoginPayload, thunkAPI) => {
    try {
      const { data } = await axios.post(`${server}/customer/login`, {
        email,
        password,
      });

      if (data.token) {
        localStorage.setItem("accessToken", data.token);
      }

      const customerUser = {
        _id: data.customer._id,
        name: data.customer.name,
        email: data.customer.email,
        picture: data.customer.picture,
        userType: data.customer.userType || 'customer',
        providerId: data.customer.providerId,
        token: data.token,
      };

      return customerUser;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || "Müşteri girişi yapılamadı.");
    }
  }
);

export const checkInitialAuth = createAsyncThunk(
  "user/checkInitialAuth",
  async (_, thunkAPI) => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        return { isAuthenticated: false };
      }
      return { isAuthenticated: true };
    } catch (error: any) {
      return { isAuthenticated: false };
    }
  }
);

export const loadUser = createAsyncThunk(
  "user/loadUser",
  async (_, thunkAPI) => {
    try {
      const token = localStorage.getItem("accessToken");

      if (!token) {
        return thunkAPI.rejectWithValue("Oturum açmanız gerekiyor");
      }

      const { data } = await axios.get(`${server}/auth/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return data.user;
    } catch (error: any) {
      if (error.response?.status === 401) {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("userEmail");
      }
      return thunkAPI.rejectWithValue(error.response?.data?.message || "Kullanıcı bilgileri yüklenemedi.");
    }
  }
);

export const logout = createAsyncThunk("user/logout", async (_, thunkAPI) => {
  try {
    const token = localStorage.getItem("accessToken");

    if (token) {
      await axios.get(`${server}/auth/logout`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    }

    localStorage.removeItem("accessToken");
    localStorage.removeItem("userEmail");
    return "Oturum kapatıldı";
  } catch (error: any) {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("userEmail");
    // Don't reject if logout fails on server, we already cleared local storage
    return "Oturum kapatıldı";
  }
});

export const verifyEmail = createAsyncThunk(
  "user/verifyEmail",
  async ({ email, verificationCode }: VerifyEmailPayload, thunkAPI) => {
    try {
      const { data } = await axios.post(`${server}/auth/verify-email`, {
        email,
        verificationCode,
      });

      if (data.user && data.user.token) {
        localStorage.setItem("accessToken", data.user.token);
      }

      return { message: data.message, user: data.user };
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || "Doğrulama başarısız oldu.");
    }
  }
);

export const againEmail = createAsyncThunk(
  "user/againEmail",
  async ({ email }: AgainEmailPayload, thunkAPI) => {
    try {
      const { data } = await axios.post(`${server}/auth/again-email`, { email });
      return data.message;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || "Kod tekrar gönderilemedi.");
    }
  }
);

export const forgotPassword = createAsyncThunk(
  "user/forgotPassword",
  async (email: string, thunkAPI) => {
    try {
      const { data } = await axios.post(`${server}/auth/forgot-password`, { email });
      return data.message;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || "E-posta gönderilemedi.");
    }
  }
);

export const resetPassword = createAsyncThunk(
  "user/resetPassword",
  async ({ email, passwordToken, newPassword }: ResetPasswordPayload, thunkAPI) => {
    try {
      const { data } = await axios.post(`${server}/auth/reset-password`, {
        email,
        passwordToken,
        newPassword,
      });
      return data.message;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || "Şifre sıfırlanamadı.");
    }
  }
);

export const editProfile = createAsyncThunk(
  "user/editProfile",
  async (userData: EditProfilePayload, thunkAPI) => {
    try {
      const token = localStorage.getItem("accessToken");

      if (!token) {
        return thunkAPI.rejectWithValue("Oturum açmanız gerekiyor");
      }

      const { data } = await axios.post(
        `${server}/auth/edit-profile`,
        userData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          }
        }
      );

      return data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || "Profil güncellenemedi.");
    }
  }
);

export const verifyEmailChange = createAsyncThunk(
  "user/verifyEmailChange",
  async (verificationCode: string, thunkAPI) => {
    try {
      const token = localStorage.getItem("accessToken");

      if (!token) {
        return thunkAPI.rejectWithValue("Oturum açmanız gerekiyor");
      }

      const { data } = await axios.post(
        `${server}/auth/verify-email-change`,
        { verificationCode },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          }
        }
      );

      return data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || "E-posta doğrulanamadı.");
    }
  }
);

export const verifyPassword = createAsyncThunk(
  "user/verifyPassword",
  async ({ password }: VerifyPasswordPayload, thunkAPI) => {
    try {
      const token = localStorage.getItem("accessToken");

      if (!token) {
        return thunkAPI.rejectWithValue("Oturum açmanız gerekiyor");
      }

      const { data } = await axios.post(
        `${server}/auth/verify-password`,
        { password },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          }
        }
      );

      return data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || "Şifre doğrulanamadı.");
    }
  }
);

// Google Auth Actions
export const googleRegister = createAsyncThunk(
  "user/googleRegister",
  async (payload: GoogleLoginPayload, thunkAPI) => {
    try {
      const { data } = await axios.post(`${server}/auth/google-register`, payload);
      localStorage.setItem("accessToken", data.user.token);
      return data.user;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response.data.message);
    }
  }
);

export const googleAuth = createAsyncThunk(
  "user/googleAuth",
  async (payload: GoogleLoginPayload, thunkAPI) => {
    try {
      const { data } = await axios.post(`${server}/auth/google-auth`, payload);
      localStorage.setItem("accessToken", data.user.token);
      localStorage.setItem("userEmail", data.user.email);
      return data.user;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response.data.message);
    }
  }
);

export const googleLogin = createAsyncThunk(
  "user/googleLogin",
  async (payload: GoogleLoginPayload, thunkAPI) => {
    try {
      const { data } = await axios.post(`${server}/auth/google-login`, payload);
      localStorage.setItem("accessToken", data.user.token);
      localStorage.setItem("userEmail", data.user.email);
      return data.user;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response.data.message);
    }
  }
);

// Admin Actions
export const getAllUsers = createAsyncThunk(
  "user/getAllUsers",
  async (params: Record<string, string> = {}, thunkAPI) => {
    try {
      const token = localStorage.getItem("accessToken");
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const queryString = new URLSearchParams(params).toString();
      const url = `${server}/auth/users${queryString ? `?${queryString}` : ''}`;
      const response = await axios.get(url, config);
      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || "Kullanıcılar getirilemedi.");
    }
  }
);

export const deleteUser = createAsyncThunk(
  "user/deleteUser",
  async (id: string, thunkAPI) => {
    try {
      const token = localStorage.getItem("accessToken");
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const response = await axios.delete(`${server}/auth/users/${id}`, config);
      return { id, message: response.data.message };
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || "Kullanıcı silinemedi.");
    }
  }
);

export const updateUserRole = createAsyncThunk(
  "user/updateUserRole",
  async ({ id, role }: { id: string; role: string }, thunkAPI) => {
    try {
      const token = localStorage.getItem("accessToken");
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };
      const response = await axios.patch(`${server}/auth/users/${id}/role`, { role }, config);
      return { id, role, message: response.data.message };
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || "Rol güncellenemedi.");
    }
  }
);

export const deleteAccount = createAsyncThunk(
  "user/deleteAccount",
  async (_, thunkAPI) => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) return thunkAPI.rejectWithValue("Oturum açmanız gerekiyor");

      const { data } = await axios.delete(`${server}/auth/delete-account`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      localStorage.removeItem("accessToken");
      localStorage.removeItem("userEmail");
      return data.message;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || "Hesap silinemedi.");
    }
  }
);

export const updateTheme = createAsyncThunk(
  "user/updateTheme",
  async (theme: string, thunkAPI) => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      return { theme };
    }

    axios.post(
      `${server}/auth/edit-profile`,
      { theme },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        timeout: 3000,
      }
    ).catch(() => { });

    return { theme };
  }
);

export const clearError = createAsyncThunk(
  "user/clearError",
  async () => {
    return null;
  }
);

