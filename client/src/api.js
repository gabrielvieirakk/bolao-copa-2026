// Cliente HTTP centralizado — token JWT em localStorage

const BASE = import.meta.env.VITE_API_URL || "";

function getToken() {
  return localStorage.getItem("bolao_token");
}

async function request(method, path, body) {
  const headers = { "Content-Type": "application/json" };
  const token = getToken();
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(`${BASE}${path}`, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.erro || `HTTP ${res.status}`);
  return data;
}

export const api = {
  get: (path) => request("GET", path),
  post: (path, body) => request("POST", path, body),
  delete: (path) => request("DELETE", path),
};
