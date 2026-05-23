import type { FastifyReply, FastifyRequest } from "fastify";
import { ZodError } from "zod";
import { db } from "../db/index.js";
import { users } from "../db/schema.js";
import { userSchema, type CreateUserInput } from "../schema/user.schema.js";

export const createUser = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    const validateBody: CreateUserInput = userSchema.parse(request.body);
    const [newUser] = await db.insert(users).values({
      fullName: validateBody.fullName,
      email: validateBody.email,
      password: validateBody.password,
      role: validateBody.role || 'USER'
    }).returning({
      id: users.id,
      fullName: users.fullName,
      email: users.email,
      role: users.role,
      createdAt: users.createdAt
    });
    reply.status(201).send({ message: "User created successfully", user: newUser });
  } catch (error) {
    if ((error as any).cause?.code === '23505') {
      return reply.code(400).send({ error: "Email already exists" });
    }
    if (error instanceof ZodError) {
      return reply.code(400).send({ error: "Validation Error", errors: error.issues });
    }
    console.error("Error creating user:", error);
    return reply.code(500).send({ error: "Internal Server Error" });
  }
} 