import TaskItem from './TaskItem';

const SKELETON_ROWS = 5;

function SkeletonRow() {
  return (
    <tr>
      <td className="px-3 sm:px-5 py-3"><div className="h-4 w-12 bg-slate-200 rounded animate-pulse" /></td>
      <td className="px-3 sm:px-5 py-3"><div className="h-4 w-32 bg-slate-200 rounded animate-pulse" /></td>
      <td className="px-3 sm:px-5 py-3"><div className="h-4 w-48 bg-slate-200 rounded animate-pulse" /></td>
      <td className="px-3 sm:px-5 py-3 text-center"><div className="h-4 w-10 bg-slate-200 rounded animate-pulse mx-auto" /></td>
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
          <table className="w-full table-fixed text-left min-w-[640px]">
            <colgroup>
              <col className="w-20 sm:w-24" />
              <col className="w-1/4" />
              <col className="w-1/3" />
              <col className="w-24 sm:w-28" />
              <col className="w-24 sm:w-28" />
            </colgroup>
            <thead className="sticky top-0 z-10">
              <tr className="bg-slate-50 text-sm text-slate-600">
                <th className="px-3 sm:px-5 py-3 font-semibold">ID</th>
                <th className="px-3 sm:px-5 py-3 font-semibold">Title</th>
                <th className="px-3 sm:px-5 py-3 font-semibold">Description</th>
                <th className="px-3 sm:px-5 py-3 font-semibold text-center">Completed</th>
                <th className="px-3 sm:px-5 py-3 font-semibold text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading
                ? Array.from({ length: SKELETON_ROWS }, (_, i) => <SkeletonRow key={i} />)
                : tasks.map((task) => (
                    <TaskItem key={task.id} task={task} onUpdate={onUpdate} onDelete={onDelete} />
                  ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
