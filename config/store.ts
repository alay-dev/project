import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import {
  PreloadedState,
  combineReducers,
  configureStore,
} from "@reduxjs/toolkit";
import { userSlice } from "@/slices/user";
import { patientApi } from "@/api/patient";
import { filesApi } from "@/api/files";

export type RootState = ReturnType<typeof reducer>;
export type AppStore = ReturnType<typeof setupStore>;
export type AppDispatch = AppStore["dispatch"];

export const reducer = combineReducers({
  user: userSlice.reducer,
  [patientApi.reducerPath]: patientApi.reducer,
  [filesApi.reducerPath]: filesApi.reducer,
});

function setupStore(preloadedState?: PreloadedState<RootState>) {
  return configureStore({
    reducer,
    preloadedState,
    devTools: process.env.NODE_ENV === "production" ? false : true,
    middleware: (middleware) =>
      middleware().concat(patientApi.middleware).concat(filesApi.middleware),
  });
}

export const store = setupStore();

export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
export const useAppDispatch: () => AppDispatch = useDispatch;
