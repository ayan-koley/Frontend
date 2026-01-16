import { useState } from "react";
import {
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  Snackbar,
  Alert,
  Divider,
} from "@mui/material";
import GitHubIcon from "@mui/icons-material/GitHub";
import { useAuth } from "../hooks/useAuth.js";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { GITHUB_OAUTH_URL } from "../utils/constants.js";

export default function Login() {
  const { doLogin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleGithubSignIn = () => {
    if (!GITHUB_OAUTH_URL) {
      setError("GitHub sign-in is not configured");
      return;
    }
    window.location.href = GITHUB_OAUTH_URL;
  };

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
      className="grid place-items-center relative overflow-hidden dark:bg-black bg-white"
      sx={{ minHeight: "calc(100vh - 64px)", px: 2 }}
    >
      {/* Ambient blurred accents (neutral greys) */}
      <div className="absolute -top-20 -left-20 w-72 h-72 rounded-full bg-gradient-to-tr from-gray-700/40 to-gray-500/30 blur-3xl opacity-30 -z-10" />
      <div className="absolute -bottom-24 -right-24 w-80 h-80 rounded-full bg-gradient-to-tr from-gray-600/30 to-gray-400/25 blur-3xl opacity-30 -z-10" />

      {/* Gradient border wrapper for the card */}
      <Box
        className="rounded-xl p-[1px]"
        sx={{
          width: 400,
          background: "linear-gradient(135deg, rgba(24,24,27,0.9), rgba(31,41,55,0.9))",
          boxShadow: "0 12px 40px rgba(0,0,0,0.55)",
        }}
      >
        <Paper
          sx={(theme) => ({
            p: 4,
            bgcolor: theme.palette.mode === "dark" ? "rgba(17,24,39,0.85)" : "#ffffff",
            backdropFilter: "blur(8px)",
            border: theme.palette.mode === "dark" ? "1px solid #1f2937" : "1px solid #e5e7eb",
          })}
          elevation={0}
        >
          {/* Header */}
          <Typography
            variant="h6"
            className="dark:text-white bg-clip-text text-transparent bg-gradient-to-r from-gray-200 to-white text-black"
            sx={{ fontWeight: 800, mb: 1 }}
          >
            Sign in
          </Typography>
          <Typography variant="body2" sx={{ color: "text.secondary", mb: 2 }}>
            Welcome back—sign in to manage your links.
          </Typography>

          {/* GitHub button */}
          <Button
          className="dark:bg-slate-300 bg-[#111827] dark:text-black dark:hover:bg-slate-400"
            onClick={handleGithubSignIn}
            variant="contained"
            fullWidth
            startIcon={<GitHubIcon />}
            disabled={!GITHUB_OAUTH_URL}
            sx={{
              mb: 2,
              bgcolor: "#111827",
              color: "#ffffff",
              textTransform: "none",
              letterSpacing: 0.2,
              py: 1.1,
              "&:hover": { bgcolor: "#1f2937" },
            }}
            title={!GITHUB_OAUTH_URL ? "Set VITE_GITHUB_OAUTH_URL to enable" : undefined}
          >
            Continue with GitHub
          </Button>

          <Divider sx={{ my: 2 }}>or</Divider>

          {/* Form */}
          <Box component="form" onSubmit={onSubmit} className="space-y-3">
            <TextField
              label="Username or Email"
              type="text"
              fullWidth
              autoComplete="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              sx={{
                "& .MuiOutlinedInput-root": {
                  "& fieldset": { borderColor: "rgba(255,255,255,0.14)" },
                  "&:hover fieldset": { borderColor: "rgba(255,255,255,0.28)" },
                  "&.Mui-focused fieldset": { borderColor: "#6366F1" },
                },
              }}
            />
            <TextField
              label="Password"
              type="password"
              fullWidth
              required
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              sx={{
                "& .MuiOutlinedInput-root": {
                  "& fieldset": { borderColor: "rgba(255,255,255,0.14)" },
                  "&:hover fieldset": { borderColor: "rgba(255,255,255,0.28)" },
                  "&.Mui-focused fieldset": { borderColor: "#6366F1" },
                },
              }}
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              size="large"
              fullWidth
              disabled={loading}
              sx={{
                textTransform: "none",
                letterSpacing: 0.2,
                py: 1.25,
                fontWeight: 800,
                borderRadius: 2,
                backgroundImage: "linear-gradient(90deg, #6366F1, #4F46E5)",
                color: "#fff",
                boxShadow:
                  "0 10px 24px rgba(99,102,241,0.35), 0 0 0 1px rgba(255,255,255,0.06) inset",
                "&:hover": { filter: "brightness(1.06)" },
                "&:focus-visible": {
                  outline: "none",
                  boxShadow:
                    "0 0 0 3px rgba(99,102,241,0.5), 0 10px 24px rgba(99,102,241,0.35)",
                },
              }}
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
      </Box>

      {/* Notifications */}
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
