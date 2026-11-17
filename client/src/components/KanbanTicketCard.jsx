import React from "react";
import { Draggable } from "@hello-pangea/dnd";
import { PriorityBadge, StatusBadge } from "./TicketBadges";
import { Calendar, Trash2, Edit3, GripVertical } from "lucide-react";

export default function KanbanTicketCard({
  ticket,
  index,
  onEdit,
  onDelete,
}) {
  return (
    <Draggable draggableId={ticket._id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          className={`card !p-4 mb-3 border transition-shadow cursor-default select-none ${
            snapshot.isDragging
              ? "shadow-2xl border-[#00A0C8] ring-2 ring-[#00A0C8]/20 bg-white dark:bg-[#1a1a26] rotate-1"
              : "hover:border-[#00A0C8]/50 dark:hover:border-[#00A0C8]/50 shadow-sm"
          }`}
        >
          {/* Header: Priority & Drag Handle + Actions */}
          <div className="flex items-center justify-between gap-2 mb-2">
            <div className="flex items-center gap-1.5">
              <span
                {...provided.dragHandleProps}
                className="text-slate-400 hover:text-[#00A0C8] dark:hover:text-[#00A0C8] cursor-grab active:cursor-grabbing p-0.5 rounded"
                title="Drag to reorder"
              >
                <GripVertical size={14} />
              </span>
              <PriorityBadge priority={ticket.priority} />
            </div>

            <div className="flex items-center gap-1 opacity-70 hover:opacity-100 transition">
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
          <h4 className="font-semibold text-slate-900 dark:text-white text-xs mb-1 line-clamp-2 leading-snug">
            {ticket.title}
          </h4>
          {ticket.description && (
            <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed mb-3">
              {ticket.description}
            </p>
          )}

          {/* Footer Info: Assignee & Creation Date */}
          <div className="pt-2.5 mt-1 border-t border-gray-100 dark:border-slate-800/80 flex items-center justify-between text-xs">
            <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
              <div className="w-5 h-5 rounded-full bg-[#00A0C8]/15 text-[#00A0C8] font-bold flex items-center justify-center text-[10px]">
                {ticket.assignee?.name?.[0]?.toUpperCase() || "?"}
              </div>
              <span className="text-[10px] font-medium truncate max-w-[100px]">
                {ticket.assignee?.name || "Unassigned"}
              </span>
            </div>

            <div className="flex items-center gap-1 text-[10px] text-slate-400">
              <Calendar size={11} />
              <span>{new Date(ticket.createdAt).toLocaleDateString()}</span>
            </div>
          </div>
        </div>
      )}
    </Draggable>
  );
}

