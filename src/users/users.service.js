import { prisma } from "../utils/prisma.js";

export async function findUserByEmail(email) {
  return prisma.user.findUnique({
    where: { email },
  });
}

export async function createUser(userData) {
  return prisma.user.create({
    data: userData,
  });
}
