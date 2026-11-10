import React, { useState } from 'react';
import { Check, Copy, Terminal } from 'lucide-react';
import { slugify } from '../../utils/markdown';

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

function renderInline(text: string): React.ReactNode[] {
  // Tokenize inline markdown: inline code, images, links, bold, italic
  const tokens: React.ReactNode[] = [];
  let remaining = text;
  let keyIdx = 0;

  const combinedRegex =
    /(`[^`]+`)|(!\[([^\]]*)\]\(([^)]+)\))|(\[([^\]]+)\]\(([^)]+)\))|(\*\*([^*]+)\*\*)|(\*([^*]+)\*)/;

  while (remaining.length > 0) {
    const match = remaining.match(combinedRegex);
    if (!match || match.index === undefined) {
      tokens.push(remaining);
      break;
    }

    if (match.index > 0) {
      tokens.push(remaining.slice(0, match.index));
    }

    const fullMatch = match[0];

    if (match[1]) {
      // Inline code `code`
      const codeText = match[1].slice(1, -1);
      tokens.push(
        <code
          key={`code-${keyIdx++}`}
          className="font-mono text-[0.85em] bg-blue-50/90 text-blue-700 border border-blue-200/70 px-2 py-0.5 rounded-md font-semibold"
        >
          {codeText}
        </code>
      );
    } else if (match[2]) {
      // Inline image ![alt](src)
      const alt = match[3] || '';
      const src = match[4] || '';
      tokens.push(
        <img
          key={`img-${keyIdx++}`}
          src={src}
          alt={alt}
          className="inline-block rounded-2xl max-h-96 object-cover my-4 shadow-lg"
        />
      );
    } else if (match[5]) {
      // Link [label](url)
      const label = match[6];
      const url = match[7];
      tokens.push(
        <a
          key={`link-${keyIdx++}`}
          href={url}
          target={url.startsWith('http') ? '_blank' : undefined}
          rel={url.startsWith('http') ? 'noopener noreferrer' : undefined}
          className="text-blue-600 hover:text-blue-800 underline decoration-blue-400/60 underline-offset-4 font-semibold transition-colors"
        >
          {label}
        </a>
      );
    } else if (match[8]) {
      // Bold **text**
      tokens.push(
        <strong key={`bold-${keyIdx++}`} className="font-bold text-slate-900">
          {match[9]}
        </strong>
      );
    } else if (match[10]) {
      // Italic *text*
      tokens.push(
        <em key={`em-${keyIdx++}`} className="italic text-slate-800">
          {match[11]}
        </em>
      );
    }

    remaining = remaining.slice(match.index + fullMatch.length);
  }

  return tokens;
}

const CodeBlock: React.FC<{ language: string; code: string }> = ({
  language,
  code,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="my-8 rounded-2xl overflow-hidden bg-slate-900 border border-slate-800 shadow-[0_15px_35px_rgba(15,23,42,0.18)]">
      <div className="flex items-center justify-between px-5 py-3 bg-slate-950/70 border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="flex gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
          </div>
          <span className="ml-2 font-mono text-[10px] tracking-[0.2em] uppercase text-blue-400 font-bold flex items-center gap-1.5">
            <Terminal size={12} />
            {language || 'TELEMETRY.SRC'}
          </span>
        </div>
        <button
          type="button"
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-mono text-[10px] uppercase tracking-wider transition-colors"
        >
          {copied ? (
            <>
              <Check size={12} className="text-emerald-400" /> Copied
            </>
          ) : (
            <>
              <Copy size={12} /> Copy
            </>
          )}
        </button>
      </div>
      <pre className="p-5 overflow-x-auto font-mono text-xs md:text-sm leading-relaxed text-slate-200">
        <code>{code}</code>
      </pre>
    </div>
  );
};

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({
  content,
  className = '',
}) => {
  const lines = (content || '').replace(/\r\n/g, '\n').split('\n');
  const elements: React.ReactNode[] = [];

  let i = 0;
  let blockKey = 0;

  while (i < lines.length) {
    const line = lines[i];
    const trimmed = line.trim();

    if (!trimmed) {
      i++;
      continue;
    }

    // 1. Fenced Code Block ```
    if (trimmed.startsWith('```')) {
      const lang = trimmed.slice(3).trim();
      const codeLines: string[] = [];
      i++;
      while (i < lines.length && !lines[i].trim().startsWith('```')) {
        codeLines.push(lines[i]);
        i++;
      }
      i++; // skip closing ```
      elements.push(
        <CodeBlock
          key={`cb-${blockKey++}`}
          language={lang}
          code={codeLines.join('\n')}
        />
      );
      continue;
    }

    // 2. Horizontal Rule
    if (/^(-{3,}|\*{3,}|_{3,})$/.test(trimmed)) {
      elements.push(
        <hr
          key={`hr-${blockKey++}`}
          className="my-10 border-t border-slate-200"
        />
      );
      i++;
      continue;
    }

    // 3. Headings (#, ##, ###, ####)
    const headingMatch = trimmed.match(/^(#{1,4})\s+(.+)$/);
    if (headingMatch) {
      const level = headingMatch[1].length;
      const text = headingMatch[2].trim();
      const id = slugify(text.replace(/[*_`~]/g, ''));

      if (level === 1) {
        elements.push(
          <h2
            id={id}
            key={`h1-${blockKey++}`}
            className="font-orbitron text-3xl md:text-4xl font-black uppercase text-slate-900 tracking-tight mt-12 mb-6 scroll-mt-28"
          >
            {renderInline(text)}
          </h2>
        );
      } else if (level === 2) {
        elements.push(
          <div key={`h2-${blockKey++}`} id={id} className="mt-12 mb-6 scroll-mt-28">
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2 h-2 bg-blue-600 rounded-sm" />
              <span className="w-1.5 h-1.5 bg-cyan-400 rounded-sm" />
            </div>
            <h2 className="font-orbitron text-2xl md:text-3xl font-bold uppercase text-slate-900 tracking-tight">
              {renderInline(text)}
            </h2>
          </div>
        );
      } else {
        elements.push(
          <h3
            id={id}
            key={`h3-${blockKey++}`}
            className="font-orbitron text-lg md:text-xl font-bold uppercase text-slate-800 tracking-wide mt-8 mb-4 scroll-mt-28"
          >
            {renderInline(text)}
          </h3>
        );
      }
      i++;
      continue;
    }

    // 4. Standalone Image ![Caption](url)
    const imgMatch = trimmed.match(/^!\[([^\]]*)\]\(([^)]+)\)$/);
    if (imgMatch) {
      const caption = imgMatch[1].trim();
      const src = imgMatch[2].trim();
      elements.push(
        <figure
          key={`fig-${blockKey++}`}
          className="my-10 rounded-3xl overflow-hidden shadow-[0_20px_50px_rgba(15,23,42,0.1)] relative group border border-slate-200/80 bg-slate-900"
        >
          <div className="max-h-[480px] overflow-hidden relative">
            <img
              src={src}
              alt={caption || 'Mission visual'}
              className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/50 via-transparent to-transparent opacity-60 group-hover:opacity-30 transition-opacity duration-500" />
          </div>
          {caption && (
            <figcaption className="px-6 py-3.5 bg-white border-t border-slate-100 flex items-center justify-between">
              <span className="font-mono text-xs text-slate-600 font-semibold tracking-wider uppercase">
                {caption}
              </span>
              <span className="font-mono text-[10px] text-blue-600 uppercase tracking-widest font-bold">
                FIG // VISUAL LOG
              </span>
            </figcaption>
          )}
        </figure>
      );
      i++;
      continue;
    }

    // 5. Blockquote >
    if (trimmed.startsWith('>')) {
      const quoteLines: string[] = [];
      while (i < lines.length && lines[i].trim().startsWith('>')) {
        quoteLines.push(lines[i].trim().replace(/^>\s?/, ''));
        i++;
      }
      const fullQuote = quoteLines.join(' ');
      // Separate optional attribution (e.g., "— Author")
      const dashSplit = fullQuote.split(/\s+—\s+/);
      const quoteBody = dashSplit[0].replace(/^"|"$/g, '');
      const quoteAuthor = dashSplit[1];

      elements.push(
        <div
          key={`quote-${blockKey++}`}
          className="my-10 p-8 bg-white border border-slate-200 rounded-3xl relative overflow-hidden shadow-[0_10px_40px_rgba(0,0,0,0.04)]"
        >
          <div className="absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b from-blue-600 to-cyan-500" />
          <p className="font-mono text-sm md:text-base text-slate-700 italic leading-relaxed font-medium">
            "{renderInline(quoteBody)}"
          </p>
          {quoteAuthor && (
            <span className="block mt-4 font-bold text-blue-700 text-xs font-mono uppercase tracking-[0.2em]">
              — {quoteAuthor}
            </span>
          )}
        </div>
      );
      continue;
    }

    // 6. Unordered List (- or *)
    if (/^[-*]\s+/.test(trimmed)) {
      const items: string[] = [];
      while (i < lines.length && /^[-*]\s+/.test(lines[i].trim())) {
        items.push(lines[i].trim().replace(/^[-*]\s+/, ''));
        i++;
      }
      elements.push(
        <ul key={`ul-${blockKey++}`} className="my-6 space-y-3">
          {items.map((item, idx) => (
            <li
              key={idx}
              className="flex items-start gap-3.5 text-slate-600 text-base md:text-lg leading-relaxed"
            >
              <span className="mt-2.5 w-2 h-2 rounded-full bg-blue-600 shrink-0 shadow-[0_0_8px_rgba(37,99,235,0.4)]" />
              <span>{renderInline(item)}</span>
            </li>
          ))}
        </ul>
      );
      continue;
    }

    // 7. Ordered List (1. 2. ...)
    if (/^\d+\.\s+/.test(trimmed)) {
      const items: string[] = [];
      while (i < lines.length && /^\d+\.\s+/.test(lines[i].trim())) {
        items.push(lines[i].trim().replace(/^\d+\.\s+/, ''));
        i++;
      }
      elements.push(
        <ol key={`ol-${blockKey++}`} className="my-6 space-y-4">
          {items.map((item, idx) => (
            <li
              key={idx}
              className="flex items-start gap-4 text-slate-600 text-base md:text-lg leading-relaxed bg-white/80 border border-slate-200/70 rounded-2xl p-4 shadow-sm"
            >
              <span className="font-orbitron font-black text-xs text-blue-600 bg-blue-50 border border-blue-200 rounded-lg px-2.5 py-1 shrink-0 mt-0.5">
                0{idx + 1}
              </span>
              <span className="flex-1">{renderInline(item)}</span>
            </li>
          ))}
        </ol>
      );
      continue;
    }

    // 8. Markdown Table (| ... |)
    if (trimmed.startsWith('|') && trimmed.endsWith('|')) {
      const tableLines: string[] = [];
      while (
        i < lines.length &&
        lines[i].trim().startsWith('|') &&
        lines[i].trim().endsWith('|')
      ) {
        tableLines.push(lines[i].trim());
        i++;
      }
      if (tableLines.length >= 2) {
        const parseRow = (r: string) =>
          r
            .slice(1, -1)
            .split('|')
            .map((c) => c.trim());
        const headers = parseRow(tableLines[0]);
        const dataRows = tableLines
          .slice(1)
          .filter((r) => !/^\|[\s\-:|]+\|$/.test(r))
          .map(parseRow);

        elements.push(
          <div
            key={`tbl-${blockKey++}`}
            className="my-8 overflow-x-auto bg-white rounded-2xl border border-slate-200 shadow-sm"
          >
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  {headers.map((h, hIdx) => (
                    <th
                      key={hIdx}
                      className="px-5 py-3.5 font-mono text-xs uppercase tracking-wider text-slate-700 font-bold"
                    >
                      {renderInline(h)}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {dataRows.map((row, rIdx) => (
                  <tr
                    key={rIdx}
                    className="border-b border-slate-100 last:border-0 hover:bg-blue-50/30 transition-colors"
                  >
                    {row.map((cell, cIdx) => (
                      <td
                        key={cIdx}
                        className="px-5 py-3.5 text-sm text-slate-600"
                      >
                        {renderInline(cell)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
        continue;
      }
    }

    // 9. Standard Paragraph
    const paraLines: string[] = [];
    while (
      i < lines.length &&
      lines[i].trim() !== '' &&
      !lines[i].trim().startsWith('#') &&
      !lines[i].trim().startsWith('```') &&
      !lines[i].trim().startsWith('>') &&
      !/^[-*]\s+/.test(lines[i].trim()) &&
      !/^\d+\.\s+/.test(lines[i].trim()) &&
      !/^!\[([^\]]*)\]\(([^)]+)\)$/.test(lines[i].trim())
    ) {
      paraLines.push(lines[i].trim());
      i++;
    }

    const paraText = paraLines.join(' ');
    elements.push(
      <p
        key={`p-${blockKey++}`}
        className="text-slate-600 text-base md:text-lg leading-relaxed mb-6 font-normal"
      >
        {renderInline(paraText)}
      </p>
    );
  }

  return <div className={`markdown-body ${className}`}>{elements}</div>;
};
