import React from "react";
import { DragDropContext, Droppable } from "@hello-pangea/dnd";
import KanbanTicketCard from "./KanbanTicketCard";
import { Plus, ListTodo, Clock, CheckCircle2 } from "lucide-react";

const COLUMNS = [
  {
    id: "To Do",
    title: "To Do",
    icon: ListTodo,
    color: "text-slate-500",
    headerBg: "bg-slate-100 dark:bg-slate-800/60",
    badgeBg: "bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300",
  },
  {
    id: "In Progress",
    title: "In Progress",
    icon: Clock,
    color: "text-[#00A0C8]",
    headerBg: "bg-[#00A0C8]/10",
    badgeBg: "bg-[#00A0C8]/20 text-[#00A0C8]",
  },
  {
    id: "Done",
    title: "Done",
    icon: CheckCircle2,
    color: "text-emerald-600 dark:text-emerald-400",
    headerBg: "bg-emerald-50/80 dark:bg-emerald-950/40",
    badgeBg: "bg-emerald-200/80 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300",
  },
];

export default function KanbanBoard({
  tickets,
  onDragEnd,
  onEditTicket,
  onDeleteTicket,
  onNewTicket,
}) {
  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-start">
        {COLUMNS.map((column) => {
          const columnTickets = tickets.filter(
            (ticket) => ticket.status === column.id
          );
          const Icon = column.icon;

          return (
            <div
              key={column.id}
              className="bg-slate-100/60 dark:bg-[#14141e] border border-gray-200/70 dark:border-slate-800/80 rounded-2xl p-4 flex flex-col min-h-[480px]"
            >
              {/* Column Header */}
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-gray-200/60 dark:border-slate-800/60">
                <div className="flex items-center gap-2">
                  <div
                    className={`w-7 h-7 rounded-lg ${column.headerBg} flex items-center justify-center ${column.color}`}
                  >
                    <Icon size={15} />
                  </div>
                  <h3 className="font-bold text-xs uppercase tracking-wider text-slate-800 dark:text-slate-200">
                    {column.title}
                  </h3>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${column.badgeBg}`}
                  >
                    {columnTickets.length}
                  </span>
                </div>

                {onNewTicket && (
                  <button
                    onClick={() => onNewTicket(column.id)}
                    title={`Add ticket to ${column.title}`}
                    className="p-1 rounded-lg text-slate-400 hover:text-[#00A0C8] hover:bg-white dark:hover:bg-slate-800 transition cursor-pointer"
                  >
                    <Plus size={14} />
                  </button>
                )}
              </div>

              {/* Droppable Area */}
              <Droppable droppableId={column.id}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={`flex-1 rounded-xl transition-colors duration-150 p-1 ${
                      snapshot.isDraggingOver
                        ? "bg-[#00A0C8]/5 dark:bg-[#00A0C8]/10 ring-2 ring-[#00A0C8]/20 ring-dashed"
                        : ""
                    }`}
                  >
                    {columnTickets.length === 0 ? (
                      <div className="h-32 border-2 border-dashed border-gray-200/80 dark:border-slate-800/80 rounded-xl flex items-center justify-center text-slate-400 text-xs">
                        No tickets in {column.title}
                      </div>
                    ) : (
                      columnTickets.map((ticket, index) => (
                        <KanbanTicketCard
                          key={ticket._id}
                          ticket={ticket}
                          index={index}
                          onEdit={onEditTicket}
                          onDelete={onDeleteTicket}
                        />
                      ))
                    )}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          );
        })}
      </div>
    </DragDropContext>
  );
}

