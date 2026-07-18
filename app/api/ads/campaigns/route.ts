import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthenticatedUser } from '@/lib/auth';

export async function GET() {
  try {
    const campaigns = await prisma.campaign.findMany();
    const recommendations = await prisma.recommendation.findMany();
    const topKeywords = await prisma.keyword.findMany({
      where: { type: 'top' },
    });
    const suggestedKeywords = await prisma.keyword.findMany({
      where: { type: 'suggested' },
    });

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

    const campaign = await prisma.campaign.findUnique({
      where: { id: campaignId },
    });

    if (!campaign) {
      return Response.json({ error: 'Campaign not found' }, { status: 404 });
    }

    const updatedCampaign = await prisma.campaign.update({
      where: { id: campaignId },
      data: {
        status: status !== undefined ? status : undefined,
        spend: spend !== undefined ? spend : undefined,
      },
    });

    if (status !== undefined) {
      await prisma.activity.create({
        data: {
          id: `act_${Date.now()}`,
          userId: user.id,
          type: 'campaign',
          user: `${user.firstName} ${user.lastName}`,
          action: `${status === 'active' ? 'resumed' : 'paused'} campaign`,
          time: new Date().toISOString(),
          detail: updatedCampaign.name,
        },
      });
    }

    return Response.json({ success: true, campaign: updatedCampaign });
  } catch (error: any) {
    return Response.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
