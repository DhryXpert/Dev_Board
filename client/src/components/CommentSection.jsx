import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import API from "../api/axios";
import {
  Send,
  Trash2,
  MessageSquare,
  Loader2,
  AlertCircle,
} from "lucide-react";

export default function CommentSection({ ticketId }) {
  const { user } = useAuth();
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const fetchComments = async () => {
    try {
      setLoading(true);
      const { data } = await API.get(`/comments/ticket/${ticketId}`);
      setComments(data);
    } catch (err) {
      console.error("Failed to load comments", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (ticketId) {
      fetchComments();
    }
  }, [ticketId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setError("");
    setSubmitting(true);

    try {
      const { data } = await API.post("/comments", {
        ticketId,
        text: newComment.trim(),
      });
      setComments((prev) => [...prev, data]);
      setNewComment("");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to post comment");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (commentId) => {
    try {
      await API.delete(`/comments/${commentId}`);
      setComments((prev) => prev.filter((c) => c._id !== commentId));
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete comment");
    }
  };

  return (
    <div className="pt-4 mt-4 border-t border-gray-100 dark:border-slate-800">
      <div className="flex items-center gap-2 mb-3">
        <MessageSquare size={16} className="text-purple-600 dark:text-purple-400" />
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
          Comments ({comments.length})
        </h4>
      </div>

      {error && (
        <div className="mb-3 p-2.5 rounded-lg bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-red-600 dark:text-red-400 flex items-center gap-2 text-xs">
          <AlertCircle size={14} className="shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Comment Input */}
      <form onSubmit={handleSubmit} className="mb-4">
        <div className="relative">
          <textarea
            rows={2}
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Write a comment or update..."
            className="w-full bg-slate-50 dark:bg-[#181822] text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-slate-800 rounded-xl p-3 text-xs outline-none focus:border-purple-500 transition resize-none placeholder:text-slate-400"
          />
          <div className="flex justify-end mt-1.5">
            <button
              type="submit"
              disabled={submitting || !newComment.trim()}
              className="btn-primary !w-auto !py-1.5 !px-3 !my-0 text-xs shrink-0 flex items-center gap-1.5"
            >
              {submitting ? (
                <Loader2 size={13} className="animate-spin" />
              ) : (
                <Send size={13} />
              )}
              <span>Comment</span>
            </button>
          </div>
        </div>
      </form>

      {/* Comments List */}
      {loading ? (
        <div className="py-6 flex items-center justify-center text-slate-400 gap-2">
          <Loader2 size={16} className="animate-spin text-purple-600" />
          <span className="text-xs">Loading comments...</span>
        </div>
      ) : comments.length === 0 ? (
        <p className="text-center text-xs text-slate-400 py-4">
          No comments yet. Start the conversation!
        </p>
      ) : (
        <div className="space-y-3 max-h-56 overflow-y-auto pr-1">
          {comments.map((comment) => {
            const isAuthor =
              comment.user?._id === user?._id || comment.user === user?._id;

            return (
              <div
                key={comment._id}
                className="p-3 bg-slate-50/70 dark:bg-[#181824] rounded-xl border border-slate-100 dark:border-slate-800/80 text-xs"
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-full bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 font-bold flex items-center justify-center text-[10px]">
                      {comment.user?.name?.[0]?.toUpperCase() || "U"}
                    </div>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                      {comment.user?.name || "User"}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      {new Date(comment.createdAt).toLocaleDateString([], {
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>

                  {isAuthor && (
                    <button
                      onClick={() => handleDelete(comment._id)}
                      title="Delete comment"
                      className="text-slate-400 hover:text-red-500 transition p-0.5 cursor-pointer"
                    >
                      <Trash2 size={12} />
                    </button>
                  )}
                </div>

                <p className="text-slate-600 dark:text-slate-300 text-xs pl-7 leading-relaxed whitespace-pre-wrap">
                  {comment.text}
                </p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

