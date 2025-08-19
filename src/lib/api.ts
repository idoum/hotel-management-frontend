// src/lib/api.ts

import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import Cookies from 'js-cookie';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3005/api';

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      timeout: 10000,
      headers: { 'Content-Type': 'application/json' },
    });
    this.setupInterceptors();
  }

  private setupInterceptors() {
    this.client.interceptors.request.use(
      config => {
        const token = Cookies.get('hotel_access_token');
        if (token) config.headers.Authorization = `Bearer ${token}`;
        return config;
      },
      error => Promise.reject(error)
    );

    this.client.interceptors.response.use(
      response => response,
      async error => {
        const originalRequest = error.config;
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;
          const refresh = Cookies.get('hotel_refresh_token');
          if (refresh) {
            try {
              const res = await axios.post(`${API_BASE_URL}/auth/refresh`, { refresh_token: refresh });
              Cookies.set('hotel_access_token', res.data.data.accessToken);
              return this.client(originalRequest);
            } catch {}
          }
        }
        return Promise.reject(error);
      }
    );
  }

  async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const res: AxiosResponse<T> = await this.client.get(url, config);
    return res.data;
  }

  async post<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    const res: AxiosResponse<T> = await this.client.post(url, data, config);
    return res.data;
  }

  async put<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    const res: AxiosResponse<T> = await this.client.put(url, data, config);
    return res.data;
  }

  async patch<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    const res: AxiosResponse<T> = await this.client.patch(url, data, config);
    return res.data;
  }

  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const res: AxiosResponse<T> = await this.client.delete(url, config);
    return res.data;
  }
}

export const apiClient = new ApiClient();
