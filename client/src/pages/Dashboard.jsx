import React from "react";
import { useAuth } from "../context/AuthContext";
import ThemeToggle from "../components/ThemeToggle";
import { LogOut, Kanban, CheckCircle2, FolderGit2 } from "lucide-react";

export default function Dashboard() {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-[#fcfbfc] dark:bg-[#0f0f14] text-slate-800 dark:text-slate-100 flex flex-col font-['Poppins'] transition-colors duration-300">
      {/* Top Navbar */}
      <header className="bg-white dark:bg-[#161620] border-b border-gray-100 dark:border-slate-800/80 py-3.5 px-6 sm:px-10 sticky top-0 z-30 flex items-center justify-between transition-colors duration-300">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-purple-600 flex items-center justify-center text-white shadow-md shadow-purple-600/30">
            <Kanban size={18} />
          </div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">
            Dev Board
          </h2>
        </div>

        <div className="flex items-center gap-3 sm:gap-4">
          <ThemeToggle />

          <div className="flex items-center gap-2.5 px-3 py-1.5 bg-slate-50 dark:bg-[#1f1f2e] border border-slate-200/70 dark:border-slate-700/60 rounded-lg text-xs">
            <div className="w-6 h-6 rounded-full bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 font-bold flex items-center justify-center text-xs">
              {user?.name?.[0]?.toUpperCase() || "U"}
            </div>
            <span className="text-slate-800 dark:text-slate-200 font-semibold">
              {user?.name}
            </span>
            <span className="px-1.5 py-0.5 rounded bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 font-medium text-[10px] border border-purple-200 dark:border-purple-800 uppercase">
              {user?.role}
            </span>
          </div>

          <button
            onClick={logout}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-gray-700 dark:text-slate-300 hover:text-red-600 dark:hover:text-red-400 bg-gray-50 dark:bg-[#1f1f2e] hover:bg-red-50 dark:hover:bg-red-950/30 border border-gray-200/60 dark:border-slate-700/60 transition cursor-pointer"
          >
            <LogOut size={14} />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-5xl w-full mx-auto p-6 sm:p-10">
        <div className="card">
          <div className="flex items-center gap-2.5 text-purple-600 dark:text-purple-400 mb-2">
            <CheckCircle2 size={24} />
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">
              Welcome to Dev Board, {user?.name}!
            </h3>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">
            Authentication is verified and your session is active.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <div className="bg-slate-50 dark:bg-[#1c1c28] border border-slate-100 dark:border-slate-800 p-4 rounded-xl">
              <span className="text-[11px] font-medium text-slate-400 dark:text-slate-500 block mb-1">
                Full Name
              </span>
              <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                {user?.name}
              </p>
            </div>

            <div className="bg-slate-50 dark:bg-[#1c1c28] border border-slate-100 dark:border-slate-800 p-4 rounded-xl">
              <span className="text-[11px] font-medium text-slate-400 dark:text-slate-500 block mb-1">
                Email
              </span>
              <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                {user?.email}
              </p>
            </div>

            <div className="bg-slate-50 dark:bg-[#1c1c28] border border-slate-100 dark:border-slate-800 p-4 rounded-xl">
              <span className="text-[11px] font-medium text-slate-400 dark:text-slate-500 block mb-1">
                Workspace Role
              </span>
              <p className="text-sm font-semibold text-purple-600 dark:text-purple-400 capitalize">
                {user?.role}
              </p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-purple-50/60 dark:bg-purple-950/20 border border-purple-100 dark:border-purple-900/30 flex items-start gap-3 text-xs text-purple-900 dark:text-purple-300">
            <FolderGit2 size={18} className="shrink-0 text-purple-600 dark:text-purple-400 mt-0.5" />
            <span>
              <strong>Ready for Day 3:</strong> Next, we'll build the Project
              Management system with Project schemas, team member assignments, and
              interactive project cards!
            </span>
          </div>
        </div>
      </main>
    </div>
  );
}
