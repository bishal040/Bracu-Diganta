import {
  type BlogPost,
  parseMarkdownFile,
  serializeToMarkdown,
  slugify,
} from '../utils/markdown';

// 1. Eagerly load all .md files bundled at build time for O(1) zero-latency access
const bundledMarkdownModules = import.meta.glob('/src/content/blogs/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>;

const OVERRIDES_STORAGE_KEY = 'diganta_blog_md_overrides_v1';
const DELETED_STORAGE_KEY = 'diganta_blog_md_deleted_v1';
const GITHUB_CONFIG_STORAGE_KEY = 'diganta_github_cms_config_v1';

export interface GitHubCMSConfig {
  owner: string;
  repo: string;
  branch: string;
  token: string;
  remote: string;
  autoCommit: boolean;
  autoPush: boolean;
}

export interface GitOperationResult {
  committed: boolean;
  pushed: boolean;
  branch?: string;
  commitHash?: string;
  commitUrl?: string;
  message: string;
  error?: string | null;
  via?: 'local-git' | 'github-api' | 'local-cache';
}

export interface GitStatusInfo {
  branch: string;
  lastCommit?: {
    hash: string;
    subject: string;
    relativeDate: string;
    author: string;
  };
  pendingFiles: string[];
  isClean: boolean;
  remotes: string[];
  backendConnected: boolean;
  githubApiConfigured: boolean;
}

function getApiBaseUrl(): string {
  const careersUrl = import.meta.env.VITE_CAREERS_API_URL || '';
  if (careersUrl.includes('/api/careers')) {
    return careersUrl.replace('/api/careers', '/api/blogs');
  }
  const contactUrl = import.meta.env.VITE_API_URL || '';
  if (contactUrl.includes('/api/contact')) {
    return contactUrl.replace('/api/contact', '/api/blogs');
  }
  return 'http://localhost:5001/api/blogs';
}

export function getGitHubConfig(): GitHubCMSConfig {
  const defaults: GitHubCMSConfig = {
    owner: import.meta.env.VITE_GITHUB_OWNER || 'bishal040',
    repo: import.meta.env.VITE_GITHUB_REPO || 'Bracu-Diganta',
    branch: import.meta.env.VITE_GITHUB_BRANCH || 'feature/blog',
    token: import.meta.env.VITE_GITHUB_TOKEN || '',
    remote: 'origin',
    autoCommit: true,
    autoPush: true,
  };
  try {
    const raw = localStorage.getItem(GITHUB_CONFIG_STORAGE_KEY);
    if (!raw) return defaults;
    return { ...defaults, ...JSON.parse(raw) };
  } catch {
    return defaults;
  }
}

export function saveGitHubConfig(config: Partial<GitHubCMSConfig>): GitHubCMSConfig {
  const merged = { ...getGitHubConfig(), ...config };
  try {
    localStorage.setItem(GITHUB_CONFIG_STORAGE_KEY, JSON.stringify(merged));
  } catch {
    // ignore storage errors
  }
  return merged;
}

function getLocalOverrides(): Record<string, string> {
  try {
    const raw = localStorage.getItem(OVERRIDES_STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function setLocalOverride(slug: string, rawMarkdown: string) {
  try {
    const overrides = getLocalOverrides();
    overrides[slug] = rawMarkdown;
    localStorage.setItem(OVERRIDES_STORAGE_KEY, JSON.stringify(overrides));

    const deleted = getDeletedSlugs();
    if (deleted.has(slug)) {
      deleted.delete(slug);
      localStorage.setItem(DELETED_STORAGE_KEY, JSON.stringify(Array.from(deleted)));
    }
  } catch {
    // ignore
  }
}

function removeLocalOverride(slug: string) {
  try {
    const overrides = getLocalOverrides();
    delete overrides[slug];
    localStorage.setItem(OVERRIDES_STORAGE_KEY, JSON.stringify(overrides));
  } catch {
    // ignore
  }
}

function getDeletedSlugs(): Set<string> {
  try {
    const raw = localStorage.getItem(DELETED_STORAGE_KEY);
    return new Set(raw ? JSON.parse(raw) : []);
  } catch {
    return new Set();
  }
}

function markSlugDeleted(slug: string) {
  try {
    const deleted = getDeletedSlugs();
    deleted.add(slug);
    localStorage.setItem(DELETED_STORAGE_KEY, JSON.stringify(Array.from(deleted)));
    removeLocalOverride(slug);
  } catch {
    // ignore
  }
}

/**
 * Returns all blog posts synchronously from bundled .md files + instant local overrides (O(1) complexity).
 */
export function getAllBlogsSync(includeDrafts = false): BlogPost[] {
  const postsMap = new Map<string, BlogPost>();
  const deletedSlugs = getDeletedSlugs();

  // 1. Load bundled .md files from src/content/blogs/*.md
  for (const [filePath, rawContent] of Object.entries(bundledMarkdownModules)) {
    const filename = filePath.split('/').pop() || 'post.md';
    const post = parseMarkdownFile(rawContent, filename);
    if (!deletedSlugs.has(post.slug)) {
      postsMap.set(post.slug, post);
    }
  }

  // 2. Apply instant local overrides (newly created or edited .md files)
  const overrides = getLocalOverrides();
  for (const [slug, rawMd] of Object.entries(overrides)) {
    if (!deletedSlugs.has(slug)) {
      const post = parseMarkdownFile(rawMd, `${slug}.md`);
      postsMap.set(post.slug, post);
    }
  }

  const allPosts = Array.from(postsMap.values()).filter((p) =>
    includeDrafts ? true : p.status !== 'DRAFT'
  );

  // Sort: featured first, then newest date first
  allPosts.sort((a, b) => {
    const timeA = new Date(a.date).getTime() || 0;
    const timeB = new Date(b.date).getTime() || 0;
    return timeB - timeA;
  });

  return allPosts;
}

export function getBlogBySlugSync(slug: string): BlogPost | undefined {
  const clean = slugify(slug);
  const all = getAllBlogsSync(true);
  return all.find((p) => p.slug === clean);
}

/**
 * Fetches latest .md files from the backend filesystem (or GitHub API if configured)
 * and syncs local state, returning the fresh list of BlogPost items.
 */
export async function fetchAllBlogs(includeDrafts = false): Promise<BlogPost[]> {
  const apiBase = getApiBaseUrl();
  try {
    const res = await fetch(apiBase, { method: 'GET' });
    if (res.ok) {
      const data = await res.json();
      if (data.success && Array.isArray(data.posts)) {
        const postsMap = new Map<string, BlogPost>();
        for (const item of data.posts) {
          const parsed = parseMarkdownFile(item.rawMarkdown, item.filename);
          parsed.updatedAt = item.updatedAt;
          postsMap.set(parsed.slug, parsed);
          setLocalOverride(parsed.slug, item.rawMarkdown);
        }
        const list = Array.from(postsMap.values()).filter((p) =>
          includeDrafts ? true : p.status !== 'DRAFT'
        );
        list.sort(
          (a, b) =>
            (new Date(b.date).getTime() || 0) - (new Date(a.date).getTime() || 0)
        );
        return list;
      }
    }
  } catch {
    // Fallback to bundled + local override sync
  }

  return getAllBlogsSync(includeDrafts);
}

// Helper for UTF-8 safe base64 encoding
function utf8ToBase64(str: string): string {
  const bytes = new TextEncoder().encode(str);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

function arrayBufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

/**
 * Direct Browser -> GitHub REST API file upsert (commits without terminal or backend).
 */
async function upsertFileOnGitHubApi(params: {
  path: string;
  contentBase64: string;
  message: string;
  config: GitHubCMSConfig;
}): Promise<{ sha: string; commitHash: string; commitUrl: string }> {
  const { path: filePath, contentBase64, message, config } = params;
  const apiUrl = `https://api.github.com/repos/${config.owner}/${config.repo}/contents/${filePath}`;
  const headers: Record<string, string> = {
    Accept: 'application/vnd.github+json',
    Authorization: `Bearer ${config.token}`,
    'Content-Type': 'application/json',
  };

  // Check if file already exists on target branch to get its blob SHA
  let existingSha: string | undefined;
  const getRes = await fetch(
    `${apiUrl}?ref=${encodeURIComponent(config.branch)}`,
    { headers }
  );
  if (getRes.ok) {
    const existingData = await getRes.json();
    existingSha = existingData.sha;
  }

  const body: Record<string, any> = {
    message,
    content: contentBase64,
    branch: config.branch,
  };
  if (existingSha) {
    body.sha = existingSha;
  }

  const putRes = await fetch(apiUrl, {
    method: 'PUT',
    headers,
    body: JSON.stringify(body),
  });

  if (!putRes.ok) {
    const errBody = await putRes.json().catch(() => ({}));
    throw new Error(
      errBody.message || `GitHub API error (${putRes.status}) committing ${filePath}`
    );
  }

  const result = await putRes.json();
  return {
    sha: result.content?.sha || '',
    commitHash: (result.commit?.sha || '').slice(0, 7),
    commitUrl: result.commit?.html_url || '',
  };
}

/**
 * Direct Browser -> GitHub REST API file deletion.
 */
async function deleteFileOnGitHubApi(params: {
  path: string;
  message: string;
  config: GitHubCMSConfig;
}): Promise<{ commitHash: string; commitUrl: string } | null> {
  const { path: filePath, message, config } = params;
  const apiUrl = `https://api.github.com/repos/${config.owner}/${config.repo}/contents/${filePath}`;
  const headers: Record<string, string> = {
    Accept: 'application/vnd.github+json',
    Authorization: `Bearer ${config.token}`,
    'Content-Type': 'application/json',
  };

  const getRes = await fetch(
    `${apiUrl}?ref=${encodeURIComponent(config.branch)}`,
    { headers }
  );
  if (!getRes.ok) {
    return null; // File doesn't exist on remote
  }
  const existingData = await getRes.json();

  const delRes = await fetch(apiUrl, {
    method: 'DELETE',
    headers,
    body: JSON.stringify({
      message,
      sha: existingData.sha,
      branch: config.branch,
    }),
  });

  if (!delRes.ok) {
    const errBody = await delRes.json().catch(() => ({}));
    throw new Error(
      errBody.message || `GitHub API error (${delRes.status}) deleting ${filePath}`
    );
  }

  const result = await delRes.json();
  return {
    commitHash: (result.commit?.sha || '').slice(0, 7),
    commitUrl: result.commit?.html_url || '',
  };
}

/**
 * Saves (Creates or Updates) a BlogPost as a .md file, updates instant cache,
 * writes to disk via backend (if running), and commits to GitHub automatically.
 */
export async function saveBlogPost(params: {
  post: BlogPost;
  oldSlug?: string;
  authToken?: string;
  commitMessage?: string;
  autoCommit?: boolean;
  autoPush?: boolean;
}): Promise<{ post: BlogPost; rawMarkdown: string; git: GitOperationResult }> {
  const { post, oldSlug, authToken, commitMessage } = params;
  const ghConfig = getGitHubConfig();
  const autoCommit = params.autoCommit ?? ghConfig.autoCommit;
  const autoPush = params.autoPush ?? ghConfig.autoPush;

  const cleanSlug = slugify(post.slug || post.title);
  const normalizedPost: BlogPost = {
    ...post,
    slug: cleanSlug,
    updatedAt: new Date().toISOString(),
  };
  const rawMarkdown = serializeToMarkdown(normalizedPost);
  normalizedPost.rawMarkdown = rawMarkdown;

  // 1. Update instant local override cache
  if (oldSlug && oldSlug !== cleanSlug) {
    removeLocalOverride(oldSlug);
  }
  setLocalOverride(cleanSlug, rawMarkdown);

  const defaultCommitMsg =
    commitMessage ||
    (oldSlug
      ? `feat(blog): update "${normalizedPost.title}" (${cleanSlug}.md)`
      : `feat(blog): publish "${normalizedPost.title}" (${cleanSlug}.md)`);

  let gitResult: GitOperationResult = {
    committed: false,
    pushed: false,
    message: `Saved ${cleanSlug}.md`,
    via: 'local-cache',
  };

  // 2. Try writing to local filesystem & executing Git commit via Backend Server
  let backendHandled = false;
  if (authToken) {
    try {
      const apiBase = getApiBaseUrl();
      const res = await fetch(apiBase, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({
          slug: cleanSlug,
          oldSlug,
          rawMarkdown,
          autoCommit,
          autoPush,
          commitMessage: defaultCommitMsg,
          remote: ghConfig.remote || 'origin',
        }),
      });

      if (res.ok) {
        const data = await res.json();
        backendHandled = true;
        if (data.git) {
          gitResult = {
            ...data.git,
            via: 'local-git',
          };
        } else {
          gitResult = {
            committed: false,
            pushed: false,
            message: `Saved ${cleanSlug}.md to project directory`,
            via: 'local-git',
          };
        }
      }
    } catch {
      // Backend not reachable (e.g. static deployment); fall through to direct GitHub API
    }
  }

  // 3. If GitHub API Token is configured (and either backend wasn't used or didn't push), commit directly via GitHub REST API
  if (autoCommit && ghConfig.token && (!backendHandled || !gitResult.pushed)) {
    try {
      const contentB64 = utf8ToBase64(rawMarkdown);
      if (oldSlug && oldSlug !== cleanSlug) {
        await deleteFileOnGitHubApi({
          path: `src/content/blogs/${oldSlug}.md`,
          message: `chore(blog): rename ${oldSlug}.md to ${cleanSlug}.md`,
          config: ghConfig,
        });
        await deleteFileOnGitHubApi({
          path: `public/blogs/posts/${oldSlug}.md`,
          message: `chore(blog): rename ${oldSlug}.md to ${cleanSlug}.md`,
          config: ghConfig,
        });
      }

      const commit1 = await upsertFileOnGitHubApi({
        path: `src/content/blogs/${cleanSlug}.md`,
        contentBase64: contentB64,
        message: defaultCommitMsg,
        config: ghConfig,
      });

      await upsertFileOnGitHubApi({
        path: `public/blogs/posts/${cleanSlug}.md`,
        contentBase64: contentB64,
        message: `${defaultCommitMsg} [public mirror]`,
        config: ghConfig,
      });

      gitResult = {
        committed: true,
        pushed: true,
        branch: ghConfig.branch,
        commitHash: commit1.commitHash,
        commitUrl: commit1.commitUrl,
        message: `Committed & pushed ${cleanSlug}.md to GitHub (${ghConfig.owner}/${ghConfig.repo}@${ghConfig.branch} • ${commit1.commitHash})`,
        via: 'github-api',
      };
    } catch (ghErr: any) {
      if (!backendHandled) {
        gitResult.error = ghErr.message || 'GitHub API commit failed';
      }
    }
  }

  return { post: normalizedPost, rawMarkdown, git: gitResult };
}

/**
 * Deletes a blog .md file from cache, filesystem, and GitHub.
 */
export async function deleteBlogPost(params: {
  slug: string;
  authToken?: string;
  commitMessage?: string;
  autoCommit?: boolean;
  autoPush?: boolean;
}): Promise<{ git: GitOperationResult }> {
  const { slug, authToken, commitMessage } = params;
  const cleanSlug = slugify(slug);
  const ghConfig = getGitHubConfig();
  const autoCommit = params.autoCommit ?? ghConfig.autoCommit;
  const autoPush = params.autoPush ?? ghConfig.autoPush;

  markSlugDeleted(cleanSlug);

  const defaultCommitMsg =
    commitMessage || `chore(blog): delete ${cleanSlug}.md via Admin Panel`;

  let gitResult: GitOperationResult = {
    committed: false,
    pushed: false,
    message: `Deleted ${cleanSlug}.md`,
    via: 'local-cache',
  };

  let backendHandled = false;
  if (authToken) {
    try {
      const apiBase = getApiBaseUrl();
      const res = await fetch(`${apiBase}/${cleanSlug}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({
          autoCommit,
          autoPush,
          commitMessage: defaultCommitMsg,
          remote: ghConfig.remote || 'origin',
        }),
      });
      if (res.ok) {
        const data = await res.json();
        backendHandled = true;
        if (data.git) {
          gitResult = { ...data.git, via: 'local-git' };
        }
      }
    } catch {
      // Fall through to GitHub API
    }
  }

  if (autoCommit && ghConfig.token && (!backendHandled || !gitResult.pushed)) {
    try {
      const del1 = await deleteFileOnGitHubApi({
        path: `src/content/blogs/${cleanSlug}.md`,
        message: defaultCommitMsg,
        config: ghConfig,
      });
      await deleteFileOnGitHubApi({
        path: `public/blogs/posts/${cleanSlug}.md`,
        message: defaultCommitMsg,
        config: ghConfig,
      });

      if (del1) {
        gitResult = {
          committed: true,
          pushed: true,
          branch: ghConfig.branch,
          commitHash: del1.commitHash,
          commitUrl: del1.commitUrl,
          message: `Deleted ${cleanSlug}.md from GitHub (${del1.commitHash})`,
          via: 'github-api',
        };
      }
    } catch (ghErr: any) {
      if (!backendHandled) {
        gitResult.error = ghErr.message;
      }
    }
  }

  return { git: gitResult };
}

/**
 * Uploads an image for a blog post and stores it in public/blogs/images/
 * (via local backend and/or direct GitHub API commit), returning the image URL.
 */
export async function uploadBlogImage(params: {
  file: File;
  authToken?: string;
  autoCommit?: boolean;
  autoPush?: boolean;
}): Promise<{ url: string; filename: string; git?: GitOperationResult }> {
  const { file, authToken } = params;
  const ghConfig = getGitHubConfig();
  const autoCommit = params.autoCommit ?? ghConfig.autoCommit;
  const autoPush = params.autoPush ?? ghConfig.autoPush;

  // 1. Try uploading via Backend Server (/api/blogs/upload-image)
  if (authToken) {
    try {
      const formData = new FormData();
      formData.append('image', file);
      formData.append('autoCommit', String(autoCommit));
      formData.append('autoPush', String(autoPush));

      const apiBase = getApiBaseUrl();
      const res = await fetch(`${apiBase}/upload-image`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();
        return {
          url: data.url,
          filename: data.filename,
          git: data.git,
        };
      }
    } catch {
      // Fall through to GitHub API or Data URL
    }
  }

  // 2. If GitHub API token is set, commit image directly to public/blogs/images/ on GitHub
  if (ghConfig.token) {
    const ext = (file.name.split('.').pop() || 'jpg').toLowerCase();
    const cleanBase = file.name
      .replace(/\.[^.]+$/, '')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 40) || 'image';
    const filename = `${Date.now()}-${cleanBase}.${ext}`;
    const buffer = await file.arrayBuffer();
    const base64 = arrayBufferToBase64(buffer);

    const commitRes = await upsertFileOnGitHubApi({
      path: `public/blogs/images/${filename}`,
      contentBase64: base64,
      message: `feat(blog): upload image ${filename}`,
      config: ghConfig,
    });

    const rawUrl = `https://raw.githubusercontent.com/${ghConfig.owner}/${ghConfig.repo}/${ghConfig.branch}/public/blogs/images/${filename}`;
    return {
      url: rawUrl,
      filename,
      git: {
        committed: true,
        pushed: true,
        branch: ghConfig.branch,
        commitHash: commitRes.commitHash,
        commitUrl: commitRes.commitUrl,
        message: `Uploaded & committed ${filename} to GitHub (${commitRes.commitHash})`,
        via: 'github-api',
      },
    };
  }

  // 3. Fallback: convert to optimized Data URL so image upload works even offline without a server
  const dataUrl = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error('Failed to read image file'));
    reader.readAsDataURL(file);
  });

  return {
    url: dataUrl,
    filename: file.name,
  };
}

/**
 * Fetches Git status from backend or GitHub API.
 */
export async function fetchGitStatus(authToken?: string): Promise<GitStatusInfo> {
  const ghConfig = getGitHubConfig();
  if (authToken) {
    try {
      const apiBase = getApiBaseUrl();
      const res = await fetch(`${apiBase}/git-status`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          return {
            branch: data.branch || ghConfig.branch,
            lastCommit: data.lastCommit,
            pendingFiles: data.pendingFiles || [],
            isClean: Boolean(data.isClean),
            remotes: data.remotes || [],
            backendConnected: true,
            githubApiConfigured: Boolean(ghConfig.token),
          };
        }
      }
    } catch {
      // Backend offline
    }
  }

  return {
    branch: ghConfig.branch,
    pendingFiles: [],
    isClean: true,
    remotes: [`${ghConfig.owner}/${ghConfig.repo}`],
    backendConnected: false,
    githubApiConfigured: Boolean(ghConfig.token),
  };
}

/**
 * Triggers a manual Git Commit & Push of all blog .md files and images from the Admin Panel.
 */
export async function triggerGitSync(params: {
  authToken?: string;
  commitMessage?: string;
  push?: boolean;
}): Promise<GitOperationResult> {
  const { authToken, commitMessage, push = true } = params;
  const ghConfig = getGitHubConfig();

  if (authToken) {
    try {
      const apiBase = getApiBaseUrl();
      const res = await fetch(`${apiBase}/git-sync`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({
          commitMessage:
            commitMessage ||
            'chore(blog): sync blog markdown files & assets from Admin Panel',
          push,
          remote: ghConfig.remote || 'origin',
          branch: ghConfig.branch || undefined,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.git) {
          return { ...data.git, via: 'local-git' };
        }
      }
    } catch {
      // Fall through to GitHub API sync
    }
  }

  // If GitHub PAT is configured, push all local overrides to GitHub API
  if (ghConfig.token) {
    const overrides = getLocalOverrides();
    const entries = Object.entries(overrides);
    if (entries.length === 0) {
      return {
        committed: false,
        pushed: true,
        branch: ghConfig.branch,
        message: `All blog .md files are already synced with ${ghConfig.owner}/${ghConfig.repo}@${ghConfig.branch}`,
        via: 'github-api',
      };
    }

    let lastCommitHash = '';
    let lastCommitUrl = '';
    for (const [slug, rawMd] of entries) {
      const b64 = utf8ToBase64(rawMd);
      const c = await upsertFileOnGitHubApi({
        path: `src/content/blogs/${slug}.md`,
        contentBase64: b64,
        message: commitMessage || `chore(blog): sync ${slug}.md from Admin Panel`,
        config: ghConfig,
      });
      await upsertFileOnGitHubApi({
        path: `public/blogs/posts/${slug}.md`,
        contentBase64: b64,
        message: commitMessage || `chore(blog): sync ${slug}.md from Admin Panel`,
        config: ghConfig,
      });
      lastCommitHash = c.commitHash;
      lastCommitUrl = c.commitUrl;
    }

    return {
      committed: true,
      pushed: true,
      branch: ghConfig.branch,
      commitHash: lastCommitHash,
      commitUrl: lastCommitUrl,
      message: `Synced ${entries.length} .md file(s) to GitHub (${ghConfig.owner}/${ghConfig.repo}@${ghConfig.branch} • ${lastCommitHash})`,
      via: 'github-api',
    };
  }

  return {
    committed: false,
    pushed: false,
    error:
      'Neither local backend server is running nor GitHub Personal Access Token is configured. Configure GitHub Token in Blog Manager -> GitHub Settings or start the backend server.',
    message: 'Sync requires local backend or GitHub Token',
  };
}
