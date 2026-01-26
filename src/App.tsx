import { RouterProvider } from "react-router-dom";
import mainRoute from "./router/mainRoute";
import { Toaster } from "react-hot-toast";
import { Provider,  useSelector } from "react-redux";
import { store, persistor } from "./store";
import { PersistGate } from "redux-persist/integration/react";
import { useEffect } from "react";
import { setAccessToken as setApiToken } from "./api/interceptors";
// import { setAccessToken } from "./store/authSlice";
import AuthBootstrap from "./AuthBootstrap";
import { RootState } from "./store";

function App() {
  function AppInner() {
    // const dispatch = useDispatch();
    const token = useSelector((state: RootState) => state.auth.accessToken);

    useEffect(() => {
      // Set token in API when it changes
      if (token) setApiToken(token);
    }, [token]);

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
