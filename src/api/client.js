const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

class ApiClientError extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
  }
}

async function request(path, { method = 'GET', body, token } = {}) {
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${API_URL}${path}`, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  if (res.status === 204) return null;

  const isJson = res.headers.get('content-type')?.includes('application/json');
  const data = isJson ? await res.json() : null;

  if (!res.ok) {
    throw new ApiClientError(data?.error || `Request failed with status ${res.status}`, res.status);
  }

  return data;
}

export const authApi = {
  login: (username, password) => request('/auth/login', { method: 'POST', body: { username, password } }),
};

export const tasksApi = {
  list: (token, params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/tasks${query ? `?${query}` : ''}`, { token });
  },
  create: (token, task) => request('/tasks', { method: 'POST', body: task, token }),
  update: (token, id, updates) => request(`/tasks/${id}`, { method: 'PUT', body: updates, token }),
  remove: (token, id) => request(`/tasks/${id}`, { method: 'DELETE', token }),
};

export { ApiClientError };
