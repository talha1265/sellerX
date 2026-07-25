import { NextResponse } from 'next/server';
import { TokenManager } from '@/lib/amazon/TokenManager';
import { AmazonAdsClient } from '@/lib/amazon/AmazonAdsClient';
import { AmazonDataService } from '@/lib/amazon/AmazonDataService';

export async function GET() {
  try {
    const tokenManager = new TokenManager();
    await tokenManager.initialize();

    if (!tokenManager.isAuthenticated()) {
      return NextResponse.json({
        authenticated: false,
        message: 'Not authenticated with Amazon. Please login first via /api/auth/amazon/login',
      }, { status: 401 });
    }

    const client = new AmazonAdsClient(tokenManager);
    const dataService = new AmazonDataService(client);

    // Step A: Get all Amazon profiles/accounts
    const profiles = await dataService.getProfiles();

    if (!profiles || profiles.length === 0) {
      return NextResponse.json({
        success: true,
        authenticated: true,
        message: 'No advertising profiles found for this account.',
        profiles: [],
        campaignsCount: 0,
        campaigns: [],
      });
    }

    // Step B: Get campaigns for the primary profile
    const primaryProfile = profiles[0];
    const campaigns = await dataService.getCampaigns(primaryProfile.profileId);

    return NextResponse.json({
      success: true,
      authenticated: true,
      primaryAccount: {
        profileId: primaryProfile.profileId,
        accountName: primaryProfile.accountInfo?.name || 'Primary Store',
        accountType: primaryProfile.accountInfo?.type || 'seller',
        country: primaryProfile.countryCode,
        currency: primaryProfile.currencyCode,
      },
      allProfiles: profiles,
      campaignsCount: campaigns.length,
      campaigns: campaigns,
    });
  } catch (err: any) {
    console.error('Failed to fetch Amazon data:', err);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch data from Amazon Advertising API',
      message: err.message,
    }, { status: 500 });
  }
}
