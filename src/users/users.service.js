import { prisma } from "../utils/prisma.js";

export async function findUserByEmail(email) {
  const normalizedEmail = email.toLowerCase().trim();
  return prisma.user.findUnique({
    where: { email: normalizedEmail },
  });
}

export async function createUser(userData) {
  const normalizedEmail = userData.email.toLowerCase().trim();
  return prisma.user.create({
    data: {
      ...userData,
      email: normalizedEmail,
    },
  });
}

export async function listUsers() {
  return prisma.user.findMany({
    select: {
      id: true,
      email: true,
      name: true,
    },
  });
}

export async function getUserById(id) {
  return prisma.user.findUnique({
    where: { id },
  });
}

export async function deleteUser(id) {
  return prisma.user.delete({
    where: { id },
  });
}

export async function updateUser(id, data) {
  const updateData = { ...data };
  if (updateData.email) {
    updateData.email = updateData.email.toLowerCase().trim();
  }
  return prisma.user.update({
    where: { id },
    data: updateData,
    select: {
      id: true,
      email: true,
      name: true,
    },
  });
}

export async function countUsers() {
  return prisma.user.count();
}

export async function updateUserPassword(id, newPassword) {
  return prisma.user.update({
    where: { id },
    data: { password: newPassword },
    select: {
      id: true,
      email: true,
      name: true,
    },
  });
}

export async function createManyUsers(usersData) {
  const normalizedUsers = usersData.map((user) => ({
    ...user,
    email: user.email.toLowerCase().trim(),
  }));
  const createdUsers = await Promise.all(
    normalizedUsers.map((user) => prisma.user.create({ data: user })),
  );
  return createdUsers.map(({ password, ...user }) => user);
}
