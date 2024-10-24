import axios, { AxiosInstance, AxiosRequestConfig, AxiosError } from 'axios';

class APIClient {
  private instance: AxiosInstance;

  constructor(baseURL: string) {
    this.instance = axios.create({
      baseURL,
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.instance.interceptors.response.use((response) => response, this.handleError.bind(this));
  }

  private handleError(error: AxiosError) {
    if (error.response?.status === 401) {
      console.error('Unauthorized access:', error);
    }
    return Promise.reject(error);
  }

  async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.instance.get<T>(url, config);
    return response.data;
  }

  async post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.instance.post<T>(url, data, config);
    return response.data;
  }

  async put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.instance.put<T>(url, data, config);
    return response.data;
  }

  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.instance.delete<T>(url, config);
    return response.data;
  }
}

const apiBaseUrl = process.env.REACT_APP_API_CLIENT || 'http://localhost:5000/api';
console.log('API Base URL:', apiBaseUrl);

export const apiClient = new APIClient(apiBaseUrl);
