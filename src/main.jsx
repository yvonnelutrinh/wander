import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import { IndexProvider } from "./data/IndexProvider.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <IndexProvider>
        <App />
      </IndexProvider>
    </BrowserRouter>
  </StrictMode>
);
