const API_BASE_URL = "http://localhost:8000/api/v1";

interface RequestOptions extends RequestInit {
  params?: Record<string, any>;
}

export class ApiError extends Error {
  status: number;
  data: any;

  constructor(status: number, data: any) {
    super(data?.detail || "API Error");
    this.name = "ApiError";
    this.status = status;
    this.data = data;
  }
}

async function fetchWithAuth(endpoint: string, options: RequestOptions = {}) {
  const token = typeof window !== "undefined" ? localStorage.getItem("atomquest-token") : null;
  const headers = new Headers(options.headers || {});
  
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }
  
  if (!(options.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }

  let url = `${API_BASE_URL}${endpoint}`;
  
  if (options.params) {
    const searchParams = new URLSearchParams();
    Object.entries(options.params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        searchParams.append(key, String(value));
      }
    });
    const queryString = searchParams.toString();
    if (queryString) {
      url += `?${queryString}`;
    }
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (response.status === 401) {
    if (typeof window !== "undefined") {
      localStorage.removeItem("atomquest-token");
      localStorage.removeItem("atomquest-role");
      window.location.href = "/login";
    }
    throw new ApiError(401, { detail: "Unauthorized" });
  }

  if (response.status === 204) {
    return null;
  }

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new ApiError(response.status, data);
  }

  return data;
}

export const api = {
  get: (endpoint: string, params?: Record<string, any>, options?: RequestInit) =>
    fetchWithAuth(endpoint, { ...options, method: "GET", params }),
    
  post: (endpoint: string, body?: any, options?: RequestInit) =>
    fetchWithAuth(endpoint, {
      ...options,
      method: "POST",
      body: body ? JSON.stringify(body) : undefined,
    }),
    
  patch: (endpoint: string, body?: any, options?: RequestInit) =>
    fetchWithAuth(endpoint, {
      ...options,
      method: "PATCH",
      body: body ? JSON.stringify(body) : undefined,
    }),
    
  delete: (endpoint: string, options?: RequestInit) =>
    fetchWithAuth(endpoint, { ...options, method: "DELETE" }),
};
