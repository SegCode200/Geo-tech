import axios, { AxiosInstance } from "axios";
import { store } from "../store";
import { clearAuth } from "../store/authSlice";

const API_BASE = "https://geo-tech-backend.onrender.com/api"; // adjust for prod
export const api: AxiosInstance = axios.create({
  baseURL: API_BASE,
  withCredentials: true, // sends HttpOnly cookies automatically
  headers: { "Content-Type": "application/json" },
});

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (token?: string) => void;
  reject: (err: any) => void;
}> = [];

const processQueue = (error: any = null, token?: string) => {
  failedQueue.forEach((prom) => {
    if (error) prom.reject(error);
    else prom.resolve(token);
  });
  failedQueue = [];
};

// Attach access token to headers
export const setAccessToken = (token: string) => {
  api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
};

export const refresh = async () => {
  const res = await api.post("/auth/refresh-token"); // cookie-based
  return res.data; // { accessToken }
};

// Interceptor to auto-refresh on 401
export const setupInterceptors = () => {
  api.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;
      if (error.response?.status === 401 && !originalRequest._retry) {
        if (isRefreshing) {
          return new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject });
          }).then((token) => {
            if (token) originalRequest.headers["Authorization"] = `Bearer ${token}`;
            return api(originalRequest);
          });
        }

        originalRequest._retry = true;
        isRefreshing = true;

        try {
          const data = await refresh();
          const token = data?.accessToken;
          if (token) setAccessToken(token);
          processQueue(null, token);
          if (token) originalRequest.headers["Authorization"] = `Bearer ${token}`;
          return api(originalRequest);
        } catch (err) {
          processQueue(err, undefined);
          store.dispatch(clearAuth());
          window.location.href = "/auth/login";
          return Promise.reject(err);
        } finally {
          isRefreshing = false;
        }
      }
      return Promise.reject(error);
    }
  );
};
