import { describe, expect, it } from "vitest";
import { readLegalDocument, renderLegalMarkdown } from "./legal";

describe("renderLegalMarkdown", () => {
  it("uses a leading level 1 heading as the title and does not repeat it in the body", () => {
    const doc = renderLegalMarkdown("# Integritetspolicy\n\nVi värnar om din integritet.\n", "Reserv");

    expect(doc.title).toBe("Integritetspolicy");
    expect(doc.html).toContain("<p>Vi värnar om din integritet.</p>");
    expect(doc.html).not.toContain("<h1");
  });

  it("uses the fallback title when the text has no leading level 1 heading", () => {
    const doc = renderLegalMarkdown("Utkast – texten publiceras efter juridisk granskning.\n", "Villkor");

    expect(doc.title).toBe("Villkor");
    expect(doc.html).toBe("<p>Utkast – texten publiceras efter juridisk granskning.</p>\n");
  });

  it("keeps a level 1 heading that is not the first thing in the text", () => {
    const doc = renderLegalMarkdown("Inledning.\n\n# Rubrik senare\n", "Villkor");

    expect(doc.title).toBe("Villkor");
    expect(doc.html).toContain("<h1>Rubrik senare</h1>");
  });

  it("renders the Markdown a legal text is made of: headings, lists, tables and links", () => {
    const doc = renderLegalMarkdown(
      [
        "# Villkor",
        "",
        "## 1. Parter",
        "",
        "- Leverantör: Habtu Consulting AB",
        "- Kund: du",
        "",
        "| Post | Belopp |",
        "|------|--------|",
        "| Månadsavgift | 695 kr |",
        "",
        "Se [integritetspolicyn](/integritet).",
      ].join("\n"),
      "Villkor",
    );

    expect(doc.html).toContain("<h2>1. Parter</h2>");
    expect(doc.html).toContain("<li>Leverantör: Habtu Consulting AB</li>");
    expect(doc.html).toContain("<td>695 kr</td>");
    expect(doc.html).toContain('<a href="/integritet">integritetspolicyn</a>');
  });
});

describe("readLegalDocument", () => {
  it.each([
    ["integritetspolicy.md", "Integritetspolicy"],
    ["villkor-webbplats.md", "Villkor"],
  ])("renders content/legal/%s", (file, title) => {
    const doc = readLegalDocument(file, title);

    expect(doc.title.length).toBeGreaterThan(0);
    expect(doc.html.trim().length).toBeGreaterThan(0);
  });
});
