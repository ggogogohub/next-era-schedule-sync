
import { ApiResponse, PaginatedResponse } from '@/types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

class ApiClient {
  private baseURL: string;
  private token: string | null = null;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
    this.token = localStorage.getItem('authToken');
  }

  setToken(token: string | null) {
    this.token = token;
    if (token) {
      localStorage.setItem('authToken', token);
    } else {
      localStorage.removeItem('authToken');
    }
  }

  private getHeaders(): Record<string, string> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`;
    }

    return headers;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;
    const config: RequestInit = {
      ...options,
      headers: {
        ...this.getHeaders(),
        ...options.headers,
      },
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `HTTP error! status: ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Authentication endpoints
  async login(email: string, password: string) {
    return this.request<{ user: any; token: string }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async logout() {
    return this.request<void>('/auth/logout', {
      method: 'POST',
    });
  }

  async refreshToken() {
    return this.request<{ token: string }>('/auth/refresh', {
      method: 'POST',
    });
  }

  async forgotPassword(email: string) {
    return this.request<void>('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  }

  async resetPassword(token: string, password: string) {
    return this.request<void>('/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({ token, password }),
    });
  }

  // User endpoints
  async getUsers(params?: any) {
    const queryString = params ? `?${new URLSearchParams(params).toString()}` : '';
    return this.request<PaginatedResponse<any>>(`/users${queryString}`);
  }

  async createUser(userData: any) {
    return this.request<any>('/users', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async updateUser(id: string, userData: any) {
    return this.request<any>(`/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  }

  async deleteUser(id: string) {
    return this.request<void>(`/users/${id}`, {
      method: 'DELETE',
    });
  }

  async getCurrentUser() {
    return this.request<any>('/users/me');
  }

  async updateProfile(profileData: any) {
    return this.request<any>('/users/me', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    });
  }

  // Schedule endpoints
  async getSchedules(params?: any) {
    const queryString = params ? `?${new URLSearchParams(params).toString()}` : '';
    return this.request<PaginatedResponse<any>>(`/schedules${queryString}`);
  }

  async createSchedule(scheduleData: any) {
    return this.request<any>('/schedules', {
      method: 'POST',
      body: JSON.stringify(scheduleData),
    });
  }

  async updateSchedule(id: string, scheduleData: any) {
    return this.request<any>(`/schedules/${id}`, {
      method: 'PUT',
      body: JSON.stringify(scheduleData),
    });
  }

  async deleteSchedule(id: string) {
    return this.request<void>(`/schedules/${id}`, {
      method: 'DELETE',
    });
  }

  async generateSchedule(constraintsId: string, dateRange: { startDate: string; endDate: string }) {
    return this.request<any>('/schedules/generate', {
      method: 'POST',
      body: JSON.stringify({ constraintsId, ...dateRange }),
    });
  }

  // Time-off endpoints
  async getTimeOffRequests(params?: any) {
    const queryString = params ? `?${new URLSearchParams(params).toString()}` : '';
    return this.request<PaginatedResponse<any>>(`/time-off${queryString}`);
  }

  async createTimeOffRequest(requestData: any) {
    return this.request<any>('/time-off', {
      method: 'POST',
      body: JSON.stringify(requestData),
    });
  }

  async updateTimeOffRequest(id: string, requestData: any) {
    return this.request<any>(`/time-off/${id}`, {
      method: 'PUT',
      body: JSON.stringify(requestData),
    });
  }

  async reviewTimeOffRequest(id: string, reviewData: any) {
    return this.request<any>(`/time-off/${id}/review`, {
      method: 'POST',
      body: JSON.stringify(reviewData),
    });
  }

  // Messages endpoints
  async getMessages(params?: any) {
    const queryString = params ? `?${new URLSearchParams(params).toString()}` : '';
    return this.request<PaginatedResponse<any>>(`/messages${queryString}`);
  }

  async sendMessage(messageData: any) {
    return this.request<any>('/messages', {
      method: 'POST',
      body: JSON.stringify(messageData),
    });
  }

  async markMessageAsRead(id: string) {
    return this.request<void>(`/messages/${id}/read`, {
      method: 'POST',
    });
  }

  async acknowledgeMessage(id: string) {
    return this.request<void>(`/messages/${id}/acknowledge`, {
      method: 'POST',
    });
  }

  // Analytics endpoints
  async getWorkforceMetrics(params?: any) {
    const queryString = params ? `?${new URLSearchParams(params).toString()}` : '';
    return this.request<any>(`/analytics/workforce${queryString}`);
  }

  async getScheduleAdherence(params?: any) {
    const queryString = params ? `?${new URLSearchParams(params).toString()}` : '';
    return this.request<any>(`/analytics/schedule-adherence${queryString}`);
  }

  async getActivityLogs(params?: any) {
    const queryString = params ? `?${new URLSearchParams(params).toString()}` : '';
    return this.request<PaginatedResponse<any>>(`/analytics/activity${queryString}`);
  }

  // Scheduling constraints endpoints
  async getSchedulingConstraints() {
    return this.request<any[]>('/scheduling-constraints');
  }

  async createSchedulingConstraints(constraintsData: any) {
    return this.request<any>('/scheduling-constraints', {
      method: 'POST',
      body: JSON.stringify(constraintsData),
    });
  }

  async updateSchedulingConstraints(id: string, constraintsData: any) {
    return this.request<any>(`/scheduling-constraints/${id}`, {
      method: 'PUT',
      body: JSON.stringify(constraintsData),
    });
  }

  // Shift swap endpoints
  async getShiftSwapRequests(params?: any) {
    const queryString = params ? `?${new URLSearchParams(params).toString()}` : '';
    return this.request<PaginatedResponse<any>>(`/shift-swaps${queryString}`);
  }

  async createShiftSwapRequest(requestData: any) {
    return this.request<any>('/shift-swaps', {
      method: 'POST',
      body: JSON.stringify(requestData),
    });
  }

  async reviewShiftSwapRequest(id: string, reviewData: any) {
    return this.request<any>(`/shift-swaps/${id}/review`, {
      method: 'POST',
      body: JSON.stringify(reviewData),
    });
  }
}

export const apiClient = new ApiClient(API_BASE_URL);
