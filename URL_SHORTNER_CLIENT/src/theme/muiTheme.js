import { createTheme } from "@mui/material/styles";

export default function muiTheme(modeParam) {
  const stored = localStorage.getItem("theme") === "dark" ? "dark" : "light";
  const mode =
    modeParam === "dark" ? "dark" : modeParam === "light" ? "light" : stored;
  return createTheme({
    palette: {
      mode,
      primary: { main: "#6366F1" },
      background: {
        default: mode === "dark" ? "#0a0a0a" : "#ffffff",
        paper: mode === "dark" ? "#111827" : "#ffffff",
      },
    },
    shape: { borderRadius: 10 },
  });
}
