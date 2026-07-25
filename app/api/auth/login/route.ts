import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { signToken } from '@/lib/auth';
import fs from 'fs';
import path from 'path';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();
    if (!email || !password) {
      return Response.json({ error: 'Email and password are required' }, { status: 400 });
    }

    let user: any = null;

    try {
      user = await prisma.user.findFirst({
        where: {
          email: {
            equals: email,
            mode: 'insensitive',
          },
          password: password,
        },
      });
    } catch (dbError: any) {
      console.warn('Postgres database unreachable, falling back to local db.json:', dbError.message || dbError);
      const dbPath = path.join(process.cwd(), 'db.json');
      if (fs.existsSync(dbPath)) {
        const raw = fs.readFileSync(dbPath, 'utf8');
        const db = JSON.parse(raw);
        user = db.users?.find(
          (u: any) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
        );
      }
    }

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

    // Log the auth activity if DB is reachable
    try {
      await prisma.activity.create({
        data: {
          id: `act_${Date.now()}`,
          userId: user.id,
          type: 'auth',
          user: `${user.firstName} ${user.lastName}`,
          action: 'logged in',
          time: new Date().toISOString(),
          detail: 'via Auth API',
        },
      });
    } catch {
      // Ignore DB activity logging failure
    }

    return Response.json({
      success: true,
      user: userWithoutPassword,
      token,
    });
  } catch (error: any) {
    return Response.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
