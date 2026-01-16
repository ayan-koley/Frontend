# URL Shortener Dashboard (Vite + React + Tailwind + MUI)

Modern SaaS-style dashboard with authentication, theme sync across Tailwind and MUI, protected routes, and URL management with mock backend.

## Tech Stack

- React 18, Vite
- Tailwind CSS
- MUI v5
- React Router v6
- Redux Toolkit + react-redux
- Axios

## Why Redux Toolkit?

Centralized, predictable state with minimal boilerplate and excellent dev tooling. It cleanly syncs theme and auth across Navbar, Sidebar, pages, and services without prop-drilling.

## Setup

1. Copy env example:

```bash
cp .env.example .env
```

2. Install dependencies:

```bash
npm install
```

3. Run dev:

```bash
npm run dev
```

Open the printed local URL to view the app.

## Environment

- `VITE_API_BASE_URL` – backend base URL
- `VITE_USE_MOCK` – set to `true` to use local mock services
- `VITE_GITHUB_OAUTH_URL` – full URL to your backend GitHub OAuth start endpoint (e.g. `https://api.example.com/api/v1/auth/github`) used by the Login page button

## Security & Best Practices

- Axios interceptor attaches `Authorization: Bearer <token>` from localStorage
- Reusable components and slices, no inline styles
- Theme preference persisted in localStorage

## Folder Structure

See `src/` for:

- `app/` – store, slices
- `components/` – UI components
- `pages/` – route pages
- `services/` – axios instance + services (mock-aware)
- `theme/` – MUI theme and Tailwind mapping
- `hooks/` – `useAuth`, `useTheme`
- `utils/` – validators, constants

## Try It

- Signup with any name/email/password (mock)
- Login and access Dashboard
- Create short URLs, copy, delete, disable
- Toggle dark/light; theme syncs across Tailwind and MUI

## Notes

- Analytics page is a placeholder for clicks per day.
- If a backend is provided, set `VITE_API_BASE_URL` and flip `VITE_USE_MOCK=false`.
