import { prisma } from '@/lib/prisma';
import { getAuthenticatedUser } from '@/lib/auth';
import fs from 'fs';
import path from 'path';

export async function GET(request: Request) {
  try {
    const user = await getAuthenticatedUser(request);
    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    let summary: any = null;
    let payouts: any[] = [];
    let brands: any[] = [];
    let activity: any[] = [];

    try {
      summary = await prisma.financeData.findUnique({
        where: { id: 'singleton' },
      });
      payouts = await prisma.payout.findMany();
      brands = await prisma.brand.findMany();
      activity = await prisma.activity.findMany({
        where: { userId: user.id },
      });
    } catch {
      const dbPath = path.join(process.cwd(), 'db.json');
      if (fs.existsSync(dbPath)) {
        const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
        summary = db.finance;
        payouts = db.finance?.payouts || [];
        brands = db.brands || [];
        activity = db.activity || [];
      }
    }

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
