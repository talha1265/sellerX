import { prisma } from './prisma';

export interface AuthenticatedUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
}

export async function getAuthenticatedUser(request: Request): Promise<AuthenticatedUser | null> {
  try {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return null;
    }

    const token = authHeader.substring(7);
    if (!token.startsWith('sx_')) {
      return null;
    }

    const parts = token.split('_');
    if (parts.length < 3) {
      return null;
    }

    const base64Email = parts[1];
    const email = Buffer.from(base64Email, 'base64').toString('utf8');

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return null;
    }

    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
    };
  } catch (error) {
    console.error('Authentication error:', error);
    return null;
  }
}
