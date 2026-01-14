import { Navigate } from "react-router-dom";
import { useEffect, useState, ReactNode } from "react";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { clearAuth, refreshAccessToken } from "../../store/authSlice";
import { setAccessToken } from "../../api/auth";

const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const dispatch = useAppDispatch();
  const accessToken = useAppSelector((s) => s.auth.accessToken);
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    const validateSession = async () => {
      // If we already have an access token in the store, use it and skip refresh
      if (accessToken) {
        setAccessToken(accessToken);
        setAuthorized(true);
        setLoading(false);
        return;
      }
      try {
        // dispatch the refresh thunk which sets axios header on success
        await dispatch(refreshAccessToken()).unwrap();
        setAuthorized(true);
      } catch {
        dispatch(clearAuth());
        setAuthorized(false);
      } finally {
        setLoading(false);
      }
    };

    validateSession();
  }, [dispatch, accessToken]);

  console.log(authorized)

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-sm text-slate-500">
        Validating session…
      </div>
    );
  }

  if (authorized === false) {
    return <Navigate to="/auth/login" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
