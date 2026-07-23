/*
  Warnings:

  - The values [USER] on the enum `Role` will be removed. If these variants are still used in the database, this will fail.
  - Added the required column `employmentType` to the `jobs` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "EmploymentType" AS ENUM ('FULL_TIME', 'PART_TIME', 'CONTRACT', 'INTERNSHIP');

-- AlterEnum
BEGIN;
CREATE TYPE "Role_new" AS ENUM ('ADMIN', 'EMPLOYER', 'APPLICANT');
ALTER TABLE "public"."users" ALTER COLUMN "role" DROP DEFAULT;
ALTER TABLE "users" ALTER COLUMN "role" TYPE "Role_new" USING ("role"::text::"Role_new");
ALTER TYPE "Role" RENAME TO "Role_old";
ALTER TYPE "Role_new" RENAME TO "Role";
DROP TYPE "public"."Role_old";
ALTER TABLE "users" ALTER COLUMN "role" SET DEFAULT 'APPLICANT';
COMMIT;

-- AlterTable
ALTER TABLE "jobs" ADD COLUMN     "employmentType" "EmploymentType" NOT NULL;

-- AlterTable
ALTER TABLE "users" ALTER COLUMN "role" SET DEFAULT 'APPLICANT';
