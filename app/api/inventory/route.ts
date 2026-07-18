import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const inventory = await prisma.inventoryItem.findMany();
    return Response.json(inventory);
  } catch (error: any) {
    return Response.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
