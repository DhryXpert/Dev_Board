import React from "react";
import { PriorityBadge, StatusBadge } from "./TicketBadges";
import { Calendar, Trash2, Edit3, UserCheck, MessageSquare } from "lucide-react";

export default function TicketCard({ ticket, onEdit, onDelete, onStatusChange }) {
  return (
    <div className="card hover:border-[#00A0C8]/50 dark:hover:border-[#00A0C8]/50 transition-all duration-200 group flex flex-col justify-between">
      <div>
        {/* Top bar: Priority, Status and Actions */}
        <div className="flex items-center justify-between gap-2 mb-2.5">
          <div className="flex items-center gap-1.5 flex-wrap">
            <PriorityBadge priority={ticket.priority} />
            <StatusBadge status={ticket.status} />
          </div>

          <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition">
            {onEdit && (
              <button
                onClick={() => onEdit(ticket)}
                title="Edit Ticket"
                className="p-1 rounded text-slate-400 hover:text-[#00A0C8] hover:bg-[#00A0C8]/10 dark:hover:bg-slate-800 transition cursor-pointer"
              >
                <Edit3 size={13} />
              </button>
            )}
            {onDelete && (
              <button
                onClick={() => onDelete(ticket._id)}
                title="Delete Ticket"
                className="p-1 rounded text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-slate-800 transition cursor-pointer"
              >
                <Trash2 size={13} />
              </button>
            )}
          </div>
        </div>

        {/* Title & Description */}
        <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-1 leading-snug">
          {ticket.title}
        </h4>
        <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed mb-3">
          {ticket.description || "No description provided."}
        </p>
      </div>

      {/* Footer Info: Assignee, Date, Quick Status Toggle */}
      <div className="pt-3 border-t border-gray-100 dark:border-slate-800/80 flex items-center justify-between text-xs">
        {/* Assignee */}
        <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
          <div className="w-5 h-5 rounded-full bg-[#00A0C8]/15 text-[#00A0C8] font-bold flex items-center justify-center text-[10px]">
            {ticket.assignee?.name?.[0]?.toUpperCase() || "?"}
          </div>
          <span className="text-[11px] font-medium truncate max-w-[90px]">
            {ticket.assignee?.name || "Unassigned"}
          </span>
        </div>

        {/* Quick status cycle or date */}
        <div className="flex items-center gap-2">
          {onStatusChange ? (
            <select
              value={ticket.status}
              onChange={(e) => onStatusChange(ticket._id, e.target.value)}
              className="text-[11px] bg-slate-50 dark:bg-[#1f1f2e] border border-slate-200 dark:border-slate-700 rounded px-1.5 py-0.5 text-slate-700 dark:text-slate-300 outline-none cursor-pointer"
            >
              <option value="To Do">To Do</option>
              <option value="In Progress">In Progress</option>
              <option value="Done">Done</option>
            </select>
          ) : (
            <div className="flex items-center gap-1 text-[11px] text-slate-400">
              <Calendar size={11} />
              <span>{new Date(ticket.createdAt).toLocaleDateString()}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

