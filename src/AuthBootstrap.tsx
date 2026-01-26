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
        const res = await api.post("/auth/refresh-token");
        const token = res.data.accessToken;
        if (token) {
          setApiToken(token);
          dispatch(setAccessToken(token));
        }
      } catch {
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
