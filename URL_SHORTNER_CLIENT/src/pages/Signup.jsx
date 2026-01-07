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
import { isStrongPassword, isValidEmail } from "../utils/validators.js";
import { useNavigate, Link } from "react-router-dom";

export default function Signup() {
  const { doSignup } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!isValidEmail(email)) {
      setError("Enter a valid email");
      return;
    }
    if (!isStrongPassword(password)) {
      setError("Password must be 8+ chars with upper, lower, number, special");
      return;
    }
    setLoading(true);
    try {
      await doSignup({ username, fullName, email, password });
      navigate("/dashboard", { replace: true });
    } catch (err) {
      setError(err.message || "Signup failed");
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
          Signup
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
            label="Full Name"
            fullWidth
            required
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
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
            helperText="8+ chars with upper, lower, number, special"
          />
          <Button
            type="submit"
            variant="contained"
            fullWidth
            disabled={loading}
          >
            {loading ? "Creating…" : "Signup"}
          </Button>
        </Box>
        <Typography variant="caption" sx={{ mt: 2, display: "block" }}>
          Have an account?{" "}
          <Link to="/login" className="text-brand">
            Login
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
