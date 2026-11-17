import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import ThemeToggle from "./ThemeToggle";
import {
  Kanban,
  LayoutDashboard,
  FolderGit2,
  CheckSquare2,
  LogOut,
  Menu,
  X,
  ChevronDown,
  Layers,
} from "lucide-react";

export default function AppLayout({ children, projects = [], currentProjectId, onSelectProject }) {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isProjectDropdownOpen, setIsProjectDropdownOpen] = useState(false);

  const currentProject = projects.find((p) => p._id === currentProjectId);

  const navItems = [
    { label: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
    {
      label: "All Projects",
      path: "/dashboard",
      icon: FolderGit2,
      badge: projects.length,
    },
  ];

  const handleProjectClick = (projectId) => {
    setIsProjectDropdownOpen(false);
    setIsSidebarOpen(false);
    if (onSelectProject) {
      onSelectProject(projectId);
    } else {
      navigate(`/projects/${projectId}`);
    }
  };

  return (
    <div className="min-h-screen bg-[#fcfbfc] dark:bg-[#0f0f14] text-slate-800 dark:text-slate-100 flex flex-col font-['Poppins'] transition-colors duration-300">
      {/* ── Top Navbar ── */}
      <header className="bg-white dark:bg-[#161620] border-b border-gray-100 dark:border-slate-800/80 py-3 px-4 sm:px-6 sticky top-0 z-40 flex items-center justify-between transition-colors duration-300">
        <div className="flex items-center gap-3">
          {/* Mobile hamburger button */}
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 lg:hidden cursor-pointer transition"
            aria-label="Toggle Navigation"
          >
            {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>

          {/* Brand Logo */}
          <Link to="/dashboard" className="flex items-center gap-2.5">
            <img
              src="/Dev_board_64.png"
              alt="Dev Board Logo"
              className="w-8 h-8 rounded-xl object-contain shadow-md shadow-[#00A0C8]/30"
            />
            <h1 className="text-base font-bold text-slate-900 dark:text-white tracking-tight hidden sm:block">
              Dev Board
            </h1>
          </Link>

          {/* Quick Project Selector Dropdown in Navbar */}
          {projects.length > 0 && (
            <div className="relative ml-2 sm:ml-4">
              <button
                onClick={() => setIsProjectDropdownOpen(!isProjectDropdownOpen)}
                className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 dark:bg-[#1f1f2e] hover:bg-[#00A0C8]/10 border border-slate-200/80 dark:border-slate-700/60 rounded-xl text-xs font-semibold text-slate-800 dark:text-slate-200 transition cursor-pointer max-w-[180px] sm:max-w-[240px]"
              >
                <Layers size={13} className="text-[#00A0C8] shrink-0" />
                <span className="truncate">
                  {currentProject ? currentProject.title : "Select Project"}
                </span>
                <ChevronDown size={12} className="text-slate-400 shrink-0" />
              </button>

              {isProjectDropdownOpen && (
                <>
                  <div
                    className="fixed inset-0 z-30"
                    onClick={() => setIsProjectDropdownOpen(false)}
                  />
                  <div className="absolute left-0 mt-2 w-64 bg-white dark:bg-[#161620] border border-gray-100 dark:border-slate-800 rounded-xl shadow-xl py-1.5 z-40 animate-in fade-in zoom-in-95 duration-100">
                    <div className="px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                      Switch Project
                    </div>
                    <div className="max-h-56 overflow-y-auto">
                      {projects.map((proj) => (
                        <button
                          key={proj._id}
                          onClick={() => handleProjectClick(proj._id)}
                          className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-[#00A0C8]/10 transition cursor-pointer ${
                            proj._id === currentProjectId
                              ? "text-[#00A0C8] font-bold bg-[#00A0C8]/10"
                              : "text-slate-700 dark:text-slate-300"
                          }`}
                        >
                          <span className="truncate">{proj.title}</span>
                          {proj._id === currentProjectId && (
                            <span className="w-1.5 h-1.5 rounded-full bg-[#00A0C8] shrink-0 ml-2" />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
          )}
        </div>

        {/* Right side controls: ThemeToggle + Profile + Logout */}
        <div className="flex items-center gap-2.5 sm:gap-4">
          <ThemeToggle />

          <div className="hidden sm:flex items-center gap-2 px-2.5 py-1.5 bg-slate-50 dark:bg-[#1f1f2e] border border-slate-200/70 dark:border-slate-700/60 rounded-xl text-xs">
            <div className="w-6 h-6 rounded-full bg-[#00A0C8]/15 text-[#00A0C8] font-bold flex items-center justify-center text-[11px]">
              {user?.name?.[0]?.toUpperCase() || "U"}
            </div>
            <span className="text-slate-800 dark:text-slate-200 font-semibold truncate max-w-[100px]">
              {user?.name}
            </span>
          </div>

          <button
            onClick={logout}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium text-gray-700 dark:text-slate-300 hover:text-red-600 dark:hover:text-red-400 bg-gray-50 dark:bg-[#1f1f2e] hover:bg-red-50 dark:hover:bg-red-950/30 border border-gray-200/60 dark:border-slate-700/60 transition cursor-pointer"
            title="Sign Out"
          >
            <LogOut size={14} />
            <span className="hidden md:inline">Logout</span>
          </button>
        </div>
      </header>

      {/* ── Main Layout Body with Collapsible Sidebar ── */}
      <div className="flex-1 flex">
        {/* Mobile Sidebar Backdrop */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-slate-950/50 backdrop-blur-sm z-30 lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* Sidebar (Zen Wealth style SideMenu) */}
        <aside
          className={`fixed lg:sticky top-[57px] left-0 h-[calc(100vh-57px)] w-64 bg-white dark:bg-[#161620] border-r border-gray-100 dark:border-slate-800/80 p-5 flex flex-col justify-between z-30 transition-transform duration-200 ease-in-out ${
            isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
          }`}
        >
          <div>
            {/* User Profile Mini Card in Sidebar */}
            <div className="flex flex-col items-center justify-center gap-2 mt-2 mb-6 p-4 rounded-2xl bg-slate-50 dark:bg-[#1a1a26] border border-slate-100 dark:border-slate-800/80">
              <div className="w-14 h-14 rounded-full bg-[#00A0C8]/15 text-[#00A0C8] font-bold flex items-center justify-center text-xl shadow-sm">
                {user?.name?.[0]?.toUpperCase() || "U"}
              </div>
              <h5 className="text-sm font-bold text-slate-900 dark:text-white text-center truncate max-w-full">
                {user?.name}
              </h5>
              <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded bg-[#00A0C8]/10 text-[#00A0C8] font-semibold border border-[#00A0C8]/20">
                {user?.role || "Developer"}
              </span>
            </div>

            {/* Navigation Links */}
            <div className="space-y-1.5">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 px-3 block mb-1">
                Navigation
              </span>

              <Link
                to="/dashboard"
                onClick={() => setIsSidebarOpen(false)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition ${
                  location.pathname === "/dashboard"
                    ? "bg-[#00A0C8] text-white shadow-md shadow-[#00A0C8]/25"
                    : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-[#1a1a26] hover:text-[#00A0C8]"
                }`}
              >
                <div className="flex items-center gap-3">
                  <LayoutDashboard size={16} />
                  <span>Dashboard</span>
                </div>
              </Link>
            </div>

            {/* Quick Projects List in Sidebar */}
            <div className="mt-6">
              <div className="flex items-center justify-between px-3 mb-2">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                  Projects ({projects.length})
                </span>
              </div>

              <div className="space-y-1 max-h-48 overflow-y-auto pr-1">
                {projects.map((proj) => {
                  const isActive = proj._id === currentProjectId;
                  return (
                    <button
                      key={proj._id}
                      onClick={() => handleProjectClick(proj._id)}
                      className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs transition cursor-pointer text-left truncate ${
                        isActive
                          ? "bg-[#00A0C8]/10 text-[#00A0C8] font-semibold border border-[#00A0C8]/30"
                          : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-[#1a1a26]"
                      }`}
                    >
                      <FolderGit2 size={14} className="shrink-0" />
                      <span className="truncate">{proj.title}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Sidebar Footer */}
          <div className="pt-4 border-t border-gray-100 dark:border-slate-800/80">
            <p className="text-[10px] text-slate-400 text-center">
              Dev Board v1.0 • Agile Kanban
            </p>
          </div>
        </aside>

        {/* ── Main Content Area ── */}
        <main className="flex-1 w-full p-4 sm:p-8 lg:p-10 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}

