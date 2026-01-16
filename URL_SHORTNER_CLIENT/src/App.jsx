import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import Sidebar from "./components/Sidebar.jsx";
import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Analytics from "./pages/Analytics.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import { useEffect } from "react";
import { currentUser } from "./services/auth.service.js";
import { useAuth } from './hooks/useAuth.js'
import PublicRoute from "./components/PublicRoute.jsx";

export default function App() {
  const location = useLocation();
  const isAuthPage = ["/login", "/signup"].includes(location.pathname);
  const isDashboard = ["/dashboard", "/analytics"].includes(location.pathname);
  const { doLoginByCurrentUser } = useAuth();

  useEffect(() => {
    const fetchCurrentUser = async() => {
        const data = await currentUser();
        doLoginByCurrentUser(data);
    }

    fetchCurrentUser();
  }, [])

  return (
    <div className="dark:bg-white text-neutral-900 dark:text-neutral-100">
      <Navbar />
      {!isAuthPage}
      <div className="flex bg-gradient-to-br dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
        {isDashboard && <Sidebar />}
        <main className={isDashboard ? "flex-1 p-4 sm:p-6" : "w-full"}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            } />
            <Route path="/signup" element={
              <PublicRoute>
                <Signup />
              </PublicRoute>
            } />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/analytics"
              element={
                <ProtectedRoute>
                  <Analytics />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}
