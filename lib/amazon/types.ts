export interface TokenResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number; // in seconds
}

export interface StoredTokens {
  accessToken: string;
  refreshToken: string;
  expiresAt: number; // Unix epoch ms
  obtainedAt: number;
}

export interface AmazonAccountInfo {
  marketplaceStringId: string;
  id: string;
  type: string; // 'seller' | 'vendor' | 'agency'
  name: string;
  subType?: string;
}

export interface AmazonProfile {
  profileId: number;
  countryCode: string;
  currencyCode: string;
  timezone: string;
  accountInfo: AmazonAccountInfo;
}

export interface Campaign {
  campaignId: string;
  name: string;
  budget: number;
  targetingType: string;
  state: 'enabled' | 'paused' | 'archived';
  startDate?: string;
}
