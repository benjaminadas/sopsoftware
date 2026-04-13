// Runs during Vercel build to create tables and seed initial data
const { createClient } = require("@libsql/client");

const url       = process.env.DATABASE_URL;
const authToken = process.env.DATABASE_AUTH_TOKEN;

if (!url) { console.log("No DATABASE_URL — skipping migration (local dev)"); process.exit(0); }
if (url.startsWith("file:")) { console.log("Local SQLite — skipping remote migration"); process.exit(0); }

const db = createClient({ url, authToken });

const SCHEMA = [
  `CREATE TABLE IF NOT EXISTS Category (
    id TEXT PRIMARY KEY, name TEXT NOT NULL, slug TEXT NOT NULL UNIQUE,
    description TEXT, icon TEXT, "order" INTEGER NOT NULL DEFAULT 0,
    createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP)`,
  `CREATE TABLE IF NOT EXISTS Subfolder (
    id TEXT PRIMARY KEY, name TEXT NOT NULL, slug TEXT NOT NULL,
    description TEXT, "group" TEXT, categoryId TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (categoryId) REFERENCES Category(id) ON DELETE CASCADE,
    UNIQUE (categoryId, slug))`,
  `CREATE TABLE IF NOT EXISTS Project (
    id TEXT PRIMARY KEY, name TEXT NOT NULL, description TEXT, platform TEXT,
    createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP)`,
  `CREATE TABLE IF NOT EXISTS Document (
    id TEXT PRIMARY KEY, docId TEXT NOT NULL UNIQUE, name TEXT NOT NULL,
    description TEXT, docType TEXT NOT NULL DEFAULT 'SOP',
    funnelStage TEXT NOT NULL DEFAULT 'General', owner TEXT NOT NULL,
    department TEXT, channel TEXT, platform TEXT,
    currentVersion INTEGER NOT NULL DEFAULT 1,
    projectId TEXT, subfolderID TEXT,
    createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (projectId) REFERENCES Project(id),
    FOREIGN KEY (subfolderID) REFERENCES Subfolder(id))`,
  `CREATE TABLE IF NOT EXISTS DocVersion (
    id TEXT PRIMARY KEY, documentId TEXT NOT NULL, version INTEGER NOT NULL,
    versionName TEXT, content TEXT NOT NULL, contentText TEXT NOT NULL DEFAULT '',
    changeNote TEXT, createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    createdBy TEXT NOT NULL DEFAULT 'Admin',
    FOREIGN KEY (documentId) REFERENCES Document(id) ON DELETE CASCADE,
    UNIQUE (documentId, version))`,
  `CREATE TABLE IF NOT EXISTS Tag (
    id TEXT PRIMARY KEY, name TEXT NOT NULL UNIQUE, slug TEXT NOT NULL UNIQUE)`,
  `CREATE TABLE IF NOT EXISTS DocTag (
    documentId TEXT NOT NULL, tagId TEXT NOT NULL,
    PRIMARY KEY (documentId, tagId),
    FOREIGN KEY (documentId) REFERENCES Document(id) ON DELETE CASCADE,
    FOREIGN KEY (tagId) REFERENCES Tag(id) ON DELETE CASCADE)`,
  `CREATE TABLE IF NOT EXISTS Template (
    id TEXT PRIMARY KEY, name TEXT NOT NULL, description TEXT,
    docType TEXT NOT NULL DEFAULT 'SOP', content TEXT NOT NULL,
    createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP)`,
  `CREATE TABLE IF NOT EXISTS Counter (
    id TEXT PRIMARY KEY, value INTEGER NOT NULL DEFAULT 0)`,
];

const CATEGORIES = [
  ["cat-appt",  "Appointment Booking", "appointment-booking", "All appointment booking SOPs, outreach channels, and guides for Eminence & Co.", "Calendar", 0],
  ["cat-shows", "Shows",               "shows",               "Show planning, event logistics, and performance tracking SOPs.",               "Film",       1],
  ["cat-sales", "Sales",               "sales",               "Sales processes, scripts, and conversion optimisation guides.",                "TrendingUp", 2],
  ["cat-prod",  "Product",             "product",             "Product management, delivery, and client success SOPs.",                      "Box",        3],
  ["cat-team",  "Team",                "team",                "Hiring, onboarding, training, and team management documentation.",            "Users",      4],
  ["cat-admin", "Admin Data",          "admin-data",          "Financial records, contracts, compliance, and admin processes.",              "Lock",       5],
];

const SUBFOLDERS = [
  ["sub-fb-out",  "FB Outreach",      "fb-outreach",      "Account setup, stimuli & tracking guides",      "FB Outreach", "cat-appt", 0],
  ["sub-ig-out",  "IG Outreach",      "ig-outreach",      "Instagram outreach and account management",     "Outbound",    "cat-appt", 1],
  ["sub-wa-out",  "WA Outreach",      "wa-outreach",      "WhatsApp outreach processes and templates",     "Outbound",    "cat-appt", 2],
  ["sub-smdms",   "Social Media DMs", "social-media-dms", "FB · IG · WA outreach coordination",           "Outbound",    "cat-appt", 3],
  ["sub-cold",    "Cold Calling",     "cold-calling",     "Scripts and call processes",                    "Outbound",    "cat-appt", 4],
  ["sub-loom",    "Loom",             "loom",             "Video outreach SOPs",                           "Outbound",    "cat-appt", 5],
  ["sub-sms",     "SMS",              "sms",              "Text campaign processes",                       "Outbound",    "cat-appt", 6],
  ["sub-ig-leg",  "IG Legion",        "ig-legion",        "Instagram account rotation and warming SOPs",  "IG Legion",   "cat-appt", 7],
  ["sub-live",    "Live Shows",       "live-shows",       "Live event planning and execution",             null,          "cat-shows", 0],
  ["sub-webinar", "Webinars",         "webinars",         "Webinar hosting and follow-up processes",      null,          "cat-shows", 1],
  ["sub-offers",  "Offer Creation",   "offer-creation",   "Offer development and packaging guides",       null,          "cat-sales", 0],
  ["sub-closer",  "Closing Scripts",  "closing-scripts",  "Sales call scripts and objection handling",    null,          "cat-sales", 1],
  ["sub-followup","Follow-Up",        "follow-up",        "Post-call follow-up and nurture sequences",    null,          "cat-sales", 2],
  ["sub-onboard", "Onboarding",       "onboarding",       "Client onboarding workflows and checklists",  null,          "cat-prod",  0],
  ["sub-delivery","Delivery",         "delivery",         "Service delivery and fulfilment SOPs",         null,          "cat-prod",  1],
  ["sub-hiring",  "Hiring",           "hiring",           "Recruitment and hiring processes",             null,          "cat-team",  0],
  ["sub-training","Training",         "training",         "Staff training programmes and materials",      null,          "cat-team",  1],
  ["sub-finance", "Finance",          "finance",          "Financial reporting and bookkeeping processes",null,          "cat-admin", 0],
  ["sub-legal",   "Legal",            "legal",            "Contracts, compliance, and legal templates",   null,          "cat-admin", 1],
];

async function main() {
  console.log("Running migrations against", url);

  // Create tables
  for (const sql of SCHEMA) {
    await db.execute(sql);
  }
  console.log("✓ Tables created");

  // Check if already seeded
  const existing = await db.execute("SELECT COUNT(*) as cnt FROM Category");
  if (existing.rows[0].cnt > 0) {
    console.log("✓ Already seeded — skipping");
    return;
  }

  // Seed categories
  for (const [id, name, slug, description, icon, order] of CATEGORIES) {
    await db.execute({
      sql: `INSERT OR IGNORE INTO Category (id, name, slug, description, icon, "order") VALUES (?, ?, ?, ?, ?, ?)`,
      args: [id, name, slug, description, icon, order],
    });
  }
  console.log("✓ Categories seeded");

  // Seed subfolders
  for (const [id, name, slug, description, group, categoryId, order] of SUBFOLDERS) {
    await db.execute({
      sql: `INSERT OR IGNORE INTO Subfolder (id, name, slug, description, "group", categoryId, "order") VALUES (?, ?, ?, ?, ?, ?, ?)`,
      args: [id, name, slug, description, group, categoryId, order],
    });
  }
  console.log("✓ Subfolders seeded");

  console.log("Migration complete.");
}

main()
  .catch(e => { console.error("Migration failed:", e.message); process.exit(1); })
  .finally(() => db.close());
