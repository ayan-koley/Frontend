import { useNavigate } from "react-router-dom";
import { Box, AppBar, Toolbar, Typography, Button } from "@mui/material";
import ThemeToggle from "../components/ThemeToggle.jsx";

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 text-white">
      {/* Navbar */}
      <AppBar
        position="sticky"
        sx={{
          backgroundColor: "transparent",
          backdropFilter: "blur(10px)",
          boxShadow: "none",
          borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
        }}
      >
        <Toolbar>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 0.5,
              flexGrow: 1,
            }}
          >
            <Box
              sx={{
                width: 32,
                height: 32,
                borderRadius: 1,
                background: "linear-gradient(135deg, #14b8a6, #06b6d4)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: 700,
              }}
            >
              ⇄
            </Box>
            <Typography
              variant="h6"
              sx={{ fontWeight: 700, fontSize: "1.25rem" }}
            >
              LinkShort
            </Typography>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <ThemeToggle />
            <Button
              variant="text"
              sx={{ color: "white", textTransform: "none" }}
              onClick={() => navigate("/login")}
            >
              Sign in
            </Button>
            <Button
              variant="contained"
              sx={{
                background: "linear-gradient(135deg, #14b8a6, #06b6d4)",
                textTransform: "none",
                fontWeight: 600,
              }}
              onClick={() => navigate("/signup")}
            >
              Get Started
            </Button>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Hero Section */}
      <Box
        sx={{
          minHeight: "calc(100vh - 64px)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          px: 2,
          py: 6,
          textAlign: "center",
        }}
      >
        <Typography
          variant="h2"
          sx={{
            fontWeight: 800,
            fontSize: { xs: "2.5rem", sm: "3.5rem", md: "4rem" },
            mb: 2,
            lineHeight: 1.1,
          }}
        >
          Shorten URLs,
          <br />
          <span
            style={{
              background: "linear-gradient(135deg, #14b8a6, #06b6d4)",
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              display: "inline-block",
            }}
          >
            Amplify Results
          </span>
        </Typography>
        <Typography
          variant="body1"
          sx={{
            fontSize: "1.125rem",
            color: "rgba(255, 255, 255, 0.7)",
            mb: 4,
            maxWidth: "600px",
            lineHeight: 1.6,
          }}
        >
          Transform long, complex URLs into memorable short links. Track every
          click with powerful analytics and grow your audience.
        </Typography>
        <Box
          sx={{
            display: "flex",
            gap: 2,
            justifyContent: "center",
            flexWrap: "wrap",
          }}
        >
          <Button
            variant="contained"
            sx={{
              background: "linear-gradient(135deg, #14b8a6, #06b6d4)",
              px: 4,
              py: 1.5,
              fontSize: "1rem",
              fontWeight: 600,
              textTransform: "none",
            }}
            onClick={() => navigate("/signup")}
          >
            Start for Free →
          </Button>
          <Button
            variant="outlined"
            sx={{
              color: "#14b8a6",
              borderColor: "#14b8a6",
              px: 4,
              py: 1.5,
              fontSize: "1rem",
              fontWeight: 600,
              textTransform: "none",
              "&:hover": {
                backgroundColor: "rgba(20, 184, 166, 0.1)",
                borderColor: "#14b8a6",
              },
            }}
            onClick={() => navigate("/login")}
          >
            Sign in
          </Button>
        </Box>
      </Box>
    </div>
  );
}
