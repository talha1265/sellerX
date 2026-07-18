import { prisma } from '@/lib/prisma';
import { getAuthenticatedUser } from '@/lib/auth';

export async function GET(request: Request) {
  try {
    const user = await getAuthenticatedUser(request);
    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const summary = await prisma.financeData.findUnique({
      where: { id: 'singleton' },
    });
    const payouts = await prisma.payout.findMany();
    const brands = await prisma.brand.findMany();
    const activity = await prisma.activity.findMany({
      where: { userId: user.id },
      orderBy: { time: 'desc' }, // Order by most recent activity
    });

    const finance = summary
      ? {
          totalRevenue: summary.totalRevenue,
          adSpend: summary.adSpend,
          aggregateCogs: summary.aggregateCogs,
          netProfit: summary.netProfit,
          payouts,
        }
      : {
          totalRevenue: 0,
          adSpend: 0,
          aggregateCogs: 0,
          netProfit: 0,
          payouts: [],
        };

    return Response.json({
      finance,
      brands,
      activity,
    });
  } catch (error: any) {
    return Response.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
