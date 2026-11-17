import React from "react";
import { Kanban, CheckSquare2, Sparkles } from "lucide-react";
import ThemeToggle from "./ThemeToggle";

export default function AuthLayout({ children }) {
  return (
    <div className="flex min-h-screen bg-[#fcfbfc] dark:bg-[#0f0f14] text-slate-800 dark:text-slate-100 transition-colors duration-300">
      {/* Left Form Section */}
      <div className="w-full md:w-[60vw] min-h-screen px-8 sm:px-16 pt-8 pb-12 flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img
              src="/Dev_board_64.png"
              alt="Dev Board Logo"
              className="w-8 h-8 rounded-xl object-contain shadow-md shadow-[#00A0C8]/30"
            />
            <h2 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">
              Dev Board
            </h2>
          </div>

          <ThemeToggle />
        </div>

        <div className="flex-1 flex flex-col justify-center max-w-md mx-auto w-full py-8">
          {children}
        </div>

        <p className="text-xs text-slate-400 dark:text-slate-600 text-center">
          © {new Date().getFullYear()} Dev Board • Project Management & Issue Tracker
        </p>
      </div>

      {/* Right Hero / Visual Section */}
      <div className="hidden md:flex w-[40vw] min-h-screen bg-cyan-50/70 dark:bg-[#13131c] border-l border-cyan-100 dark:border-slate-800/80 overflow-hidden p-10 relative flex-col justify-between transition-colors duration-300">
        {/* Soft geometric accent circles */}
        <div className="w-64 h-64 rounded-full bg-[#00A0C8]/15 blur-3xl absolute -top-12 -left-12 pointer-events-none" />
        <div className="w-64 h-64 rounded-full bg-sky-500/15 blur-3xl absolute top-[40%] -right-12 pointer-events-none" />
        <div className="w-56 h-56 rounded-full bg-cyan-500/15 blur-3xl absolute -bottom-10 left-10 pointer-events-none" />

        {/* Floating Stat Card 1 */}
        <div className="relative z-10 pt-8">
          <div className="flex items-center gap-4 bg-white dark:bg-[#1a1a26] p-5 rounded-2xl shadow-lg shadow-[#00A0C8]/10 dark:shadow-none border border-gray-100 dark:border-slate-800 max-w-sm">
            <img
              src="/Dev_board_64.png"
              alt="Dev Board Icon"
              className="w-12 h-12 rounded-xl object-contain shadow-md shadow-[#00A0C8]/30 shrink-0"
            />
            <div>
              <h6 className="text-xs text-gray-400 dark:text-slate-400 font-medium">
                Agile Workflow
              </h6>
              <span className="text-lg font-semibold text-slate-900 dark:text-white">
                Kanban & Sprint Tracking
              </span>
            </div>
          </div>
        </div>

        {/* Floating Stat Card 2 */}
        <div className="relative z-10 pb-8 flex flex-col gap-4 max-w-sm">
          <div className="flex items-center gap-4 bg-white/95 dark:bg-[#1a1a26]/95 backdrop-blur p-4 rounded-2xl shadow-lg shadow-[#00A0C8]/10 dark:shadow-none border border-gray-100 dark:border-slate-800">
            <div className="w-10 h-10 flex items-center justify-center text-white bg-emerald-500 rounded-xl shadow-md shadow-emerald-500/30">
              <CheckSquare2 size={20} />
            </div>
            <div>
              <h6 className="text-xs text-gray-400 dark:text-slate-400 font-medium">
                Issue Resolution
              </h6>
              <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                Real-time Bug Lifecycle
              </span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-gradient-to-r from-[#00A0C8] to-cyan-600 text-white shadow-xl shadow-[#00A0C8]/25">
            <div className="flex items-center gap-2 text-xs font-medium text-cyan-100 mb-1">
              <Sparkles size={14} />
              <span>Production Ready</span>
            </div>
            <p className="text-sm font-semibold">
              Built with MERN Stack, JWT Auth & Agile Kanban boards.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
