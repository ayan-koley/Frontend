import { useEffect, useState } from "react";
import {
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  Snackbar,
  Alert,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  IconButton,
} from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import DeleteIcon from "@mui/icons-material/Delete";
import BlockIcon from "@mui/icons-material/Block";
import {
  createUrl,
  listUrls,
  deleteUrl,
  disableUrl,
} from "../services/url.service.js";
import UrlCard from "../components/UrlCard.jsx";

export default function Dashboard() {
  const [original, setOriginal] = useState("");
  const [urls, setUrls] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const load = async () => {
    try {
      setUrls(await listUrls());
    } catch (e) {
      setError(e.message);
    }
  };
  useEffect(() => {
    load();
  }, []);

  const onCreate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const entry = await createUrl({ original });
      console.log("Entry point ", entry);
      setUrls((prev) => [entry, ...prev]);
      setOriginal("");
    } catch (e) {
      setError(e.message || "Failed to create URL");
    } finally {
      setLoading(false);
    }
  };

  const onCopy = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {}
  };

  const onDelete = async (id) => {
    await deleteUrl(id);
    setUrls((prev) => prev.filter((u) => u.id !== id));
  };
  const onDisable = async (id) => {
    await disableUrl(id);
    setUrls((prev) =>
      prev.map((u) => (u.id === id ? { ...u, disabled: true } : u))
    );
  };

  return (
    <Box className="space-y-6">
      <Paper sx={{ p: 3 }} elevation={0} >
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
          Create Short URL
        </Typography>
        <Box
          component="form"
          onSubmit={onCreate}
          className="grid gap-3 sm:grid-cols-12"
        >
          <TextField
            className="sm:col-span-6"
            label="Original URL"
            placeholder="https://example.com"
            required
            fullWidth
            value={original}
            onChange={(e) => setOriginal(e.target.value)}
          />
          <Button
            className="sm:col-span-2"
            type="submit"
            variant="contained"
            disabled={loading}
          >
            Create
          </Button>
        </Box>
      </Paper>

      <Paper sx={{ p: 3 }} elevation={0}>
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
          Your URLs
        </Typography>
        <div className="hidden md:block">
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Short URL</TableCell>
                <TableCell>Original</TableCell>
                <TableCell>Clicks</TableCell>
                <TableCell>Created</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {urls.length > 0 && urls.map((u) => 
              (
                  <TableRow key={u._id} hover>
                  <TableCell>
                    <a
                      className="text-brand"
                      href={`http://localhost:4000/${u.shortCode}`}
                      rel="noreferrer"
                      target="blank"
                    >
                      {`http://localhost:4000/${u.shortCode}`}
                    </a>
                  </TableCell>
                  <TableCell className="truncate max-w-[280px]">
                    {u.originalUrl}
                  </TableCell>
                  <TableCell>{u.clickCount}</TableCell>
                  <TableCell>
                    {new Date(u.createdAt).toLocaleString()}
                  </TableCell>
                  <TableCell>{!u.isActive ? "Disabled" : "Active"}</TableCell>
                  <TableCell align="right">
                    <IconButton size="small" onClick={() => onCopy(`http://localhost:4000/${u.shortCode}`)}>
                      <ContentCopyIcon fontSize="small" />
                    </IconButton>
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => onDelete(u._id)}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                    {!u.isActive && (
                      <IconButton
                        size="small"
                        color="warning"
                        onClick={() => onDisable(u._id)}
                      >
                        <BlockIcon fontSize="small" />
                      </IconButton>
                    )}
                  </TableCell>
                </TableRow>
              )
              )}
            </TableBody>
          </Table>
        </div>
        <div className="md:hidden">
          {urls.map((u) => (
            <div key={u._id}>
              <UrlCard
              url={u.originalUrl}
              onCopy={onCopy}
              onDelete={onDelete}
              onDisable={onDisable}
            />
            </div>
          ))}
        </div>
      </Paper>

      <Paper sx={{ p: 3 }} elevation={0}>
        <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
          Analytics
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Clicks per day chart coming soon…
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
