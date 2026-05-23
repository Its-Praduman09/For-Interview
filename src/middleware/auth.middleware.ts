import type { FastifyReply, FastifyRequest } from "fastify";
import { verifyToken } from "../utils/jwt.js";


export const authenticate = async (request: FastifyRequest, reply: FastifyReply) => {
  const authHeader = request.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return reply.code(401).send({ error: "Unauthorized: No token provided" });
  }
  const token = authHeader.split(" ")[1]?.trim()
  if (!token) {
    return reply.code(401).send({ error: "Unauthorized: Invalid token format" });
  }
  const decoded = verifyToken(token);
  if (!decoded) {
    return reply.code(401).send({ error: "Unauthorized: Invalid or expired token" });
  }
  request.user = decoded;
  return;
}
export const authorize = (roles: string[]) => {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    if (!request.user) {
      return reply.code(401).send({ error: "Unauthorized: No user information" });
    }
    if (!roles.includes(request.user.role)) {
      return reply.code(403).send({ error: "Forbidden: Insufficient permissions" });
    }
  }
}