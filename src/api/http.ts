import { config } from 'src/config';

const API_BASE_URL = config.api.baseUrl;

export async function apiFetch(path: string, options: RequestInit = {}): Promise<Response> {
  const token = localStorage.getItem('access_token');

  const headers = new Headers(options.headers || {});

  // Only set JSON content-type if body is not a FormData instance
  if (!(options.body instanceof FormData) && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const prefix = path.startsWith('/') ? '' : '/';
  const res = await fetch(`${API_BASE_URL}${prefix}${path}`, {
    ...options,
    headers,
  });

  return res;
}

export default apiFetch;
