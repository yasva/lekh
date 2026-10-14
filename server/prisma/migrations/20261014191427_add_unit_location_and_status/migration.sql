/*
  Warnings:

  - The `status` column on the `EquipmentUnit` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Added the required column `location` to the `EquipmentUnit` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "UnitStatus" AS ENUM ('AVAILABLE', 'ON_LOAN', 'OUT_OF_SERVICE');

-- AlterTable
ALTER TABLE "EquipmentUnit" ADD COLUMN     "location" TEXT NOT NULL,
DROP COLUMN "status",
ADD COLUMN     "status" "UnitStatus" NOT NULL DEFAULT 'AVAILABLE';
