/*
  Warnings:

  - You are about to drop the column `profileId` on the `Notification` table. All the data in the column will be lost.
  - You are about to drop the column `read` on the `Notification` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Notification_profileId_idx";

-- AlterTable
ALTER TABLE "Notification" DROP COLUMN "profileId",
DROP COLUMN "read";

-- CreateTable
CREATE TABLE "MemberNotification" (
    "id" TEXT NOT NULL,
    "read" BOOLEAN NOT NULL DEFAULT false,
    "memberId" TEXT NOT NULL,
    "notificationId" TEXT NOT NULL,

    CONSTRAINT "MemberNotification_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "MemberNotification_notificationId_idx" ON "MemberNotification"("notificationId");

-- CreateIndex
CREATE UNIQUE INDEX "MemberNotification_memberId_notificationId_key" ON "MemberNotification"("memberId", "notificationId");
