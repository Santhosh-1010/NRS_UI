import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useAsyncAction } from '../hooks/useAsyncAction';
import Button from './Button';

export default function Login() {
  const { login } = useAuth();
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('password123');
  const [isSubmitting, runSubmit] = useAsyncAction('Login failed');

  function handleSubmit(e) {
    e.preventDefault();
    runSubmit(() => login(username, password));
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 px-4">
      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-6 sm:p-8 w-full max-w-sm space-y-4">
        <h1 className="text-2xl font-semibold text-slate-800 text-center">Task Manager Login</h1>
        <p className="text-sm text-slate-500 text-center">
          Demo credentials: <code className="text-slate-700">admin / password123</code>
        </p>

        <div>
          <label htmlFor="username" className="block text-sm font-medium text-slate-700 mb-1">
            Username
          </label>
          <input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full border border-slate-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-1">
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border border-slate-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          />
        </div>

        <Button
          type="submit"
          disabled={isSubmitting}
          fullWidth
          className="bg-indigo-600 hover:bg-indigo-700 py-2"
        >
          {isSubmitting ? 'Logging in...' : 'Log In'}
        </Button>
      </form>
    </div>
  );
}
