import { PrismaClient } from "@prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";
import { SOP_TEMPLATE, GLOBAL_VARS_TEMPLATE, LEARNINGS_TEMPLATE, METRICS_TEMPLATE } from "../src/lib/templates";

const adapter = new PrismaLibSql({ url: "file:./dev.db" });
const prisma = new PrismaClient({ adapter } as ConstructorParameters<typeof PrismaClient>[0]);

async function main() {
  console.log("Seeding database...");

  // Seed counters
  await prisma.counter.upsert({
    where: { id: "SOP-SYS-IG" },
    update: {},
    create: { id: "SOP-SYS-IG", value: 2 },
  });
  await prisma.counter.upsert({
    where: { id: "SOP-SYS-FB" },
    update: {},
    create: { id: "SOP-SYS-FB", value: 0 },
  });
  await prisma.counter.upsert({
    where: { id: "SYS-VARS-FB" },
    update: {},
    create: { id: "SYS-VARS-FB", value: 3 },
  });
  await prisma.counter.upsert({
    where: { id: "SYS-LEARN-FB" },
    update: {},
    create: { id: "SYS-LEARN-FB", value: 1 },
  });

  // Seed templates
  await prisma.template.upsert({
    where: { id: "tpl-sop" },
    update: {},
    create: {
      id: "tpl-sop",
      name: "Standard Operating Procedure",
      description: "Full SOP with Purpose, Scope, Roles, Tools, Definitions, and Procedure sections",
      docType: "SOP",
      content: SOP_TEMPLATE,
    },
  });

  await prisma.template.upsert({
    where: { id: "tpl-gv" },
    update: {},
    create: {
      id: "tpl-gv",
      name: "Global Variables / Outreach System",
      description: "Template for outreach systems with Trojan Horse Copy, VSL Script, Calendly Message, etc.",
      docType: "GLOBAL_VARS",
      content: GLOBAL_VARS_TEMPLATE,
    },
  });

  await prisma.template.upsert({
    where: { id: "tpl-learn" },
    update: {},
    create: {
      id: "tpl-learn",
      name: "Learnings & Hypotheses",
      description: "Knowledge base with Inbox, categorised learnings, Experiment log, and Change log",
      docType: "LEARNINGS",
      content: LEARNINGS_TEMPLATE,
    },
  });

  await prisma.template.upsert({
    where: { id: "tpl-metrics" },
    update: {},
    create: {
      id: "tpl-metrics",
      name: "Metrics Doc",
      description: "Track key metrics and weekly performance",
      docType: "METRICS",
      content: METRICS_TEMPLATE,
    },
  });

  // Seed example projects
  const fbProject = await prisma.project.upsert({
    where: { id: "proj-fb-dm" },
    update: {},
    create: {
      id: "proj-fb-dm",
      name: "(Facebook) DM Versions",
      description: "FB DM outreach system - all versions, scripts, metrics, and learnings",
      platform: "FB",
    },
  });

  const igProject = await prisma.project.upsert({
    where: { id: "proj-ig-legion" },
    update: {},
    create: {
      id: "proj-ig-legion",
      name: "IG Legion",
      description: "Instagram account management and outreach system",
      platform: "IG",
    },
  });

  // Seed example documents
  await prisma.document.upsert({
    where: { id: "doc-ig-setup" },
    update: {},
    create: {
      id: "doc-ig-setup",
      docId: "SOP-SYS-IG-002",
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
      versions: {
        create: {
          version: 1,
          versionName: "v1.0",
          content: SOP_TEMPLATE,
          contentText: "Instagram Account Environment Profile Setup SOP Purpose Scope Roles",
          changeNote: "Initial version",
          createdBy: "Ben (Founder)",
        },
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
      description: "Global variables for the FB outreach system - messaging and booking",
      docType: "GLOBAL_VARS",
      funnelStage: "Global – Messaging & Booking",
      owner: "Ben Adams",
      channel: "Facebook DM",
      platform: "FB",
      currentVersion: 3,
      projectId: fbProject.id,
      versions: {
        create: [
          {
            version: 1,
            versionName: "v1.0",
            content: GLOBAL_VARS_TEMPLATE,
            contentText: "FB Outreach System Global Variables Trojan Horse Copy Evergreen",
            changeNote: "V1 Trojan Copy + Engaged Script + Calendly Copy",
            createdBy: "Ben Adams",
          },
          {
            version: 2,
            versionName: "v2.0",
            content: GLOBAL_VARS_TEMPLATE,
            contentText: "FB Outreach System Global Variables Trojan Horse Copy Evergreen v2",
            changeNote: "V2 Trojan Copy + Engaged Script + Calendly Copy",
            createdBy: "Ben Adams",
          },
          {
            version: 3,
            versionName: "v3.0",
            content: GLOBAL_VARS_TEMPLATE,
            contentText: "FB Outreach System Global Variables Trojan Horse Copy Evergreen v3",
            changeNote: "v3.0 full overhaul - Voicenote format, updated VSL script",
            createdBy: "Ben Adams",
          },
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
      versions: {
        create: {
          version: 1,
          versionName: "v1.1",
          content: LEARNINGS_TEMPLATE,
          contentText: "Outreach Learnings Hypotheses FB Inbox Setup Messaging Experiment log",
          changeNote: "Initial version",
          createdBy: "Benjamin",
        },
      },
    },
  });

  console.log("Seeding complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
