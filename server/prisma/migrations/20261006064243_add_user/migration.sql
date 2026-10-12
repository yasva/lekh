-- CreateEnum
CREATE TYPE "Role" AS ENUM ('STUDENT', 'MAINTAINER', 'ADMIN');

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "username" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'STUDENT',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- Keep the former hard-coded test accounts with the same ids (1-3), so loans
-- created before this migration still point to an existing user.
-- Password for all three: password123
INSERT INTO "User" ("id", "username", "passwordHash", "role", "updatedAt") VALUES
    (1, 'student', '$2b$10$j5aqLu63EgZKH2cQI38Or.0YOVV3AX.4U1hDSSatkAwvPoZfCIZpy', 'STUDENT', CURRENT_TIMESTAMP),
    (2, 'maintainer', '$2b$10$j5aqLu63EgZKH2cQI38Or.0YOVV3AX.4U1hDSSatkAwvPoZfCIZpy', 'MAINTAINER', CURRENT_TIMESTAMP),
    (3, 'admin', '$2b$10$j5aqLu63EgZKH2cQI38Or.0YOVV3AX.4U1hDSSatkAwvPoZfCIZpy', 'ADMIN', CURRENT_TIMESTAMP);

SELECT setval(pg_get_serial_sequence('"User"', 'id'), (SELECT MAX("id") FROM "User"));

-- AddForeignKey
ALTER TABLE "Loan" ADD CONSTRAINT "Loan_borrowerId_fkey" FOREIGN KEY ("borrowerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
