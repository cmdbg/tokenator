import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { TokenEndpointFactory } from '../types/auth.types';

declare module 'axios' {
  interface AxiosResponse<T = any> extends Promise<T> {}
}


export abstract class HttpClient {
  protected readonly instance: AxiosInstance;
  protected readonly config = {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  }

   public constructor(tokenEndpoint: TokenEndpointFactory) {
      const baseURL = tokenEndpoint();
      this.instance = axios.create({
        baseURL,
      });

    this._initializeResponseInterceptor();
  }

  private _initializeResponseInterceptor = () => {
    this.instance.interceptors.response.use(
      this._handleResponse,
      this._handleError,
    );
  };

  protected async authenticate(params: URLSearchParams): Promise<any>
  {
    return await this.instance.post('', params, this.config);
  }

  private _handleResponse = ({ data }: AxiosResponse) => data;

  protected _handleError = (error: any) => Promise.reject(error);
}