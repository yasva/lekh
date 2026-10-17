-- CreateEnum
CREATE TYPE "FaultStatus" AS ENUM ('OPEN', 'RESOLVED');

-- CreateTable
CREATE TABLE "Fault" (
    "id" SERIAL NOT NULL,
    "equipmentUnitId" INTEGER NOT NULL,
    "reporterId" INTEGER NOT NULL,
    "description" TEXT NOT NULL,
    "status" "FaultStatus" NOT NULL DEFAULT 'OPEN',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Fault_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Fault" ADD CONSTRAINT "Fault_equipmentUnitId_fkey" FOREIGN KEY ("equipmentUnitId") REFERENCES "EquipmentUnit"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Fault" ADD CONSTRAINT "Fault_reporterId_fkey" FOREIGN KEY ("reporterId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
