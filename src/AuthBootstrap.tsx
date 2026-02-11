import { ReactNode, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { api, setupInterceptors, setAccessToken as setApiToken } from "./api/interceptors";
import { clearAuth, setAccessToken } from "./store/authSlice";

export default function AuthBootstrap({ children }: { children: ReactNode }) {
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();

  useEffect(() => {
    const initAuth = async () => {
      // Setup interceptors with callback for clearing auth on 401
      setupInterceptors(() => {
        dispatch(clearAuth());
      });

      try {
        // Only attempt refresh if user has been logged in before (has a refresh token)
        // Check if there's a token in Redux state or localStorage (from persistence)
        const token = localStorage.getItem("auth_token"); // or check Redux state
        if (token) {
          const res = await api.post("/auth/refresh-token");
          const newToken = res.data.accessToken;
          if (newToken) {
            setApiToken(newToken);
            dispatch(setAccessToken(newToken));
          }
        }
      } catch (err) {
        // Silent fail - user is not logged in, that's okay
        dispatch(clearAuth());
      } finally {
        setLoading(false);
      }
    };
    initAuth();
  }, [dispatch]);

  if (loading) return null; // or a spinner
  return <>{children}</>;
}
