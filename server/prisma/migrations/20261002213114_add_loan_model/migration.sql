-- CreateEnum
CREATE TYPE "ApprovalStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED', 'NOT_REQUIRED');

-- CreateEnum
CREATE TYPE "LoanStatus" AS ENUM ('REQUESTED', 'ACTIVE', 'RETURNED');

-- AlterTable
ALTER TABLE "Equipment" ADD COLUMN     "approvalRequired" BOOLEAN NOT NULL DEFAULT true;

-- CreateTable
CREATE TABLE "Loan" (
    "id" SERIAL NOT NULL,
    "equipmentId" INTEGER NOT NULL,
    "borrowerId" INTEGER NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "approvalStatus" "ApprovalStatus" NOT NULL,
    "loanStatus" "LoanStatus" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Loan_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Loan" ADD CONSTRAINT "Loan_equipmentId_fkey" FOREIGN KEY ("equipmentId") REFERENCES "Equipment"("id") ON DELETE CASCADE ON UPDATE CASCADE;
