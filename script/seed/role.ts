/* eslint-disable prettier/prettier */
import envConfig from 'src/shared/config';
import { RoleName } from 'src/shared/constants/role.constant';
import { HashingService } from 'src/shared/services/hashing.service';
import { PrismaService } from 'src/shared/services/prisma.service';

const prisma = new PrismaService();
const hashingService = new HashingService();

const main = async () => {
  await prisma.$connect();
  console.log('Generating seed data...');

  // Seed roles
  const rowCount = await prisma.role.count();

  if (rowCount > 0) {
    const roles = await prisma.role.findMany();
    console.log('Roles already seeded: ', roles);
    return;
  }
  const roles = await prisma.role.createMany({
    data: [
      {
        name: RoleName.Admin,
        description: 'Admin role with full permissions',
      },
      {
        name: RoleName.Client,
        description: 'Client role with limited permissions',
      },
      {
        name: RoleName.Seller,
        description:
          'Seller role with permissions to manage products and orders',
      },
    ],
  });

  const adminRole = await prisma.role.findFirstOrThrow({
    where: {
      name: RoleName.Admin,
    },
  });

  // Seed admin user
  const hashedPassword = await hashingService.hash(
    envConfig.ADMIN_PASSWORD || '12345678',
  );

  const adminUser = await prisma.user.create({
    data: {
      email: envConfig.ADMIN_EMAIL || 'admin@example.com',
      password: hashedPassword,
      name: envConfig.ADMIN_NAME || 'Admin User',
      roleId: adminRole.id,
      phoneNumber: envConfig.ADMIN_PHONE_NUMBER || '1234567890',
    },
  });

  return {
    roles,
    adminUser,
  };
};

console.log(main());
