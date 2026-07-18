import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

async function main() {
  const dbPath = path.join(process.cwd(), 'db.json');
  if (!fs.existsSync(dbPath)) {
    console.warn('db.json not found, seeding skipped');
    return;
  }
  
  const raw = fs.readFileSync(dbPath, 'utf8');
  const db = JSON.parse(raw);

  console.log('Clearing database tables...');
  await prisma.user.deleteMany({});
  await prisma.amazonAccount.deleteMany({});
  await prisma.campaign.deleteMany({});
  await prisma.keyword.deleteMany({});
  await prisma.recommendation.deleteMany({});
  await prisma.inventoryItem.deleteMany({});
  await prisma.payout.deleteMany({});
  await prisma.financeData.deleteMany({});
  await prisma.brand.deleteMany({});
  await prisma.activity.deleteMany({});

  console.log('Seeding users...');
  for (const u of db.users || []) {
    await prisma.user.create({ data: u });
  }

  console.log('Seeding Amazon accounts...');
  for (const a of db.accounts || []) {
    await prisma.amazonAccount.create({
      data: {
        ...a,
        userId: '1',
      },
    });
  }

  console.log('Seeding campaigns...');
  for (const c of db.campaigns || []) {
    await prisma.campaign.create({ data: c });
  }

  console.log('Seeding keywords...');
  if (db.keywords) {
    for (const kw of db.keywords.top || []) {
      await prisma.keyword.create({
        data: {
          keyword: kw.keyword,
          bid: kw.bid,
          position: kw.position,
          conversions: kw.conversions,
          ctr: kw.ctr,
          trend: kw.trend,
          type: 'top',
        },
      });
    }
    for (const kw of db.keywords.suggested || []) {
      await prisma.keyword.create({
        data: {
          keyword: kw.keyword,
          bid: kw.suggestedBid, // Suggested bid maps to bid field
          predictedRoas: kw.predictedRoas,
          searchVolume: kw.searchVolume,
          competition: kw.competition,
          suggestedBid: kw.suggestedBid,
          type: 'suggested',
        },
      });
    }
  }

  console.log('Seeding recommendations...');
  for (const r of db.recommendations || []) {
    await prisma.recommendation.create({ data: r });
  }

  console.log('Seeding inventory items...');
  for (const i of db.inventory || []) {
    await prisma.inventoryItem.create({ data: i });
  }

  console.log('Seeding financial summaries & payouts...');
  if (db.finance) {
    const { payouts, ...summary } = db.finance;
    await prisma.financeData.create({
      data: {
        id: 'singleton',
        totalRevenue: summary.totalRevenue,
        adSpend: summary.adSpend,
        aggregateCogs: summary.aggregateCogs,
        netProfit: summary.netProfit,
      },
    });

    for (const p of payouts || []) {
      await prisma.payout.create({
        data: {
          payoutDate: p.payoutDate,
          amount: p.amount,
          status: p.status,
        },
      });
    }
  }

  console.log('Seeding brands...');
  for (const b of db.brands || []) {
    await prisma.brand.create({ data: b });
  }

  console.log('Seeding activity logs...');
  for (const act of db.activity || []) {
    await prisma.activity.create({
      data: {
        ...act,
        userId: '1',
      },
    });
  }

  console.log('PostgreSQL Seeding complete!');
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
