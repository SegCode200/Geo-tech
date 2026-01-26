import axios, {AxiosInstance } from "axios";
import { api } from "./interceptors";

export type RegisterPayload = {
  firstName?: string;
  lastName?: string;
  fullName?: string; // backend may accept fullName
  email: string;
  password: string;
  phone?: string;
};

export type LoginPayload = {
  email: string;
  password: string;
};

export type ApiError = {
  message?: string;
  errors?: any;
};

export { setAccessToken } from "./interceptors";

export function normalizeAxiosError(err: any): ApiError {
  if (err?.response?.data) return err.response.data as ApiError;
  if (err?.message) return { message: err.message };
  return { message: "Request failed" };
}

export async function register(payload: RegisterPayload) {
  const body = {
    fullName:
      payload.fullName ||
      `${payload.firstName || ""} ${payload.lastName || ""}`.trim(),
    email: payload.email,
    password: payload.password,
    ...(payload.phone ? { phone: payload.phone } : {}),
  };

  try {
    const res = await api.post("/auth/register", body);
    return res.data;
  } catch (err: any) {
    throw normalizeAxiosError(err);
  }
}

export async function login(payload: LoginPayload) {
  try {
    const res = await api.post("/auth/login", payload);
    return res.data;
  } catch (err: any) {
    throw normalizeAxiosError(err);
  }
}
export async function resendVerificationEmail(email: string) {
  try {
    const res = await api.post("/auth/resend-verification", { email });
    return res.data;
  } catch (err: any) {
    throw normalizeAxiosError(err);
  }
}

export async function verifyEmail(email: string, token: string) {
  try {
    const res = await api.post("/auth/verify-email", { email, token });
    return res.data;
  } catch (err: any) {
    throw normalizeAxiosError(err);
  }
}

export async function logout() {
  try {
    const res = await api.post("/auth/logout");
    return res.data;
  } catch (err: any) {
    throw normalizeAxiosError(err);
  }
}
export async function refresh() {
  try {
    // backend exposes cookie-based refresh at /auth/refresh
    const res = await api.post("/auth/refresh-token");
    return res.data; // expected { accessToken }
  } catch (err: any) {
    throw normalizeAxiosError(err);
  }
}

export async function requestPasswordReset(email: string) {
  try {
    const res = await api.post("/auth/request-password-reset", { email });
    return res.data;
  } catch (err: any) {
    throw normalizeAxiosError(err);
  }
}

export async function resetPassword(token: string, newPassword: string) {
  try {
    const res = await api.post("/auth/reset-password", { token, newPassword });
    return res.data;
  } catch (err: any) {
    throw normalizeAxiosError(err);
  }
}

export async function landRegisteration(formData: FormData) {
  try {
    const res = await api.post("/lands/land-register", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return res.data;
  } catch (error) {
    throw normalizeAxiosError(error);
  }
}

export async function getLandRegistrations() {
  try {
    const res = await api.get("/lands/get-user-lands");
    return res.data;
  }
  catch (error) {
    throw normalizeAxiosError(error);
  }
}

export async function getStates() {
  try {
    const res = await api.get("/auth/get-state");
    return res.data;
  } catch (error) {
    throw normalizeAxiosError(error);
  }
}

export async function deleteLand(landId: string) {
  try {
    const res = await api.delete(`/lands/${landId}`);
    return res.data;
  } catch (error) {
    throw normalizeAxiosError(error);
  }
}

export async function updateLand(landId: string, formData: FormData) {
  try {
    const res = await api.put(`/lands/${landId}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return res.data;
  } catch (error) {
    throw normalizeAxiosError(error);
  }
}

export async function searchLands(
  longitude: number,
  latitude: number,
  radius: number = 50
) {
  try {
    const res = await api.get(
      `/lands/search-lands?lat=${longitude}&lng=${latitude}&radius=${radius}`
    );
    return res.data;
  } catch (error) {
    throw normalizeAxiosError(error);
  }
}
export default api;
