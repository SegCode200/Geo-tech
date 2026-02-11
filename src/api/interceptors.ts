import axios, { AxiosInstance } from "axios";

const API_BASE = "https://geo-tech-backend.onrender.com/api"; // adjust for prod
export const api: AxiosInstance = axios.create({
  baseURL: API_BASE,
  withCredentials: true, // sends HttpOnly cookies automatically
  headers: { 
    "Content-Type": "application/json",
    // Don't set Authorization header here - set it dynamically via setAccessToken
  },
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
export const setupInterceptors = (onUnauthorized?: () => void) => {
  api.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;
      
      // Only retry on 401 for non-refresh endpoints to avoid infinite loops
      if (
        error.response?.status === 401 &&
        !originalRequest._retry &&
        !originalRequest.url?.includes("/auth/refresh-token")
      ) {
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
          // Call the callback instead of directly importing store
          if (onUnauthorized) onUnauthorized();
          // Don't force redirect here - let the app handle logout
          return Promise.reject(err);
        } finally {
          isRefreshing = false;
        }
      }
      
      // For refresh-token endpoint returning 401, just reject
      if (originalRequest.url?.includes("/auth/refresh-token") && error.response?.status === 401) {
        return Promise.reject(error);
      }
      
      return Promise.reject(error);
    }
  );
};
