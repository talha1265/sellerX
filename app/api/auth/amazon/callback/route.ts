import { NextRequest, NextResponse } from 'next/server';
import { TokenManager } from '@/lib/amazon/TokenManager';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const code = searchParams.get('code');
  const error = searchParams.get('error');

  if (error) {
    console.error('Amazon OAuth error callback:', error);
    return NextResponse.redirect(new URL(`/integrations?error=${encodeURIComponent(error)}`, request.url));
  }

  if (!code) {
    return NextResponse.json({ error: 'Missing authorization code' }, { status: 400 });
  }

  try {
    const tokenManager = new TokenManager();
    await tokenManager.exchangeCode(code);

    // Record connected account in Prisma DB if users exist
    const defaultUser = await prisma.user.findFirst();
    if (defaultUser) {
      const existing = await prisma.amazonAccount.findFirst({
        where: { userId: defaultUser.id },
      });

      if (!existing) {
        await prisma.amazonAccount.create({
          data: {
            id: `amz_${Date.now()}`,
            userId: defaultUser.id,
            sellerId: 'LWA_OAUTH_ACCOUNT',
            storeName: 'Amazon Store (OAuth Connected)',
            marketplace: 'amazon.com',
            marketplaceCode: 'US',
            region: 'na',
            connectedAt: new Date().toISOString(),
            lastSync: new Date().toISOString(),
            status: 'active',
          },
        });
      } else {
        await prisma.amazonAccount.update({
          where: { id: existing.id },
          data: {
            status: 'active',
            lastSync: new Date().toISOString(),
          },
        });
      }
    }

    return NextResponse.redirect(new URL('/integrations?connected=true', request.url));
  } catch (err: any) {
    console.error('Callback error:', err);
    return NextResponse.redirect(new URL(`/integrations?error=${encodeURIComponent(err.message || 'Token exchange failed')}`, request.url));
  }
}
