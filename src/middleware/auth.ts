import type { APIContext } from 'astro';
import jwt from 'jsonwebtoken';

const secret = process.env.SECRET_JWT || 'your-secret-key';

export const extractToken = (request: Request) => {
  const authHeader = request.headers.get('authorization');
  if (!authHeader) {
    throw new Error("No auth header");
  }
  return authHeader.split(" ")[1];
};

export const verifyToken = (token: string) => {
  return jwt.verify(token, secret);
};

export const authMiddleware = async (context: APIContext) => {
  try {
    const token = extractToken(context.request);
    const decoded = verifyToken(token);
    return { ...context, user: decoded };
  } catch (error) {
    return new Response(JSON.stringify({ message: 'Unauthorized' }), {
      status: 401,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
};