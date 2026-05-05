# Prisma Workflow Guides (migration folder as the source of truth)

We are using unsupported Prisma features like partial unique index.

```sql
CREATE UNIQUE INDEX permission_path_method_unique
ON "Permission"("path", "method")
WHERE "deletedAt" IS NULL;

CREATE UNIQUE INDEX role_name_unique
ON "Role"("name")
WHERE "deletedAt" IS NULL;
```

Therefore, we have to:

## Generate migration file

Ask Prisma to generate migration `.sql` file

```bash
npx prisma migrate dev --create-only
```

## Edit migration file

Rememeber to remove `DROP INDEX`s since Prisma is still trying to comply to the `schema` files. Then, add or modify SQL.

## Apply migration

```bash
npx prisma migrate dev
```

From here `Applying migration `20260505091059_add_module_permission``, Prisma already apply your files but it still ask for migration name. Cancel the process. Your migration is done.
