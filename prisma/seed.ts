import { PrismaClient } from "@prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";
import { SOP_TEMPLATE, GLOBAL_VARS_TEMPLATE, LEARNINGS_TEMPLATE } from "../src/lib/templates";

const adapter = new PrismaLibSql({ url: "file:./dev.db" });
const prisma = new PrismaClient({ adapter } as ConstructorParameters<typeof PrismaClient>[0]);

async function main() {
  console.log("Seeding database...");

  // ── Categories ─────────────────────────────────────────────────────────────
  const categories = [
    { id: "cat-appt",  name: "Appointment Booking", slug: "appointment-booking", description: "All appointment booking SOPs, outreach channels, and guides for Eminence & Co.", icon: "Calendar", order: 0 },
    { id: "cat-shows", name: "Shows",               slug: "shows",               description: "Show planning, event logistics, and performance tracking SOPs.",              icon: "Film",     order: 1 },
    { id: "cat-sales", name: "Sales",               slug: "sales",               description: "Sales processes, scripts, and conversion optimisation guides.",               icon: "TrendingUp", order: 2 },
    { id: "cat-prod",  name: "Product",             slug: "product",             description: "Product management, delivery, and client success SOPs.",                     icon: "Box",      order: 3 },
    { id: "cat-team",  name: "Team",                slug: "team",                description: "Hiring, onboarding, training, and team management documentation.",           icon: "Users",    order: 4 },
    { id: "cat-admin", name: "Admin Data",          slug: "admin-data",          description: "Financial records, contracts, compliance, and admin processes.",             icon: "Lock",     order: 5 },
  ];

  for (const cat of categories) {
    await prisma.category.upsert({
      where: { id: cat.id },
      update: { name: cat.name, description: cat.description, order: cat.order },
      create: cat,
    });
  }

  // ── Subfolders ──────────────────────────────────────────────────────────────
  const subfolders = [
    // Appointment Booking
    { id: "sub-fb-out",  name: "FB Outreach",       slug: "fb-outreach",       description: "Account setup, stimuli & tracking guides",       group: "FB Outreach",  categoryId: "cat-appt", order: 0 },
    { id: "sub-ig-out",  name: "IG Outreach",       slug: "ig-outreach",       description: "Instagram outreach and account management",       group: "Outbound",     categoryId: "cat-appt", order: 1 },
    { id: "sub-wa-out",  name: "WA Outreach",       slug: "wa-outreach",       description: "WhatsApp outreach processes and templates",       group: "Outbound",     categoryId: "cat-appt", order: 2 },
    { id: "sub-smdms",   name: "Social Media DMs",  slug: "social-media-dms",  description: "FB · IG · WA outreach coordination",             group: "Outbound",     categoryId: "cat-appt", order: 3 },
    { id: "sub-cold",    name: "Cold Calling",      slug: "cold-calling",      description: "Scripts and call processes",                      group: "Outbound",     categoryId: "cat-appt", order: 4 },
    { id: "sub-loom",    name: "Loom",              slug: "loom",              description: "Video outreach SOPs",                             group: "Outbound",     categoryId: "cat-appt", order: 5 },
    { id: "sub-sms",     name: "SMS",               slug: "sms",               description: "Text campaign processes",                         group: "Outbound",     categoryId: "cat-appt", order: 6 },
    { id: "sub-ig-leg",  name: "IG Legion",         slug: "ig-legion",         description: "Instagram account rotation and warming SOPs",     group: "IG Legion",    categoryId: "cat-appt", order: 7 },
    // Shows
    { id: "sub-live",    name: "Live Shows",        slug: "live-shows",        description: "Live event planning and execution",               group: null,           categoryId: "cat-shows", order: 0 },
    { id: "sub-webinar", name: "Webinars",          slug: "webinars",          description: "Webinar hosting and follow-up processes",         group: null,           categoryId: "cat-shows", order: 1 },
    // Sales
    { id: "sub-offers",  name: "Offer Creation",   slug: "offer-creation",    description: "Offer development and packaging guides",          group: null,           categoryId: "cat-sales", order: 0 },
    { id: "sub-closer",  name: "Closing Scripts",  slug: "closing-scripts",   description: "Sales call scripts and objection handling",       group: null,           categoryId: "cat-sales", order: 1 },
    { id: "sub-followup","name": "Follow-Up",      slug: "follow-up",         description: "Post-call follow-up and nurture sequences",       group: null,           categoryId: "cat-sales", order: 2 },
    // Product
    { id: "sub-onboard", name: "Onboarding",       slug: "onboarding",        description: "Client onboarding workflows and checklists",      group: null,           categoryId: "cat-prod",  order: 0 },
    { id: "sub-delivery","name": "Delivery",       slug: "delivery",          description: "Service delivery and fulfilment SOPs",            group: null,           categoryId: "cat-prod",  order: 1 },
    // Team
    { id: "sub-hiring",  name: "Hiring",           slug: "hiring",            description: "Recruitment and hiring processes",                group: null,           categoryId: "cat-team",  order: 0 },
    { id: "sub-training","name": "Training",       slug: "training",          description: "Staff training programmes and materials",         group: null,           categoryId: "cat-team",  order: 1 },
    // Admin Data
    { id: "sub-finance", name: "Finance",          slug: "finance",           description: "Financial reporting and bookkeeping processes",   group: null,           categoryId: "cat-admin", order: 0 },
    { id: "sub-legal",   name: "Legal",            slug: "legal",             description: "Contracts, compliance, and legal templates",      group: null,           categoryId: "cat-admin", order: 1 },
  ];

  for (const sf of subfolders) {
    await prisma.subfolder.upsert({
      where: { id: sf.id },
      update: { name: sf.name, description: sf.description, group: sf.group, order: sf.order },
      create: sf,
    });
  }

  // ── Counters ────────────────────────────────────────────────────────────────
  const counters = [
    { id: "SOP-SYS-IG", value: 2 },
    { id: "SOP-SYS-FB", value: 2 },
    { id: "SYS-VARS-FB", value: 3 },
    { id: "SYS-LEARN-FB", value: 1 },
    { id: "SOP-SYS-APPT", value: 1 },
  ];
  for (const c of counters) {
    await prisma.counter.upsert({ where: { id: c.id }, update: {}, create: c });
  }

  // ── Templates ───────────────────────────────────────────────────────────────
  await prisma.template.upsert({
    where: { id: "tpl-sop" },
    update: {},
    create: { id: "tpl-sop", name: "Standard Operating Procedure", description: "Full SOP with Purpose, Scope, Roles, Tools, Definitions, and Procedure sections", docType: "SOP", content: SOP_TEMPLATE },
  });
  await prisma.template.upsert({
    where: { id: "tpl-gv" },
    update: {},
    create: { id: "tpl-gv", name: "Global Variables / Outreach System", description: "Template for outreach systems with Trojan Horse Copy, VSL Script, Calendly Message, etc.", docType: "GLOBAL_VARS", content: GLOBAL_VARS_TEMPLATE },
  });
  await prisma.template.upsert({
    where: { id: "tpl-learn" },
    update: {},
    create: { id: "tpl-learn", name: "Learnings & Hypotheses", description: "Knowledge base with Inbox, categorised learnings, Experiment log, and Change log", docType: "LEARNINGS", content: LEARNINGS_TEMPLATE },
  });

  // ── Legacy Project (for existing docs) ─────────────────────────────────────
  const fbProject = await prisma.project.upsert({
    where: { id: "proj-fb-dm" },
    update: {},
    create: { id: "proj-fb-dm", name: "(Facebook) DM Versions", description: "FB DM outreach system", platform: "FB" },
  });
  const igProject = await prisma.project.upsert({
    where: { id: "proj-ig-legion" },
    update: {},
    create: { id: "proj-ig-legion", name: "IG Legion", description: "Instagram account management and outreach system", platform: "IG" },
  });

  // ── Sample Documents ────────────────────────────────────────────────────────
  const fbSopContent = JSON.stringify({
    type: "doc",
    content: [
      { type: "heading", attrs: { level: 1 }, content: [{ type: "text", text: "FB Outreach Account Setup SOP" }] },
      { type: "paragraph", content: [{ type: "text", marks: [{ type: "bold" }], text: "SOP ID: " }, { type: "text", text: "SOP-SYS-FB-001" }] },
      { type: "paragraph", content: [{ type: "text", marks: [{ type: "bold" }], text: "Owner: " }, { type: "text", text: "Ben Adams" }] },
      { type: "paragraph", content: [{ type: "text", marks: [{ type: "bold" }], text: "Version: " }, { type: "text", text: "v2.0" }] },
      { type: "heading", attrs: { level: 2 }, content: [{ type: "text", text: "Purpose" }] },
      { type: "paragraph", content: [{ type: "text", text: "This SOP outlines the step-by-step process for setting up a new Facebook outreach account in AdsPower, including profile configuration, warming schedule, and initial connection strategy." }] },
      { type: "heading", attrs: { level: 2 }, content: [{ type: "text", text: "Scope" }] },
      { type: "paragraph", content: [{ type: "text", text: "Applies to all new Facebook accounts created for outreach purposes. This includes accounts used for direct messaging, engagement farming, and connection building." }] },
      { type: "heading", attrs: { level: 2 }, content: [{ type: "text", text: "Tools Required" }] },
      { type: "bulletList", content: [
        { type: "listItem", content: [{ type: "paragraph", content: [{ type: "text", text: "AdsPower browser" }] }] },
        { type: "listItem", content: [{ type: "paragraph", content: [{ type: "text", text: "VPN (residential IP)" }] }] },
        { type: "listItem", content: [{ type: "paragraph", content: [{ type: "text", text: "Facebook account credentials" }] }] },
        { type: "listItem", content: [{ type: "paragraph", content: [{ type: "text", text: "Stimuli tracking spreadsheet" }] }] },
      ]},
      { type: "heading", attrs: { level: 2 }, content: [{ type: "text", text: "Procedure" }] },
      { type: "orderedList", content: [
        { type: "listItem", content: [{ type: "paragraph", content: [{ type: "text", marks: [{ type: "bold" }], text: "Account Creation: " }, { type: "text", text: "Create the account using a unique email and residential IP. Use a genuine-sounding profile name." }] }] },
        { type: "listItem", content: [{ type: "paragraph", content: [{ type: "text", marks: [{ type: "bold" }], text: "Profile Setup: " }, { type: "text", text: "Add profile picture, cover photo, and basic bio information. Ensure the profile looks authentic." }] }] },
        { type: "listItem", content: [{ type: "paragraph", content: [{ type: "text", marks: [{ type: "bold" }], text: "Warming Phase (Days 1–7): " }, { type: "text", text: "Like and comment on 10–15 posts per day. Send no DMs during this phase." }] }] },
        { type: "listItem", content: [{ type: "paragraph", content: [{ type: "text", marks: [{ type: "bold" }], text: "Outreach Phase (Day 8+): " }, { type: "text", text: "Begin sending 5–10 connection requests per day. Track all interactions in the stimuli sheet." }] }] },
      ]},
    ],
  });

  await prisma.document.upsert({
    where: { id: "doc-fb-setup" },
    update: {},
    create: {
      id: "doc-fb-setup",
      docId: "SOP-SYS-FB-001",
      name: "FB Outreach Account Setup",
      description: "Step-by-step process for setting up and warming new Facebook outreach accounts in AdsPower",
      docType: "SOP",
      funnelStage: "Setup & Infrastructure",
      owner: "Ben Adams",
      department: "Systems / Operations",
      channel: "Facebook DM",
      platform: "FB",
      currentVersion: 2,
      projectId: fbProject.id,
      subfolderID: "sub-fb-out",
      versions: {
        create: [
          { version: 1, versionName: "v1.0", content: SOP_TEMPLATE, contentText: "FB Outreach Account Setup SOP", changeNote: "Initial version", createdBy: "Ben Adams" },
          { version: 2, versionName: "v2.0", content: fbSopContent, contentText: "FB Outreach Account Setup AdsPower warming profile", changeNote: "Full rewrite — added warming schedule and AdsPower setup steps", createdBy: "Ben Adams" },
        ],
      },
    },
  });

  await prisma.document.upsert({
    where: { id: "doc-fb-vars" },
    update: {},
    create: {
      id: "doc-fb-vars",
      docId: "SYS-VARS-FB-003-FB",
      name: "v3.0 FB Outreach System Global Variables",
      description: "Global variables for the FB outreach system — messaging, VSL script, and booking copy",
      docType: "GLOBAL_VARS",
      funnelStage: "Global – Messaging & Booking",
      owner: "Ben Adams",
      channel: "Facebook DM",
      platform: "FB",
      currentVersion: 3,
      projectId: fbProject.id,
      subfolderID: "sub-fb-out",
      versions: {
        create: [
          { version: 1, versionName: "v1.0", content: GLOBAL_VARS_TEMPLATE, contentText: "FB Outreach System Global Variables Trojan Horse Copy Evergreen", changeNote: "V1 Trojan Copy + Engaged Script + Calendly Copy", createdBy: "Ben Adams" },
          { version: 2, versionName: "v2.0", content: GLOBAL_VARS_TEMPLATE, contentText: "FB Outreach System Global Variables Trojan Horse Copy Evergreen v2", changeNote: "V2 Trojan Copy + Engaged Script + Calendly Copy", createdBy: "Ben Adams" },
          { version: 3, versionName: "v3.0", content: GLOBAL_VARS_TEMPLATE, contentText: "FB Outreach System Global Variables Trojan Horse Copy Evergreen v3", changeNote: "v3.0 full overhaul — Voicenote format, updated VSL script", createdBy: "Ben Adams" },
        ],
      },
    },
  });

  await prisma.document.upsert({
    where: { id: "doc-fb-learn" },
    update: {},
    create: {
      id: "doc-fb-learn",
      docId: "SYS-LEARN-FB-001-FB",
      name: "Outreach Learnings & Hypotheses (FB)",
      description: "Single source of truth for FB outreach learnings, hypotheses, and experiment logs",
      docType: "LEARNINGS",
      funnelStage: "Knowledge Base – Outreach",
      owner: "Benjamin",
      platform: "FB",
      currentVersion: 1,
      projectId: fbProject.id,
      subfolderID: "sub-fb-out",
      versions: {
        create: { version: 1, versionName: "v1.1", content: LEARNINGS_TEMPLATE, contentText: "Outreach Learnings Hypotheses FB", changeNote: "Initial version", createdBy: "Benjamin" },
      },
    },
  });

  await prisma.document.upsert({
    where: { id: "doc-ig-setup" },
    update: {},
    create: {
      id: "doc-ig-setup",
      docId: "SOP-SYS-IG-001",
      name: "Instagram Account Environment & Profile Setup",
      description: "Step-by-step process for setting up Instagram accounts in AdsPower",
      docType: "SOP",
      funnelStage: "Setup & Infrastructure",
      owner: "Ben (Founder)",
      department: "Systems / Operations",
      channel: "Instagram DM",
      platform: "IG",
      currentVersion: 1,
      projectId: igProject.id,
      subfolderID: "sub-ig-leg",
      versions: {
        create: { version: 1, versionName: "v1.0", content: SOP_TEMPLATE, contentText: "Instagram Account Environment Profile Setup", changeNote: "Initial version", createdBy: "Ben (Founder)" },
      },
    },
  });

  await prisma.document.upsert({
    where: { id: "doc-ig-sop2" },
    update: {},
    create: {
      id: "doc-ig-sop2",
      docId: "SOP-SYS-IG-002",
      name: "IG DM Outreach Sequence",
      description: "Full IG DM outreach sequence: connection, conversation starter, and booking the call",
      docType: "SOP",
      funnelStage: "Outreach – DM",
      owner: "Ben (Founder)",
      channel: "Instagram DM",
      platform: "IG",
      currentVersion: 1,
      subfolderID: "sub-ig-out",
      versions: {
        create: { version: 1, versionName: "v1.0", content: SOP_TEMPLATE, contentText: "IG DM Outreach Sequence connection conversation booking", changeNote: "Initial version", createdBy: "Ben (Founder)" },
      },
    },
  });

  await prisma.document.upsert({
    where: { id: "doc-cold-call" },
    update: {},
    create: {
      id: "doc-cold-call",
      docId: "SOP-SYS-APPT-001",
      name: "Cold Call Script & Objection Handling",
      description: "Step-by-step cold calling script with common objections and rebuttals",
      docType: "SOP",
      funnelStage: "Outbound – Calling",
      owner: "Ben Adams",
      channel: "Phone",
      currentVersion: 1,
      subfolderID: "sub-cold",
      versions: {
        create: { version: 1, versionName: "v1.0", content: SOP_TEMPLATE, contentText: "Cold Call Script Objection Handling rebuttals", changeNote: "Initial version", createdBy: "Ben Adams" },
      },
    },
  });

  console.log("Seeding complete.");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
