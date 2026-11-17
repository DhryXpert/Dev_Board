import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import AppLayout from "../components/AppLayout";
import Breadcrumbs from "../components/Breadcrumbs";
import Modal from "../components/Modal";
import TicketCard from "../components/TicketCard";
import KanbanBoard from "../components/KanbanBoard";
import API from "../api/axios";
import {
  Plus,
  Search,
  Filter,
  AlertCircle,
  Loader2,
  Kanban,
  CheckCircle2,
  Clock,
  ListTodo,
  LayoutGrid,
  Columns3,
} from "lucide-react";

export default function ProjectDetails() {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [allProjects, setAllProjects] = useState([]);
  const [project, setProject] = useState(null);
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [selectedPriority, setSelectedPriority] = useState("All");
  const [viewMode, setViewMode] = useState("kanban"); // "kanban" or "grid"

  // Modal State
  const [isTicketModalOpen, setIsTicketModalOpen] = useState(false);
  const [editingTicket, setEditingTicket] = useState(null);
  const [modalError, setModalError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [ticketForm, setTicketForm] = useState({
    title: "",
    description: "",
    priority: "Medium",
    status: "To Do",
    assignee: "",
  });

  // Fetch Project & Tickets
  const fetchData = async () => {
    try {
      setLoading(true);
      const [allProjectsRes, projectRes, ticketsRes] = await Promise.all([
        API.get("/projects"),
        API.get(`/projects/${projectId}`),
        API.get(`/tickets/project/${projectId}`),
      ]);
      setAllProjects(allProjectsRes.data);
      setProject(projectRes.data);
      setTickets(ticketsRes.data);
    } catch (err) {
      console.error("Failed to load project details", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [projectId]);

  // Open Create Modal
  const openCreateModal = (defaultStatus = "To Do") => {
    setEditingTicket(null);
    setTicketForm({
      title: "",
      description: "",
      priority: "Medium",
      status: defaultStatus || "To Do",
      assignee: "",
    });
    setModalError("");
    setIsTicketModalOpen(true);
  };

  // Open Edit Modal
  const openEditModal = (ticket) => {
    setEditingTicket(ticket);
    setTicketForm({
      title: ticket.title,
      description: ticket.description || "",
      priority: ticket.priority || "Medium",
      status: ticket.status || "To Do",
      assignee: ticket.assignee?._id || "",
    });
    setModalError("");
    setIsTicketModalOpen(true);
  };

  // Handle Form Submit (Create or Update)
  const handleTicketSubmit = async (e) => {
    e.preventDefault();
    setModalError("");
    setIsSubmitting(true);

    try {
      if (editingTicket) {
        const { data } = await API.put(`/tickets/${editingTicket._id}`, {
          ...ticketForm,
          assignee: ticketForm.assignee || null,
        });
        setTickets((prev) =>
          prev.map((t) => (t._id === data._id ? data : t))
        );
      } else {
        const { data } = await API.post("/tickets", {
          ...ticketForm,
          projectId,
          assignee: ticketForm.assignee || null,
        });
        setTickets((prev) => [data, ...prev]);
      }
      setIsTicketModalOpen(false);
    } catch (err) {
      setModalError(err.response?.data?.message || "Failed to save ticket");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Drag and Drop End Handler
  const handleDragEnd = async (result) => {
    const { destination, source, draggableId } = result;

    // Dropped outside a valid column
    if (!destination) return;

    // Dropped in the same column and same position
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    const targetStatus = destination.droppableId;
    const ticketToMove = tickets.find((t) => t._id === draggableId);
    if (!ticketToMove || ticketToMove.status === targetStatus) return;

    // 1. Optimistic UI update: instant update for super snappy UX
    const previousTickets = [...tickets];
    setTickets((prev) =>
      prev.map((t) =>
        t._id === draggableId ? { ...t, status: targetStatus } : t
      )
    );

    // 2. Persist status update to backend MongoDB API
    try {
      await API.put(`/tickets/${draggableId}`, { status: targetStatus });
    } catch (err) {
      console.error("Failed to persist ticket move", err);
      // Rollback to previous state on failure
      setTickets(previousTickets);
      alert(err.response?.data?.message || "Failed to update ticket status on server");
    }
  };

  // Handle Quick Status Change from Grid dropdown
  const handleStatusChange = async (ticketId, newStatus) => {
    try {
      const { data } = await API.put(`/tickets/${ticketId}`, { status: newStatus });
      setTickets((prev) =>
        prev.map((t) => (t._id === data._id ? data : t))
      );
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update ticket status");
    }
  };

  // Handle Delete Ticket
  const handleDeleteTicket = async (ticketId) => {
    if (!window.confirm("Are you sure you want to delete this ticket?")) return;

    try {
      await API.delete(`/tickets/${ticketId}`);
      setTickets((prev) => prev.filter((t) => t._id !== ticketId));
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete ticket");
    }
  };

  // Filtering
  const filteredTickets = tickets.filter((t) => {
    const matchesSearch =
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      selectedStatus === "All" || t.status === selectedStatus;
    const matchesPriority =
      selectedPriority === "All" || t.priority === selectedPriority;
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const todoCount = tickets.filter((t) => t.status === "To Do").length;
  const inProgressCount = tickets.filter((t) => t.status === "In Progress").length;
  const doneCount = tickets.filter((t) => t.status === "Done").length;

  if (loading) {
    return (
      <div className="min-h-screen bg-[#fcfbfc] dark:bg-[#0f0f14] flex items-center justify-center">
        <Loader2 size={30} className="animate-spin text-purple-600" />
      </div>
    );
  }

  return (
    <AppLayout
      projects={allProjects}
      currentProjectId={projectId}
      onSelectProject={(id) => navigate(`/projects/${id}`)}
    >
      <div className="max-w-6xl mx-auto">
        <Breadcrumbs
          items={[
            { label: "Projects", path: "/dashboard" },
            { label: project?.title || "Project" },
          ]}
        />

        {/* Project Overview Card */}
        <div className="card mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-xl font-bold text-slate-900 dark:text-white">
                  {project?.title}
                </h1>
                <button
                  onClick={() => openCreateModal("To Do")}
                  className="btn-primary !w-auto !py-1.5 !px-3 !my-0 text-xs shadow-md shadow-purple-600/20 flex items-center gap-1.5"
                >
                  <Plus size={14} />
                  <span>New Ticket</span>
                </button>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-xl">
                {project?.description || "No project description provided."}
              </p>
            </div>

            {/* Stats Chips (Zen Wealth style) */}
            <div className="flex items-center gap-2 flex-wrap">
              <div className="px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-[#1f1f2e] border border-slate-200 dark:border-slate-800 flex items-center gap-2 text-xs">
                <ListTodo size={14} className="text-slate-500" />
                <span className="font-semibold text-slate-700 dark:text-slate-300">
                  {todoCount}
                </span>
                <span className="text-[10px] text-slate-400">To Do</span>
              </div>

              <div className="px-3 py-1.5 rounded-xl bg-purple-50/80 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-900/40 flex items-center gap-2 text-xs text-purple-700 dark:text-purple-300">
                <Clock size={14} className="text-purple-600" />
                <span className="font-semibold">{inProgressCount}</span>
                <span className="text-[10px] opacity-80">In Progress</span>
              </div>

              <div className="px-3 py-1.5 rounded-xl bg-emerald-50/80 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/40 flex items-center gap-2 text-xs text-emerald-700 dark:text-emerald-300">
                <CheckCircle2 size={14} className="text-emerald-600" />
                <span className="font-semibold">{doneCount}</span>
                <span className="text-[10px] opacity-80">Done</span>
              </div>
            </div>
          </div>
        </div>

        {/* Search & Filter Controls + Kanban / Grid View Switcher */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 mb-6">
          <div className="relative flex-1 max-w-md">
            <Search
              size={15}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              type="text"
              placeholder="Search tickets by title or description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-white dark:bg-[#161620] border border-gray-200 dark:border-slate-800 rounded-xl text-xs text-slate-800 dark:text-slate-200 placeholder:text-slate-400 outline-none focus:border-purple-500 transition"
            />
          </div>

          <div className="flex items-center gap-2 self-end md:self-auto flex-wrap">
            {/* View Switcher: Kanban vs Grid */}
            <div className="flex items-center bg-slate-100 dark:bg-[#181824] p-1 rounded-xl border border-slate-200/80 dark:border-slate-800">
              <button
                onClick={() => setViewMode("kanban")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                  viewMode === "kanban"
                    ? "bg-white dark:bg-[#252536] text-purple-600 dark:text-purple-400 shadow-sm"
                    : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
                }`}
              >
                <Columns3 size={14} />
                <span>Kanban</span>
              </button>
              <button
                onClick={() => setViewMode("grid")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                  viewMode === "grid"
                    ? "bg-white dark:bg-[#252536] text-purple-600 dark:text-purple-400 shadow-sm"
                    : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
                }`}
              >
                <LayoutGrid size={14} />
                <span>Grid</span>
              </button>
            </div>

            {/* Status Filter (available in Grid mode) */}
            {viewMode === "grid" && (
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="text-xs bg-white dark:bg-[#161620] border border-gray-200 dark:border-slate-800 rounded-xl px-3 py-2 text-slate-700 dark:text-slate-300 outline-none cursor-pointer focus:border-purple-500"
              >
                <option value="All">All Statuses</option>
                <option value="To Do">To Do</option>
                <option value="In Progress">In Progress</option>
                <option value="Done">Done</option>
              </select>
            )}

            {/* Priority Filter */}
            <select
              value={selectedPriority}
              onChange={(e) => setSelectedPriority(e.target.value)}
              className="text-xs bg-white dark:bg-[#161620] border border-gray-200 dark:border-slate-800 rounded-xl px-3 py-2 text-slate-700 dark:text-slate-300 outline-none cursor-pointer focus:border-purple-500"
            >
              <option value="All">All Priorities</option>
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
              <option value="Critical">Critical</option>
            </select>
          </div>
        </div>

        {/* View Mode 1: Interactive Drag and Drop Kanban Board */}
        {viewMode === "kanban" ? (
          <KanbanBoard
            tickets={filteredTickets}
            onDragEnd={handleDragEnd}
            onEditTicket={openEditModal}
            onDeleteTicket={handleDeleteTicket}
            onNewTicket={(columnStatus) => openCreateModal(columnStatus)}
          />
        ) : (
          /* View Mode 2: Traditional Grid Cards */
          filteredTickets.length === 0 ? (
            <div className="card text-center py-16 flex flex-col items-center justify-center border-dashed border-gray-200 dark:border-slate-800">
              <div className="w-12 h-12 rounded-2xl bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 flex items-center justify-center mb-3">
                <Kanban size={24} />
              </div>
              <h4 className="font-semibold text-slate-900 dark:text-white text-base">
                No Tickets Found
              </h4>
              <p className="text-xs text-slate-400 mt-1 max-w-xs mb-5">
                {searchQuery || selectedStatus !== "All" || selectedPriority !== "All"
                  ? "Try adjusting your search or filters."
                  : "Create your first ticket to track bugs, tasks, or features."}
              </p>
              <button
                onClick={() => openCreateModal("To Do")}
                className="btn-primary !w-auto !py-2 !px-4 text-xs"
              >
                <Plus size={15} />
                <span>Create Ticket</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredTickets.map((ticket) => (
                <TicketCard
                  key={ticket._id}
                  ticket={ticket}
                  onEdit={openEditModal}
                  onDelete={handleDeleteTicket}
                  onStatusChange={handleStatusChange}
                />
              ))}
            </div>
          )
        )}
      </div>

      {/* Ticket Modal (Create / Edit) */}
      <Modal
        isOpen={isTicketModalOpen}
        onClose={() => setIsTicketModalOpen(false)}
        title={editingTicket ? "Edit Ticket" : "Create New Ticket"}
      >
        {modalError && (
          <div className="mb-4 p-3 rounded-lg bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-red-600 dark:text-red-400 flex items-center gap-2 text-xs">
            <AlertCircle size={15} className="shrink-0" />
            <span>{modalError}</span>
          </div>
        )}

        <form onSubmit={handleTicketSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">
              Ticket Title *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Implement drag and drop on Kanban"
              value={ticketForm.title}
              onChange={(e) =>
                setTicketForm({ ...ticketForm, title: e.target.value })
              }
              className="w-full bg-slate-100 dark:bg-[#181822] text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-slate-800 rounded-lg px-3.5 py-2.5 text-xs outline-none focus:border-purple-500 transition"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">
              Description
            </label>
            <textarea
              rows={3}
              placeholder="Details or steps to reproduce..."
              value={ticketForm.description}
              onChange={(e) =>
                setTicketForm({ ...ticketForm, description: e.target.value })
              }
              className="w-full bg-slate-100 dark:bg-[#181822] text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-slate-800 rounded-lg px-3.5 py-2.5 text-xs outline-none focus:border-purple-500 transition"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">
                Priority
              </label>
              <select
                value={ticketForm.priority}
                onChange={(e) =>
                  setTicketForm({ ...ticketForm, priority: e.target.value })
                }
                className="w-full bg-slate-100 dark:bg-[#181822] text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2 text-xs outline-none focus:border-purple-500 cursor-pointer"
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
                <option value="Critical">Critical</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">
                Status
              </label>
              <select
                value={ticketForm.status}
                onChange={(e) =>
                  setTicketForm({ ...ticketForm, status: e.target.value })
                }
                className="w-full bg-slate-100 dark:bg-[#181822] text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2 text-xs outline-none focus:border-purple-500 cursor-pointer"
              >
                <option value="To Do">To Do</option>
                <option value="In Progress">In Progress</option>
                <option value="Done">Done</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">
              Assignee
            </label>
            <select
              value={ticketForm.assignee}
              onChange={(e) =>
                setTicketForm({ ...ticketForm, assignee: e.target.value })
              }
              className="w-full bg-slate-100 dark:bg-[#181822] text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2 text-xs outline-none focus:border-purple-500 cursor-pointer"
            >
              <option value="">Unassigned</option>
              {project?.teamMembers?.map((m) => (
                <option key={m._id} value={m._id}>
                  {m.name} ({m.email})
                </option>
              ))}
            </select>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsTicketModalOpen(false)}
              className="px-4 py-2 rounded-lg text-xs font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary !w-auto !py-2 !px-4 !my-0 text-xs"
            >
              {isSubmitting ? "Saving..." : editingTicket ? "Save Changes" : "Create Ticket"}
            </button>
          </div>
        </form>
      </Modal>
    </AppLayout>
  );
}
