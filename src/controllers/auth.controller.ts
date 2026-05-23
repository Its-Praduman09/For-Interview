import bcrypt from 'bcrypt'
import { eq } from 'drizzle-orm'
import type { FastifyReply, FastifyRequest } from 'fastify'
import { ZodError } from 'zod'
import { db } from '../db/index.js'
import { users } from '../db/schema.js'
import { loginSchema, registerSchema, type LoginInput, type RegisterInput } from '../schema/auth.schema.js'
import { generateToken } from '../utils/jwt.js'

export const register = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    const validateBody: RegisterInput = registerSchema.parse(request.body);
    const hashedPassword = await bcrypt.hash(validateBody.password, 10);
    const [newUser] = await db.insert(users).values({
      fullName: validateBody.fullName,
      email: validateBody.email,
      password: hashedPassword,
      role: validateBody.role || 'USER'
    }).returning({
      id: users.id,
      fullName: users.fullName,
      email: users.email,
      role: users.role,
      createdAt: users.createdAt
    });
    reply.status(201).send({ message: "User registered successfully", user: newUser });
  } catch (error) {
    if ((error as any).cause?.code === '23505') {
      return reply.code(400).send({ error: "Email already exists" });
    }
    if (error instanceof ZodError) {
      return reply.code(400).send({ error: "Validation Error", errors: error.issues });
    }
    console.error("Error during registration:", error);
    return reply.code(500).send({ error: "Internal Server Error" });
  }
}

const DUMMY_PASSWORD_HASH = "$2b$10$CwTycUXWue0Thq9StjUM0uJ8z5rZ3YyFh7jHn9E1KqQyVZf4a"; // bcrypt hash for "password123"
export const login = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    const validateBody: LoginInput = loginSchema.parse(request.body);
    const [existingUser] = await db.select({
      id: users.id,
      fullName: users.fullName,
      email: users.email,
      password: users.password,
      role: users.role
    }).from(users).where(eq(users.email, validateBody.email))
    const passwordToCompare = existingUser?.password ?? DUMMY_PASSWORD_HASH;
    const passwordMatch = await bcrypt.compare(validateBody.password, passwordToCompare);
    if (!existingUser || !passwordMatch) {
      return reply.code(401).send({ error: "Invalid email or password" });
    }
    const { password, ...safeUser } = existingUser;
    const token = generateToken({
      userId: existingUser.id,
      email: existingUser.email,
      role: existingUser.role
    });
    reply.send({ message: "Login successful", user: safeUser, token });
  } catch (error) {
    if (error instanceof ZodError) {
      return reply.code(400).send({ error: "Validation Error", errors: error.issues });
    }
    console.error("Error during login:", error);
    return reply.code(500).send({ error: "Internal Server Error" });
  }
}

