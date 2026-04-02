-- CreateTable
CREATE TABLE "Sop" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "docId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "funnelStage" TEXT NOT NULL DEFAULT 'GENERAL',
    "owner" TEXT NOT NULL,
    "currentVersion" INTEGER NOT NULL DEFAULT 1,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "SopVersion" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "sopId" TEXT NOT NULL,
    "version" INTEGER NOT NULL,
    "content" TEXT NOT NULL,
    "contentText" TEXT NOT NULL DEFAULT '',
    "changeNote" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" TEXT NOT NULL DEFAULT 'Admin',
    CONSTRAINT "SopVersion_sopId_fkey" FOREIGN KEY ("sopId") REFERENCES "Sop" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Tag" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "SopTag" (
    "sopId" TEXT NOT NULL,
    "tagId" TEXT NOT NULL,

    PRIMARY KEY ("sopId", "tagId"),
    CONSTRAINT "SopTag_sopId_fkey" FOREIGN KEY ("sopId") REFERENCES "Sop" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "SopTag_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "Tag" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Template" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "content" TEXT NOT NULL,
    "funnelStage" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Counter" (
    "id" TEXT NOT NULL PRIMARY KEY DEFAULT 'sop_counter',
    "value" INTEGER NOT NULL DEFAULT 0
);

-- CreateIndex
CREATE UNIQUE INDEX "Sop_docId_key" ON "Sop"("docId");

-- CreateIndex
CREATE INDEX "Sop_funnelStage_idx" ON "Sop"("funnelStage");

-- CreateIndex
CREATE INDEX "Sop_owner_idx" ON "Sop"("owner");

-- CreateIndex
CREATE INDEX "SopVersion_sopId_idx" ON "SopVersion"("sopId");

-- CreateIndex
CREATE UNIQUE INDEX "SopVersion_sopId_version_key" ON "SopVersion"("sopId", "version");

-- CreateIndex
CREATE UNIQUE INDEX "Tag_name_key" ON "Tag"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Tag_slug_key" ON "Tag"("slug");
