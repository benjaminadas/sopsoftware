const { PrismaLibSql } = require("@prisma/adapter-libsql");
const { PrismaClient } = require("@prisma/client");
const path = require("path");

const adapter = new PrismaLibSql({ url: "file:./dev.db" });
const prisma = new PrismaClient({ adapter });

const SOP_TEMPLATE = JSON.stringify({
  type: "doc",
  content: [
    { type: "heading", attrs: { level: 1 }, content: [{ type: "text", text: "SOP Title" }] },
    { type: "paragraph", content: [{ type: "text", marks: [{ type: "bold" }], text: "SOP ID: " }, { type: "text", text: "AUTO-GENERATED" }] },
    { type: "paragraph", content: [{ type: "text", marks: [{ type: "bold" }], text: "Version: " }, { type: "text", text: "v1.0" }] },
    { type: "paragraph", content: [{ type: "text", marks: [{ type: "bold" }], text: "Owner: " }, { type: "text", text: "Ben (Founder)" }] },
    { type: "paragraph", content: [{ type: "text", marks: [{ type: "bold" }], text: "Department: " }, { type: "text", text: "Systems / Operations" }] },
    { type: "horizontalRule" },
    { type: "heading", attrs: { level: 2 }, content: [{ type: "text", text: "1. Purpose" }] },
    { type: "paragraph", content: [{ type: "text", text: "To define the step-by-step process for:" }] },
    { type: "bulletList", content: [{ type: "listItem", content: [{ type: "paragraph", content: [{ type: "text", text: "Step one..." }] }] }] },
    { type: "horizontalRule" },
    { type: "heading", attrs: { level: 2 }, content: [{ type: "text", text: "2. Scope" }] },
    { type: "paragraph", content: [{ type: "text", text: "This SOP applies to any team member responsible for..." }] },
    { type: "horizontalRule" },
    { type: "heading", attrs: { level: 2 }, content: [{ type: "text", text: "3. Roles & Responsibilities" }] },
    { type: "bulletList", content: [{ type: "listItem", content: [{ type: "paragraph", content: [{ type: "text", marks: [{ type: "bold" }], text: "Operator (VA): " }, { type: "text", text: "Follows this SOP." }] }] }, { type: "listItem", content: [{ type: "paragraph", content: [{ type: "text", marks: [{ type: "bold" }], text: "Ben: " }, { type: "text", text: "Provides resources and approves changes." }] }] }] },
    { type: "horizontalRule" },
    { type: "heading", attrs: { level: 2 }, content: [{ type: "text", text: "4. Tools & Access Needed" }] },
    { type: "bulletList", content: [{ type: "listItem", content: [{ type: "paragraph", content: [{ type: "text", text: "Tool name + link" }] }] }] },
    { type: "horizontalRule" },
    { type: "heading", attrs: { level: 2 }, content: [{ type: "text", text: "5. Definitions" }] },
    { type: "paragraph" },
    { type: "horizontalRule" },
    { type: "heading", attrs: { level: 2 }, content: [{ type: "text", text: "6. Procedure" }] },
    { type: "heading", attrs: { level: 3 }, content: [{ type: "text", text: "6.1 Step One" }] },
    { type: "orderedList", content: [{ type: "listItem", content: [{ type: "paragraph", content: [{ type: "text", text: "Sub-step..." }] }] }] },
  ],
});

const GLOBAL_VARS_TEMPLATE = JSON.stringify({
  type: "doc",
  content: [
    { type: "heading", attrs: { level: 1 }, content: [{ type: "text", text: "Global Variables / System Name" }] },
    { type: "paragraph", content: [{ type: "text", marks: [{ type: "bold" }], text: "Doc ID: " }, { type: "text", text: "AUTO-GENERATED" }] },
    { type: "paragraph", content: [{ type: "text", marks: [{ type: "bold" }], text: "Version: " }, { type: "text", text: "v1.0" }] },
    { type: "paragraph", content: [{ type: "text", marks: [{ type: "bold" }], text: "Channel: " }, { type: "text", text: "Facebook DM" }] },
    { type: "horizontalRule" },
    { type: "heading", attrs: { level: 2 }, content: [{ type: "text", text: "v1.0 Trojan Horse Copy" }] },
    { type: "paragraph", content: [{ type: "text", marks: [{ type: "bold" }], text: "Type: " }, { type: "text", text: "Voicenote / Text" }] },
    { type: "paragraph", content: [{ type: "text", text: "Hey there, write your message copy here..." }] },
    { type: "horizontalRule" },
    { type: "heading", attrs: { level: 2 }, content: [{ type: "text", text: "v1.0 Evergreen Accompany Message" }] },
    { type: "paragraph", content: [{ type: "text", text: "Hey {{firstname}}, write your message here..." }] },
    { type: "horizontalRule" },
    { type: "heading", attrs: { level: 2 }, content: [{ type: "text", text: "v1.0 Engaged VSL Script" }] },
    { type: "paragraph", content: [{ type: "text", text: "Script content here..." }] },
    { type: "horizontalRule" },
    { type: "heading", attrs: { level: 2 }, content: [{ type: "text", text: "v1.0 Calendly Message Copy" }] },
    { type: "paragraph", content: [{ type: "text", text: "Calendly message copy here..." }] },
    { type: "horizontalRule" },
    { type: "heading", attrs: { level: 2 }, content: [{ type: "text", text: "Notes / Results" }] },
    { type: "paragraph", content: [{ type: "text", text: "Add notes and results here..." }] },
  ],
});

const LEARNINGS_TEMPLATE = JSON.stringify({
  type: "doc",
  content: [
    { type: "heading", attrs: { level: 1 }, content: [{ type: "text", text: "Outreach Learnings & Hypotheses" }] },
    { type: "horizontalRule" },
    { type: "heading", attrs: { level: 2 }, content: [{ type: "text", text: "Inbox (drop new notes here)" }] },
    { type: "bulletList", content: [{ type: "listItem", content: [{ type: "paragraph", content: [{ type: "text", marks: [{ type: "bold" }], text: "Hypothesis: " }] }] }, { type: "listItem", content: [{ type: "paragraph", content: [{ type: "text", marks: [{ type: "bold" }], text: "Learning: " }] }] }, { type: "listItem", content: [{ type: "paragraph", content: [{ type: "text", marks: [{ type: "bold" }], text: "Failure mode: " }] }] }] },
    { type: "horizontalRule" },
    { type: "heading", attrs: { level: 2 }, content: [{ type: "text", text: "Setup & Infrastructure" }] },
    { type: "paragraph" },
    { type: "horizontalRule" },
    { type: "heading", attrs: { level: 2 }, content: [{ type: "text", text: "Messaging & Deliverability" }] },
    { type: "paragraph" },
    { type: "horizontalRule" },
    { type: "heading", attrs: { level: 2 }, content: [{ type: "text", text: "Experiment Log" }] },
    { type: "paragraph", content: [{ type: "text", text: "| Date | Variable Changed | Metric | Result |" }] },
    { type: "horizontalRule" },
    { type: "heading", attrs: { level: 2 }, content: [{ type: "text", text: "Change Log" }] },
    { type: "paragraph" },
  ],
});

const METRICS_TEMPLATE = JSON.stringify({
  type: "doc",
  content: [
    { type: "heading", attrs: { level: 1 }, content: [{ type: "text", text: "Metrics Doc" }] },
    { type: "horizontalRule" },
    { type: "heading", attrs: { level: 2 }, content: [{ type: "text", text: "Key Metrics" }] },
    { type: "bulletList", content: [{ type: "listItem", content: [{ type: "paragraph", content: [{ type: "text", marks: [{ type: "bold" }], text: "Metric Name: " }, { type: "text", text: "Value / Target" }] }] }] },
    { type: "horizontalRule" },
    { type: "heading", attrs: { level: 2 }, content: [{ type: "text", text: "Weekly Tracking" }] },
    { type: "paragraph", content: [{ type: "text", text: "| Week | Metric 1 | Metric 2 | Notes |" }] },
  ],
});

async function main() {
  console.log("Seeding database...");

  await prisma.counter.upsert({ where: { id: "SOP-SYS-IG" }, update: {}, create: { id: "SOP-SYS-IG", value: 2 } });
  await prisma.counter.upsert({ where: { id: "SOP-SYS-FB" }, update: {}, create: { id: "SOP-SYS-FB", value: 0 } });
  await prisma.counter.upsert({ where: { id: "SYS-VARS-FB" }, update: {}, create: { id: "SYS-VARS-FB", value: 3 } });
  await prisma.counter.upsert({ where: { id: "SYS-LEARN-FB" }, update: {}, create: { id: "SYS-LEARN-FB", value: 1 } });

  await prisma.template.upsert({ where: { id: "tpl-sop" }, update: {}, create: { id: "tpl-sop", name: "Standard Operating Procedure", description: "Full SOP with Purpose, Scope, Roles, Tools, Definitions, and Procedure sections", docType: "SOP", content: SOP_TEMPLATE } });
  await prisma.template.upsert({ where: { id: "tpl-gv" }, update: {}, create: { id: "tpl-gv", name: "Global Variables / Outreach System", description: "Outreach scripts: Trojan Horse Copy, VSL Script, Calendly Message, etc.", docType: "GLOBAL_VARS", content: GLOBAL_VARS_TEMPLATE } });
  await prisma.template.upsert({ where: { id: "tpl-learn" }, update: {}, create: { id: "tpl-learn", name: "Learnings & Hypotheses", description: "Inbox, categorised learnings, Experiment log, and Change log", docType: "LEARNINGS", content: LEARNINGS_TEMPLATE } });
  await prisma.template.upsert({ where: { id: "tpl-metrics" }, update: {}, create: { id: "tpl-metrics", name: "Metrics Doc", description: "Track key metrics and weekly performance", docType: "METRICS", content: METRICS_TEMPLATE } });

  const fbProject = await prisma.project.upsert({ where: { id: "proj-fb-dm" }, update: {}, create: { id: "proj-fb-dm", name: "(Facebook) DM Versions", description: "FB DM outreach system - all versions, scripts, metrics, and learnings", platform: "FB" } });
  const igProject = await prisma.project.upsert({ where: { id: "proj-ig-legion" }, update: {}, create: { id: "proj-ig-legion", name: "IG Legion", description: "Instagram account management and outreach system", platform: "IG" } });

  await prisma.document.upsert({
    where: { id: "doc-ig-setup" }, update: {},
    create: { id: "doc-ig-setup", docId: "SOP-SYS-IG-002", name: "Instagram Account Environment & Profile Setup", description: "Step-by-step process for setting up Instagram accounts in AdsPower", docType: "SOP", funnelStage: "Setup & Infrastructure", owner: "Ben (Founder)", department: "Systems / Operations", channel: "Instagram DM", platform: "IG", currentVersion: 1, projectId: igProject.id, versions: { create: { version: 1, versionName: "v1.0", content: SOP_TEMPLATE, contentText: "Instagram Account Environment Profile Setup SOP", changeNote: "Initial version", createdBy: "Ben (Founder)" } } },
  });

  await prisma.document.upsert({
    where: { id: "doc-fb-vars" }, update: {},
    create: { id: "doc-fb-vars", docId: "SYS-VARS-FB-003-FB", name: "v3.0 FB Outreach System Global Variables", description: "Global variables for the FB outreach system", docType: "GLOBAL_VARS", funnelStage: "Global – Messaging & Booking", owner: "Ben Adams", channel: "Facebook DM", platform: "FB", currentVersion: 3, projectId: fbProject.id, versions: { create: [{ version: 1, versionName: "v1.0", content: GLOBAL_VARS_TEMPLATE, contentText: "FB Outreach Global Variables v1", changeNote: "V1 Trojan Copy + Engaged Script + Calendly Copy", createdBy: "Ben Adams" }, { version: 2, versionName: "v2.0", content: GLOBAL_VARS_TEMPLATE, contentText: "FB Outreach Global Variables v2", changeNote: "V2 Trojan Copy + Engaged Script + Calendly Copy", createdBy: "Ben Adams" }, { version: 3, versionName: "v3.0", content: GLOBAL_VARS_TEMPLATE, contentText: "FB Outreach Global Variables v3", changeNote: "v3.0 full overhaul - Voicenote format", createdBy: "Ben Adams" }] } },
  });

  await prisma.document.upsert({
    where: { id: "doc-fb-learn" }, update: {},
    create: { id: "doc-fb-learn", docId: "SYS-LEARN-FB-001-FB", name: "Outreach Learnings & Hypotheses (FB)", description: "Single source of truth for FB outreach learnings and hypotheses", docType: "LEARNINGS", funnelStage: "Knowledge Base – Outreach", owner: "Benjamin", platform: "FB", currentVersion: 1, projectId: fbProject.id, versions: { create: { version: 1, versionName: "v1.1", content: LEARNINGS_TEMPLATE, contentText: "Outreach Learnings Hypotheses FB Inbox", changeNote: "Initial version", createdBy: "Benjamin" } } },
  });

  console.log("Done! Database seeded successfully.");
}

main().catch((e) => { console.error(e); process.exit(1); }).finally(() => prisma.$disconnect());
