import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import App from "./App.jsx";
import "./index.css";
import store from "./app/store.js";
import muiTheme from "./theme/muiTheme.js";
import { useTheme, useThemeInit } from "./hooks/useTheme.js";

function ThemeRoot() {
  const { mode } = useTheme();
  useThemeInit();
  return (
    <ThemeProvider theme={muiTheme(mode)}>
      <CssBaseline />
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ThemeProvider>
  );
}

function Root() {
  return (
    <Provider store={store}>
      <ThemeRoot />
    </Provider>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Root />
  </React.StrictMode>
);
