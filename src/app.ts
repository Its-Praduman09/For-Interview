import dotenv from "dotenv";
import fastify from "fastify";
import { db } from "./db/index.js";
import { authRoutes } from "./routes/auth.routes.js";
import { userRoutes } from "./routes/user.routes.js";
dotenv.config();

if (!process.env.PORT) {
  throw new Error("PORT is not defined in the environment variables.");
}
const app = fastify({ logger: true });
const PORT = Number(process.env.PORT) || 4000;

const start = async () => {
  try {
    app.register(authRoutes, { prefix: "/api/auth" });
    app.register(userRoutes, { prefix: "/api/users" });
    await db.execute("SELECT 1")
    console.log("✅ Database connection successful.");
    console.log("✅ Tables synced successfully.");
    app.listen({
      port: PORT,
      host: '0.0.0.0'
    })
    console.log(`🚀 Backend server running on http://localhost:${PORT}`);
  }
  catch (error: unknown) {
    console.log("❌ Failed to start the server:");
    console.error(error);
    process.exit(1);
  }
}
start()