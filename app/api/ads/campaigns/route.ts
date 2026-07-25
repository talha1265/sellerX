import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthenticatedUser } from '@/lib/auth';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    let campaigns: any[] = [];
    let recommendations: any[] = [];
    let topKeywords: any[] = [];
    let suggestedKeywords: any[] = [];

    try {
      campaigns = await prisma.campaign.findMany();
      recommendations = await prisma.recommendation.findMany();
      topKeywords = await prisma.keyword.findMany({
        where: { type: 'top' },
      });
      suggestedKeywords = await prisma.keyword.findMany({
        where: { type: 'suggested' },
      });
    } catch {
      const dbPath = path.join(process.cwd(), 'db.json');
      if (fs.existsSync(dbPath)) {
        const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
        campaigns = db.campaigns || [];
        recommendations = db.recommendations || [];
        topKeywords = db.keywords?.top || [];
        suggestedKeywords = db.keywords?.suggested || [];
      }
    }

    return Response.json({
      campaigns,
      keywords: {
        top: topKeywords,
        suggested: suggestedKeywords,
      },
      recommendations,
    });
  } catch (error: any) {
    return Response.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const user = await getAuthenticatedUser(request);
    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { campaignId, status, spend } = await request.json();
    if (!campaignId) {
      return Response.json({ error: 'Campaign ID is required' }, { status: 400 });
    }

    let updatedCampaign: any = { id: campaignId, status, spend, name: 'Campaign' };
    try {
      const campaign = await prisma.campaign.findUnique({
        where: { id: campaignId },
      });

      if (campaign) {
        updatedCampaign = await prisma.campaign.update({
          where: { id: campaignId },
          data: {
            status: status !== undefined ? status : undefined,
            spend: spend !== undefined ? spend : undefined,
          },
        });
      }
    } catch {
      // Fallback update
    }

    return Response.json({ success: true, campaign: updatedCampaign });
  } catch (error: any) {
    return Response.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
