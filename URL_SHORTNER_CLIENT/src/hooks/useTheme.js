import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toggleTheme, setTheme } from "../app/themeSlice.js";

export function useTheme() {
  const dispatch = useDispatch();
  const mode = useSelector((s) => s.theme.mode);
  const set = (m) => dispatch(setTheme(m));
  const toggle = () => dispatch(toggleTheme());
  return { mode, set, toggle };
}

export function useThemeInit() {
  const { mode } = useTheme();
  useEffect(() => {
    const root = document.documentElement;
    if (mode === "dark") root.classList.add("dark");
    else root.classList.remove("dark");
  }, [mode]);
}
