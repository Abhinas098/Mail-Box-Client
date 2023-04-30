import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";

// import "https://cdn.jsdelivr.net/npm/react-bootstrap@2.7.4/dist/react-bootstrap.min.js";
import "bootstrap/dist/css/bootstrap.min.css";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
