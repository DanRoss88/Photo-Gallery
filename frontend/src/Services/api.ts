import axios, { AxiosInstance, AxiosRequestConfig, AxiosError } from "axios";
import { Photo } from "../types";

class APIClient {
  private instance: AxiosInstance;

  constructor(baseURL: string) {
    this.instance = axios.create({
      baseURL,
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
      },
    });

    this.instance.interceptors.response.use(
      (response) => response,
      this.handleError.bind(this)
    );
  }

  private handleError(error: AxiosError) {
    if (error.response?.status === 401) {
    }
    return Promise.reject(error);
  }

  async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.instance.get<T>(url, config);
    return response.data;
  }

  async post<T>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<T> {
    const response = await this.instance.post<T>(url, data, config);
    return response.data;
  }

  async put<T>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<T> {
    const response = await this.instance.put<T>(url, data, config);
    return response.data;
  }

  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.instance.delete<T>(url, config);
    return response.data;
  }

  async searchPhotos(query: string): Promise<{ data: { data: Photo[] } }> {
    return this.get(`/photos/search?query=${encodeURIComponent(query)}`);
  }
  async getUserPhotos(): Promise<{ data: { photos: Photo[] } }> {
    return this.get('/photos/user');
  }

  async updatePhotoDetails(photoId: string, data: { description: string; tags: string[] }): Promise<{ data: { photo: Photo } }> {
    return this.put(`/photos/${photoId}`, data);
  }

  async deletePhoto(photoId: string): Promise<void> {
    return this.delete(`/photos/${photoId}`);
  }
}

export const apiClientInstance = new APIClient("http://localhost:5000/api");
