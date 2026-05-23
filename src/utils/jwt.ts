import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import { userRoleEnum } from '../db/schema.js';
dotenv.config();

export type Role = typeof userRoleEnum.enumValues[number];

if (!process.env.JWT_SECRET_KEY) {
  throw new Error("JWT_SECRET_KEY is not defined in the environment variables.");
}
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY || "mysupersecretkey";
type JwtPayload = {
  userId: number;
  email: string;
  role: Role;
}

declare module 'fastify' {
  export interface FastifyRequest {
    user?: JwtPayload;
  }
}

export const generateToken = (payload: JwtPayload): string => {
  return jwt.sign(payload, JWT_SECRET_KEY, { expiresIn: '1h' });
}
export const verifyToken = (token: string): JwtPayload | null => {
  try {
    return jwt.verify(token, JWT_SECRET_KEY) as JwtPayload;
  } catch (error) {
    console.error("JWT verification failed:", error);
    return null;
  }
}

