"use client";

import { ReactNode } from "react";
import { Provider } from "react-redux";

import { store } from "@/config/store";
import Theme from "./Theme";

export function RootProviders({ children }: { children?: ReactNode }) {
  return (
    <Provider store={store}>
      <Theme>{children}</Theme>
    </Provider>
  );
}
