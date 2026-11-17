import React from "react";
import { Link } from "react-router-dom";
import { ChevronRight, Home } from "lucide-react";

export default function Breadcrumbs({ items = [] }) {
  return (
    <nav className="flex items-center gap-1.5 text-xs text-slate-400 mb-5 flex-wrap">
      <Link
        to="/dashboard"
        className="flex items-center gap-1 hover:text-[#00A0C8] dark:hover:text-[#00A0C8] transition"
      >
        <Home size={13} />
        <span>Home</span>
      </Link>

      {items.map((item, index) => {
        const isLast = index === items.length - 1;

        return (
          <React.Fragment key={index}>
            <ChevronRight size={12} className="text-slate-300 dark:text-slate-700 shrink-0" />
            {isLast || !item.path ? (
              <span className="font-semibold text-slate-800 dark:text-slate-200 truncate max-w-[200px]">
                {item.label}
              </span>
            ) : (
              <Link
                to={item.path}
                className="hover:text-[#00A0C8] dark:hover:text-[#00A0C8] transition truncate max-w-[150px]"
              >
                {item.label}
              </Link>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
}

