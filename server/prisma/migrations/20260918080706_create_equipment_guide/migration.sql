-- CreateTable
CREATE TABLE "Guide" (
    "id" SERIAL NOT NULL,
    "equipmentId" INTEGER NOT NULL,
    "setup" TEXT NOT NULL,
    "usage" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Guide_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Guide" ADD CONSTRAINT "Guide_equipmentId_fkey" FOREIGN KEY ("equipmentId") REFERENCES "Equipment"("id") ON DELETE CASCADE ON UPDATE CASCADE;
