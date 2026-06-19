-- DropIndex
DROP INDEX "brandtranslation_brandid_languageid_unique";

-- DropIndex
DROP INDEX "permission_path_method_unique";

-- DropIndex
DROP INDEX "role_name_unique";

-- AlterTable
ALTER TABLE "BrandTranslation" ALTER COLUMN "description" DROP NOT NULL;
