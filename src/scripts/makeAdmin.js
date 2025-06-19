import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function makeAdmin(email) {
  const user = await prisma.user.update({
    where: { email },
    data: { admin: true },
  });
  console.log(`User ${user.email} is now admin!`);
}

makeAdmin('Faisal@gmail.com').then(() => prisma.$disconnect()); 