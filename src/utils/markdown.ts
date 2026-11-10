export interface BlogSpec {
  label: string;
  value: string;
}

export interface BlogPost {
  slug: string;
  title: string;
  subtitle?: string;
  excerpt: string;
  date: string;
  author: string;
  authorRole?: string;
  category: string;
  tags: string[];
  coverImage: string;
  readTime: string;
  featured?: boolean;
  recordId?: string;
  status: 'PUBLISHED' | 'DRAFT';
  specs?: BlogSpec[];
  gallery?: string[];
  content: string;
  rawMarkdown?: string;
  updatedAt?: string;
}

export const DEFAULT_COVER_IMAGE =
  'https://i.ibb.co.com/W42n1dsP/Whats-App-Image-2026-06-17-at-01-47-48-2.jpg';

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/\.md$/i, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '') || `post-${Date.now()}`;
}

export function calculateReadTime(content: string): string {
  const words = content
    .replace(/[#*`>_~\-[\]()!]/g, ' ')
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;
  const minutes = Math.max(1, Math.ceil(words / 180));
  return `${minutes} MIN READ`;
}

export function formatDisplayDate(dateStr: string): string {
  if (!dateStr) return 'AUGUST 2026';
  const parsed = new Date(dateStr);
  if (isNaN(parsed.getTime())) {
    return dateStr.toUpperCase();
  }
  return parsed
    .toLocaleDateString('en-US', {
      month: 'long',
      day: '2-digit',
      year: 'numeric',
    })
    .toUpperCase();
}

function unquote(val: string): string {
  const trimmed = val.trim();
  if (
    (trimmed.startsWith('"') && trimmed.endsWith('"')) ||
    (trimmed.startsWith("'") && trimmed.endsWith("'"))
  ) {
    return trimmed
      .slice(1, -1)
      .replace(/\\"/g, '"')
      .replace(/\\n/g, '\n');
  }
  return trimmed;
}

/**
 * Parses a Markdown (.md) string with optional YAML frontmatter into a BlogPost object.
 * Works both with structured frontmatter and plain markdown files uploaded directly.
 */
export function parseMarkdownFile(rawMd: string, fallbackFilename?: string): BlogPost {
  const normalized = rawMd.replace(/\r\n/g, '\n');
  const fmRegex = /^---\n([\s\S]*?)\n---\n?([\s\S]*)$/;
  const match = normalized.match(fmRegex);

  const meta: Record<string, any> = {};
  let body = normalized;

  if (match) {
    const yamlBlock = match[1];
    body = match[2].trim();

    const lines = yamlBlock.split('\n');
    let currentKey: string | null = null;
    let currentList: any[] | null = null;
    let currentSpecObj: Record<string, string> | null = null;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      if (!line.trim() || line.trim().startsWith('#')) continue;

      // Check for indented list item
      if (/^\s*-\s+/.test(line) && currentKey) {
        const itemContent = line.replace(/^\s*-\s+/, '').trim();
        if (itemContent.includes(':')) {
          const colonIdx = itemContent.indexOf(':');
          const k = itemContent.slice(0, colonIdx).trim();
          const v = unquote(itemContent.slice(colonIdx + 1));
          currentSpecObj = { [k]: v };
          if (!currentList) currentList = [];
          currentList.push(currentSpecObj);
          meta[currentKey] = currentList;
        } else {
          currentSpecObj = null;
          if (!currentList) currentList = [];
          currentList.push(unquote(itemContent));
          meta[currentKey] = currentList;
        }
        continue;
      }

      // Check for continuation property of a list object (e.g. "    value: ...")
      if (/^\s+\w+\s*:/.test(line) && currentSpecObj) {
        const trimmedLine = line.trim();
        const colonIdx = trimmedLine.indexOf(':');
        const k = trimmedLine.slice(0, colonIdx).trim();
        const v = unquote(trimmedLine.slice(colonIdx + 1));
        currentSpecObj[k] = v;
        continue;
      }

      // Top-level key: value
      const topMatch = line.match(/^([a-zA-Z0-9_]+)\s*:\s*(.*)$/);
      if (topMatch) {
        currentKey = topMatch[1].trim();
        const rawVal = topMatch[2].trim();
        currentList = null;
        currentSpecObj = null;

        if (!rawVal) {
          // Next lines might be a YAML array
          currentList = [];
          meta[currentKey] = currentList;
        } else if (rawVal.startsWith('[') && rawVal.endsWith(']')) {
          const inner = rawVal.slice(1, -1).trim();
          meta[currentKey] = inner
            ? inner.split(',').map((s) => unquote(s))
            : [];
        } else if (rawVal === 'true') {
          meta[currentKey] = true;
        } else if (rawVal === 'false') {
          meta[currentKey] = false;
        } else {
          meta[currentKey] = unquote(rawVal);
        }
      }
    }
  }

  // Fallback extraction for plain .md files without frontmatter
  let extractedTitle = meta.title || '';
  if (!extractedTitle) {
    const h1Match = body.match(/^#\s+(.+)$/m);
    if (h1Match) {
      extractedTitle = h1Match[1].trim();
      // Remove the top H1 from body if it was at the very start
      body = body.replace(/^#\s+.+\n*/, '').trim();
    } else if (fallbackFilename) {
      extractedTitle = fallbackFilename
        .replace(/\.md$/i, '')
        .replace(/[-_]+/g, ' ')
        .replace(/\b\w/g, (c) => c.toUpperCase());
    } else {
      extractedTitle = 'Untitled Mission Log';
    }
  }

  let extractedExcerpt = meta.excerpt || '';
  if (!extractedExcerpt) {
    const paragraphs = body
      .split(/\n{2,}/)
      .map((p) => p.trim())
      .filter(
        (p) =>
          p &&
          !p.startsWith('#') &&
          !p.startsWith('!') &&
          !p.startsWith('>') &&
          !p.startsWith('```') &&
          !p.startsWith('-')
      );
    if (paragraphs.length > 0) {
      const cleanPara = paragraphs[0]
        .replace(/[*_`~]/g, '')
        .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1');
      extractedExcerpt =
        cleanPara.length > 200 ? cleanPara.slice(0, 197) + '...' : cleanPara;
    } else {
      extractedExcerpt = 'Technical mission log and aerospace engineering update from BRACU Diganta.';
    }
  }

  let extractedCover = meta.coverImage || '';
  if (!extractedCover) {
    const imgMatch = body.match(/!\[[^\]]*\]\(([^)]+)\)/);
    extractedCover = imgMatch ? imgMatch[1].trim() : DEFAULT_COVER_IMAGE;
  }

  const slug = meta.slug
    ? slugify(String(meta.slug))
    : fallbackFilename
    ? slugify(fallbackFilename)
    : slugify(extractedTitle);

  const tags: string[] = Array.isArray(meta.tags)
    ? meta.tags.map(String)
    : typeof meta.tags === 'string' && meta.tags
    ? meta.tags.split(',').map((t: string) => t.trim()).filter(Boolean)
    : ['Aerospace', 'Engineering', 'Diganta'];

  const specs: BlogSpec[] = Array.isArray(meta.specs)
    ? meta.specs
        .filter((s: any) => s && (s.label || s.value))
        .map((s: any) => ({
          label: String(s.label || 'Parameter'),
          value: String(s.value || 'Nominal'),
        }))
    : [
        { label: 'Division', value: String(meta.category || 'Aerospace R&D') },
        { label: 'Telemetry Status', value: 'VERIFIED' },
      ];

  const gallery: string[] = Array.isArray(meta.gallery)
    ? meta.gallery.map(String).filter(Boolean)
    : [];

  const post: BlogPost = {
    slug,
    title: extractedTitle,
    subtitle: meta.subtitle ? String(meta.subtitle) : undefined,
    excerpt: extractedExcerpt,
    date: meta.date ? String(meta.date) : new Date().toISOString().split('T')[0],
    author: meta.author ? String(meta.author) : 'BRACU Diganta Engineering',
    authorRole: meta.authorRole ? String(meta.authorRole) : 'Mission Systems Division',
    category: meta.category ? String(meta.category) : 'Mission Engineering',
    tags,
    coverImage: extractedCover,
    readTime: meta.readTime ? String(meta.readTime) : calculateReadTime(body),
    featured: Boolean(meta.featured),
    recordId: meta.recordId
      ? String(meta.recordId)
      : `LOG-${slug.slice(0, 6).toUpperCase()}`,
    status: meta.status === 'DRAFT' ? 'DRAFT' : 'PUBLISHED',
    specs,
    gallery,
    content: body,
    updatedAt: meta.updatedAt ? String(meta.updatedAt) : undefined,
  };

  post.rawMarkdown = serializeToMarkdown(post);
  return post;
}

function escapeYaml(str: string): string {
  return `"${String(str || '').replace(/\\/g, '\\\\').replace(/"/g, '\\"')}"`;
}

/**
 * Serializes a BlogPost object into a complete .md file string with YAML frontmatter.
 */
export function serializeToMarkdown(post: BlogPost): string {
  const lines: string[] = ['---'];
  lines.push(`title: ${escapeYaml(post.title)}`);
  lines.push(`slug: ${escapeYaml(post.slug)}`);
  if (post.subtitle) {
    lines.push(`subtitle: ${escapeYaml(post.subtitle)}`);
  }
  lines.push(`excerpt: ${escapeYaml(post.excerpt)}`);
  lines.push(`date: ${escapeYaml(post.date)}`);
  lines.push(`author: ${escapeYaml(post.author)}`);
  if (post.authorRole) {
    lines.push(`authorRole: ${escapeYaml(post.authorRole)}`);
  }
  lines.push(`category: ${escapeYaml(post.category)}`);
  lines.push(
    `tags: [${(post.tags || []).map((t) => escapeYaml(t)).join(', ')}]`
  );
  lines.push(`coverImage: ${escapeYaml(post.coverImage)}`);
  lines.push(`readTime: ${escapeYaml(post.readTime || calculateReadTime(post.content))}`);
  lines.push(`featured: ${post.featured ? 'true' : 'false'}`);
  lines.push(`recordId: ${escapeYaml(post.recordId || `LOG-${post.slug.slice(0, 6).toUpperCase()}`)}`);
  lines.push(`status: ${escapeYaml(post.status || 'PUBLISHED')}`);

  if (post.specs && post.specs.length > 0) {
    lines.push('specs:');
    for (const spec of post.specs) {
      if (spec.label || spec.value) {
        lines.push(`  - label: ${escapeYaml(spec.label)}`);
        lines.push(`    value: ${escapeYaml(spec.value)}`);
      }
    }
  }

  if (post.gallery && post.gallery.length > 0) {
    lines.push('gallery:');
    for (const img of post.gallery) {
      if (img) {
        lines.push(`  - ${escapeYaml(img)}`);
      }
    }
  }

  lines.push('---');
  lines.push('');
  lines.push((post.content || '').trim());
  lines.push('');

  return lines.join('\n');
}

export interface HeadingItem {
  id: string;
  text: string;
  level: number;
}

export function extractHeadings(markdown: string): HeadingItem[] {
  const headings: HeadingItem[] = [];
  const lines = markdown.split('\n');
  let inCodeBlock = false;

  for (const line of lines) {
    if (line.trim().startsWith('```')) {
      inCodeBlock = !inCodeBlock;
      continue;
    }
    if (inCodeBlock) continue;

    const match = line.match(/^(#{2,3})\s+(.+)$/);
    if (match) {
      const level = match[1].length;
      const text = match[2].replace(/[*_`~]/g, '').trim();
      const id = slugify(text);
      headings.push({ id, text, level });
    }
  }
  return headings;
}
