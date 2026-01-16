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
import { isStrongPassword, isValidEmail } from "../utils/validators.js";
import { useNavigate, Link } from "react-router-dom";
import { GITHUB_OAUTH_URL } from "../utils/constants.js";

export default function Signup() {
  const { doSignup } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [fullName, setFullName] = useState("");
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
          width: 420,
          background:
            "linear-gradient(135deg, rgba(24,24,27,0.9), rgba(31,41,55,0.9))",
          boxShadow: "0 12px 40px rgba(0,0,0,0.55)",
        }}
      >
        <Paper
          sx={(theme) => ({
            p: 4,
            bgcolor:
              theme.palette.mode === "dark" ? "rgba(17,24,39,0.85)" : "#ffffff",
            backdropFilter: "blur(8px)",
            border:
              theme.palette.mode === "dark"
                ? "1px solid #1f2937"
                : "1px solid #e5e7eb",
          })}
          elevation={0}
        >
          {/* Header */}
          <Typography
            variant="h6"
            className="bg-clip-text text-transparent bg-gradient-to-r dark:from-gray-200 dark:to-white from-gray-800 to-gray-900"
            sx={{ fontWeight: 800, mb: 1 }}
          >
            Create your account
          </Typography>
          <Typography variant="body2" sx={{ color: "text.secondary", mb: 2 }}>
            Join and start shortening links in seconds.
          </Typography>

          {/* GitHub button */}
          <Button
          className="dark:bg-slate-300 bg-[#111827] dark:text-black dark:hover:bg-slate-400"
            onClick={handleGithubSignIn}
            variant="contained"
            fullWidth
            startIcon={<GitHubIcon />}
            // disabled={!GITHUB_OAUTH_URL}
            sx={{
              mb: 2,
              bgcolor: "#111827",
              color: "#ffffff",
              textTransform: "none",
              letterSpacing: 0.2,
              py: 1.1,
              "&:hover": { bgcolor: "#1f2937" },
            }}
            title={
              !GITHUB_OAUTH_URL
                ? "Set VITE_GITHUB_OAUTH_URL to enable"
                : undefined
            }
          >
            Continue with GitHub
          </Button>

          <Divider sx={{ my: 2 }}>or</Divider>

          {/* Form */}
          <Box component="form" onSubmit={onSubmit} className="space-y-3">
            <TextField
              label="Username"
              type="text"
              fullWidth
              autoComplete="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              size="small"
              sx={{
                "& .MuiOutlinedInput-root": {
                  // "& fieldset": { borderColor: "rgba(255,255,255,0.14)" },
                  // "&:hover fieldset": { borderColor: "rgba(255,255,255,0.28)" },
                  "&.Mui-focused fieldset": { borderColor: "#6366F1" },
                },
              }}
            />
            <TextField
              label="Full Name"
              type="text"
              fullWidth
              required
              autoComplete="name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              size="small"
              sx={{
                "& .MuiOutlinedInput-root": {
                  // "& fieldset": { borderColor: "rgba(255,255,255,0.14)" },
                  // "&:hover fieldset": { borderColor: "rgba(255,255,255,0.28)" },
                  "&.Mui-focused fieldset": { borderColor: "#6366F1" },
                },
              }}
            />
            <TextField
              label="Email"
              type="email"
              fullWidth
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              size="small"
              sx={{
                "& .MuiOutlinedInput-root": {
                  // "& fieldset": { borderColor: "rgba(255,255,255,0.14)" },
                  // "&:hover fieldset": { borderColor: "rgba(255,255,255,0.28)" },
                  "&.Mui-focused fieldset": { borderColor: "#6366F1" },
                },
              }}
            />
            <TextField
              label="Password"
              type="password"
              fullWidth
              required
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              size="small"
              helperText="8+ chars with upper, lower, number, special"
              sx={{
                "& .MuiOutlinedInput-root": {
                  // "& fieldset": { borderColor: "rgba(255,255,255,0.14)" },
                  // "&:hover fieldset": { borderColor: "rgba(255,255,255,0.28)" },
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
