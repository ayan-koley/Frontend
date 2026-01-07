import { useState } from "react";
import {
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  Snackbar,
  Alert,
} from "@mui/material";
import { useAuth } from "../hooks/useAuth.js";
import { useLocation, useNavigate, Link } from "react-router-dom";

export default function Login() {
  const { doLogin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await doLogin({ username, email, password });
      const to = location.state?.from?.pathname || "/dashboard";
      console.log("redirect route ", to);
      navigate(to, { replace: true });
    } catch (err) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      className="grid place-items-center"
      sx={{ minHeight: "calc(100vh - 64px)" }}
    >
      <Paper sx={{ p: 4, width: 360 }} elevation={0}>
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
          Login
        </Typography>
        <Box component="form" onSubmit={onSubmit} className="space-y-3">
          <TextField
            label="Username"
            type="username"
            fullWidth
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <TextField
            label="Email"
            type="email"
            fullWidth
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            label="Password"
            type="password"
            fullWidth
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button
            type="submit"
            variant="contained"
            fullWidth
            disabled={loading}
          >
            {loading ? "Signing in…" : "Login"}
          </Button>
        </Box>
        <Typography variant="caption" sx={{ mt: 2, display: "block" }}>
          No account?{" "}
          <Link to="/signup" className="text-brand">
            Signup
          </Link>
        </Typography>
      </Paper>
      <Snackbar
        open={Boolean(error)}
        autoHideDuration={4000}
        onClose={() => setError("")}
      >
        <Alert severity="error" onClose={() => setError("")}>
          {error}
        </Alert>
      </Snackbar>
    </Box>
  );
}
