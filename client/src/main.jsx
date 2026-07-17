import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from "react-router-dom";

import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
)

// Checking if backend-frontend connection is working or not
import API from "./utils/api";

API.get("/teams")
  .then((res) => console.log("Fetched teams successfully:", res.data))
  .catch((err) => console.error("API Error:", err));
