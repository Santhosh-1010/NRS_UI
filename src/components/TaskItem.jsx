import { useState, Fragment } from 'react';
import { useToast } from '../context/ToastContext';
import { useAsyncAction } from '../hooks/useAsyncAction';
import { inputClassNames } from '../utils/inputClassNames';
import Button from './Button';
import Modal from './Modal';

export default function TaskItem({ task, columns, onUpdate, onDelete }) {
  const [isEditing, setIsEditing] = useState(false);
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description);
  const [completed, setCompleted] = useState(task.completed);
  const [titleError, setTitleError] = useState('');
  const [descriptionError, setDescriptionError] = useState('');
  const { showSuccess } = useToast();
  const [isTogglingCompleted, runToggleCompleted] = useAsyncAction('Failed to update task');
  const [isSavingEdit, runSaveEdit] = useAsyncAction('Failed to update task');
  const [isDeleting, runDelete] = useAsyncAction('Failed to delete task');
  const isBusy = isTogglingCompleted || isSavingEdit || isDeleting;

  function handleToggleCompleted() {
    runToggleCompleted(() => onUpdate(task.id, { completed: !task.completed }), {
      onSuccess: () => showSuccess('Task updated successfully'),
    });
  }

  function handleSaveEdit(e) {
    e.preventDefault();
    const nextTitleError = title.trim() ? '' : 'Title cannot be empty';
    const nextDescriptionError = description.trim() ? '' : 'Description cannot be empty';
    setTitleError(nextTitleError);
    setDescriptionError(nextDescriptionError);

    if (nextTitleError || nextDescriptionError) {
      return;
    }

    runSaveEdit(() => onUpdate(task.id, { title: title.trim(), description: description.trim(), completed }), {
      onSuccess: () => {
        setIsEditing(false);
        showSuccess('Task updated successfully');
      },
    });
  }

  function handleDelete() {
    runDelete(() => onDelete(task.id), {
      onSuccess: () => {
        showSuccess('Task deleted successfully');
        setIsConfirmingDelete(false);
      },
    });
  }

  function closeEdit() {
    setIsEditing(false);
    setTitle(task.title);
    setDescription(task.description);
    setCompleted(task.completed);
    setTitleError('');
    setDescriptionError('');
  }

  return (
    <Fragment>
      <tr className="hover:bg-slate-50 transition-colors">
        {columns.map((key) => {
          if (key === 'id') {
            return (
              <td key={key} className="px-3 sm:px-5 py-3 text-slate-400 font-mono">{task.id}</td>
            );
          }
          if (key === 'title') {
            return (
              <td key={key} className={`px-3 sm:px-5 py-3 break-words ${task.completed ? 'line-through text-slate-400' : 'text-slate-800'} font-medium`}>
                {task.title}
              </td>
            );
          }
          if (key === 'completed') {
            return (
              <td key={key} className="px-3 sm:px-5 py-3 text-center">
                <span className={`text-sm font-medium ${task.completed ? 'text-emerald-600' : 'text-slate-500'}`}>
                  {task.completed ? 'Yes' : 'No'}
                </span>
              </td>
            );
          }
          return (
            <td key={key} className={`px-3 sm:px-5 py-3 break-words ${task.completed ? 'text-slate-300' : 'text-slate-500'}`}>
              {String(task[key] ?? '')}
            </td>
          );
        })}
        <td className="px-3 sm:px-5 py-3">
          <div className="flex gap-2 justify-center">
            <Button
              variant="icon"
              iconColor="blue"
              onClick={() => setIsEditing(true)}
              disabled={isBusy || task.completed}
              aria-label={`Edit "${task.title}"`}
              title={task.completed ? 'Completed tasks cannot be edited' : 'Edit'}
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </Button>
            <Button
              variant="icon"
              iconColor="red"
              onClick={() => setIsConfirmingDelete(true)}
              disabled={isBusy}
              aria-label={`Delete "${task.title}"`}
              title="Delete"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M9 7V4a1 1 0 011-1h4a1 1 0 011 1v3M4 7h16" />
              </svg>
            </Button>
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
                Description <span className="text-red-600">*</span>
              </label>
              <textarea
                id={`edit-description-${task.id}`}
                value={description}
                onChange={(e) => {
                  setDescription(e.target.value);
                  if (descriptionError) setDescriptionError('');
                }}
                rows={3}
                className={`${inputClassNames(Boolean(descriptionError))} resize-none`}
              />
              {descriptionError && <p className="text-sm text-red-600 mt-1">{descriptionError}</p>}
            </div>
            <div className="flex items-center justify-between gap-2 pt-2">
              <label htmlFor={`edit-completed-${task.id}`} className="flex items-center gap-2 cursor-pointer select-none text-sm text-slate-700">
                <input
                  id={`edit-completed-${task.id}`}
                  type="checkbox"
                  checked={completed}
                  onChange={(e) => setCompleted(e.target.checked)}
                  className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                />
                <span>Completed</span>
              </label>
              <div className="flex items-center gap-2">
                <Button type="button" variant="neutral" size="sm" onClick={closeEdit}>
                  Cancel
                </Button>
                <Button type="submit" variant="primary" size="sm" disabled={isSavingEdit}>
                  Save
                </Button>
              </div>
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
            <Button type="button" variant="neutral" size="sm" onClick={() => setIsConfirmingDelete(false)} disabled={isBusy}>
              Cancel
            </Button>
            <Button type="button" variant="danger" size="sm" onClick={handleDelete} disabled={isBusy}>
              {isDeleting ? 'Deleting...' : 'Delete'}
            </Button>
          </div>
        </Modal>
      )}
    </Fragment>
  );
}
