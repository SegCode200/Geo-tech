// src/store/authSlice.ts
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as authApi from "../api/auth";

export type User = {
  id?: string;
  name?: string;
  email: string;
  role?: string;
};

type AuthState = {
  user: User | null;
  accessToken: string | null;
  status: "idle" | "loading" | "authenticated" | "unauthenticated";
  error?: string | null;
};

const initialState: AuthState = {
  user: null,
  accessToken: null,
  status: "idle",
  error: null,
};

/**
 * 🔐 LOGIN
 * - Sets refresh cookie on backend
 * - DOES NOT return accessToken
 */
export const loginUser = createAsyncThunk<
  { user: User; accessToken?: string },
  { email: string; password: string },
  { rejectValue: string }
>("auth/login", async (payload, { rejectWithValue }) => {
  try {
    const res = await authApi.login(payload);
    return { user: res.user, accessToken: res.accessToken };
  } catch (err: any) {
    // extract message from API error response or use default
    const message = err?.response?.data?.message || err?.message || "Login failed";
    return rejectWithValue(message);
  }
});

/**
 * 🔁 REFRESH SESSION
 * - Validates cookie
 * - Returns fresh accessToken + user
 */
export const refreshAccessToken = createAsyncThunk<
  { accessToken: string },
  void,
  { rejectValue: string }
>("auth/refresh-token", async (_, { rejectWithValue }) => {
  try {
    const res = await authApi.refresh();
    return res;
  } catch {
    return rejectWithValue("Session expired");
  }
});

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearAuth(state) {
      state.user = null;
      state.accessToken = null;
      state.status = "unauthenticated";
      state.error = null;
    },
    setAccessToken(state, action) {
      state.accessToken = action.payload;
    },
  },
  extraReducers(builder) {
    builder
      // LOGIN
      .addCase(loginUser.pending, (s) => {
        s.status = "loading";
        s.error = null;
      })
      .addCase(loginUser.fulfilled, (s, action) => {
        s.user = action.payload.user;
        s.accessToken = action.payload.accessToken ?? null;
        s.status = "authenticated";
      })
      .addCase(loginUser.rejected, (s, action) => {
        s.status = "unauthenticated";
        s.error = action.payload ?? "Login failed";
      })

      // REFRESH
      .addCase(refreshAccessToken.fulfilled, (s, action) => {
        s.accessToken = action.payload.accessToken;
        s.status = "authenticated";
      })
      .addCase(refreshAccessToken.rejected, (s) => {
        s.accessToken = null;
        s.status = "unauthenticated";
      });
  },
});

export const { clearAuth, setAccessToken } = authSlice.actions;
export default authSlice.reducer;
