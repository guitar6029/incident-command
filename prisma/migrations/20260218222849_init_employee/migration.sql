-- CreateEnum
CREATE TYPE "EmployeeRole" AS ENUM ('IT_HELP', 'SYSTEM', 'NETWORK', 'SRE', 'HR');

-- CreateEnum
CREATE TYPE "EmployeeLevel" AS ENUM ('L1', 'L2', 'L3');

-- CreateTable
CREATE TABLE "Employee" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "role" "EmployeeRole" NOT NULL,
    "level" "EmployeeLevel" NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "onCall" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Employee_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Employee_email_key" ON "Employee"("email");
