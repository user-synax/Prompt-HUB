import { NextRequest } from 'next/server';
import { verifyToken } from '@/lib/jwt';
import { cookies } from 'next/headers';

/**
 * Extracts and verifies the userId from the request cookies or Authorization header.
 * @param req NextRequest object
 * @returns userId string or null if unauthorized
 */
export async function getUserId(req: NextRequest): Promise<string | null> {
  let token: string | undefined;

  // 1. Try to get token from cookies (HTTP-only)
  try {
    const cookieStore = await cookies();
    token = cookieStore.get('token')?.value;
  } catch {
    // Fallback to request cookies if cookies() is unavailable
    token = req.cookies.get('token')?.value;
  }

  // 2. Try to get token from Authorization header (fallback)
  if (!token) {
    const authHeader = req.headers.get('Authorization');
    if (authHeader?.startsWith('Bearer ')) {
      token = authHeader.split(' ')[1];
    }
  }

  if (!token) {
    return null;
  }

  const decoded = verifyToken(token);
  return decoded ? decoded.userId : null;
}

/**
 * Checks if the request is authenticated.
 */
export async function isAuthenticated(req: NextRequest): Promise<boolean> {
  return !!(await getUserId(req));
}
