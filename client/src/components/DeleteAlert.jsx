import React from "react";
import Modal from "./Modal";
import { AlertTriangle, Trash2 } from "lucide-react";

export default function DeleteAlert({
  isOpen,
  onClose,
  onConfirm,
  title = "Delete Item",
  message = "Are you sure you want to delete this? This action cannot be undone.",
  isDeleting = false,
}) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <div className="flex items-start gap-3.5 my-2">
        <div className="w-10 h-10 rounded-xl bg-red-100 dark:bg-red-950/50 text-red-600 dark:text-red-400 flex items-center justify-center shrink-0">
          <AlertTriangle size={20} />
        </div>
        <div>
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            {message}
          </p>
        </div>
      </div>

      <div className="flex items-center justify-end gap-2.5 mt-6 pt-3 border-t border-gray-100 dark:border-slate-800">
        <button
          type="button"
          onClick={onClose}
          disabled={isDeleting}
          className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={onConfirm}
          disabled={isDeleting}
          className="px-4 py-2 rounded-lg text-xs font-semibold text-white bg-red-600 hover:bg-red-700 transition shadow-md shadow-red-600/20 flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
        >
          <Trash2 size={13} />
          <span>{isDeleting ? "Deleting..." : "Delete"}</span>
        </button>
      </div>
    </Modal>
  );
}

