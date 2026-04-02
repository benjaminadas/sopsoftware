type TipTapNode = {
  type?: string;
  text?: string;
  content?: TipTapNode[];
  [key: string]: unknown;
};

export function jsonToText(json: unknown): string {
  if (!json) return "";
  try {
    const parsed: TipTapNode = typeof json === "string" ? JSON.parse(json) : json;
    return extractText(parsed).trim();
  } catch {
    return "";
  }
}

function extractText(node: TipTapNode): string {
  if (node.text) return node.text + " ";
  if (!node.content) return "";
  return node.content.map(extractText).join("");
}

export const EMPTY_DOC = JSON.stringify({
  type: "doc",
  content: [{ type: "paragraph" }],
});
