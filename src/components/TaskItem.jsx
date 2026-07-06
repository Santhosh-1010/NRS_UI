import { useState, Fragment } from 'react';
import { useToast } from '../context/ToastContext';
import { inputClassNames } from '../utils/inputClassNames';
import Modal from './Modal';

export default function TaskItem({ task, onUpdate, onDelete }) {
  const [isEditing, setIsEditing] = useState(false);
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description);
  const [titleError, setTitleError] = useState('');
  const [isBusy, setIsBusy] = useState(false);
  const { showError, showSuccess } = useToast();

  async function handleToggleCompleted() {
    setIsBusy(true);
    try {
      await onUpdate(task.id, { completed: !task.completed });
      showSuccess('Task updated successfully');
    } catch (err) {
      showError(err.message || 'Failed to update task');
    } finally {
      setIsBusy(false);
    }
  }

  async function handleSaveEdit(e) {
    e.preventDefault();
    if (!title.trim()) {
      setTitleError('Title cannot be empty');
      return;
    }
    setTitleError('');
    setIsBusy(true);
    try {
      await onUpdate(task.id, { title: title.trim(), description });
      setIsEditing(false);
      showSuccess('Task updated successfully');
    } catch (err) {
      showError(err.message || 'Failed to update task');
    } finally {
      setIsBusy(false);
    }
  }

  async function handleDelete() {
    setIsBusy(true);
    try {
      await onDelete(task.id);
      showSuccess('Task deleted successfully');
      setIsConfirmingDelete(false);
    } catch (err) {
      showError(err.message || 'Failed to delete task');
    } finally {
      setIsBusy(false);
    }
  }

  function closeEdit() {
    setIsEditing(false);
    setTitle(task.title);
    setDescription(task.description);
    setTitleError('');
  }

  return (
    <Fragment>
      <tr className="hover:bg-slate-50 transition-colors">
        <td className="px-3 sm:px-5 py-3 text-slate-400 font-mono">{task.id}</td>
        <td className={`px-3 sm:px-5 py-3 break-words ${task.completed ? 'line-through text-slate-400' : 'text-slate-800'} font-medium`}>
          {task.title}
        </td>
        <td className={`px-3 sm:px-5 py-3 break-words ${task.completed ? 'text-slate-300' : 'text-slate-500'}`}>
          {task.description}
        </td>
        <td className="px-3 sm:px-5 py-3 text-center">
          <label className="inline-flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={task.completed}
              onChange={handleToggleCompleted}
              disabled={isBusy}
              className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
              aria-label={`Mark "${task.title}" as ${task.completed ? 'incomplete' : 'completed'}`}
            />
            <span className={`text-sm font-medium ${task.completed ? 'text-emerald-600' : 'text-slate-500'}`}>
              {task.completed ? 'Yes' : 'No'}
            </span>
          </label>
        </td>
        <td className="px-3 sm:px-5 py-3">
          <div className="flex gap-2 justify-center">
            <button
              onClick={() => setIsEditing(true)}
              disabled={isBusy}
              aria-label={`Edit "${task.title}"`}
              title="Edit"
              className="flex items-center justify-center h-8 w-8 text-blue-600 hover:bg-blue-50 border border-blue-300 rounded-lg transition-colors disabled:opacity-60"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>
            <button
              onClick={() => setIsConfirmingDelete(true)}
              disabled={isBusy}
              aria-label={`Delete "${task.title}"`}
              title="Delete"
              className="flex items-center justify-center h-8 w-8 text-red-600 hover:bg-red-50 border border-red-300 rounded-lg transition-colors disabled:opacity-60"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M9 7V4a1 1 0 011-1h4a1 1 0 011 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </td>
      </tr>

      {isEditing && (
        <Modal labelledBy={`edit-task-${task.id}-heading`} onClose={closeEdit}>
          <h3 id={`edit-task-${task.id}-heading`} className="text-base font-semibold text-slate-800 mb-4">
            Edit Task
          </h3>
          <form onSubmit={handleSaveEdit} className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">ID</label>
              <input
                type="text"
                value={task.id}
                disabled
                readOnly
                className="w-full border border-slate-200 bg-slate-100 text-slate-500 rounded-md px-3 py-1.5 cursor-not-allowed"
              />
            </div>
            <div>
              <label htmlFor={`edit-title-${task.id}`} className="block text-sm font-medium text-slate-700 mb-1">
                Title <span className="text-red-600">*</span>
              </label>
              <input
                id={`edit-title-${task.id}`}
                type="text"
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                  if (titleError) setTitleError('');
                }}
                className={inputClassNames(Boolean(titleError))}
              />
              {titleError && <p className="text-sm text-red-600 mt-1">{titleError}</p>}
            </div>
            <div>
              <label htmlFor={`edit-description-${task.id}`} className="block text-sm font-medium text-slate-700 mb-1">
                Description
              </label>
              <textarea
                id={`edit-description-${task.id}`}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="w-full border border-slate-300 rounded-md px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
              />
            </div>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={closeEdit}
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-medium px-4 py-1.5 rounded-md transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isBusy}
                className="bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white text-sm font-medium px-4 py-1.5 rounded-md transition-colors"
              >
                Save
              </button>
            </div>
          </form>
        </Modal>
      )}

      {isConfirmingDelete && (
        <Modal
          labelledBy={`delete-task-${task.id}-heading`}
          onClose={() => !isBusy && setIsConfirmingDelete(false)}
          role="alertdialog"
          maxWidth="max-w-sm"
        >
          <h3 id={`delete-task-${task.id}-heading`} className="text-base font-semibold text-slate-800 mb-2">
            Delete Task
          </h3>
          <p className="text-sm text-slate-600 mb-4">
            Are you sure you want to delete &ldquo;{task.title}&rdquo;? This action cannot be undone.
          </p>
          <div className="flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsConfirmingDelete(false)}
              disabled={isBusy}
              className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-medium px-4 py-1.5 rounded-md transition-colors disabled:opacity-60"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleDelete}
              disabled={isBusy}
              className="bg-red-600 hover:bg-red-700 disabled:opacity-60 text-white text-sm font-medium px-4 py-1.5 rounded-md transition-colors"
            >
              {isBusy ? 'Deleting...' : 'Delete'}
            </button>
          </div>
        </Modal>
      )}
    </Fragment>
  );
}
