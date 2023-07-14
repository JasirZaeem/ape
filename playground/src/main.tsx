import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { ThemeProvider } from "@/themeContext.tsx";
import { ApeProvider } from "@/apeContext.tsx";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <ThemeProvider>
      <ApeProvider>
        <App />
      </ApeProvider>
    </ThemeProvider>
  </React.StrictMode>
);
