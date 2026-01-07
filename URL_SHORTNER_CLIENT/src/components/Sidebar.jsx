import { NavLink } from "react-router-dom";
import DashboardIcon from "@mui/icons-material/Dashboard";
import InsightsIcon from "@mui/icons-material/Insights";

export default function Sidebar() {
  return (
    <aside className="hidden sm:block w-60 border-r border-neutral-200 dark:border-neutral-800 min-h-[calc(100vh-64px)]">
      <nav className="p-4 space-y-2">
        <NavLink
          to="/dashboard"
          className={({ isActive }) =>
            `flex items-center gap-2 px-3 py-2 rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-800 ${
              isActive ? "bg-neutral-100 dark:bg-neutral-800 font-medium" : ""
            }`
          }
        >
          <DashboardIcon fontSize="small" /> Dashboard
        </NavLink>
        <NavLink
          to="/analytics"
          className={({ isActive }) =>
            `flex items-center gap-2 px-3 py-2 rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-800 ${
              isActive ? "bg-neutral-100 dark:bg-neutral-800 font-medium" : ""
            }`
          }
        >
          <InsightsIcon fontSize="small" /> Analytics
        </NavLink>
      </nav>
    </aside>
  );
}
