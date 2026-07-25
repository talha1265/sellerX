import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { config } from './config';
import { TokenManager } from './TokenManager';

export class AmazonAdsClient {
  private client: AxiosInstance;
  private tokenManager: TokenManager;

  constructor(tokenManager: TokenManager) {
    this.tokenManager = tokenManager;
    this.client = axios.create({
      baseURL: config.amazon.adsApiBase,
      timeout: 60000,
    });

    this.setupInterceptors();
  }

  private setupInterceptors(): void {
    // Inject Bearer token & Client ID
    this.client.interceptors.request.use(async (req) => {
      const token = await this.tokenManager.getValidToken();
      req.headers['Authorization'] = `Bearer ${token}`;
      req.headers['Amazon-Advertising-API-ClientId'] = config.amazon.clientId;
      return req;
    });

    // Rate Limit 429 Retry Backoff
    this.client.interceptors.response.use(
      (res) => res,
      async (error) => {
        const configReq = error.config;
        if (error.response?.status === 429 && configReq && !configReq._isRetry) {
          configReq._isRetry = true;
          const retryAfterHeader = error.response.headers['retry-after'];
          const retryAfter = retryAfterHeader ? parseInt(retryAfterHeader, 10) : 2;
          console.warn(`⚠️ 429 Rate Limit encountered. Waiting ${retryAfter}s before retrying...`);
          await new Promise((r) => setTimeout(r, retryAfter * 1000));
          return this.client.request(configReq);
        }
        return Promise.reject(error);
      }
    );
  }

  async get<T = any>(path: string, profileId?: number | string): Promise<AxiosResponse<T>> {
    const headers: Record<string, string> = {};
    if (profileId) headers['Amazon-Advertising-API-Scope'] = String(profileId);
    return this.client.get<T>(path, { headers });
  }

  async post<T = any>(path: string, body?: any, profileId?: number | string): Promise<AxiosResponse<T>> {
    const headers: Record<string, string> = {};
    if (profileId) headers['Amazon-Advertising-API-Scope'] = String(profileId);
    return this.client.post<T>(path, body, { headers });
  }
}
