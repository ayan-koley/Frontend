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
    const html = document.documentElement;
    if (mode === "dark") {
      html.classList.add("dark");
    } else {
      html.classList.remove("dark");
    }
  }, [mode]);
}
