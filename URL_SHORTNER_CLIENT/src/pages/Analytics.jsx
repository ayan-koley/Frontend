import { Paper, Typography } from "@mui/material";

export default function Analytics() {
  return (
    <Paper sx={{ p: 3 }} elevation={0}>
      <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
        Analytics
      </Typography>
      <Typography variant="body2" color="text.secondary">
        Placeholder for clicks per day.
      </Typography>
    </Paper>
  );
}
