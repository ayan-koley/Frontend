import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { useAuth } from "../hooks/useAuth.js";
import ThemeToggle from "./ThemeToggle.jsx";

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  return (
    <AppBar
      position="sticky"
      color="default"
      elevation={0}
      sx={{ borderBottom: 1, borderColor: "divider" }}
    >
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 600 }}>
          URL Shortener
        </Typography>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <ThemeToggle />
          {isAuthenticated ? (
            <>
              <Typography variant="body2" sx={{ mr: 1 }}>
                {user?.name || user?.email}
              </Typography>
              <Button variant="outlined" onClick={logout}>
                Logout
              </Button>
            </>
          ) : null}
        </Box>
      </Toolbar>
    </AppBar>
  );
}
