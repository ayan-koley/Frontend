import { useNavigate } from "react-router-dom";
import { Box, AppBar, Toolbar, Typography, Button } from "@mui/material";
import ThemeToggle from "../components/ThemeToggle.jsx";
import { useAuth } from "../hooks/useAuth.js";

export default function Home() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  return (
    <div className="max-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 dark:bg-white text-white dark:text-blue-600">
      

      {/* Hero Section */}
      <Box
      className="bg-white dark:bg-transparent"
        sx={{
          minHeight: "calc(100vh - 64px)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          px: 2,
          py: 6,
          textAlign: "center",
        }
        
      }
      >
        <Typography
          variant="h2"
          className="text-blue-700"
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
          className="dark:bg-white bg-black"
            style={{
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
          className="text-gray-500 dark:text-white"
          sx={{
            fontSize: "1.125rem",
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
          {
            isAuthenticated ? (
              <Button
                  variant="contained"
                  className="bg-transparent dark:bg-white dark:text-black"
                  sx={{
                    px: 4,
                    py: 1.5,
                    background: "black",
                    fontSize: "1rem",
                    fontWeight: 600,
                    textTransform: "none",
                  }}
                  onClick={() => navigate("/dashboard")}
                >
                Dashboard
              </Button>
            ) : (
              <>
                <Button
                  variant="contained"
                  className="bg-transparent dark:bg-white dark:text-black"
                  sx={{
                    px: 4,
                    py: 1.5,
                    background: "black",
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
              </>
            )
          }


          
        </Box>
      </Box>
    </div>
  
  );
}
