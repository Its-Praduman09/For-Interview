import type { FastifyInstance } from "fastify";
import { createUser } from "../controllers/user.controller.js";
import { authenticate, authorize } from "../middleware/auth.middleware.js";
export const userRoutes = (app: FastifyInstance) => {
  app.post("/users", {
    preHandler: [authenticate, authorize(['ADMIN'])]
  }, createUser);
  // Example of a protected route
  // app.get("/users/me", { preHandler: [authenticate, authorize(['USER', 'ADMIN'])] }, getCurrentUser);
}