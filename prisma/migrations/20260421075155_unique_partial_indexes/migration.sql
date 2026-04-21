CREATE UNIQUE INDEX permission_path_method_unique 
ON "Permission" ("path", "method")
WHERE "deletedAt" IS NULL;

CREATE UNIQUE INDEX role_name_unique
ON "Role" ("name")
WHERE "deletedAt" IS NULL;