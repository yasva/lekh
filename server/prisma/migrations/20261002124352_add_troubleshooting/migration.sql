-- CreateTable
CREATE TABLE "Troubleshooting" (
    "id" SERIAL NOT NULL,
    "equipmentId" INTEGER NOT NULL,
    "problem" TEXT NOT NULL,
    "solution" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Troubleshooting_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Troubleshooting" ADD CONSTRAINT "Troubleshooting_equipmentId_fkey" FOREIGN KEY ("equipmentId") REFERENCES "Equipment"("id") ON DELETE CASCADE ON UPDATE CASCADE;
