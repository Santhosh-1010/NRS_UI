import { useCallback, useEffect, useState } from 'react';
import { useAuth } from './context/AuthContext';
import { tasksApi } from './api/client';
import Login from './components/Login';
import TaskForm from './components/TaskForm';
import TaskList from './components/TaskList';
import Pagination from './components/Pagination';
import Button from './components/Button';

const PAGE_SIZE = 10;

export default function App() {
  const { token, logout } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [pagination, setPagination] = useState({ total: 0, page: 1, totalPages: 1 });
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const loadTasks = useCallback(async () => {
    if (!token) return;
    setIsLoading(true);
    setError('');
    try {
      const result = await tasksApi.list(token, { page, limit: PAGE_SIZE });
      setTasks(result.data);
      setPagination(result.pagination);
    } catch (err) {
      if (err.status === 401) {
        logout();
      } else {
        setError(err.message || 'Failed to load tasks');
      }
    } finally {
      setIsLoading(false);
    }
  }, [token, page, logout]);

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  async function handleCreate(task) {
    await tasksApi.create(token, task);
    setPage(1);
    await loadTasks();
  }

  async function handleUpdate(id, updates) {
    await tasksApi.update(token, id, updates);
    await loadTasks();
  }

  async function handleDelete(id) {
    await tasksApi.remove(token, id);
    await loadTasks();
  }

  if (!token) {
    return <Login />;
  }

  return (
    <div className="h-screen flex flex-col bg-slate-100">
      <header className="shrink-0 bg-gradient-to-r from-blue-600 to-blue-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 sm:gap-2.5 min-w-0">
            <svg className="h-5 w-5 sm:h-6 sm:w-6 text-white shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7l2 2 4-4" />
            </svg>
            <h1 className="text-base sm:text-xl font-bold text-white truncate">Task Manager</h1>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <Button
              onClick={logout}
              size="sm"
              className="text-white bg-white/15 hover:bg-white/25"
            >
              Log out
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1 min-h-0 flex flex-col max-w-7xl w-full mx-auto px-3 sm:px-6 py-4 sm:py-6 gap-3">
        {error && (
          <p className="shrink-0 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md px-3 py-2">{error}</p>
        )}

        <div className="shrink-0">
          <TaskForm onCreate={handleCreate} />
        </div>

        <TaskList
          tasks={tasks}
          total={pagination.total}
          isLoading={isLoading}
          onUpdate={handleUpdate}
          onDelete={handleDelete}
        />
        <div className="shrink-0">
          <Pagination page={pagination.page} totalPages={pagination.totalPages} onPageChange={setPage} />
        </div>
      </main>
    </div>
  );
}
