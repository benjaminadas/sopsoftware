// Pre-built TipTap JSON content for each document type

export const SOP_TEMPLATE = JSON.stringify({
  type: "doc",
  content: [
    {
      type: "heading",
      attrs: { level: 1 },
      content: [{ type: "text", text: "SOP Title" }],
    },
    {
      type: "paragraph",
      content: [
        { type: "text", marks: [{ type: "bold" }], text: "SOP ID: " },
        { type: "text", text: "AUTO-GENERATED" },
      ],
    },
    {
      type: "paragraph",
      content: [
        { type: "text", marks: [{ type: "bold" }], text: "Version: " },
        { type: "text", text: "v1.0" },
      ],
    },
    {
      type: "paragraph",
      content: [
        { type: "text", marks: [{ type: "bold" }], text: "Owner: " },
        { type: "text", text: "Ben (Founder)" },
      ],
    },
    {
      type: "paragraph",
      content: [
        { type: "text", marks: [{ type: "bold" }], text: "Department: " },
        { type: "text", text: "Systems / Operations" },
      ],
    },
    {
      type: "paragraph",
      content: [
        { type: "text", marks: [{ type: "bold" }], text: "Last Updated: " },
        { type: "text", text: new Date().toLocaleDateString("en-GB") },
      ],
    },
    { type: "horizontalRule" },
    {
      type: "heading",
      attrs: { level: 2 },
      content: [{ type: "text", text: "1. Purpose" }],
    },
    {
      type: "paragraph",
      content: [{ type: "text", text: "To define the step-by-step process for:" }],
    },
    {
      type: "bulletList",
      content: [
        {
          type: "listItem",
          content: [{ type: "paragraph", content: [{ type: "text", text: "Step one..." }] }],
        },
        {
          type: "listItem",
          content: [{ type: "paragraph", content: [{ type: "text", text: "Step two..." }] }],
        },
      ],
    },
    { type: "horizontalRule" },
    {
      type: "heading",
      attrs: { level: 2 },
      content: [{ type: "text", text: "2. Scope" }],
    },
    {
      type: "paragraph",
      content: [{ type: "text", text: "This SOP applies to any team member responsible for:" }],
    },
    {
      type: "bulletList",
      content: [
        {
          type: "listItem",
          content: [{ type: "paragraph", content: [{ type: "text", text: "..." }] }],
        },
      ],
    },
    {
      type: "paragraph",
      content: [
        { type: "text", marks: [{ type: "bold" }], text: "It does NOT cover: " },
        { type: "text", text: "..." },
      ],
    },
    { type: "horizontalRule" },
    {
      type: "heading",
      attrs: { level: 2 },
      content: [{ type: "text", text: "3. Roles & Responsibilities" }],
    },
    {
      type: "bulletList",
      content: [
        {
          type: "listItem",
          content: [
            {
              type: "paragraph",
              content: [
                { type: "text", marks: [{ type: "bold" }], text: "Operator (VA): " },
                { type: "text", text: "Follows this SOP for each assigned task." },
              ],
            },
          ],
        },
        {
          type: "listItem",
          content: [
            {
              type: "paragraph",
              content: [
                { type: "text", marks: [{ type: "bold" }], text: "Ben: " },
                { type: "text", text: "Provides resources and approves changes." },
              ],
            },
          ],
        },
      ],
    },
    { type: "horizontalRule" },
    {
      type: "heading",
      attrs: { level: 2 },
      content: [{ type: "text", text: "4. Tools & Access Needed" }],
    },
    {
      type: "bulletList",
      content: [
        {
          type: "listItem",
          content: [{ type: "paragraph", content: [{ type: "text", text: "Tool name + link" }] }],
        },
      ],
    },
    { type: "horizontalRule" },
    {
      type: "heading",
      attrs: { level: 2 },
      content: [{ type: "text", text: "5. Definitions" }],
    },
    {
      type: "bulletList",
      content: [
        {
          type: "listItem",
          content: [
            {
              type: "paragraph",
              content: [
                { type: "text", marks: [{ type: "bold" }], text: "Term: " },
                { type: "text", text: "Definition" },
              ],
            },
          ],
        },
      ],
    },
    { type: "horizontalRule" },
    {
      type: "heading",
      attrs: { level: 2 },
      content: [{ type: "text", text: "6. Procedure" }],
    },
    {
      type: "heading",
      attrs: { level: 3 },
      content: [{ type: "text", text: "6.1 Step One" }],
    },
    {
      type: "orderedList",
      content: [
        {
          type: "listItem",
          content: [{ type: "paragraph", content: [{ type: "text", text: "Sub-step..." }] }],
        },
      ],
    },
    {
      type: "heading",
      attrs: { level: 3 },
      content: [{ type: "text", text: "6.2 Step Two" }],
    },
    {
      type: "orderedList",
      content: [
        {
          type: "listItem",
          content: [{ type: "paragraph", content: [{ type: "text", text: "Sub-step..." }] }],
        },
      ],
    },
  ],
});

export const GLOBAL_VARS_TEMPLATE = JSON.stringify({
  type: "doc",
  content: [
    {
      type: "heading",
      attrs: { level: 1 },
      content: [{ type: "text", text: "Global Variables / System Name" }],
    },
    {
      type: "paragraph",
      content: [
        { type: "text", marks: [{ type: "bold" }], text: "Doc ID: " },
        { type: "text", text: "AUTO-GENERATED" },
      ],
    },
    {
      type: "paragraph",
      content: [
        { type: "text", marks: [{ type: "bold" }], text: "Version: " },
        { type: "text", text: "v1.0" },
      ],
    },
    {
      type: "paragraph",
      content: [
        { type: "text", marks: [{ type: "bold" }], text: "Funnel Stage: " },
        { type: "text", text: "Global – Messaging & Booking" },
      ],
    },
    {
      type: "paragraph",
      content: [
        { type: "text", marks: [{ type: "bold" }], text: "Channel: " },
        { type: "text", text: "Facebook DM" },
      ],
    },
    {
      type: "paragraph",
      content: [
        { type: "text", marks: [{ type: "bold" }], text: "Owner: " },
        { type: "text", text: "Ben Adams" },
      ],
    },
    { type: "horizontalRule" },
    {
      type: "heading",
      attrs: { level: 2 },
      content: [{ type: "text", text: "v1.0 Trojan Horse Copy" }],
    },
    {
      type: "paragraph",
      content: [
        { type: "text", marks: [{ type: "bold" }], text: "Type: " },
        { type: "text", text: "Voicenote / Text" },
      ],
    },
    {
      type: "paragraph",
      content: [{ type: "text", text: "Hey there," }],
    },
    {
      type: "paragraph",
      content: [{ type: "text", text: "Write your message copy here..." }],
    },
    { type: "horizontalRule" },
    {
      type: "heading",
      attrs: { level: 2 },
      content: [{ type: "text", text: "v1.0 Evergreen Accompany Message" }],
    },
    {
      type: "paragraph",
      content: [{ type: "text", text: "Hey {{firstname}}, write your message here..." }],
    },
    { type: "horizontalRule" },
    {
      type: "heading",
      attrs: { level: 2 },
      content: [{ type: "text", text: "v1.0 Engaged VSL Script" }],
    },
    {
      type: "paragraph",
      content: [{ type: "text", text: "Script content here..." }],
    },
    { type: "horizontalRule" },
    {
      type: "heading",
      attrs: { level: 2 },
      content: [{ type: "text", text: "v1.0 Calendly Message Copy" }],
    },
    {
      type: "paragraph",
      content: [{ type: "text", text: "Calendly message copy here..." }],
    },
    { type: "horizontalRule" },
    {
      type: "heading",
      attrs: { level: 2 },
      content: [{ type: "text", text: "Notes / Results" }],
    },
    {
      type: "paragraph",
      content: [{ type: "text", text: "Add notes and results observations here..." }],
    },
  ],
});

export const LEARNINGS_TEMPLATE = JSON.stringify({
  type: "doc",
  content: [
    {
      type: "heading",
      attrs: { level: 1 },
      content: [{ type: "text", text: "Outreach Learnings & Hypotheses (FB)" }],
    },
    {
      type: "paragraph",
      content: [
        { type: "text", marks: [{ type: "italic" }], text: "Single source of truth for learnings and hypotheses" },
      ],
    },
    { type: "horizontalRule" },
    {
      type: "heading",
      attrs: { level: 2 },
      content: [{ type: "text", text: "How to use this document" }],
    },
    {
      type: "orderedList",
      content: [
        {
          type: "listItem",
          content: [{ type: "paragraph", content: [{ type: "text", text: "Capture new ideas immediately in the Inbox section (keep it messy if needed)." }] }],
        },
        {
          type: "listItem",
          content: [{ type: "paragraph", content: [{ type: "text", text: "During your daily/weekly review, move items from Inbox into the correct section and rewrite as one clear line starting with 'Hypothesis:' or 'Learning:'." }] }],
        },
        {
          type: "listItem",
          content: [{ type: "paragraph", content: [{ type: "text", text: "When you run a test, log it in the Experiment log (variable changed, what stayed constant, metric, result)." }] }],
        },
        {
          type: "listItem",
          content: [{ type: "paragraph", content: [{ type: "text", text: "Once a hypothesis is validated or invalidated, update its status and add the key takeaway under Learnings." }] }],
        },
      ],
    },
    { type: "horizontalRule" },
    {
      type: "heading",
      attrs: { level: 2 },
      content: [{ type: "text", text: "Inbox (drop new notes here)" }],
    },
    {
      type: "paragraph",
      content: [{ type: "text", marks: [{ type: "italic" }], text: "Use this section for raw notes. During review, rewrite each into the correct format and move it into the right section." }],
    },
    {
      type: "bulletList",
      content: [
        {
          type: "listItem",
          content: [{ type: "paragraph", content: [{ type: "text", marks: [{ type: "bold" }], text: "Hypothesis: " }] }],
        },
        {
          type: "listItem",
          content: [{ type: "paragraph", content: [{ type: "text", marks: [{ type: "bold" }], text: "Learning: " }] }],
        },
        {
          type: "listItem",
          content: [{ type: "paragraph", content: [{ type: "text", marks: [{ type: "bold" }], text: "Failure mode: " }] }],
        },
      ],
    },
    { type: "horizontalRule" },
    {
      type: "heading",
      attrs: { level: 2 },
      content: [{ type: "text", text: "Setup & Infrastructure" }],
    },
    { type: "paragraph" },
    { type: "horizontalRule" },
    {
      type: "heading",
      attrs: { level: 2 },
      content: [{ type: "text", text: "Messaging & Deliverability" }],
    },
    { type: "paragraph" },
    { type: "horizontalRule" },
    {
      type: "heading",
      attrs: { level: 2 },
      content: [{ type: "text", text: "Lead Gen & Targeting" }],
    },
    { type: "paragraph" },
    { type: "horizontalRule" },
    {
      type: "heading",
      attrs: { level: 2 },
      content: [{ type: "text", text: "Scaling & Ops" }],
    },
    { type: "paragraph" },
    { type: "horizontalRule" },
    {
      type: "heading",
      attrs: { level: 2 },
      content: [{ type: "text", text: "Failure Modes to Watch" }],
    },
    { type: "paragraph" },
    { type: "horizontalRule" },
    {
      type: "heading",
      attrs: { level: 2 },
      content: [{ type: "text", text: "Experiment Log" }],
    },
    {
      type: "paragraph",
      content: [{ type: "text", text: "| Date | Variable Changed | What Stayed Constant | Metric | Result |" }],
    },
    { type: "horizontalRule" },
    {
      type: "heading",
      attrs: { level: 2 },
      content: [{ type: "text", text: "Change Log" }],
    },
    { type: "paragraph" },
  ],
});

export const METRICS_TEMPLATE = JSON.stringify({
  type: "doc",
  content: [
    {
      type: "heading",
      attrs: { level: 1 },
      content: [{ type: "text", text: "Metrics Doc" }],
    },
    { type: "horizontalRule" },
    {
      type: "heading",
      attrs: { level: 2 },
      content: [{ type: "text", text: "Key Metrics" }],
    },
    {
      type: "bulletList",
      content: [
        {
          type: "listItem",
          content: [
            {
              type: "paragraph",
              content: [
                { type: "text", marks: [{ type: "bold" }], text: "Metric Name: " },
                { type: "text", text: "Value / Target" },
              ],
            },
          ],
        },
      ],
    },
    { type: "horizontalRule" },
    {
      type: "heading",
      attrs: { level: 2 },
      content: [{ type: "text", text: "Weekly Tracking" }],
    },
    {
      type: "paragraph",
      content: [{ type: "text", text: "| Week | Metric 1 | Metric 2 | Notes |" }],
    },
  ],
});

export const BLANK_TEMPLATE = JSON.stringify({
  type: "doc",
  content: [{ type: "paragraph" }],
});

export const TEMPLATE_BY_TYPE: Record<string, string> = {
  SOP: SOP_TEMPLATE,
  GLOBAL_VARS: GLOBAL_VARS_TEMPLATE,
  LEARNINGS: LEARNINGS_TEMPLATE,
  METRICS: METRICS_TEMPLATE,
  TEMPLATE_DOC: BLANK_TEMPLATE,
};
