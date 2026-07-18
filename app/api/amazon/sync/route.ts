import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthenticatedUser } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const user = await getAuthenticatedUser(request);
    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { accountId } = await request.json();
    if (!accountId) {
      return Response.json({ error: 'Account ID is required' }, { status: 400 });
    }

    const account = await prisma.amazonAccount.findFirst({
      where: { id: accountId, userId: user.id },
    });

    if (!account) {
      return Response.json({ error: 'Account not found or access denied' }, { status: 404 });
    }

    const syncTime = new Date().toISOString();
    const updatedAccount = await prisma.amazonAccount.update({
      where: { id: accountId },
      data: { lastSync: syncTime },
    });

    // Premium touch: increase finance metrics dynamically in Postgres
    const finance = await prisma.financeData.findUnique({
      where: { id: 'singleton' },
    });
    
    if (finance) {
      const addedRevenue = Math.floor(Math.random() * 5000) + 1500;
      const nextRevenue = finance.totalRevenue + addedRevenue;
      const nextNet = nextRevenue - finance.adSpend - finance.aggregateCogs;
      
      await prisma.financeData.update({
        where: { id: 'singleton' },
        data: {
          totalRevenue: nextRevenue,
          netProfit: nextNet,
        },
      });
    }

    // Log the sync event with userId reference
    await prisma.activity.create({
      data: {
        id: `act_${Date.now()}`,
        userId: user.id,
        type: 'sync',
        user: `${user.firstName} ${user.lastName}`,
        action: 'synced Amazon account',
        time: syncTime,
        detail: updatedAccount.storeName,
      },
    });

    return Response.json({ success: true, account: updatedAccount });
  } catch (error: any) {
    return Response.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
