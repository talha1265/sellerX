import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthenticatedUser } from '@/lib/auth';
import fs from 'fs';
import path from 'path';

const MARKETPLACE_NAMES: Record<string, string> = {
  'amazon.com': 'United States',
  'amazon.ca': 'Canada',
  'amazon.com.mx': 'Mexico',
  'amazon.co.uk': 'United Kingdom',
  'amazon.de': 'Germany',
  'amazon.fr': 'France',
  'amazon.it': 'Italy',
  'amazon.es': 'Spain',
  'amazon.co.jp': 'Japan',
  'amazon.com.au': 'Australia',
  'amazon.in': 'India',
  'amazon.ae': 'UAE',
};

export async function GET(request: Request) {
  try {
    const user = await getAuthenticatedUser(request);
    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    let accounts: any[] = [];
    try {
      accounts = await prisma.amazonAccount.findMany({
        where: { userId: user.id },
      });
    } catch {
      const dbPath = path.join(process.cwd(), 'db.json');
      if (fs.existsSync(dbPath)) {
        const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
        accounts = db.accounts || [];
      }
    }
    return Response.json(accounts);
  } catch (error: any) {
    return Response.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getAuthenticatedUser(request);
    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const credentials = await request.json();
    if (!credentials.sellerId || !credentials.marketplace) {
      return Response.json({ error: 'Seller ID and Marketplace are required' }, { status: 400 });
    }

    const marketplaceName = MARKETPLACE_NAMES[credentials.marketplace] || credentials.marketplace;
    
    let newAccount: any;
    try {
      newAccount = await prisma.amazonAccount.create({
        data: {
          id: `amz_${Date.now()}`,
          userId: user.id,
          sellerId: credentials.sellerId,
          storeName: `${credentials.sellerId.slice(0, 8).toUpperCase()} — ${marketplaceName}`,
          marketplace: credentials.marketplace,
          marketplaceCode: credentials.marketplaceCode || 'US',
          region: credentials.region || 'na',
          connectedAt: new Date().toISOString(),
          lastSync: null,
          status: 'active',
        },
      });
    } catch {
      newAccount = {
        id: `amz_${Date.now()}`,
        userId: user.id,
        sellerId: credentials.sellerId,
        storeName: `${credentials.sellerId.slice(0, 8).toUpperCase()} — ${marketplaceName}`,
        marketplace: credentials.marketplace,
        marketplaceCode: credentials.marketplaceCode || 'US',
        region: credentials.region || 'na',
        connectedAt: new Date().toISOString(),
        lastSync: null,
        status: 'active',
      };
    }
    
    try {
      await prisma.activity.create({
        data: {
          id: `act_${Date.now()}`,
          userId: user.id,
          type: 'sync',
          user: `${user.firstName} ${user.lastName}`,
          action: 'connected Amazon account',
          time: new Date().toISOString(),
          detail: newAccount.storeName,
        },
      });
    } catch {
      // Ignore activity log error
    }

    return Response.json(newAccount);
  } catch (error: any) {
    return Response.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const user = await getAuthenticatedUser(request);
    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = request.nextUrl;
    const id = searchParams.get('id');
    
    if (!id) {
      return Response.json({ error: 'Account ID is required' }, { status: 400 });
    }

    try {
      const accountToDelete = await prisma.amazonAccount.findFirst({
        where: { id, userId: user.id },
      });

      if (accountToDelete) {
        await prisma.amazonAccount.delete({
          where: { id },
        });

        await prisma.activity.create({
          data: {
            id: `act_${Date.now()}`,
            userId: user.id,
            type: 'sync',
            user: `${user.firstName} ${user.lastName}`,
            action: 'disconnected Amazon account',
            time: new Date().toISOString(),
            detail: accountToDelete.storeName,
          },
        });
      }
    } catch {
      // Fallback
    }

    return Response.json({ success: true });
  } catch (error: any) {
    return Response.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
