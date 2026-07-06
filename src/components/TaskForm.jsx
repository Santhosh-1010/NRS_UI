import { useState } from 'react';
import { useToast } from '../context/ToastContext';
import { inputClassNames } from '../utils/inputClassNames';

export default function TaskForm({ onCreate }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [completed, setCompleted] = useState(false);
  const [titleError, setTitleError] = useState('');
  const [descriptionError, setDescriptionError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { showError, showSuccess } = useToast();

  async function handleSubmit(e) {
    e.preventDefault();

    const nextTitleError = title.trim() ? '' : 'Title cannot be empty';
    const nextDescriptionError = description.trim() ? '' : 'Description cannot be empty';
    setTitleError(nextTitleError);
    setDescriptionError(nextDescriptionError);

    if (nextTitleError || nextDescriptionError) {
      return;
    }

    setIsSubmitting(true);
    try {
      await onCreate({ title: title.trim(), description: description.trim(), completed });
      setTitle('');
      setDescription('');
      setCompleted(false);
      showSuccess('Task added successfully');
    } catch (err) {
      showError(err.message || 'Failed to create task');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm ring-1 ring-slate-200 p-3 sm:p-4">
      <h2 className="flex items-center gap-2 text-base font-semibold text-slate-800 mb-3">
        Add New Task
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label htmlFor="new-title" className="block text-sm font-medium text-slate-700 mb-1">
            Title <span className="text-red-600">*</span>
          </label>
          <input
            id="new-title"
            type="text"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              if (titleError) setTitleError('');
            }}
            placeholder="Enter task title"
            className={inputClassNames(Boolean(titleError), { transition: true })}
          />
          {titleError && <p className="text-sm text-red-600 mt-1">{titleError}</p>}
        </div>

        <div>
          <label htmlFor="new-description" className="block text-sm font-medium text-slate-700 mb-1">
            Description <span className="text-red-600">*</span>
          </label>
          <input
            id="new-description"
            type="text"
            value={description}
            onChange={(e) => {
              setDescription(e.target.value);
              if (descriptionError) setDescriptionError('');
            }}
            placeholder="Enter task description"
            className={inputClassNames(Boolean(descriptionError), { transition: true })}
          />
          {descriptionError && <p className="text-sm text-red-600 mt-1">{descriptionError}</p>}
        </div>
        <div>
          <label htmlFor="new-completed" className="flex items-center gap-2 cursor-pointer select-none">
            <input
              id="new-completed"
              type="checkbox"
              checked={completed}
              onChange={(e) => setCompleted(e.target.checked)}
              className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm text-slate-700">completed</span>
          </label>
        </div>
      </div>

      <div className="flex items-center justify-end mt-3">
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-medium px-4 py-1.5 rounded-md transition-colors shadow-sm hover:shadow"
        >
          <span className="text-base leading-none">+</span>
          {isSubmitting ? 'Adding...' : 'Add Task'}
        </button>
      </div>
    </form>
  );
}
