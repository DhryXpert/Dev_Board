import React from "react";
import { Users, Trash2, Edit3, ArrowRight, FolderGit2 } from "lucide-react";

export default function ProjectCard({
  project,
  isOwner,
  onEdit,
  onDelete,
  onManageMembers,
  onClick,
}) {
  return (
    <div className="card hover:border-[#00A0C8]/50 dark:hover:border-[#00A0C8]/50 transition-all duration-200 group flex flex-col justify-between">
      <div>
        {/* Card Header */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#00A0C8]/10 text-[#00A0C8] flex items-center justify-center shrink-0 border border-[#00A0C8]/20">
              <FolderGit2 size={18} />
            </div>
            <div>
              <h4
                onClick={onClick}
                className="font-bold text-slate-900 dark:text-white text-base hover:text-[#00A0C8] transition cursor-pointer line-clamp-1"
              >
                {project.title}
              </h4>
              <span className="text-[11px] text-slate-400">
                Created {new Date(project.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>

          {isOwner && (
            <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition">
              <button
                onClick={() => onEdit(project)}
                title="Edit Project"
                className="p-1.5 rounded-lg text-slate-400 hover:text-[#00A0C8] hover:bg-[#00A0C8]/10 dark:hover:bg-slate-800 transition cursor-pointer"
              >
                <Edit3 size={15} />
              </button>
              <button
                onClick={() => onDelete(project._id)}
                title="Delete Project"
                className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-slate-800 transition cursor-pointer"
              >
                <Trash2 size={15} />
              </button>
            </div>
          )}
        </div>

        {/* Description */}
        <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mb-4 leading-relaxed">
          {project.description || "No description provided."}
        </p>
      </div>

      {/* Footer info: Team members & actions */}
      <div className="pt-3 border-t border-gray-100 dark:border-slate-800/80 flex items-center justify-between">
        <button
          onClick={() => onManageMembers(project)}
          className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 hover:text-[#00A0C8] transition cursor-pointer"
        >
          <div className="flex -space-x-1.5 overflow-hidden">
            {project.teamMembers?.slice(0, 3).map((member) => (
              <div
                key={member._id}
                title={member.name}
                className="w-5 h-5 rounded-full bg-[#00A0C8]/15 text-[#00A0C8] ring-2 ring-white dark:ring-[#161620] flex items-center justify-center text-[9px] font-bold"
              >
                {member.name?.[0]?.toUpperCase() || "U"}
              </div>
            ))}
          </div>
          <span className="text-[11px] font-medium ml-1">
            {project.teamMembers?.length || 1} member
            {project.teamMembers?.length === 1 ? "" : "s"}
          </span>
        </button>

        <button
          onClick={onClick}
          className="text-xs font-semibold text-[#00A0C8] hover:underline flex items-center gap-1 cursor-pointer transition"
        >
          <span>Open</span>
          <ArrowRight size={13} />
        </button>
      </div>
    </div>
  );
}

