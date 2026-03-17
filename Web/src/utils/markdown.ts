export interface MarkdownOutlineItem {
  id: string;
  title: string;
  level: number;
}

export interface ParsedMarkdown {
  html: string;
  outline: MarkdownOutlineItem[];
}

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

const escapeAttr = (value: string) => escapeHtml(value).replace(/`/g, "&#96;");

const formatInline = (value: string) => {
  let html = escapeHtml(value);

  html = html.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, (_match, alt: string, src: string) => {
    return `<img src="${escapeAttr(src)}" alt="${escapeAttr(alt)}" />`;
  });

  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_match, text: string, href: string) => {
    return `<a href="${escapeAttr(href)}" target="_blank" rel="noreferrer">${escapeHtml(text)}</a>`;
  });

  html = html.replace(/`([^`]+)`/g, (_match, code: string) => `<code>${escapeHtml(code)}</code>`);
  html = html.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
  html = html.replace(/\*([^*]+)\*/g, "<em>$1</em>");

  return html;
};

export const parseMarkdown = (markdown: string): ParsedMarkdown => {
  const lines = markdown.replace(/\r/g, "").split("\n");
  const html: string[] = [];
  const outline: MarkdownOutlineItem[] = [];
  const paragraphBuffer: string[] = [];
  const listBuffer: string[] = [];
  const codeBuffer: string[] = [];
  let inCodeBlock = false;
  let headingIndex = 0;

  const flushParagraph = () => {
    if (!paragraphBuffer.length) return;
    html.push(`<p>${paragraphBuffer.map((line) => formatInline(line)).join("<br />")}</p>`);
    paragraphBuffer.length = 0;
  };

  const flushList = () => {
    if (!listBuffer.length) return;
    html.push(`<ul>${listBuffer.map((item) => `<li>${formatInline(item)}</li>`).join("")}</ul>`);
    listBuffer.length = 0;
  };

  const flushCode = () => {
    if (!codeBuffer.length) return;
    html.push(`<pre><code>${escapeHtml(codeBuffer.join("\n"))}</code></pre>`);
    codeBuffer.length = 0;
  };

  for (const rawLine of lines) {
    const line = rawLine.trimEnd();

    if (inCodeBlock) {
      if (line.startsWith("```")) {
        flushCode();
        inCodeBlock = false;
      } else {
        codeBuffer.push(rawLine);
      }
      continue;
    }

    if (line.startsWith("```")) {
      flushParagraph();
      flushList();
      inCodeBlock = true;
      continue;
    }

    if (!line.trim()) {
      flushParagraph();
      flushList();
      continue;
    }

    const headingMatch = line.match(/^(#{1,3})\s+(.+)$/);
    if (headingMatch) {
      flushParagraph();
      flushList();
      headingIndex += 1;
      const hashes = headingMatch[1] ?? "";
      const title = (headingMatch[2] ?? "").trim();
      const level = hashes.length;
      const id = `md-heading-${headingIndex}`;
      outline.push({ id, title, level });
      html.push(`<h${level} id="${id}" data-heading-anchor="true">${formatInline(title)}</h${level}>`);
      continue;
    }

    const listMatch = line.match(/^[-*]\s+(.+)$/);
    if (listMatch) {
      flushParagraph();
      listBuffer.push(listMatch[1] ?? "");
      continue;
    }

    paragraphBuffer.push(line);
  }

  flushParagraph();
  flushList();
  if (inCodeBlock) {
    flushCode();
  }

  return {
    html: html.join("\n"),
    outline,
  };
};
