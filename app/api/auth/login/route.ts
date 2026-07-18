import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { signToken } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();
    if (!email || !password) {
      return Response.json({ error: 'Email and password are required' }, { status: 400 });
    }

    const user = await prisma.user.findFirst({
      where: {
        email: {
          equals: email,
          mode: 'insensitive',
        },
        password: password,
      },
    });

    if (!user) {
      return Response.json(
        { error: 'Invalid email or password. Try talha@sellerx.io / demo1234' },
        { status: 401 }
      );
    }

    // Generate cryptographically signed token
    const token = signToken(user.email);
    
    // Omit password from response
    const { password: _, ...userWithoutPassword } = user;

    // Log the auth activity in the PostgreSQL database
    await prisma.activity.create({
      data: {
        id: `act_${Date.now()}`,
        userId: user.id,
        type: 'auth',
        user: `${user.firstName} ${user.lastName}`,
        action: 'logged in',
        time: new Date().toISOString(),
        detail: 'via Postgres API',
      },
    });

    return Response.json({
      success: true,
      user: userWithoutPassword,
      token,
    });
  } catch (error: any) {
    return Response.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
