import React from "react";
import { useTheme } from "../context/ThemeContext";
import { Sun, Moon } from "lucide-react";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      aria-label="Toggle Theme"
      className="p-2 rounded-xl text-slate-600 hover:text-[#00A0C8] bg-slate-100 hover:bg-[#00A0C8]/10 dark:text-slate-300 dark:hover:text-[#00A0C8] dark:bg-[#1a1a24] dark:hover:bg-[#252536] border border-slate-200/80 dark:border-slate-800 transition cursor-pointer"
    >
      {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
    </button>
  );
}

