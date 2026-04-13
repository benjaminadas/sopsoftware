import { createClient } from "@libsql/client";

const url       = process.env.DATABASE_URL!;
const authToken = process.env.DATABASE_AUTH_TOKEN;

const db = createClient({ url, authToken });

const SQL = `
CREATE TABLE IF NOT EXISTS Category (
  id          TEXT PRIMARY KEY,
  name        TEXT NOT NULL,
  slug        TEXT NOT NULL UNIQUE,
  description TEXT,
  icon        TEXT,
  "order"     INTEGER NOT NULL DEFAULT 0,
  createdAt   DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updatedAt   DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS Subfolder (
  id          TEXT PRIMARY KEY,
  name        TEXT NOT NULL,
  slug        TEXT NOT NULL,
  description TEXT,
  "group"     TEXT,
  categoryId  TEXT NOT NULL,
  "order"     INTEGER NOT NULL DEFAULT 0,
  createdAt   DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updatedAt   DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (categoryId) REFERENCES Category(id) ON DELETE CASCADE,
  UNIQUE (categoryId, slug)
);

CREATE TABLE IF NOT EXISTS Project (
  id          TEXT PRIMARY KEY,
  name        TEXT NOT NULL,
  description TEXT,
  platform    TEXT,
  createdAt   DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updatedAt   DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS Document (
  id             TEXT PRIMARY KEY,
  docId          TEXT NOT NULL UNIQUE,
  name           TEXT NOT NULL,
  description    TEXT,
  docType        TEXT NOT NULL DEFAULT 'SOP',
  funnelStage    TEXT NOT NULL DEFAULT 'General',
  owner          TEXT NOT NULL,
  department     TEXT,
  channel        TEXT,
  platform       TEXT,
  currentVersion INTEGER NOT NULL DEFAULT 1,
  projectId      TEXT,
  subfolderID    TEXT,
  createdAt      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updatedAt      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (projectId)   REFERENCES Project(id),
  FOREIGN KEY (subfolderID) REFERENCES Subfolder(id)
);

CREATE TABLE IF NOT EXISTS DocVersion (
  id          TEXT PRIMARY KEY,
  documentId  TEXT NOT NULL,
  version     INTEGER NOT NULL,
  versionName TEXT,
  content     TEXT NOT NULL,
  contentText TEXT NOT NULL DEFAULT '',
  changeNote  TEXT,
  createdAt   DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  createdBy   TEXT NOT NULL DEFAULT 'Admin',
  FOREIGN KEY (documentId) REFERENCES Document(id) ON DELETE CASCADE,
  UNIQUE (documentId, version)
);

CREATE TABLE IF NOT EXISTS Tag (
  id   TEXT PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS DocTag (
  documentId TEXT NOT NULL,
  tagId      TEXT NOT NULL,
  PRIMARY KEY (documentId, tagId),
  FOREIGN KEY (documentId) REFERENCES Document(id) ON DELETE CASCADE,
  FOREIGN KEY (tagId)      REFERENCES Tag(id)      ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS Template (
  id          TEXT PRIMARY KEY,
  name        TEXT NOT NULL,
  description TEXT,
  docType     TEXT NOT NULL DEFAULT 'SOP',
  content     TEXT NOT NULL,
  createdAt   DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updatedAt   DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS Counter (
  id    TEXT PRIMARY KEY,
  value INTEGER NOT NULL DEFAULT 0
);
`;

async function main() {
  console.log("Setting up Turso database...");
  const statements = SQL.split(";").map(s => s.trim()).filter(Boolean);
  for (const stmt of statements) {
    await db.execute(stmt);
    console.log("✓", stmt.slice(0, 60).replace(/\n/g, " "));
  }
  console.log("Done!");
}

main().catch(e => { console.error(e); process.exit(1); }).finally(() => db.close());
