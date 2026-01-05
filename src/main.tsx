import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('No #root element found in DOM');
}

createRoot(rootElement).render(<App />);
