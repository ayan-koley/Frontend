import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
} from "@mui/material";

export default function UrlCard({ url, onCopy, onDelete, onDisable }) {
  return (
    <Card variant="outlined" sx={{ mb: 2 }}>
      <CardContent>
        <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
          {url.short}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {url.original}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          Clicks: {url.clicks} • Created:{" "}
          {new Date(url.createdAt).toLocaleString()}
        </Typography>
        {url.disabled ? (
          <Typography variant="caption" color="error" sx={{ display: "block" }}>
            Disabled
          </Typography>
        ) : null}
      </CardContent>
      <CardActions>
        <Button size="small" onClick={() => onCopy(url.short)}>
          Copy
        </Button>
        <Button size="small" color="error" onClick={() => onDelete(url.id)}>
          Delete
        </Button>
        {!url.disabled && (
          <Button
            size="small"
            color="warning"
            onClick={() => onDisable(url.id)}
          >
            Disable
          </Button>
        )}
      </CardActions>
    </Card>
  );
}
