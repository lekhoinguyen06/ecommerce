CREATE UNIQUE INDEX Permission_path_method_unique
ON "Permission"("path", "method")
WHERE "deletedAt" IS NULL;

CREATE UNIQUE INDEX Role_name_unique
ON "Role"("name")
WHERE "deletedAt" IS NULL;

CREATE UNIQUE INDEX BrandTranslation_brandId_languageId_unique
ON "BrandTranslation"("brandId", "languageId")
WHERE "deletedAt" IS NULL;