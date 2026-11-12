import React from "react";

export function PriorityBadge({ priority }) {
  const styles = {
    Low: "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700",
    Medium: "bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-900/40",
    High: "bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-900/40",
    Critical: "bg-red-50 dark:bg-red-950/50 text-red-600 dark:text-red-400 border-red-200 dark:border-red-900/40 font-semibold",
  };

  return (
    <span
      className={`text-[10px] uppercase tracking-wider px-2 py-0.5 rounded border ${
        styles[priority] || styles.Medium
      }`}
    >
      {priority}
    </span>
  );
}

export function StatusBadge({ status }) {
  const styles = {
    "To Do": "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700",
    "In Progress": "bg-purple-50 dark:bg-purple-950/50 text-purple-600 dark:text-purple-400 border-purple-200 dark:border-purple-900/40",
    Done: "bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-900/40",
  };

  return (
    <span
      className={`text-[10px] font-medium px-2 py-0.5 rounded border ${
        styles[status] || styles["To Do"]
      }`}
    >
      {status}
    </span>
  );
}

