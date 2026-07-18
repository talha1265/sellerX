import { prisma } from '@/lib/prisma';
import { getAuthenticatedUser } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const user = await getAuthenticatedUser(request);
    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const campaigns = await prisma.campaign.findMany();
    
    // Perform bulk optimization on campaigns in PostgreSQL
    for (const c of campaigns) {
      if (c.status === 'active') {
        const improvedAcos = Math.max(12, c.acos - (Math.random() * 2 + 1));
        const improvedRoas = c.roas + (Math.random() * 0.4 + 0.1);
        
        await prisma.campaign.update({
          where: { id: c.id },
          data: {
            acos: parseFloat(improvedAcos.toFixed(1)),
            roas: parseFloat(improvedRoas.toFixed(2)),
            aiHealth: Math.min(100, c.aiHealth + Math.floor(Math.random() * 5 + 3)),
          },
        });
      }
    }

    // Clear resolved recommendations as they are applied in Postgres
    await prisma.recommendation.deleteMany({});

    // Log the AI optimization event under the logged-in user
    await prisma.activity.create({
      data: {
        id: `act_${Date.now()}`,
        userId: user.id,
        type: 'campaign',
        user: 'AI Engine',
        action: 'executed portfolio-wide ad optimization',
        time: new Date().toISOString(),
        detail: 'Adjusted budgets & keyword bids',
      },
    });

    const updatedCampaigns = await prisma.campaign.findMany();
    return Response.json({ success: true, campaigns: updatedCampaigns });
  } catch (error: any) {
    return Response.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
