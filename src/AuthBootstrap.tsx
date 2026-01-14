import { ReactNode, useEffect, useState } from "react";
import api, { setAccessToken } from "./api/auth";
import { store } from "./store";
import { clearAuth } from "./store/authSlice";

export default function AuthBootstrap({ children }: { children: ReactNode }) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      try {
        const res = await api.post("/auth/refresh-token");
        const token = res.data.accessToken;
        if (token) setAccessToken(token);
      } catch {
        store.dispatch(clearAuth());
      } finally {
        setLoading(false);
      }
    };
    initAuth();
  }, []);

  if (loading) return null; // or a spinner
  return <>{children}</>;
}
