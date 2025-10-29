import { beforeAll, afterAll, beforeEach } from 'vitest';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Setup before all tests
beforeAll(async () => {
  // Connect to test database
  await prisma.$connect();
});

// Cleanup after all tests
afterAll(async () => {
  await prisma.$disconnect();
});

// Clean database before each test
beforeEach(async () => {
  // Clear all tables in reverse order of dependencies
  await prisma.invoice.deleteMany();
  await prisma.project.deleteMany();
  await prisma.user.deleteMany();
});

export { prisma };
