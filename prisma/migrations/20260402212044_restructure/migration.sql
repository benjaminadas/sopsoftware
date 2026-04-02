/*
  Warnings:

  - You are about to drop the `Sop` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `SopTag` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `SopVersion` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the column `funnelStage` on the `Template` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Sop_owner_idx";

-- DropIndex
DROP INDEX "Sop_funnelStage_idx";

-- DropIndex
DROP INDEX "Sop_docId_key";

-- DropIndex
DROP INDEX "SopVersion_sopId_version_key";

-- DropIndex
DROP INDEX "SopVersion_sopId_idx";

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Sop";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "SopTag";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "SopVersion";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "Project" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "platform" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Document" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "docId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "docType" TEXT NOT NULL DEFAULT 'SOP',
    "funnelStage" TEXT NOT NULL DEFAULT 'General',
    "owner" TEXT NOT NULL,
    "department" TEXT,
    "channel" TEXT,
    "platform" TEXT,
    "currentVersion" INTEGER NOT NULL DEFAULT 1,
    "projectId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Document_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "DocVersion" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "documentId" TEXT NOT NULL,
    "version" INTEGER NOT NULL,
    "versionName" TEXT,
    "content" TEXT NOT NULL,
    "contentText" TEXT NOT NULL DEFAULT '',
    "changeNote" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" TEXT NOT NULL DEFAULT 'Admin',
    CONSTRAINT "DocVersion_documentId_fkey" FOREIGN KEY ("documentId") REFERENCES "Document" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "DocTag" (
    "documentId" TEXT NOT NULL,
    "tagId" TEXT NOT NULL,

    PRIMARY KEY ("documentId", "tagId"),
    CONSTRAINT "DocTag_documentId_fkey" FOREIGN KEY ("documentId") REFERENCES "Document" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "DocTag_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "Tag" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Counter" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "value" INTEGER NOT NULL DEFAULT 0
);
INSERT INTO "new_Counter" ("id", "value") SELECT "id", "value" FROM "Counter";
DROP TABLE "Counter";
ALTER TABLE "new_Counter" RENAME TO "Counter";
CREATE TABLE "new_Template" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "docType" TEXT NOT NULL DEFAULT 'SOP',
    "content" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Template" ("content", "createdAt", "description", "id", "name", "updatedAt") SELECT "content", "createdAt", "description", "id", "name", "updatedAt" FROM "Template";
DROP TABLE "Template";
ALTER TABLE "new_Template" RENAME TO "Template";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "Document_docId_key" ON "Document"("docId");

-- CreateIndex
CREATE INDEX "Document_docType_idx" ON "Document"("docType");

-- CreateIndex
CREATE INDEX "Document_funnelStage_idx" ON "Document"("funnelStage");

-- CreateIndex
CREATE INDEX "Document_projectId_idx" ON "Document"("projectId");

-- CreateIndex
CREATE INDEX "Document_platform_idx" ON "Document"("platform");

-- CreateIndex
CREATE INDEX "DocVersion_documentId_idx" ON "DocVersion"("documentId");

-- CreateIndex
CREATE UNIQUE INDEX "DocVersion_documentId_version_key" ON "DocVersion"("documentId", "version");
