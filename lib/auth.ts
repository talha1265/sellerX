import crypto from 'crypto';
import { prisma } from './prisma';

const SESSION_SECRET = process.env.SESSION_SECRET || 'fallback-session-secret-key-32-chars-long';

export interface AuthenticatedUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
}

export function signToken(email: string): string {
  const timestamp = Date.now();
  const base64Email = Buffer.from(email).toString('base64');
  const signature = crypto
    .createHmac('sha256', SESSION_SECRET)
    .update(`${email}:${timestamp}`)
    .digest('hex');
  return `sx_${base64Email}_${timestamp}_${signature}`;
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
    if (parts.length < 4) {
      return null;
    }

    const base64Email = parts[1];
    const timestamp = parts[2];
    const signature = parts[3];

    const email = Buffer.from(base64Email, 'base64').toString('utf8');

    // Cryptographic validation of the signature
    const expectedSignature = crypto
      .createHmac('sha256', SESSION_SECRET)
      .update(`${email}:${timestamp}`)
      .digest('hex');

    if (signature !== expectedSignature) {
      console.warn(`Invalid token signature detected for email: ${email}`);
      return null;
    }

    // Verify user exists in the database
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
