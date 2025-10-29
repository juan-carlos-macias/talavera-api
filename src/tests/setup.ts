import { beforeAll, afterAll, beforeEach } from 'vitest';
import prisma from '../lib/prisma';

beforeAll(async () => {
  await prisma.$connect();
});

afterAll(async () => {
  await prisma.$disconnect();
});

beforeEach(async () => {
  await prisma.invoice.deleteMany();
  await prisma.project.deleteMany();
  await prisma.user.deleteMany();
});

export { prisma };
