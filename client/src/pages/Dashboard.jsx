import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import AppLayout from "../components/AppLayout";
import Breadcrumbs from "../components/Breadcrumbs";
import Modal from "../components/Modal";
import ProjectCard from "../components/ProjectCard";
import API from "../api/axios";
import {
  Plus,
  FolderGit2,
  Search,
  UserPlus,
  Trash2,
  AlertCircle,
  Loader2,
  Layers,
  Sparkles,
} from "lucide-react";

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  // Modals state
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [projectForm, setProjectForm] = useState({ title: "", description: "" });

  const [isMembersModalOpen, setIsMembersModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [memberEmail, setMemberEmail] = useState("");
  const [modalError, setModalError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch all projects for user
  const fetchProjects = async () => {
    try {
      setLoading(true);
      const { data } = await API.get("/projects");
      setProjects(data);
    } catch (err) {
      console.error("Error fetching projects", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  // Handle Create / Edit Project Submit
  const handleProjectSubmit = async (e) => {
    e.preventDefault();
    setModalError("");
    setIsSubmitting(true);

    try {
      if (editingProject) {
        const { data } = await API.put(`/projects/${editingProject._id}`, projectForm);
        setProjects((prev) =>
          prev.map((p) => (p._id === data._id ? data : p))
        );
      } else {
        const { data } = await API.post("/projects", projectForm);
        setProjects((prev) => [data, ...prev]);
      }
      setIsProjectModalOpen(false);
      setEditingProject(null);
      setProjectForm({ title: "", description: "" });
    } catch (err) {
      setModalError(err.response?.data?.message || "Failed to save project");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Delete Project
  const handleDeleteProject = async (projectId) => {
    if (!window.confirm("Are you sure you want to delete this project?")) return;

    try {
      await API.delete(`/projects/${projectId}`);
      setProjects((prev) => prev.filter((p) => p._id !== projectId));
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete project");
    }
  };

  // Add Member
  const handleAddMember = async (e) => {
    e.preventDefault();
    if (!memberEmail) return;

    setModalError("");
    setIsSubmitting(true);

    try {
      const { data } = await API.post(
        `/projects/${selectedProject._id}/members`,
        { email: memberEmail }
      );
      setSelectedProject(data);
      setProjects((prev) =>
        prev.map((p) => (p._id === data._id ? data : p))
      );
      setMemberEmail("");
    } catch (err) {
      setModalError(err.response?.data?.message || "Failed to add member");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Remove Member
  const handleRemoveMember = async (memberId) => {
    try {
      const { data } = await API.delete(
        `/projects/${selectedProject._id}/members/${memberId}`
      );
      setSelectedProject(data);
      setProjects((prev) =>
        prev.map((p) => (p._id === data._id ? data : p))
      );
    } catch (err) {
      setModalError(err.response?.data?.message || "Failed to remove member");
    }
  };

  const filteredProjects = projects.filter((p) =>
    p.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <AppLayout projects={projects}>
      <div className="max-w-6xl mx-auto">
        <Breadcrumbs items={[{ label: "Projects" }]} />

        {/* Header Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
              Projects Overview
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Manage all software projects and collaborate with team members
            </p>
          </div>

          <button
            onClick={() => {
              setEditingProject(null);
              setProjectForm({ title: "", description: "" });
              setModalError("");
              setIsProjectModalOpen(true);
            }}
            className="btn-primary !w-auto !py-2.5 !px-4 !my-0 text-xs shadow-md shadow-purple-600/20"
          >
            <Plus size={16} />
            <span>New Project</span>
          </button>
        </div>

        {/* Search & Filter Bar */}
        <div className="mb-6 flex items-center justify-between gap-4">
          <div className="relative max-w-sm w-full">
            <Search
              size={16}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              type="text"
              placeholder="Search projects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white dark:bg-[#161620] border border-gray-200 dark:border-slate-800 rounded-xl text-xs text-slate-800 dark:text-slate-200 placeholder:text-slate-400 outline-none focus:border-purple-500 transition"
            />
          </div>

          <span className="text-xs text-slate-400">
            Total: <strong>{filteredProjects.length}</strong>
          </span>
        </div>

        {/* Projects Grid */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3 text-slate-400">
            <Loader2 size={28} className="animate-spin text-purple-600" />
            <p className="text-xs">Loading projects...</p>
          </div>
        ) : filteredProjects.length === 0 ? (
          <div className="card text-center py-16 flex flex-col items-center justify-center border-dashed border-gray-200 dark:border-slate-800">
            <div className="w-12 h-12 rounded-2xl bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 flex items-center justify-center mb-3">
              <FolderGit2 size={24} />
            </div>
            <h4 className="font-semibold text-slate-900 dark:text-white text-base">
              No Projects Found
            </h4>
            <p className="text-xs text-slate-400 mt-1 max-w-xs mb-5">
              Create your first project to start organizing tickets and sprints.
            </p>
            <button
              onClick={() => {
                setEditingProject(null);
                setProjectForm({ title: "", description: "" });
                setModalError("");
                setIsProjectModalOpen(true);
              }}
              className="btn-primary !w-auto !py-2 !px-4 text-xs"
            >
              <Plus size={15} />
              <span>Create Project</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredProjects.map((project) => (
              <ProjectCard
                key={project._id}
                project={project}
                isOwner={project.owner?._id === user?._id || project.owner === user?._id}
                onEdit={(p) => {
                  setEditingProject(p);
                  setProjectForm({
                    title: p.title,
                    description: p.description || "",
                  });
                  setModalError("");
                  setIsProjectModalOpen(true);
                }}
                onDelete={handleDeleteProject}
                onManageMembers={(p) => {
                  setSelectedProject(p);
                  setMemberEmail("");
                  setModalError("");
                  setIsMembersModalOpen(true);
                }}
                onClick={() => {
                  navigate(`/projects/${project._id}`);
                }}
              />
            ))}
          </div>
        )}
      </div>

      {/* Modal 1: Create / Edit Project */}
      <Modal
        isOpen={isProjectModalOpen}
        onClose={() => setIsProjectModalOpen(false)}
        title={editingProject ? "Edit Project" : "Create New Project"}
      >
        {modalError && (
          <div className="mb-4 p-3 rounded-lg bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-red-600 dark:text-red-400 flex items-center gap-2 text-xs">
            <AlertCircle size={15} className="shrink-0" />
            <span>{modalError}</span>
          </div>
        )}

        <form onSubmit={handleProjectSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">
              Project Title *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Website Redesign"
              value={projectForm.title}
              onChange={(e) =>
                setProjectForm({ ...projectForm, title: e.target.value })
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
              placeholder="Brief description about this project..."
              value={projectForm.description}
              onChange={(e) =>
                setProjectForm({ ...projectForm, description: e.target.value })
              }
              className="w-full bg-slate-100 dark:bg-[#181822] text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-slate-800 rounded-lg px-3.5 py-2.5 text-xs outline-none focus:border-purple-500 transition"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsProjectModalOpen(false)}
              className="px-4 py-2 rounded-lg text-xs font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary !w-auto !py-2 !px-4 !my-0 text-xs"
            >
              {isSubmitting ? "Saving..." : editingProject ? "Save Changes" : "Create"}
            </button>
          </div>
        </form>
      </Modal>

      {/* Modal 2: Manage Team Members */}
      <Modal
        isOpen={isMembersModalOpen}
        onClose={() => setIsMembersModalOpen(false)}
        title={`Team Members • ${selectedProject?.title || ""}`}
      >
        {modalError && (
          <div className="mb-4 p-3 rounded-lg bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-red-600 dark:text-red-400 flex items-center gap-2 text-xs">
            <AlertCircle size={15} className="shrink-0" />
            <span>{modalError}</span>
          </div>
        )}

        {/* Add Member Form (Only Owner) */}
        {selectedProject?.owner?._id === user?._id && (
          <form onSubmit={handleAddMember} className="mb-5">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">
              Add Member by Email
            </label>
            <div className="flex gap-2">
              <input
                type="email"
                required
                placeholder="colleague@example.com"
                value={memberEmail}
                onChange={(e) => setMemberEmail(e.target.value)}
                className="flex-1 bg-slate-100 dark:bg-[#181822] text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-slate-800 rounded-lg px-3.5 py-2 text-xs outline-none focus:border-purple-500 transition"
              />
              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-primary !w-auto !py-2 !px-3.5 !my-0 text-xs shrink-0"
              >
                <UserPlus size={14} />
                <span>Add</span>
              </button>
            </div>
          </form>
        )}

        {/* Current Members List */}
        <div>
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-2">
            Current Members ({selectedProject?.teamMembers?.length || 0})
          </span>
          <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
            {selectedProject?.teamMembers?.map((member) => {
              const isOwner = selectedProject.owner?._id === member._id;
              const canRemove =
                selectedProject.owner?._id === user?._id && !isOwner;

              return (
                <div
                  key={member._id}
                  className="flex items-center justify-between p-2.5 bg-slate-50 dark:bg-[#181822] rounded-xl border border-slate-100 dark:border-slate-800/80 text-xs"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-full bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 font-bold flex items-center justify-center text-xs">
                      {member.name?.[0]?.toUpperCase() || "U"}
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900 dark:text-white">
                        {member.name}
                      </p>
                      <p className="text-[11px] text-slate-400">{member.email}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {isOwner ? (
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 border border-purple-200 dark:border-purple-800 uppercase">
                        Owner
                      </span>
                    ) : (
                      <span className="text-[10px] font-medium px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 uppercase">
                        Member
                      </span>
                    )}

                    {canRemove && (
                      <button
                        onClick={() => handleRemoveMember(member._id)}
                        className="p-1 rounded text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-slate-800 transition cursor-pointer"
                        title="Remove member"
                      >
                        <Trash2 size={13} />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </Modal>
    </AppLayout>
  );
}
