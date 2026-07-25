import { AmazonAdsClient } from './AmazonAdsClient';
import { AmazonProfile, Campaign } from './types';

export class AmazonDataService {
  private client: AmazonAdsClient;

  constructor(client: AmazonAdsClient) {
    this.client = client;
  }

  /** Fetch all Amazon Advertising Profiles/Accounts attached to the user */
  async getProfiles(): Promise<AmazonProfile[]> {
    console.log('🔍 Fetching Amazon profiles...');
    const response = await this.client.get<AmazonProfile[]>('/v2/profiles');
    return response.data;
  }

  /** Fetch Sponsored Products Campaigns for a specific Profile ID */
  async getCampaigns(profileId: number | string): Promise<Campaign[]> {
    console.log(`📦 Fetching campaigns for profile: ${profileId}`);
    try {
      // Amazon Ads v2 endpoint
      const response = await this.client.get<Campaign[]>('/v2/sp/campaigns', profileId);
      return response.data;
    } catch (v2Error) {
      console.log('Falling back to Amazon Ads v3 endpoint /sp/campaigns/list');
      // Fallback for Amazon Ads v3 endpoint
      const response = await this.client.post<{ campaigns: Campaign[] }>(
        '/sp/campaigns/list',
        { maxResults: 100 },
        profileId
      );
      return response.data.campaigns || [];
    }
  }
}
