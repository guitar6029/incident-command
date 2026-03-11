-- CreateEnum
CREATE TYPE "TicketLogType" AS ENUM ('STATUS_CHANGED', 'ACKNOWLEDGED');

-- CreateTable
CREATE TABLE "TicketLog" (
    "id" TEXT NOT NULL,
    "ticketId" TEXT NOT NULL,
    "eventType" "TicketLogType" NOT NULL,
    "byEmployeeId" TEXT NOT NULL,
    "fromStatus" "TicketStatus" NOT NULL,
    "toStatus" "TicketStatus" NOT NULL,
    "note" VARCHAR(2000),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TicketLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "TicketLog_ticketId_idx" ON "TicketLog"("ticketId");

-- CreateIndex
CREATE INDEX "TicketLog_createdAt_idx" ON "TicketLog"("createdAt");

-- AddForeignKey
ALTER TABLE "TicketLog" ADD CONSTRAINT "TicketLog_ticketId_fkey" FOREIGN KEY ("ticketId") REFERENCES "Ticket"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TicketLog" ADD CONSTRAINT "TicketLog_byEmployeeId_fkey" FOREIGN KEY ("byEmployeeId") REFERENCES "Employee"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
