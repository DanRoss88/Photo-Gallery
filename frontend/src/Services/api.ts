import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from "axios";

export const requestInterceptor = (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
    const token = localStorage.getItem('token'); 
    if (token) {
      config.headers = config.headers || {};
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  };

const responseInterceptor = (response: AxiosResponse): AxiosResponse => {
  return response;
};

export const errorInterceptor = (error: any): Promise<never> => {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      const errorMessage = error.response.data.message || "HTTP Error";
      const customError = new Error(errorMessage) as Error & { status?: number };
      customError.status = error.response.status;
      return Promise.reject(customError);
    } else if (error.request) {
      // The request was made but no response was received
      return Promise.reject(new Error('No response received from server'));
    } else {
      // Something happened in setting up the request that triggered an Error
      return Promise.reject(new Error('Error setting up the request'));
    }
  };
  

interface RequestOptions extends AxiosRequestConfig {
  token?: string;
}

class APIClient {
  private instance: AxiosInstance;

  constructor(baseURL: string) {
    this.instance = axios.create({
      baseURL,
      headers: {
        "Content-Type": "application/json",
      },
    });

    // Request interceptor
    this.instance.interceptors.request.use(
        requestInterceptor,
        error => Promise.reject(error)
      );

    // Response interceptors
    this.instance.interceptors.response.use(
      responseInterceptor,
      errorInterceptor
    );
  }

  private async request<T>(options: RequestOptions): Promise<T> {
    try {
      const config: AxiosRequestConfig = {
        ...options,
        headers: {
          ...options.headers,
          ...(options.token && { Authorization: `Bearer ${options.token}` }),
        },
      };

      const response: AxiosResponse<T> = await this.instance(config);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  get<T>(url: string, options: RequestOptions = {}): Promise<T> {
    return this.request<T>({ ...options, method: "GET", url });
  }

  post<T>(url: string, data: any, options: RequestOptions = {}): Promise<T> {
    return this.request<T>({ ...options, method: "POST", url, data });
  }

  put<T>(url: string, data: any, options: RequestOptions = {}): Promise<T> {
    return this.request<T>({ ...options, method: "PUT", url, data });
  }

  delete<T>(url: string, options: RequestOptions = {}): Promise<T> {
    return this.request<T>({ ...options, method: "DELETE", url });
  }
}

// Create and export an instance of the APIClient
export const apiClientInstance = new APIClient("http://localhost:5000/api");
