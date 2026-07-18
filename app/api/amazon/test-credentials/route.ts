import { NextRequest } from 'next/server';
import { getAuthenticatedUser } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const user = await getAuthenticatedUser(request);
    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const clientId = process.env.AMAZON_CLIENT_ID;
    const clientSecret = process.env.AMAZON_CLIENT_SECRET;

    if (!clientId || !clientSecret) {
      return Response.json({
        success: false,
        status: 'missing',
        message: 'AMAZON_CLIENT_ID or AMAZON_CLIENT_SECRET is missing from your .env file.',
      });
    }

    // Call Amazon LWA token server to verify the credentials
    const response = await fetch('https://api.amazon.com/auth/o2/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        grant_type: 'client_credentials',
        client_id: clientId,
        client_secret: clientSecret,
        scope: 'sellingpartnerapi::notifications',
      }),
    });

    const data = await response.json().catch(() => ({}));

    if (response.ok) {
      return Response.json({
        success: true,
        status: 'valid',
        message: 'Successfully authenticated with Amazon LWA! Client ID and Client Secret are valid.',
        accessToken: data.access_token ? `${data.access_token.slice(0, 15)}...` : 'n/a',
        expiresIn: data.expires_in || 3600,
      });
    } else {
      return Response.json({
        success: false,
        status: 'invalid',
        message: `Amazon authentication failed: ${data.error_description || data.error || response.statusText}`,
      });
    }
  } catch (error: any) {
    return Response.json({
      success: false,
      status: 'error',
      message: `Failed to reach Amazon servers: ${error.message}`,
    });
  }
}
