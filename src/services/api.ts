import { refreshAccessToken } from "@/services/admin/authService";

const BASE_URL = import.meta.env.VITE_DJANGO_API_URL || 'http://127.0.0.1:8000/api';

const getAuthHeaders = (): Record<string, string> => {
  const token = localStorage.getItem('accessToken');
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

const handleUnauthorized = async (): Promise<string | null> => {
  const newToken = await refreshAccessToken();
  if (!newToken) {
    // Dispatch logout event to redirect to login
    window.dispatchEvent(new CustomEvent("auth:logout"));
    return null;
  }
  return newToken;
};

export const apiClient = {
  async post<T>(endpoint: string, data?: any): Promise<T> {
    let response = await fetch(`${BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: data ? JSON.stringify(data) : undefined,
    });

    // Handle 401 - try refresh token
    if (response.status === 401) {
      const newToken = await handleUnauthorized();
      if (newToken) {
        response = await fetch(`${BASE_URL}${endpoint}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${newToken}`,
          },
          body: data ? JSON.stringify(data) : undefined,
        });
      } else {
        throw new Error('Session expired. Please login again.');
      }
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || errorData.message || `API Error: ${response.statusText}`);
    }

    return response.json();
  },

  async get<T>(endpoint: string): Promise<T> {
    let response = await fetch(`${BASE_URL}${endpoint}`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    // Handle 401 - try refresh token
    if (response.status === 401) {
      const newToken = await handleUnauthorized();
      if (newToken) {
        response = await fetch(`${BASE_URL}${endpoint}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${newToken}`,
          },
        });
      } else {
        throw new Error('Session expired. Please login again.');
      }
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || errorData.message || `API Error: ${response.statusText}`);
    }

    return response.json();
  },

  async put<T>(endpoint: string, data?: any): Promise<T> {
    let response = await fetch(`${BASE_URL}${endpoint}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: data ? JSON.stringify(data) : undefined,
    });

    // Handle 401 - try refresh token
    if (response.status === 401) {
      const newToken = await handleUnauthorized();
      if (newToken) {
        response = await fetch(`${BASE_URL}${endpoint}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${newToken}`,
          },
          body: data ? JSON.stringify(data) : undefined,
        });
      } else {
        throw new Error('Session expired. Please login again.');
      }
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || errorData.message || `API Error: ${response.statusText}`);
    }

    return response.json();
  },

  async delete<T>(endpoint: string): Promise<T> {
    let response = await fetch(`${BASE_URL}${endpoint}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });

    // Handle 401 - try refresh token
    if (response.status === 401) {
      const newToken = await handleUnauthorized();
      if (newToken) {
        response = await fetch(`${BASE_URL}${endpoint}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${newToken}`,
          },
        });
      } else {
        throw new Error('Session expired. Please login again.');
      }
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || errorData.message || `API Error: ${response.statusText}`);
    }

    return response.json();
  },

  async postFormData<T>(endpoint: string, formData: FormData): Promise<T> {
    const token = localStorage.getItem('accessToken');
    const headers: Record<string, string> = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    let response = await fetch(`${BASE_URL}${endpoint}`, {
      method: 'POST',
      headers,
      body: formData,
    });

    // Handle 401 - try refresh token
    if (response.status === 401) {
      const newToken = await handleUnauthorized();
      if (newToken) {
        response = await fetch(`${BASE_URL}${endpoint}`, {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${newToken}` },
          body: formData,
        });
      } else {
        throw new Error('Session expired. Please login again.');
      }
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || errorData.message || `API Error: ${response.statusText}`);
    }

    return response.json();
  },

  async putFormData<T>(endpoint: string, formData: FormData): Promise<T> {
    const token = localStorage.getItem('accessToken');
    const headers: Record<string, string> = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    let response = await fetch(`${BASE_URL}${endpoint}`, {
      method: 'PUT',
      headers,
      body: formData,
    });

    // Handle 401 - try refresh token
    if (response.status === 401) {
      const newToken = await handleUnauthorized();
      if (newToken) {
        response = await fetch(`${BASE_URL}${endpoint}`, {
          method: 'PUT',
          headers: { 'Authorization': `Bearer ${newToken}` },
          body: formData,
        });
      } else {
        throw new Error('Session expired. Please login again.');
      }
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || errorData.message || `API Error: ${response.statusText}`);
    }

    return response.json();
  },
};
