export const API_URL = import.meta.env.VITE_API_URL;

export function getAuthHeaders(extraHeaders = {}) {
  const password = localStorage.getItem("appPassword") || "";

  return {
    ...extraHeaders,
    "X-App-Password": password,
  };
}

export async function apiFetch(path, options = {}) {
  const finalOptions = {
    ...options,
    headers: getAuthHeaders(options.headers || {}),
  };

  const response = await fetch(`${API_URL}${path}`, finalOptions);

  if (response.status === 401) {
    throw new Error("Unauthorized");
  }

  return response;
}