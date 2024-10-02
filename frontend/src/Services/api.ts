import axios, { AxiosInstance, AxiosRequestConfig } from "axios";

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
    private async handleError(error: any): Promise<never> {
        if (error.response) {
            const errorMessage = error.response.data.message || "HTTP Error";
            const customError = new Error(errorMessage) as Error & { status?: number };
            customError.status = error.response.status;
            return Promise.reject(customError);
        } else if (error.request) {
            return Promise.reject(new Error('No response received from server'));
        } else {
            return Promise.reject(new Error('Error setting up the request'));
        }
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

export const apiClientInstance = new APIClient("http://localhost:5000/api");
