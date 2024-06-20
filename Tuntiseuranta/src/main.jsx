import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { HashRouter, Routes, Route } from "react-router-dom";
import Statistics from "./Pages/Statistics.jsx";
import AddShift from "./Pages/AddShift.jsx";

const router = (
  <HashRouter>
    <Routes>
      <Route path="/" element={<App />}>
        <Route index element={<AddShift />} />
        <Route path="/statistics" element={<Statistics />} />
      </Route>
    </Routes>
  </HashRouter>
);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>{router}</React.StrictMode>
);
