import TaskItem from './TaskItem';

const SKELETON_ROWS = 5;
const HIDDEN_COLUMNS = ['createdAt', 'updatedAt'];
const COLUMN_ORDER = ['id', 'title', 'description', 'completed'];
const COLUMN_LABELS = {
  id: 'ID',
  title: 'Title',
  description: 'Description',
  completed: 'Completed',
};
const CENTERED_COLUMNS = ['completed'];

function formatLabel(key) {
  const spaced = key.replace(/([a-z0-9])([A-Z])/g, '$1 $2');
  return spaced.charAt(0).toUpperCase() + spaced.slice(1);
}

function getColumns(tasks) {
  const keys = new Set();
  tasks.forEach((task) => {
    Object.keys(task).forEach((key) => {
      if (!HIDDEN_COLUMNS.includes(key)) keys.add(key);
    });
  });
  const ordered = COLUMN_ORDER.filter((key) => keys.has(key));
  const rest = [...keys].filter((key) => !COLUMN_ORDER.includes(key));
  return [...ordered, ...rest];
}

function SkeletonRow({ columnCount }) {
  return (
    <tr>
      {Array.from({ length: columnCount }, (_, i) => (
        <td key={i} className="px-3 sm:px-5 py-3"><div className="h-4 w-24 bg-slate-200 rounded animate-pulse" /></td>
      ))}
      <td className="px-3 sm:px-5 py-3">
        <div className="flex gap-2 justify-center">
          <div className="h-8 w-8 bg-slate-200 rounded-lg animate-pulse" />
          <div className="h-8 w-8 bg-slate-200 rounded-lg animate-pulse" />
        </div>
      </td>
    </tr>
  );
}

export default function TaskList({ tasks, total, isLoading, onUpdate, onDelete }) {
  const columns = getColumns(tasks);

  return (
    <div className="flex-1 min-h-0 flex flex-col bg-white rounded-lg shadow-sm ring-1 ring-slate-200 overflow-hidden">
      <div className="shrink-0 px-4 py-4 border-b border-slate-200">
        <h2 className="text-base font-semibold text-slate-800">
          Task List {!isLoading && <span className="text-slate-400 font-normal">({total})</span>}
        </h2>
      </div>

      {!isLoading && tasks.length === 0 ? (
        <p className="text-slate-500 text-center py-12 px-4">No tasks found. Create your first task to get started.</p>
      ) : (
        <div className="flex-1 min-h-0 overflow-x-auto overflow-y-auto">
          <table className="w-full text-left min-w-[640px]">
            <thead className="sticky top-0 z-10">
              <tr className="bg-slate-50 text-sm text-slate-600">
                {columns.map((key) => (
                  <th
                    key={key}
                    className={`px-3 sm:px-5 py-3 font-semibold ${CENTERED_COLUMNS.includes(key) ? 'text-center' : ''}`}
                  >
                    {COLUMN_LABELS[key] || formatLabel(key)}
                  </th>
                ))}
                <th className="px-3 sm:px-5 py-3 font-semibold text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading
                ? Array.from({ length: SKELETON_ROWS }, (_, i) => <SkeletonRow key={i} columnCount={columns.length || 4} />)
                : tasks.map((task) => (
                    <TaskItem key={task.id} task={task} columns={columns} onUpdate={onUpdate} onDelete={onDelete} />
                  ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
