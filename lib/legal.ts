import { readFileSync } from "node:fs";
import path from "node:path";
import { marked } from "marked";

export type LegalDocument = { title: string; html: string };

const LEGAL_DIR = path.join(process.cwd(), "content", "legal");

/**
 * Turns Markdown into HTML at build time. The text is trusted: it is committed
 * to this repository (content/legal), never typed in by a visitor.
 *
 * If the text starts with a level 1 heading, that heading becomes the page
 * title (and is not repeated in the body), so a draft can be copied in as it
 * is. Otherwise the fallback title is used.
 */
export function renderLegalMarkdown(markdown: string, fallbackTitle: string): LegalDocument {
  const tokens = marked.lexer(markdown);
  const first = tokens.find((token) => token.type !== "space");

  if (first?.type === "heading" && first.depth === 1) {
    return {
      title: first.text,
      html: marked.parser(tokens.filter((token) => token !== first)),
    };
  }
  return { title: fallbackTitle, html: marked.parser(tokens) };
}

/** Reads content/legal/<file> and renders it. Runs during `next build`. */
export function readLegalDocument(file: string, fallbackTitle: string): LegalDocument {
  const markdown = readFileSync(path.join(LEGAL_DIR, file), "utf-8");
  return renderLegalMarkdown(markdown, fallbackTitle);
}
