import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./global.css";
import App from "./App.tsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter as Router } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { initAmplitude } from "./lib/amplitide.ts";

const queryClient = new QueryClient();
initAmplitude();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <Router>
        <App />

        <Toaster position="bottom-right" reverseOrder={false} />
      </Router>
    </QueryClientProvider>
  </StrictMode>
);
