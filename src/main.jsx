import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { initDB } from "./db";  // 🆕 Import IndexedDB setup

initDB(); // Initialize IndexedDB at app start

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
