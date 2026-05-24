import type { FastifyInstance } from "fastify";
import { login, register } from "../controllers/auth.controller.js";

export const authRoutes = (app: FastifyInstance) => {
  app.post("/register", register);
  app.post("/login", {
    config: {
      rateLimit: {
        max: 5,
        timeWindow: '1 minute'
      }
    }
  }, login);
}