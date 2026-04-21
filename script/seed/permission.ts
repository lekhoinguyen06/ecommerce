import { NestFactory } from '@nestjs/core';
import { AppModule } from 'src/app.module';
import { HTTPMethod } from 'src/generated/prisma/enums';
import { PrismaService } from 'src/shared/services/prisma.service';

const prisma = new PrismaService();

async function bootstrap() {
  await prisma.$connect();
  const app = await NestFactory.create(AppModule);
  await app.listen(3001);
  const server = app.getHttpAdapter().getInstance();
  const router = server.router;

  // Get all permission records from the database
  const permissionsInDb = await prisma.permission.findMany({
    where: {
      deletedAt: null,
    },
  });

  // Get all available routes from the router
  const availableRoutes: {
    name: string;
    path: string;
    method: keyof typeof HTTPMethod;
  }[] = router.stack
    .map((layer) => {
      if (layer.route) {
        const path = layer.route?.path;
        const method = String(
          layer.route?.stack[0].method,
        ).toUpperCase() as keyof typeof HTTPMethod;
        return {
          name: method + ' ' + path,
          path,
          method,
        };
      }
    })
    .filter((item) => item !== undefined);

  // Create permissionsInDB map with key [method-key]
  const permissionsMap = permissionsInDb.reduce((map, permission) => {
    map[`${permission.method}-${permission.path}`] = permission;
    return map;
  }, {});

  // Create availableRoutes map with key [method-key]
  const availableRoutesMap = availableRoutes.reduce((map, route) => {
    map[`${route.method}-${route.path}`] = route;
    return map;
  }, {});

  // Find permissions to delete
  const permissionsToDelete = permissionsInDb.filter(
    (permission) =>
      !availableRoutesMap[`${permission.method}-${permission.path}`],
  );

  // Delete permissions that are not in availableRoutes
  if (permissionsToDelete.length > 0) {
    try {
      await prisma.permission.deleteMany({
        where: {
          id: {
            in: permissionsToDelete.map((permission) => permission.id),
          },
        },
      });
      await prisma.$disconnect();
    } catch (error) {
      throw error;
    }
  }

  // Find permissions to create
  const permissionsToCreate = availableRoutes.filter(
    (route) => !permissionsMap[`${route.method}-${route.path}`],
  );

  // Add to database
  try {
    await prisma.permission.createMany({
      data: permissionsToCreate.map((route) => ({
        name: route.name,
        path: route.path,
        method: route.method,
      })),
      skipDuplicates: true,
    });
  } catch (error) {
    throw error;
  }

  // Log
  console.log('Permissions seeded successfully');
  console.log('Added: ', permissionsToCreate.length);
  console.log('Created data: ', permissionsToCreate);
  console.log('Removed: ', permissionsToDelete.length);
  console.log('Deleted data: ', permissionsToDelete);

  // Cleanup and exit
  await prisma.$disconnect();
  process.exit(0);
}
bootstrap();
