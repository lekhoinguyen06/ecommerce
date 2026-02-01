import { Prisma } from 'src/generated/prisma/client';

// Type predicate helper to check type at runtime

export function isUniqueConstraintPrisma2002Error(
  error: any,
): error is Prisma.PrismaClientKnownRequestError {
  return (
    error instanceof Prisma.PrismaClientKnownRequestError &&
    error.code === 'P2002'
  );
}

export function isRequiredRecordNotFoundPrisma2025Error(
  error: any,
): error is Prisma.PrismaClientKnownRequestError {
  return (
    error instanceof Prisma.PrismaClientKnownRequestError &&
    error.code === 'P2025'
  );
}
