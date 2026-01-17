import { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Chip,
  Divider,
  FormControl,
  Grid,
  InputLabel,
  LinearProgress,
  MenuItem,
  Paper,
  Select,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import {
  getClickHistory,
  getDailyAnalytics,
  getUrlAnalytics,
  listUrls,
} from "../services/url.service.js";

const formatDateTime = (value) => new Date(value).toLocaleString();

const formatAgo = (value) => {
  const diff = Date.now() - new Date(value).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
};

function StatCard({ label, value, helper }) {
  return (
    <Paper variant="outlined" sx={{ p: 2.5, height: "100%" }}>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
        {label}
      </Typography>
      <Typography variant="h5" sx={{ fontWeight: 700, mb: helper ? 0.5 : 0 }}>
        {value}
      </Typography>
      {helper ? (
        <Typography variant="caption" color="text.secondary">
          {helper}
        </Typography>
      ) : null}
    </Paper>
  );
}

function MiniBarChart({ data }) {
  if (!data || data.length === 0) return null;
  const max = Math.max(...data.map((d) => d.clicks || 0)) || 1;
  return (
    <Box
      sx={{ display: "flex", gap: 0.75, alignItems: "flex-end", minHeight: 96 }}
    >
      {data.map((d, idx) => {
        const height = ((d.clicks || 0) / max) * 88 + 8;
        const label = new Date(d.date).toLocaleDateString(undefined, {
          month: "short",
          day: "numeric",
        });
        return (
          <Box key={idx} sx={{ textAlign: "center" }}>
            <Box
              sx={{
                width: 10,
                height,
                borderRadius: 10,
                bgcolor: "primary.main",
                transition: "all 0.2s ease",
              }}
              title={`${label}: ${d.clicks} clicks`}
            />
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ display: "block", mt: 0.5 }}
            >
              {label.split(" ")[1]}
            </Typography>
          </Box>
        );
      })}
    </Box>
  );
}

export default function Analytics() {
  const [urls, setUrls] = useState([]);
  const [selectedId, setSelectedId] = useState("");
  const [summary, setSummary] = useState(null);
  const [daily, setDaily] = useState([]);
  const [clicks, setClicks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const loadUrls = async () => {
    try {
      const data = await listUrls();
      setUrls(data || []);
      if (!selectedId && data && data.length) {
        const first = data[0];
        setSelectedId(first._id || first.id || "");
      }
    } catch (err) {
      setError(err.message || "Failed to load URLs");
    }
  };

  useEffect(() => {
    loadUrls();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadAnalytics = async (id) => {
    const targetId = id || selectedId;
    if (!targetId) return;
    setLoading(true);
    setError("");
    try {
      const [s, d, c] = await Promise.all([
        getUrlAnalytics(targetId),
        getDailyAnalytics(targetId),
        getClickHistory(targetId),
      ]);
      setSummary(s);
      setDaily(d || []);
      setClicks(c || []);
    } catch (err) {
      setError(err.message || "Unable to load analytics");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAnalytics();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedId]);

  const selectedUrl = useMemo(
    () => urls.find((u) => (u._id || u.id) === selectedId),
    [urls, selectedId]
  );

  const todayClicks = useMemo(() => {
    return daily.totalClicksToday;
  }, [daily]);

  const hasData = daily?.length > 0 || clicks?.length > 0 || summary;

  return (
    <Stack spacing={3}>
      <Paper sx={{ p: 3 }} elevation={0}>
        <Stack
          direction={{ xs: "column", sm: "row" }}
          justifyContent="space-between"
          alignItems={{ xs: "flex-start", sm: "center" }}
          gap={2}
        >
          <div>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              Analytics
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Routes used: /api/v1/urls/:id/analytics, /clicks, /analytics/daily
            </Typography>
          </div>
          <Stack direction="row" spacing={1}>
            <Button
              variant="outlined"
              size="small"
              onClick={() => loadAnalytics()}
            >
              Refresh
            </Button>
          </Stack>
        </Stack>

        <Box sx={{ mt: 2 }}>
          <FormControl size="small" sx={{ minWidth: 240 }}>
            <InputLabel id="url-select-label">Select URL</InputLabel>
            <Select
              labelId="url-select-label"
              value={selectedId}
              label="Select URL"
              onChange={(e) => setSelectedId(e.target.value)}
            >
              {urls.map((u) => {
                const id = u._id || u.id;
                const label = u.shortCode
                  ? `${u.shortCode} → ${u.originalUrl}`
                  : u.originalUrl;
                return (
                  <MenuItem key={id} value={id}>
                    {label}
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>
        </Box>
      </Paper>

      {loading && <LinearProgress />}
      {error && (
        <Alert severity="error" onClose={() => setError("")}>
          {error}
        </Alert>
      )}

      {!selectedId && !urls.length && (
        <Paper sx={{ p: 3 }} elevation={0}>
          <Typography variant="body2" color="text.secondary">
            Create a short URL first to view analytics.
          </Typography>
        </Paper>
      )}

      {hasData ? (
        <Stack spacing={3}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={3}>
              <StatCard
                label="Today's Clicks"
                value={todayClicks ?? "–"}
                helper={
                  summary?.lastClickedAt
                    ? `Last click ${formatAgo(summary.lastClickedAt)}`
                    : "Last 24h"
                }
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <StatCard
                label="Total Clicks"
                value={summary?.totalClicks ?? "–"}
                helper={
                  summary?.lastClickedAt
                    ? `Last click ${formatAgo(summary.lastClickedAt)}`
                    : null
                }
              />
            </Grid>
            {/* <Grid item xs={12} md={3}>
              <StatCard
                label="Unique Visitors"
                value={summary?.uniqueVisitors ?? "–"}
                helper={
                  summary?.totalClicks
                    ? `${Math.round(
                        (summary.uniqueVisitors /
                          Math.max(summary.totalClicks, 1)) *
                          100
                      )}% of total`
                    : null
                }
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <StatCard
                label="Short Code"
                value={summary?.shortCode || "—"}
                helper={summary?.originalUrl}
              />
            </Grid> */}
            <Grid item xs={12} md={3.2}>
              <StatCard
                label="Created"
                value={
                  summary?.createdAt ? formatDateTime(summary.createdAt) : "—"
                }
                helper={summary?.id ? `ID: ${summary.id}` : null}
              />
            </Grid>
          </Grid>

          {/* <Paper sx={{ p: 3 }} elevation={0}>
            <Stack
              direction={{ xs: "column", sm: "row" }}
              justifyContent="space-between"
              alignItems={{ xs: "flex-start", sm: "center" }}
              gap={1}
            >
              <div>
                <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                  Daily Clicks
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Recent 14-day trend
                </Typography>
              </div>
              <Chip size="small" label={`${daily?.length || 0} days`} />
            </Stack>
            <Divider sx={{ my: 2 }} />
            {daily && daily.length ? (
              <MiniBarChart data={daily} />
            ) : (
              <Typography variant="body2" color="text.secondary">
                No daily data yet.
              </Typography>
            )}
          </Paper>

          <Paper sx={{ p: 3 }} elevation={0}>
            <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1 }}>
              Recent Clicks
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Latest visits from /:id/clicks
            </Typography>
            {clicks && clicks.length ? (
              <Box sx={{ overflowX: "auto" }}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>When</TableCell>
                      <TableCell>Referrer</TableCell>
                      <TableCell>Country</TableCell>
                      <TableCell>User Agent</TableCell>
                      <TableCell>IP</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {clicks.slice(0, 25).map((c, idx) => (
                      <TableRow key={idx} hover>
                        <TableCell>
                          <Typography variant="body2">
                            {formatDateTime(c.timestamp)}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {formatAgo(c.timestamp)}
                          </Typography>
                        </TableCell>
                        <TableCell>{c.referrer || "direct"}</TableCell>
                        <TableCell>{c.country || "-"}</TableCell>
                        <TableCell>{c.userAgent || "-"}</TableCell>
                        <TableCell>{c.ip || "-"}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Box>
            ) : (
              <Typography variant="body2" color="text.secondary">
                No click events recorded for this URL yet.
              </Typography>
            )}
          </Paper> */}
        </Stack>
      ) : (
        <Paper sx={{ p: 3 }} elevation={0}>
          <Typography variant="body2" color="text.secondary">
            Select a URL to see analytics.
          </Typography>
        </Paper>
      )}
    </Stack>
  );
}
