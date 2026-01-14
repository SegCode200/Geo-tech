import { RouterProvider } from "react-router-dom";
import mainRoute from "./router/mainRoute";
import { Toaster } from "react-hot-toast";
import { Provider } from "react-redux";
import { store, persistor } from "./store";
import { PersistGate } from "redux-persist/integration/react";
import { useEffect } from "react";
import { setupInterceptors, setAccessToken } from "./api/interceptors";
import AuthBootstrap from "./AuthBootstrap";

function App() {
  function AppInner() {
    useEffect(() => {
      setupInterceptors();
      const token = store.getState().auth.accessToken;
      if (token) setAccessToken(token);
    }, []);

    return (
      <PersistGate loading={null} persistor={persistor}>
        <AuthBootstrap>
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 5000,
              style: { borderRadius: "8px", background: "#0f172a", color: "#fff" },
            }}
          />
          <RouterProvider router={mainRoute} />
        </AuthBootstrap>
      </PersistGate>
    );
  }

  return (
    <Provider store={store}>
      <AppInner />
    </Provider>
  );
}

export default App;
