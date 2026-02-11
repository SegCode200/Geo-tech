// src/store/index.ts
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

const persistConfig = { key: 'root', storage, whitelist: ['auth'] };

const persistedReducer = persistReducer(
  persistConfig,
  (
    state = { auth: authReducer(undefined, { type: '@@INIT' }) },
    action: any
  ) => ({
    auth: authReducer((state as any)?.auth, action),
  }) as any
);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      thunk: true,
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;