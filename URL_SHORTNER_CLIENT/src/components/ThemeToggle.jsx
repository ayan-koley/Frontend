import { IconButton, Tooltip } from "@mui/material";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import { useTheme } from "../hooks/useTheme.js";

export default function ThemeToggle() {
  const { mode, toggle } = useTheme();
  return (
    <Tooltip title={mode === "dark" ? "Light mode" : "Dark mode"}>
      <IconButton color="inherit" onClick={toggle} aria-label="toggle theme">
        {mode === "dark" ? <LightModeIcon /> : <DarkModeIcon />}
      </IconButton>
    </Tooltip>
  );
}
