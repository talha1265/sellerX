import axios from 'axios';
import fs from 'fs';
import path from 'path';
import { config } from './config';
import { TokenResponse, StoredTokens } from './types';

export class TokenManager {
  private tokens: StoredTokens | null = null;
  private tokenFilePath: string;

  constructor(filePath?: string) {
    this.tokenFilePath = filePath || path.resolve(process.cwd(), '.tokens.json');
  }

  /** Initialize token manager by attempting to load stored tokens from disk */
  async initialize(): Promise<void> {
    await this.loadTokens();
  }

  /** Generate Amazon LWA OAuth authorization URL */
  getLoginUrl(region?: string): string {
    let baseUrl = config.amazon.authUrl;
    if (region === 'eu') {
      baseUrl = 'https://eu.account.amazon.com/ap/oa';
    } else if (region === 'fe' || region === 'apac') {
      baseUrl = 'https://apac.account.amazon.com/ap/oa';
    } else if (region === 'na') {
      baseUrl = 'https://www.amazon.com/ap/oa';
    }

    const params = new URLSearchParams({
      client_id: config.amazon.clientId,
      scope: 'advertising::campaign_management',
      response_type: 'code',
      redirect_uri: config.amazon.redirectUri,
    });
    return `${baseUrl}?${params.toString()}`;
  }


  /** Exchange authorization code for Access Token and Refresh Token */
  async exchangeCode(code: string): Promise<StoredTokens> {
    console.log('🔄 Exchanging OAuth code for Amazon Advertising tokens...');

    const params = new URLSearchParams({
      grant_type: 'authorization_code',
      code: code,
      client_id: config.amazon.clientId,
      client_secret: config.amazon.clientSecret,
      redirect_uri: config.amazon.redirectUri,
    });

    try {
      const response = await axios.post<TokenResponse>(
        config.amazon.tokenUrl,
        params.toString(),
        {
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        }
      );

      const data = response.data;
      const now = Date.now();

      this.tokens = {
        accessToken: data.access_token,
        refreshToken: data.refresh_token,
        expiresAt: now + data.expires_in * 1000,
        obtainedAt: now,
      };

      await this.saveTokens();
      console.log('✅ Tokens successfully obtained and stored!');
      return this.tokens;
    } catch (error: any) {
      console.error('❌ Token exchange failed:', error.response?.data || error.message);
      throw new Error(`Failed to exchange authorization code: ${JSON.stringify(error.response?.data || error.message)}`);
    }
  }

  /** Refresh an expired access token using the stored refresh token */
  async refreshAccessToken(): Promise<StoredTokens> {
    if (!this.tokens?.refreshToken) {
      throw new Error('No refresh token available. Please authenticate via /login first.');
    }

    console.log('🔄 Refreshing Amazon Ads access token...');

    const params = new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: this.tokens.refreshToken,
      client_id: config.amazon.clientId,
      client_secret: config.amazon.clientSecret,
    });

    try {
      const response = await axios.post<TokenResponse>(
        config.amazon.tokenUrl,
        params.toString(),
        {
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        }
      );

      const data = response.data;
      const now = Date.now();

      this.tokens = {
        accessToken: data.access_token,
        // Refresh token might not be re-issued; keep existing if omitted
        refreshToken: data.refresh_token || this.tokens.refreshToken,
        expiresAt: now + data.expires_in * 1000,
        obtainedAt: now,
      };

      await this.saveTokens();
      console.log('✅ Access token successfully refreshed!');
      return this.tokens;
    } catch (error: any) {
      console.error('❌ Refreshing token failed:', error.response?.data || error.message);
      throw new Error(`Failed to refresh token: ${JSON.stringify(error.response?.data || error.message)}`);
    }
  }

  /** Get a valid access token, auto-refreshing if expired or expiring soon (within 5 min) */
  async getValidToken(): Promise<string> {
    if (!this.tokens) {
      await this.loadTokens();
    }

    if (!this.tokens || !this.tokens.accessToken) {
      throw new Error('No access token available. Please complete OAuth flow via /api/auth/amazon/login.');
    }

    // Buffer of 5 minutes (300,000 ms) before actual expiration
    const isExpired = Date.now() + 300000 >= this.tokens.expiresAt;
    if (isExpired) {
      console.log('⚠️ Access token near expiration or expired. Triggering auto-refresh...');
      await this.refreshAccessToken();
    }

    return this.tokens!.accessToken;
  }

  /** Check if currently authenticated with saved tokens */
  isAuthenticated(): boolean {
    return !!(this.tokens && this.tokens.accessToken);
  }

  /** Retrieve currently stored tokens */
  getTokens(): StoredTokens | null {
    return this.tokens;
  }

  /** Save tokens to local disk JSON file */
  private async saveTokens(): Promise<void> {
    try {
      if (this.tokens) {
        fs.writeFileSync(this.tokenFilePath, JSON.stringify(this.tokens, null, 2), 'utf-8');
      }
    } catch (err) {
      console.warn('Unable to persist tokens to disk:', err);
    }
  }

  /** Load tokens from local disk JSON file if available */
  private async loadTokens(): Promise<void> {
    try {
      if (fs.existsSync(this.tokenFilePath)) {
        const raw = fs.readFileSync(this.tokenFilePath, 'utf-8');
        this.tokens = JSON.parse(raw);
      }
    } catch (err) {
      console.warn('Unable to read stored tokens from disk:', err);
    }
  }
}
