export async function apiFetch(path, options = {}) {
  const password = localStorage.getItem("appPassword") || "";

  const response = await fetch(`${import.meta.env.VITE_API_URL}${path}`, {
    ...options,
    headers: {
      ...(options.headers || {}),
      "X-App-Password": password,
    },
  });

  if (response.status === 401) {
    localStorage.removeItem("appPassword");
    window.location.reload();
    throw new Error("Unauthorized");
  }

  return response;
}