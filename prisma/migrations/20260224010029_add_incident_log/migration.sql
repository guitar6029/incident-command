-- CreateEnum
CREATE TYPE "IncidentLogType" AS ENUM ('STATUS_CHANGED', 'ACKNOWLEDGED');

-- CreateTable
CREATE TABLE "IncidentLog" (
    "id" TEXT NOT NULL,
    "incidentId" TEXT NOT NULL,
    "eventType" "IncidentLogType" NOT NULL,
    "byEmployeeId" TEXT NOT NULL,
    "fromStatus" "IncidentStatus" NOT NULL,
    "toStatus" "IncidentStatus" NOT NULL,
    "note" VARCHAR(2000),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "IncidentLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "IncidentLog_incidentId_idx" ON "IncidentLog"("incidentId");

-- CreateIndex
CREATE INDEX "IncidentLog_createdAt_idx" ON "IncidentLog"("createdAt");

-- AddForeignKey
ALTER TABLE "IncidentLog" ADD CONSTRAINT "IncidentLog_incidentId_fkey" FOREIGN KEY ("incidentId") REFERENCES "Incident"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IncidentLog" ADD CONSTRAINT "IncidentLog_byEmployeeId_fkey" FOREIGN KEY ("byEmployeeId") REFERENCES "Employee"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
