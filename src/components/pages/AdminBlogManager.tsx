import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  Plus,
  Upload,
  Trash2,
  Edit3,
  ExternalLink,
  GitBranch,
  GitCommit,
  CloudUpload,
  CheckCircle2,
  AlertCircle,
  FileCode2,
  Image as ImageIcon,
  Download,
  Eye,
  Code2,
  Columns,
  Sparkles,
  Settings,
  X,
  Search,
  Bold,
  Italic,
  Heading2,
  Heading3,
  Quote,
  List,
  Link as LinkIcon,
  Terminal,
  RefreshCw,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../ui/ToastProvider';
import {
  type BlogPost,
  type BlogSpec,
  DEFAULT_COVER_IMAGE,
  calculateReadTime,
  formatDisplayDate,
  parseMarkdownFile,
  serializeToMarkdown,
  slugify,
} from '../../utils/markdown';
import {
  type GitHubCMSConfig,
  type GitStatusInfo,
  BUILTIN_BLOG_IMAGES,
  deleteBlogPost,
  fetchAllBlogs,
  fetchGitStatus,
  fetchStoredBlogImages,
  getAllBlogsSync,
  getGitHubConfig,
  resolveBlogImageUrl,
  saveBlogPost,
  saveGitHubConfig,
  triggerGitSync,
  uploadBlogImage,
} from '../../services/blogService';
import { MarkdownRenderer } from '../ui/MarkdownRenderer';
import { BlogCard } from '../sections/BlogSection';

const CATEGORY_SUGGESTIONS = [
  'Avionics & GNC',
  'Mechanical Systems',
  'Communications & Telemetry',
  'Software & AI',
  'Mission Log',
  'Research & Outreach',
];

function createEmptyPost(): BlogPost {
  const today = new Date().toISOString().split('T')[0];
  return {
    slug: '',
    title: '',
    subtitle: '',
    excerpt: '',
    date: today,
    author: 'BRACU Diganta Engineering',
    authorRole: 'Mission Systems Division',
    category: 'Avionics & GNC',
    tags: ['Aerospace', 'Diganta', 'Mission Log'],
    coverImage: DEFAULT_COVER_IMAGE,
    readTime: '3 MIN READ',
    featured: false,
    recordId: `LOG-${Math.floor(100 + Math.random() * 900)}`,
    status: 'PUBLISHED',
    specs: [
      { label: 'Subsystem', value: 'Avionics & GNC' },
      { label: 'Mission Status', value: 'VERIFIED' },
    ],
    gallery: [],
    content: `## Mission Overview\n\nWrite your technical blog post in Markdown here. You can upload images directly from the toolbar above, add code blocks, quotes, and telemetry specifications.\n\n### Key Engineering Highlights\n\n- **Autonomous Telemetry:** Real-time packet verification and logging.\n- **Structural Integrity:** Carbon-fiber composite frame tested under high-G loads.\n\n> "Engineering excellence through relentless iteration and flight testing." — BRACU Diganta Team\n`,
  };
}

export const AdminBlogManager: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { showToast } = useToast();

  const [posts, setPosts] = useState<BlogPost[]>(() => getAllBlogsSync(true));
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'PUBLISHED' | 'DRAFT'>('ALL');

  // Editor state
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingOriginalSlug, setEditingOriginalSlug] = useState<string | undefined>(undefined);
  const [draftPost, setDraftPost] = useState<BlogPost>(createEmptyPost);
  const [tagsInput, setTagsInput] = useState('Aerospace, Diganta, Mission Log');
  const [rawMdModeText, setRawMdModeText] = useState('');
  const [editorMode, setEditorMode] = useState<'split' | 'raw' | 'preview'>('split');
  const [commitMessage, setCommitMessage] = useState('');
  const [autoCommit, setAutoCommit] = useState(true);
  const [autoPush, setAutoPush] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  // Delete Confirmation Modal
  const [deleteTarget, setDeleteTarget] = useState<BlogPost | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Uploaded .md Preview Modal
  const [uploadedMdPreview, setUploadedMdPreview] = useState<{
    filename: string;
    post: BlogPost;
    rawMarkdown: string;
  } | null>(null);

  // Git & GitHub Status
  const [gitStatus, setGitStatus] = useState<GitStatusInfo | null>(null);
  const [lastGitBanner, setLastGitBanner] = useState<{
    type: 'success' | 'info' | 'error';
    text: string;
    commitUrl?: string;
  } | null>(null);
  const [isSyncingGit, setIsSyncingGit] = useState(false);

  // GitHub Settings Modal
  const [isGhModalOpen, setIsGhModalOpen] = useState(false);
  const [ghConfig, setGhConfig] = useState<GitHubCMSConfig>(() => getGitHubConfig());
  const [storedImages, setStoredImages] = useState<{ filename: string; url: string }[]>(
    BUILTIN_BLOG_IMAGES
  );
  const [showCoverLibrary, setShowCoverLibrary] = useState(false);

  // Refs for file inputs and markdown textarea
  const mdFileInputRef = useRef<HTMLInputElement>(null);
  const coverImageInputRef = useRef<HTMLInputElement>(null);
  const inlineImageInputRef = useRef<HTMLInputElement>(null);
  const galleryImageInputRef = useRef<HTMLInputElement>(null);
  const contentTextareaRef = useRef<HTMLTextAreaElement>(null);

  const refreshBlogsAndGit = async () => {
    setLoading(true);
    try {
      const [freshPosts, imgs] = await Promise.all([
        fetchAllBlogs(true),
        fetchStoredBlogImages(),
      ]);
      setPosts(freshPosts);
      setStoredImages(imgs);
      if (user) {
        const token = await user.getIdToken();
        const gs = await fetchGitStatus(token);
        setGitStatus(gs);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshBlogsAndGit();
  }, [user]);

  // Check if URL has ?edit=<slug>
  useEffect(() => {
    const editSlug = searchParams.get('edit');
    if (editSlug && posts.length > 0) {
      const target = posts.find((p) => p.slug === editSlug);
      if (target) {
        openEditPost(target);
        searchParams.delete('edit');
        setSearchParams(searchParams, { replace: true });
      }
    }
  }, [searchParams, posts]);

  const openCreateNew = () => {
    const fresh = createEmptyPost();
    setEditingOriginalSlug(undefined);
    setDraftPost(fresh);
    setTagsInput(fresh.tags.join(', '));
    setRawMdModeText(serializeToMarkdown(fresh));
    setCommitMessage('');
    setEditorMode('split');
    setIsEditorOpen(true);
  };

  const openEditPost = (post: BlogPost) => {
    const cloned: BlogPost = {
      ...post,
      tags: [...(post.tags || [])],
      specs: post.specs ? post.specs.map((s) => ({ ...s })) : [],
      gallery: post.gallery ? [...post.gallery] : [],
    };
    setEditingOriginalSlug(post.slug);
    setDraftPost(cloned);
    setTagsInput((cloned.tags || []).join(', '));
    setRawMdModeText(post.rawMarkdown || serializeToMarkdown(cloned));
    setCommitMessage(`feat(blog): update "${post.title}" (${post.slug}.md)`);
    setEditorMode('split');
    setIsEditorOpen(true);
  };

  // Sync draftPost changes when switching from Raw .md mode back to Split/Preview
  const handleSwitchEditorMode = (nextMode: 'split' | 'raw' | 'preview') => {
    if (editorMode === 'raw' && nextMode !== 'raw') {
      const parsed = parseMarkdownFile(
        rawMdModeText,
        draftPost.slug ? `${draftPost.slug}.md` : 'post.md'
      );
      setDraftPost(parsed);
      setTagsInput((parsed.tags || []).join(', '));
    } else if (editorMode !== 'raw' && nextMode === 'raw') {
      const updatedPost: BlogPost = {
        ...draftPost,
        slug: slugify(draftPost.slug || draftPost.title || 'untitled-post'),
        tags: tagsInput
          .split(',')
          .map((t) => t.trim())
          .filter(Boolean),
        readTime: calculateReadTime(draftPost.content),
      };
      setRawMdModeText(serializeToMarkdown(updatedPost));
    }
    setEditorMode(nextMode);
  };

  // Handle .md file upload from computer
  const handleMdFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    e.target.value = '';

    try {
      const rawText = await file.text();
      const parsed = parseMarkdownFile(rawText, file.name);
      setUploadedMdPreview({
        filename: file.name,
        post: parsed,
        rawMarkdown: serializeToMarkdown(parsed),
      });
    } catch (err: any) {
      showToast(err.message || 'Failed to parse .md file', 'error');
    }
  };

  // Directly publish the uploaded .md file and commit to GitHub
  const handleConfirmDirectMdUpload = async () => {
    if (!uploadedMdPreview) return;
    setIsSaving(true);
    try {
      const token = await user?.getIdToken();
      const result = await saveBlogPost({
        post: uploadedMdPreview.post,
        authToken: token,
        commitMessage: `feat(blog): upload ${uploadedMdPreview.post.slug}.md via Admin Panel`,
        autoCommit,
        autoPush,
      });

      setUploadedMdPreview(null);
      await refreshBlogsAndGit();

      setLastGitBanner({
        type: result.git.error ? 'info' : 'success',
        text: result.git.error
          ? `${result.git.message} (${result.git.error})`
          : result.git.message,
        commitUrl: result.git.commitUrl,
      });
      showToast(
        `Uploaded ${result.post.slug}.md & committed to repository!`,
        'success'
      );
    } catch (err: any) {
      showToast(err.message || 'Failed to upload .md file', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  // Save / Update from Editor
  const handleSavePost = async (overrideStatus?: 'PUBLISHED' | 'DRAFT') => {
    let postToSave: BlogPost;
    if (editorMode === 'raw') {
      postToSave = parseMarkdownFile(
        rawMdModeText,
        draftPost.slug ? `${draftPost.slug}.md` : 'post.md'
      );
    } else {
      postToSave = {
        ...draftPost,
        tags: tagsInput
          .split(',')
          .map((t) => t.trim())
          .filter(Boolean),
        readTime: draftPost.readTime || calculateReadTime(draftPost.content),
      };
    }

    if (!postToSave.title.trim()) {
      showToast('Please enter a blog title before saving.', 'error');
      return;
    }

    if (overrideStatus) {
      postToSave.status = overrideStatus;
    }

    postToSave.slug = slugify(postToSave.slug || postToSave.title);
    postToSave.readTime = calculateReadTime(postToSave.content);

    setIsSaving(true);
    try {
      const token = await user?.getIdToken();
      const result = await saveBlogPost({
        post: postToSave,
        oldSlug: editingOriginalSlug,
        authToken: token,
        commitMessage:
          commitMessage.trim() ||
          (editingOriginalSlug
            ? `feat(blog): update "${postToSave.title}" (${postToSave.slug}.md)`
            : `feat(blog): publish "${postToSave.title}" (${postToSave.slug}.md)`),
        autoCommit,
        autoPush,
      });

      setIsEditorOpen(false);
      await refreshBlogsAndGit();

      setLastGitBanner({
        type: result.git.error ? 'info' : 'success',
        text: result.git.error
          ? `${result.git.message} — ${result.git.error}`
          : result.git.message,
        commitUrl: result.git.commitUrl,
      });

      showToast(
        editingOriginalSlug
          ? `Updated ${result.post.slug}.md successfully!`
          : `Created ${result.post.slug}.md successfully!`,
        'success'
      );
    } catch (err: any) {
      showToast(err.message || 'Failed to save blog post', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  // Delete Blog Post
  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      const token = await user?.getIdToken();
      const result = await deleteBlogPost({
        slug: deleteTarget.slug,
        authToken: token,
        commitMessage: `chore(blog): delete ${deleteTarget.slug}.md via Admin Panel`,
        autoCommit,
        autoPush,
      });

      setDeleteTarget(null);
      await refreshBlogsAndGit();

      setLastGitBanner({
        type: result.git.error ? 'info' : 'success',
        text: result.git.message,
        commitUrl: result.git.commitUrl,
      });
      showToast(`Deleted ${deleteTarget.slug}.md`, 'success');
    } catch (err: any) {
      showToast(err.message || 'Failed to delete blog post', 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  // Manual Git Commit & Push Button
  const handleManualGitSync = async () => {
    setIsSyncingGit(true);
    try {
      const token = await user?.getIdToken();
      const result = await triggerGitSync({
        authToken: token,
        commitMessage:
          'chore(blog): sync blog markdown files & images from Admin Panel',
        push: true,
      });

      await refreshBlogsAndGit();
      setLastGitBanner({
        type: result.error ? 'error' : 'success',
        text: result.error ? `${result.message} (${result.error})` : result.message,
        commitUrl: result.commitUrl,
      });
      if (!result.error) {
        showToast(result.message, 'success');
      } else {
        showToast(result.error, 'error');
      }
    } catch (err: any) {
      showToast(err.message || 'Git sync failed', 'error');
    } finally {
      setIsSyncingGit(false);
    }
  };

  // Image Upload Handlers
  const handleCoverImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    e.target.value = '';
    setIsUploadingImage(true);
    try {
      const token = await user?.getIdToken();
      const uploaded = await uploadBlogImage({
        file,
        authToken: token,
        autoCommit,
        autoPush,
      });
      setDraftPost((prev) => ({ ...prev, coverImage: uploaded.url }));
      setStoredImages((prev) => [
        { filename: uploaded.filename, url: uploaded.url },
        ...prev.filter((i) => i.url !== uploaded.url),
      ]);
      showToast(`Uploaded cover image: ${uploaded.filename}`, 'success');
    } catch (err: any) {
      showToast(err.message || 'Image upload failed', 'error');
    } finally {
      setIsUploadingImage(false);
    }
  };

  const handleInlineImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    e.target.value = '';
    setIsUploadingImage(true);
    try {
      const token = await user?.getIdToken();
      const uploaded = await uploadBlogImage({
        file,
        authToken: token,
        autoCommit,
        autoPush,
      });
      const altName = file.name.replace(/\.[^.]+$/, '').replace(/[-_]+/g, ' ');
      const markdownSnippet = `\n![${altName}](${uploaded.url})\n`;

      if (editorMode === 'raw') {
        setRawMdModeText((prev) => prev + markdownSnippet);
      } else {
        const textarea = contentTextareaRef.current;
        if (textarea) {
          const start = textarea.selectionStart || draftPost.content.length;
          const end = textarea.selectionEnd || draftPost.content.length;
          const nextContent =
            draftPost.content.slice(0, start) +
            markdownSnippet +
            draftPost.content.slice(end);
          setDraftPost((prev) => ({ ...prev, content: nextContent }));
        } else {
          setDraftPost((prev) => ({
            ...prev,
            content: prev.content + markdownSnippet,
          }));
        }
      }
      showToast(`Inserted image ${uploaded.filename} into Markdown!`, 'success');
    } catch (err: any) {
      showToast(err.message || 'Image upload failed', 'error');
    } finally {
      setIsUploadingImage(false);
    }
  };

  const handleGalleryImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    e.target.value = '';
    setIsUploadingImage(true);
    try {
      const token = await user?.getIdToken();
      const uploaded = await uploadBlogImage({
        file,
        authToken: token,
        autoCommit,
        autoPush,
      });
      setDraftPost((prev) => ({
        ...prev,
        gallery: [...(prev.gallery || []), uploaded.url],
      }));
      setStoredImages((prev) => [
        { filename: uploaded.filename, url: uploaded.url },
        ...prev.filter((i) => i.url !== uploaded.url),
      ]);
      showToast(`Added ${uploaded.filename} to gallery!`, 'success');
    } catch (err: any) {
      showToast(err.message || 'Gallery upload failed', 'error');
    } finally {
      setIsUploadingImage(false);
    }
  };

  // Markdown Toolbar Helper
  const insertMarkdownSyntax = (prefix: string, suffix = '', placeholder = 'text') => {
    const textarea = contentTextareaRef.current;
    if (!textarea) return;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selected = draftPost.content.slice(start, end) || placeholder;
    const replacement = `${prefix}${selected}${suffix}`;
    const nextContent =
      draftPost.content.slice(0, start) +
      replacement +
      draftPost.content.slice(end);
    setDraftPost((prev) => ({ ...prev, content: nextContent }));
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(
        start + prefix.length,
        start + prefix.length + selected.length
      );
    }, 10);
  };

  const handleDownloadMdFile = (post: BlogPost) => {
    const mdContent = post.rawMarkdown || serializeToMarkdown(post);
    const blob = new Blob([mdContent], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${post.slug}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const filteredPosts = posts.filter((post) => {
    const matchesStatus =
      statusFilter === 'ALL' || post.status === statusFilter;
    if (!matchesStatus) return false;
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      post.title.toLowerCase().includes(q) ||
      post.slug.toLowerCase().includes(q) ||
      post.category.toLowerCase().includes(q) ||
      post.author.toLowerCase().includes(q)
    );
  });

  const publishedCount = posts.filter((p) => p.status === 'PUBLISHED').length;
  const draftCount = posts.filter((p) => p.status === 'DRAFT').length;

  return (
    <div className="space-y-8">
      {/* Hidden File Inputs */}
      <input
        ref={mdFileInputRef}
        type="file"
        accept=".md,.markdown,text/markdown,text/plain"
        onChange={handleMdFileUpload}
        className="hidden"
      />
      <input
        ref={coverImageInputRef}
        type="file"
        accept="image/*"
        onChange={handleCoverImageUpload}
        className="hidden"
      />
      <input
        ref={inlineImageInputRef}
        type="file"
        accept="image/*"
        onChange={handleInlineImageUpload}
        className="hidden"
      />
      <input
        ref={galleryImageInputRef}
        type="file"
        accept="image/*"
        onChange={handleGalleryImageUpload}
        className="hidden"
      />

      {/* Git / GitHub Terminal-Free Status & Control Bar */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 md:p-8 shadow-xl border border-slate-800 relative overflow-hidden">
        <div className="absolute -right-12 -top-12 w-48 h-48 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 font-mono text-[10px] uppercase tracking-widest font-bold">
                <GitBranch size={12} />
                Branch: {gitStatus?.branch || ghConfig.branch || 'feature/blog'}
              </span>

              {gitStatus?.backendConnected ? (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 font-mono text-[10px] uppercase tracking-widest font-bold">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Local Git + Filesystem Active
                </span>
              ) : null}

              {ghConfig.token ? (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/20 border border-cyan-400/30 text-cyan-300 font-mono text-[10px] uppercase tracking-widest font-bold">
                  <CheckCircle2 size={12} />
                  GitHub REST API Ready ({ghConfig.owner}/{ghConfig.repo})
                </span>
              ) : null}
            </div>

            <h2 className="font-orbitron text-xl md:text-2xl font-bold uppercase tracking-wide">
              Markdown (.md) Blog Engine & GitHub Auto-Commit
            </h2>

            {gitStatus?.lastCommit ? (
              <p className="font-mono text-xs text-slate-400 flex items-center gap-2">
                <GitCommit size={14} className="text-blue-400 shrink-0" />
                <span>
                  Latest Commit:{' '}
                  <strong className="text-white">{gitStatus.lastCommit.hash}</strong> —{' '}
                  {gitStatus.lastCommit.subject} ({gitStatus.lastCommit.relativeDate})
                </span>
              </p>
            ) : (
              <p className="font-mono text-xs text-slate-400">
                Zero-MongoDB static Markdown architecture • O(1) read time • Direct GitHub commit from Admin Panel
              </p>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              onClick={() => setIsGhModalOpen(true)}
              className="px-4 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-mono text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-colors"
            >
              <Settings size={15} />
              GitHub Config
            </button>

            <button
              onClick={handleManualGitSync}
              disabled={isSyncingGit}
              className="px-6 py-3 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-mono text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-blue-600/30 transition-all disabled:opacity-50"
            >
              {isSyncingGit ? (
                <>
                  <RefreshCw size={15} className="animate-spin" />
                  Committing & Pushing...
                </>
              ) : (
                <>
                  <CloudUpload size={16} />
                  Commit & Push to GitHub
                </>
              )}
            </button>
          </div>
        </div>

        {/* Last Git Operation Notification Banner */}
        {lastGitBanner && (
          <div
            className={`mt-5 p-4 rounded-2xl border flex items-center justify-between gap-4 font-mono text-xs ${
              lastGitBanner.type === 'success'
                ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-200'
                : lastGitBanner.type === 'error'
                ? 'bg-rose-950/60 border-rose-500/40 text-rose-200'
                : 'bg-blue-950/60 border-blue-500/40 text-blue-200'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <CheckCircle2 size={16} className="shrink-0" />
              <span>{lastGitBanner.text}</span>
              {lastGitBanner.commitUrl && (
                <a
                  href={lastGitBanner.commitUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline font-bold hover:text-white inline-flex items-center gap-1 ml-2"
                >
                  View Commit on GitHub <ExternalLink size={12} />
                </a>
              )}
            </div>
            <button
              onClick={() => setLastGitBanner(null)}
              className="text-slate-400 hover:text-white"
            >
              <X size={15} />
            </button>
          </div>
        )}
      </div>

      {/* Stats & Primary Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-3xl shadow-[0_10px_30px_rgba(0,0,0,0.03)] flex items-center gap-4">
          <div className="p-4 bg-blue-50 text-blue-600 rounded-2xl">
            <FileCode2 size={24} />
          </div>
          <div>
            <p className="text-xs font-mono text-gray-400 uppercase tracking-wider">
              Total .MD Files
            </p>
            <p className="text-2xl font-bold text-gray-900">{posts.length}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl shadow-[0_10px_30px_rgba(0,0,0,0.03)] flex items-center gap-4">
          <div className="p-4 bg-emerald-50 text-emerald-600 rounded-2xl">
            <CheckCircle2 size={24} />
          </div>
          <div>
            <p className="text-xs font-mono text-gray-400 uppercase tracking-wider">
              Published
            </p>
            <p className="text-2xl font-bold text-emerald-600">
              {publishedCount}
            </p>
          </div>
        </div>

        {/* Write New Blog Card Button */}
        <button
          onClick={openCreateNew}
          className="bg-blue-600 hover:bg-blue-700 text-white p-6 rounded-3xl shadow-[0_12px_30px_rgba(37,99,235,0.25)] flex items-center justify-between group transition-all text-left"
        >
          <div>
            <p className="text-[10px] font-mono text-blue-200 uppercase tracking-widest font-bold mb-1">
              CREATE FROM ADMIN
            </p>
            <p className="font-orbitron text-lg font-bold uppercase">
              Write New Blog
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-white/15 flex items-center justify-center group-hover:scale-110 transition-transform">
            <Plus size={24} />
          </div>
        </button>

        {/* Direct Upload .MD File Button */}
        <button
          onClick={() => mdFileInputRef.current?.click()}
          className="bg-white hover:bg-slate-50 text-slate-900 p-6 rounded-3xl border-2 border-dashed border-blue-300 hover:border-blue-600 shadow-[0_10px_30px_rgba(0,0,0,0.03)] flex items-center justify-between group transition-all text-left"
        >
          <div>
            <p className="text-[10px] font-mono text-blue-600 uppercase tracking-widest font-bold mb-1">
              DIRECT FILE UPLOAD
            </p>
            <p className="font-orbitron text-lg font-bold uppercase">
              Upload .MD File
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform">
            <Upload size={22} />
          </div>
        </button>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="bg-white rounded-3xl p-4 md:p-6 shadow-[0_10px_30px_rgba(0,0,0,0.03)] flex flex-col md:flex-row gap-4 justify-between items-center">
        <div className="flex flex-wrap gap-2">
          {(['ALL', 'PUBLISHED', 'DRAFT'] as const).map((st) => {
            const count =
              st === 'ALL'
                ? posts.length
                : st === 'PUBLISHED'
                ? publishedCount
                : draftCount;
            return (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-5 py-2.5 rounded-full font-mono text-xs font-bold tracking-wider uppercase transition-all ${
                  statusFilter === st
                    ? 'bg-gray-900 text-white shadow-md'
                    : 'bg-slate-100 text-gray-600 hover:bg-slate-200'
                }`}
              >
                {st} ({count})
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-80">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              size={18}
            />
            <input
              type="text"
              placeholder="Search by title, slug.md, category..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
          </div>

          <button
            onClick={() => navigate('/blog')}
            className="px-5 py-2.5 bg-[#eef2f5] hover:bg-blue-50 text-slate-800 hover:text-blue-600 rounded-full font-mono text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-colors shrink-0"
          >
            <ExternalLink size={14} /> View Public Blog
          </button>
        </div>
      </div>

      {/* Blog Posts List */}
      <div className="bg-white rounded-3xl p-6 md:p-8 shadow-[0_20px_40px_rgba(0,0,0,0.04)]">
        {loading && posts.length === 0 ? (
          <div className="text-center py-12 font-mono text-slate-400">
            Loading Markdown blog files...
          </div>
        ) : filteredPosts.length === 0 ? (
          <div className="text-center py-12">
            <p className="font-orbitron text-lg font-bold text-slate-700 uppercase mb-2">
              No Markdown Blog Posts Found
            </p>
            <p className="text-slate-500 text-sm mb-6">
              Create a new blog post in the editor or upload an existing .md file.
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={openCreateNew}
                className="px-6 py-3 bg-blue-600 text-white rounded-full font-mono text-xs font-bold uppercase tracking-widest"
              >
                + Write New Blog
              </button>
              <button
                onClick={() => mdFileInputRef.current?.click()}
                className="px-6 py-3 bg-slate-900 text-white rounded-full font-mono text-xs font-bold uppercase tracking-widest"
              >
                Upload .MD File
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredPosts.map((post) => (
              <div
                key={post.slug}
                className="border border-slate-100 hover:border-blue-200 rounded-2xl p-4 md:p-5 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-5 hover:bg-blue-50/20 transition-all group"
              >
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 flex-1 min-w-0">
                  <img
                    src={resolveBlogImageUrl(post.coverImage)}
                    alt={post.title}
                    className="w-full sm:w-28 h-20 rounded-xl object-cover shrink-0 bg-slate-900 border border-slate-200"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2 mb-1.5">
                      <span
                        className={`px-2.5 py-0.5 rounded-full font-mono text-[10px] font-bold uppercase tracking-wider ${
                          post.status === 'DRAFT'
                            ? 'bg-amber-100 text-amber-800 border border-amber-200'
                            : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        }`}
                      >
                        {post.status}
                      </span>

                      <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 font-mono text-[10px] font-bold uppercase tracking-wider">
                        {post.category}
                      </span>

                      <span className="px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-600 font-mono text-[10px] font-semibold flex items-center gap-1">
                        <FileCode2 size={11} className="text-blue-600" />
                        {post.slug}.md
                      </span>

                      {post.featured && (
                        <span className="px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 font-mono text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                          <Sparkles size={10} /> Featured
                        </span>
                      )}
                    </div>

                    <h3
                      onClick={() => openEditPost(post)}
                      className="font-orbitron text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors cursor-pointer truncate"
                    >
                      {post.title}
                    </h3>

                    <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">
                      {post.excerpt}
                    </p>

                    <div className="flex flex-wrap items-center gap-3 mt-2 font-mono text-[10px] text-slate-400 uppercase tracking-wider">
                      <span>{formatDisplayDate(post.date)}</span>
                      <span>•</span>
                      <span>{post.author}</span>
                      <span>•</span>
                      <span>{post.readTime}</span>
                    </div>
                  </div>
                </div>

                {/* Action Buttons: View, Edit/Update, Download .md, Delete */}
                <div className="flex flex-wrap items-center gap-2 shrink-0 w-full lg:w-auto justify-end border-t lg:border-t-0 pt-3 lg:pt-0 border-slate-100">
                  <button
                    onClick={() => navigate(`/blog/${post.slug}`)}
                    className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-mono text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors"
                    title="View Detailed Blog Page"
                  >
                    <Eye size={14} /> View
                  </button>

                  <button
                    onClick={() => openEditPost(post)}
                    className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-mono text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors shadow-sm"
                  >
                    <Edit3 size={14} /> Edit / Update
                  </button>

                  <button
                    onClick={() => handleDownloadMdFile(post)}
                    className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-mono text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors"
                    title="Download .md file"
                  >
                    <Download size={14} /> .MD
                  </button>

                  <button
                    onClick={() => setDeleteTarget(post)}
                    className="px-3.5 py-2 rounded-xl bg-red-50 hover:bg-red-600 text-red-600 hover:text-white font-mono text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors"
                    title="Delete .md file & commit to GitHub"
                  >
                    <Trash2 size={14} /> Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ===================================================================== */}
      {/* FULL-SCREEN MARKDOWN & FRONTMATTER BLOG EDITOR MODAL                  */}
      {/* ===================================================================== */}
      {isEditorOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-2 md:p-6">
          <div
            className="bg-[#eef2f5] w-full max-w-[95rem] h-[94vh] rounded-3xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden"
            data-lenis-prevent
          >
            {/* Editor Top Header */}
            <div className="bg-white px-6 py-4 border-b border-slate-200 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-orbitron font-black">
                  MD
                </div>
                <div>
                  <h2 className="font-orbitron text-lg md:text-xl font-black uppercase text-slate-900">
                    {editingOriginalSlug
                      ? `Editing: ${editingOriginalSlug}.md`
                      : 'Create New Markdown Blog Post'}
                  </h2>
                  <p className="font-mono text-[11px] text-slate-500">
                    Generates & updates{' '}
                    <code className="text-blue-600 font-bold">
                      src/content/blogs/
                      {slugify(draftPost.slug || draftPost.title || 'new-post')}.md
                    </code>
                  </p>
                </div>
              </div>

              {/* Editor Mode Switcher */}
              <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-full border border-slate-200">
                <button
                  type="button"
                  onClick={() => handleSwitchEditorMode('split')}
                  className={`px-4 py-1.5 rounded-full font-mono text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all ${
                    editorMode === 'split'
                      ? 'bg-slate-900 text-white shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Columns size={13} /> Editor + Live Preview
                </button>
                <button
                  type="button"
                  onClick={() => handleSwitchEditorMode('raw')}
                  className={`px-4 py-1.5 rounded-full font-mono text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all ${
                    editorMode === 'raw'
                      ? 'bg-slate-900 text-white shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Code2 size={13} /> Raw .MD File
                </button>
                <button
                  type="button"
                  onClick={() => handleSwitchEditorMode('preview')}
                  className={`px-4 py-1.5 rounded-full font-mono text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all ${
                    editorMode === 'preview'
                      ? 'bg-slate-900 text-white shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Eye size={13} /> Card & Page Preview
                </button>
              </div>

              {/* Save / Publish / Close Buttons */}
              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={() => handleSavePost('DRAFT')}
                  disabled={isSaving}
                  className="px-4 py-2.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-mono text-xs font-bold uppercase tracking-wider transition-colors disabled:opacity-50"
                >
                  Save Draft
                </button>

                <button
                  type="button"
                  onClick={() => handleSavePost('PUBLISHED')}
                  disabled={isSaving}
                  className="px-6 py-2.5 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-mono text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-blue-600/25 transition-all disabled:opacity-50"
                >
                  <CloudUpload size={15} />
                  {isSaving
                    ? 'Saving & Committing...'
                    : editingOriginalSlug
                    ? 'Update .MD & Commit'
                    : 'Publish .MD & Commit'}
                </button>

                <button
                  type="button"
                  onClick={() => setIsEditorOpen(false)}
                  className="p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                >
                  <X size={22} />
                </button>
              </div>
            </div>

            {/* Editor Main Body */}
            <div className="flex-1 overflow-y-auto p-6">
              {editorMode === 'raw' ? (
                /* RAW .MD SOURCE EDITOR */
                <div className="max-w-5xl mx-auto bg-slate-900 rounded-3xl p-6 border border-slate-800 shadow-xl flex flex-col h-full min-h-[70vh]">
                  <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-800">
                    <span className="font-mono text-xs text-blue-400 uppercase tracking-widest font-bold flex items-center gap-2">
                      <FileCode2 size={16} />
                      RAW MARKDOWN + YAML FRONTMATTER ({slugify(draftPost.slug || draftPost.title || 'post')}.md)
                    </span>
                    <button
                      type="button"
                      onClick={() => inlineImageInputRef.current?.click()}
                      className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-mono text-xs uppercase tracking-wider flex items-center gap-1.5"
                    >
                      <ImageIcon size={13} /> Upload & Insert Image
                    </button>
                  </div>
                  <textarea
                    value={rawMdModeText}
                    onChange={(e) => setRawMdModeText(e.target.value)}
                    className="flex-1 w-full bg-transparent text-slate-100 font-mono text-sm leading-relaxed focus:outline-none resize-none"
                    placeholder="---&#10;title: ...&#10;---&#10;&#10;## Markdown Content"
                  />
                </div>
              ) : editorMode === 'preview' ? (
                /* FULL CARD + ARTICLE PREVIEW */
                <div className="max-w-5xl mx-auto space-y-12">
                  <div>
                    <span className="font-mono text-xs uppercase tracking-widest text-blue-600 font-bold block mb-4">
                      1. Blog Section Card Preview
                    </span>
                    <div className="max-w-md">
                      <BlogCard
                        post={{
                          ...draftPost,
                          slug: slugify(draftPost.slug || draftPost.title || 'preview'),
                          tags: tagsInput
                            .split(',')
                            .map((t) => t.trim())
                            .filter(Boolean),
                          readTime: calculateReadTime(draftPost.content),
                        }}
                        onClick={() => {}}
                      />
                    </div>
                  </div>

                  <div className="bg-white rounded-3xl p-8 md:p-12 border border-slate-200 shadow-sm">
                    <span className="font-mono text-xs uppercase tracking-widest text-blue-600 font-bold block mb-4">
                      2. Detailed Article Page Preview
                    </span>
                    <h1 className="font-orbitron text-4xl md:text-5xl font-black uppercase text-slate-900 mb-3">
                      {draftPost.title || 'Untitled Blog Post'}
                    </h1>
                    {draftPost.subtitle && (
                      <p className="font-orbitron text-lg font-bold text-blue-600 uppercase mb-6">
                        {draftPost.subtitle}
                      </p>
                    )}
                    <img
                      src={draftPost.coverImage || DEFAULT_COVER_IMAGE}
                      alt="Cover preview"
                      className="w-full aspect-[21/9] object-cover rounded-3xl mb-8"
                    />
                    <MarkdownRenderer content={draftPost.content} />
                  </div>
                </div>
              ) : (
                /* SPLIT SCREEN: FORM + MARKDOWN EDITOR (LEFT) & LIVE PREVIEW (RIGHT) */
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  {/* Left 7 Cols: Metadata + Markdown Editor */}
                  <div className="lg:col-span-7 space-y-6">
                    {/* Frontmatter Metadata Card */}
                    <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-4">
                      <h3 className="font-orbitron text-sm font-bold uppercase tracking-wider text-blue-600 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-blue-600" />
                        1. Post Metadata (.MD Frontmatter)
                      </h3>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="md:col-span-2">
                          <label className="block font-mono text-[10px] uppercase tracking-wider text-slate-500 font-bold mb-1">
                            Blog Title *
                          </label>
                          <input
                            type="text"
                            value={draftPost.title}
                            onChange={(e) => {
                              const nextTitle = e.target.value;
                              setDraftPost((prev) => ({
                                ...prev,
                                title: nextTitle,
                                slug: editingOriginalSlug
                                  ? prev.slug
                                  : slugify(nextTitle),
                              }));
                            }}
                            placeholder="e.g. Designing the SIGMA Active Guidance System"
                            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-900 focus:bg-white focus:border-blue-500 outline-none"
                          />
                        </div>

                        <div>
                          <label className="block font-mono text-[10px] uppercase tracking-wider text-slate-500 font-bold mb-1">
                            Subtitle (Optional)
                          </label>
                          <input
                            type="text"
                            value={draftPost.subtitle || ''}
                            onChange={(e) =>
                              setDraftPost((prev) => ({
                                ...prev,
                                subtitle: e.target.value,
                              }))
                            }
                            placeholder="Technical subtitle..."
                            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:bg-white focus:border-blue-500 outline-none"
                          />
                        </div>

                        <div>
                          <label className="block font-mono text-[10px] uppercase tracking-wider text-slate-500 font-bold mb-1">
                            Filename Slug (.md)
                          </label>
                          <div className="flex items-center bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5">
                            <input
                              type="text"
                              value={draftPost.slug}
                              onChange={(e) =>
                                setDraftPost((prev) => ({
                                  ...prev,
                                  slug: slugify(e.target.value),
                                }))
                              }
                              placeholder="auto-generated-slug"
                              className="w-full bg-transparent font-mono text-xs text-slate-800 outline-none"
                            />
                            <span className="font-mono text-xs text-blue-600 font-bold">
                              .md
                            </span>
                          </div>
                        </div>

                        <div>
                          <label className="block font-mono text-[10px] uppercase tracking-wider text-slate-500 font-bold mb-1">
                            Category / Division
                          </label>
                          <input
                            list="blog-categories"
                            value={draftPost.category}
                            onChange={(e) =>
                              setDraftPost((prev) => ({
                                ...prev,
                                category: e.target.value,
                              }))
                            }
                            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:bg-white focus:border-blue-500 outline-none"
                          />
                          <datalist id="blog-categories">
                            {CATEGORY_SUGGESTIONS.map((c) => (
                              <option key={c} value={c} />
                            ))}
                          </datalist>
                        </div>

                        <div>
                          <label className="block font-mono text-[10px] uppercase tracking-wider text-slate-500 font-bold mb-1">
                            Publication Date
                          </label>
                          <input
                            type="date"
                            value={draftPost.date}
                            onChange={(e) =>
                              setDraftPost((prev) => ({
                                ...prev,
                                date: e.target.value,
                              }))
                            }
                            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:bg-white focus:border-blue-500 outline-none"
                          />
                        </div>

                        <div>
                          <label className="block font-mono text-[10px] uppercase tracking-wider text-slate-500 font-bold mb-1">
                            Author Name
                          </label>
                          <input
                            type="text"
                            value={draftPost.author}
                            onChange={(e) =>
                              setDraftPost((prev) => ({
                                ...prev,
                                author: e.target.value,
                              }))
                            }
                            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:bg-white focus:border-blue-500 outline-none"
                          />
                        </div>

                        <div>
                          <label className="block font-mono text-[10px] uppercase tracking-wider text-slate-500 font-bold mb-1">
                            Author Role / Subsystem
                          </label>
                          <input
                            type="text"
                            value={draftPost.authorRole || ''}
                            onChange={(e) =>
                              setDraftPost((prev) => ({
                                ...prev,
                                authorRole: e.target.value,
                              }))
                            }
                            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:bg-white focus:border-blue-500 outline-none"
                          />
                        </div>

                        <div className="md:col-span-2">
                          <label className="block font-mono text-[10px] uppercase tracking-wider text-slate-500 font-bold mb-1">
                            Card Summary / Excerpt
                          </label>
                          <textarea
                            rows={2}
                            value={draftPost.excerpt}
                            onChange={(e) =>
                              setDraftPost((prev) => ({
                                ...prev,
                                excerpt: e.target.value,
                              }))
                            }
                            placeholder="Short summary shown on the blog card..."
                            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:bg-white focus:border-blue-500 outline-none resize-none"
                          />
                        </div>

                        <div className="md:col-span-2">
                          <label className="block font-mono text-[10px] uppercase tracking-wider text-slate-500 font-bold mb-2">
                            Cover Image (Stored in public/blogs/images/)
                          </label>
                          <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
                            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                              <img
                                src={resolveBlogImageUrl(draftPost.coverImage)}
                                alt="Cover preview"
                                className="w-full sm:w-36 h-24 rounded-xl object-cover bg-slate-900 border border-slate-200 shrink-0"
                              />
                              <div className="space-y-2 flex-1">
                                <div className="flex flex-wrap gap-2">
                                  <button
                                    type="button"
                                    onClick={() => coverImageInputRef.current?.click()}
                                    disabled={isUploadingImage}
                                    className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-mono text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-colors shadow-sm"
                                  >
                                    <Upload size={14} />
                                    {isUploadingImage
                                      ? 'Uploading Image...'
                                      : 'Upload Image from Computer'}
                                  </button>

                                  <button
                                    type="button"
                                    onClick={() =>
                                      setShowCoverLibrary((prev) => !prev)
                                    }
                                    className="px-4 py-2.5 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-xl font-mono text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-colors"
                                  >
                                    <ImageIcon size={14} />
                                    {showCoverLibrary
                                      ? 'Hide Stored Images'
                                      : `Choose Stored Image (${storedImages.length})`}
                                  </button>
                                </div>
                                <p className="font-mono text-xs text-slate-500 truncate">
                                  Active file: <strong className="text-slate-700">{draftPost.coverImage}</strong>
                                </p>
                              </div>
                            </div>

                            {showCoverLibrary && storedImages.length > 0 && (
                              <div className="pt-3 border-t border-slate-200 grid grid-cols-3 sm:grid-cols-5 gap-2.5 max-h-48 overflow-y-auto">
                                {storedImages.map((img) => {
                                  const isSelected = draftPost.coverImage === img.url;
                                  return (
                                    <button
                                      key={img.url}
                                      type="button"
                                      onClick={() => {
                                        setDraftPost((prev) => ({
                                          ...prev,
                                          coverImage: img.url,
                                        }));
                                        setShowCoverLibrary(false);
                                      }}
                                      className={`relative aspect-video rounded-xl overflow-hidden border-2 transition-all group ${
                                        isSelected
                                          ? 'border-blue-600 ring-2 ring-blue-500/30'
                                          : 'border-slate-200 hover:border-blue-400'
                                      }`}
                                    >
                                      <img
                                        src={resolveBlogImageUrl(img.url)}
                                        alt={img.filename}
                                        className="w-full h-full object-cover"
                                      />
                                    </button>
                                  );
                                })}
                              </div>
                            )}
                          </div>
                        </div>

                        <div>
                          <label className="block font-mono text-[10px] uppercase tracking-wider text-slate-500 font-bold mb-1">
                            Tags (Comma separated)
                          </label>
                          <input
                            type="text"
                            value={tagsInput}
                            onChange={(e) => setTagsInput(e.target.value)}
                            placeholder="CanSat, Telemetry, Avionics"
                            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-800 focus:bg-white focus:border-blue-500 outline-none"
                          />
                        </div>

                        <div className="flex items-center gap-6 pt-5">
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={Boolean(draftPost.featured)}
                              onChange={(e) =>
                                setDraftPost((prev) => ({
                                  ...prev,
                                  featured: e.target.checked,
                                }))
                              }
                              className="w-4 h-4 accent-blue-600 rounded"
                            />
                            <span className="font-mono text-xs font-bold uppercase tracking-wider text-slate-700">
                              Featured Post
                            </span>
                          </label>
                        </div>
                      </div>
                    </div>

                    {/* Markdown Body Editor Card */}
                    <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-4">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <h3 className="font-orbitron text-sm font-bold uppercase tracking-wider text-blue-600 flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-blue-600" />
                          2. Markdown Content Body
                        </h3>

                        {/* Formatting Toolbar */}
                        <div className="flex flex-wrap items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200">
                          <button
                            type="button"
                            onClick={() => insertMarkdownSyntax('## ', '', 'Section Heading')}
                            className="p-1.5 hover:bg-white rounded-lg text-slate-700"
                            title="Heading 2"
                          >
                            <Heading2 size={15} />
                          </button>
                          <button
                            type="button"
                            onClick={() => insertMarkdownSyntax('### ', '', 'Subheading')}
                            className="p-1.5 hover:bg-white rounded-lg text-slate-700"
                            title="Heading 3"
                          >
                            <Heading3 size={15} />
                          </button>
                          <button
                            type="button"
                            onClick={() => insertMarkdownSyntax('**', '**', 'bold text')}
                            className="p-1.5 hover:bg-white rounded-lg text-slate-700"
                            title="Bold"
                          >
                            <Bold size={15} />
                          </button>
                          <button
                            type="button"
                            onClick={() => insertMarkdownSyntax('*', '*', 'italic text')}
                            className="p-1.5 hover:bg-white rounded-lg text-slate-700"
                            title="Italic"
                          >
                            <Italic size={15} />
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              insertMarkdownSyntax('\n> "', '" — BRACU Diganta Team\n', 'Quote')
                            }
                            className="p-1.5 hover:bg-white rounded-lg text-slate-700"
                            title="Quote Card"
                          >
                            <Quote size={15} />
                          </button>
                          <button
                            type="button"
                            onClick={() => insertMarkdownSyntax('\n- ', '', 'List item')}
                            className="p-1.5 hover:bg-white rounded-lg text-slate-700"
                            title="Bullet List"
                          >
                            <List size={15} />
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              insertMarkdownSyntax('\n```cpp\n', '\n```\n', '// code here')
                            }
                            className="p-1.5 hover:bg-white rounded-lg text-slate-700"
                            title="Code Block"
                          >
                            <Terminal size={15} />
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              insertMarkdownSyntax('[', '](https://)', 'link text')
                            }
                            className="p-1.5 hover:bg-white rounded-lg text-slate-700"
                            title="Link"
                          >
                            <LinkIcon size={15} />
                          </button>
                          <button
                            type="button"
                            onClick={() => inlineImageInputRef.current?.click()}
                            className="px-2.5 py-1 bg-blue-600 text-white rounded-lg font-mono text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 ml-1"
                            title="Upload & Insert Image into Markdown"
                          >
                            <ImageIcon size={12} /> + Image
                          </button>
                        </div>
                      </div>

                      <textarea
                        ref={contentTextareaRef}
                        rows={16}
                        value={draftPost.content}
                        onChange={(e) =>
                          setDraftPost((prev) => ({
                            ...prev,
                            content: e.target.value,
                          }))
                        }
                        placeholder="Write your article in Markdown..."
                        className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl font-mono text-sm text-slate-900 leading-relaxed focus:bg-white focus:border-blue-500 outline-none resize-y"
                      />
                    </div>

                    {/* Telemetry Sidebar Specs & Gallery Editor */}
                    <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-6">
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <h3 className="font-orbitron text-xs font-bold uppercase tracking-wider text-blue-600">
                            3. Sidebar Telemetry Specs
                          </h3>
                          <button
                            type="button"
                            onClick={() =>
                              setDraftPost((prev) => ({
                                ...prev,
                                specs: [
                                  ...(prev.specs || []),
                                  { label: 'Parameter', value: 'Value' },
                                ],
                              }))
                            }
                            className="font-mono text-[10px] font-bold text-blue-600 hover:underline uppercase"
                          >
                            + Add Spec Row
                          </button>
                        </div>

                        <div className="space-y-2">
                          {(draftPost.specs || []).map((spec: BlogSpec, idx: number) => (
                            <div key={idx} className="flex items-center gap-2">
                              <input
                                type="text"
                                value={spec.label}
                                onChange={(e) => {
                                  const next = [...(draftPost.specs || [])];
                                  next[idx] = { ...next[idx], label: e.target.value };
                                  setDraftPost((prev) => ({ ...prev, specs: next }));
                                }}
                                placeholder="Label (e.g. Target Altitude)"
                                className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono"
                              />
                              <input
                                type="text"
                                value={spec.value}
                                onChange={(e) => {
                                  const next = [...(draftPost.specs || [])];
                                  next[idx] = { ...next[idx], value: e.target.value };
                                  setDraftPost((prev) => ({ ...prev, specs: next }));
                                }}
                                placeholder="Value (e.g. 750 Meters)"
                                className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold"
                              />
                              <button
                                type="button"
                                onClick={() => {
                                  const next = (draftPost.specs || []).filter(
                                    (_, i) => i !== idx
                                  );
                                  setDraftPost((prev) => ({ ...prev, specs: next }));
                                }}
                                className="p-2 text-slate-400 hover:text-red-600"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Gallery Images */}
                      <div className="pt-4 border-t border-slate-100">
                        <div className="flex items-center justify-between mb-3">
                          <h3 className="font-orbitron text-xs font-bold uppercase tracking-wider text-blue-600">
                            4. Article Gallery Images
                          </h3>
                          <button
                            type="button"
                            onClick={() => galleryImageInputRef.current?.click()}
                            className="px-3 py-1.5 bg-slate-900 hover:bg-blue-600 text-white rounded-xl font-mono text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5"
                          >
                            <Upload size={12} /> Upload Gallery Image
                          </button>
                        </div>

                        {draftPost.gallery && draftPost.gallery.length > 0 ? (
                          <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                            {draftPost.gallery.map((imgUrl, gIdx) => (
                              <div
                                key={gIdx}
                                className="relative group aspect-video rounded-xl overflow-hidden border border-slate-200 bg-slate-900"
                              >
                                <img
                                  src={resolveBlogImageUrl(imgUrl)}
                                  alt=""
                                  className="w-full h-full object-cover"
                                />
                                <button
                                  type="button"
                                  onClick={() =>
                                    setDraftPost((prev) => ({
                                      ...prev,
                                      gallery: (prev.gallery || []).filter(
                                        (_, i) => i !== gIdx
                                      ),
                                    }))
                                  }
                                  className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-red-600 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                  <X size={12} />
                                </button>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-xs text-slate-400 font-mono">
                            No gallery images added yet.
                          </p>
                        )}
                      </div>

                      {/* Git Commit Controls */}
                      <div className="pt-4 border-t border-slate-100 space-y-3">
                        <h3 className="font-orbitron text-xs font-bold uppercase tracking-wider text-blue-600">
                          5. GitHub Commit Options
                        </h3>
                        <input
                          type="text"
                          value={commitMessage}
                          onChange={(e) => setCommitMessage(e.target.value)}
                          placeholder={`feat(blog): ${
                            editingOriginalSlug ? 'update' : 'publish'
                          } ${slugify(draftPost.slug || draftPost.title || 'post')}.md`}
                          className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono text-xs text-slate-800"
                        />
                        <div className="flex flex-wrap items-center gap-6">
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={autoCommit}
                              onChange={(e) => setAutoCommit(e.target.checked)}
                              className="w-4 h-4 accent-blue-600 rounded"
                            />
                            <span className="font-mono text-xs text-slate-700 font-bold">
                              Auto-commit .md file to Git
                            </span>
                          </label>

                          <label className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={autoPush}
                              onChange={(e) => setAutoPush(e.target.checked)}
                              className="w-4 h-4 accent-blue-600 rounded"
                            />
                            <span className="font-mono text-xs text-slate-700 font-bold">
                              Auto-push commit to GitHub remote
                            </span>
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right 5 Cols: Sticky Live Diganta-Themed Preview */}
                  <div className="lg:col-span-5">
                    <div className="sticky top-0 bg-white rounded-3xl p-6 md:p-8 border border-slate-200/80 shadow-sm max-h-[82vh] overflow-y-auto">
                      <div className="flex items-center justify-between pb-4 mb-6 border-b border-slate-100">
                        <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-blue-600 font-bold flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                          LIVE THEME PREVIEW
                        </span>
                        <span className="font-mono text-[10px] text-slate-400">
                          {calculateReadTime(draftPost.content)}
                        </span>
                      </div>

                      <div className="mb-3">
                        <span className="inline-block px-3 py-1 rounded-full bg-blue-50 text-blue-700 font-mono text-[10px] font-bold uppercase tracking-wider">
                          {draftPost.category || 'Category'}
                        </span>
                      </div>

                      <h1 className="font-orbitron text-2xl md:text-3xl font-black uppercase text-slate-900 leading-tight mb-2">
                        {draftPost.title || 'Untitled Mission Log'}
                      </h1>

                      {draftPost.subtitle && (
                        <p className="font-orbitron text-xs font-bold text-blue-600 uppercase tracking-wider mb-4">
                          {draftPost.subtitle}
                        </p>
                      )}

                      {draftPost.coverImage && (
                        <div className="rounded-2xl overflow-hidden aspect-video mb-6 bg-slate-900">
                          <img
                            src={resolveBlogImageUrl(draftPost.coverImage)}
                            alt="Cover"
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}

                      {draftPost.excerpt && (
                        <p className="text-sm text-slate-700 font-medium leading-relaxed mb-6 pb-4 border-b border-slate-100">
                          {draftPost.excerpt}
                        </p>
                      )}

                      <MarkdownRenderer content={draftPost.content} />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* UPLOADED .MD FILE CONFIRMATION MODAL                                  */}
      {/* ===================================================================== */}
      {uploadedMdPreview && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 md:p-8 shadow-2xl border border-slate-200 space-y-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-blue-600 font-bold block mb-1">
                  MARKDOWN FILE PARSED SUCCESSFULLY
                </span>
                <h3 className="font-orbitron text-2xl font-black text-slate-900 uppercase">
                  {uploadedMdPreview.post.title}
                </h3>
                <p className="font-mono text-xs text-slate-500 mt-1">
                  Source file: <strong>{uploadedMdPreview.filename}</strong> → Target:{' '}
                  <code className="text-blue-600 font-bold">
                    src/content/blogs/{uploadedMdPreview.post.slug}.md
                  </code>
                </p>
              </div>
              <button
                onClick={() => setUploadedMdPreview(null)}
                className="p-2 text-slate-400 hover:text-slate-600"
              >
                <X size={20} />
              </button>
            </div>

            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 space-y-2 text-xs">
              <div className="flex justify-between font-mono">
                <span className="text-slate-400 uppercase">Category:</span>
                <span className="font-bold text-slate-800">
                  {uploadedMdPreview.post.category}
                </span>
              </div>
              <div className="flex justify-between font-mono">
                <span className="text-slate-400 uppercase">Author:</span>
                <span className="font-bold text-slate-800">
                  {uploadedMdPreview.post.author}
                </span>
              </div>
              <div className="flex justify-between font-mono">
                <span className="text-slate-400 uppercase">Read Time:</span>
                <span className="font-bold text-blue-600">
                  {uploadedMdPreview.post.readTime}
                </span>
              </div>
              <p className="text-slate-600 pt-2 border-t border-slate-200 line-clamp-3">
                {uploadedMdPreview.post.excerpt}
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-end gap-3 pt-2">
              <button
                onClick={() => {
                  const p = uploadedMdPreview.post;
                  setUploadedMdPreview(null);
                  setEditingOriginalSlug(undefined);
                  setDraftPost(p);
                  setTagsInput((p.tags || []).join(', '));
                  setRawMdModeText(uploadedMdPreview.rawMarkdown);
                  setEditorMode('split');
                  setIsEditorOpen(true);
                }}
                className="px-5 py-3 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-800 font-mono text-xs font-bold uppercase tracking-wider"
              >
                Open in Editor First
              </button>

              <button
                onClick={handleConfirmDirectMdUpload}
                disabled={isSaving}
                className="px-6 py-3 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-mono text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-blue-600/25"
              >
                <CloudUpload size={15} />
                {isSaving ? 'Uploading & Committing...' : 'Upload & Commit Now'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* DELETE CONFIRMATION MODAL                                             */}
      {/* ===================================================================== */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 md:p-8 shadow-2xl border border-slate-200 space-y-5">
            <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center">
              <AlertCircle size={24} />
            </div>
            <div>
              <h3 className="font-orbitron text-xl font-bold text-slate-900 uppercase">
                Delete {deleteTarget.slug}.md?
              </h3>
              <p className="text-sm text-slate-600 mt-2 leading-relaxed">
                This will remove{' '}
                <code className="font-mono font-bold text-slate-800">
                  {deleteTarget.slug}.md
                </code>{' '}
                from the blog section and commit the deletion to GitHub.
              </p>
            </div>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setDeleteTarget(null)}
                className="px-5 py-2.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-mono text-xs font-bold uppercase tracking-wider"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                disabled={isDeleting}
                className="px-6 py-2.5 rounded-full bg-red-600 hover:bg-red-700 text-white font-mono text-xs font-bold uppercase tracking-wider shadow-lg shadow-red-600/25"
              >
                {isDeleting ? 'Deleting...' : 'Delete & Commit'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* GITHUB DIRECT COMMIT CONFIGURATION MODAL                              */}
      {/* ===================================================================== */}
      {isGhModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 md:p-8 shadow-2xl border border-slate-200 space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-blue-600 font-bold block">
                  TERMINAL-FREE GIT INTEGRATION
                </span>
                <h3 className="font-orbitron text-xl font-black text-slate-900 uppercase">
                  GitHub Auto-Commit Settings
                </h3>
              </div>
              <button
                onClick={() => setIsGhModalOpen(false)}
                className="p-2 text-slate-400 hover:text-slate-600"
              >
                <X size={20} />
              </button>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              When running locally, the backend server automatically writes{' '}
              <code className="font-mono font-bold">.md</code> files and runs{' '}
              <code className="font-mono font-bold">git add / commit / push</code>. You can
              also provide a GitHub Personal Access Token (PAT) with <code className="font-mono">repo</code>{' '}
              scope to commit directly via the GitHub REST API from any browser!
            </p>

            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-mono text-[10px] uppercase tracking-wider text-slate-500 font-bold mb-1">
                    GitHub Owner / Org
                  </label>
                  <input
                    type="text"
                    value={ghConfig.owner}
                    onChange={(e) =>
                      setGhConfig((prev) => ({ ...prev, owner: e.target.value }))
                    }
                    placeholder="bishal040"
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono text-xs"
                  />
                </div>
                <div>
                  <label className="block font-mono text-[10px] uppercase tracking-wider text-slate-500 font-bold mb-1">
                    Repository Name
                  </label>
                  <input
                    type="text"
                    value={ghConfig.repo}
                    onChange={(e) =>
                      setGhConfig((prev) => ({ ...prev, repo: e.target.value }))
                    }
                    placeholder="Bracu-Diganta"
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-mono text-[10px] uppercase tracking-wider text-slate-500 font-bold mb-1">
                    Target Branch
                  </label>
                  <input
                    type="text"
                    value={ghConfig.branch}
                    onChange={(e) =>
                      setGhConfig((prev) => ({ ...prev, branch: e.target.value }))
                    }
                    placeholder="feature/blog"
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono text-xs"
                  />
                </div>
                <div>
                  <label className="block font-mono text-[10px] uppercase tracking-wider text-slate-500 font-bold mb-1">
                    Git Remote Name
                  </label>
                  <input
                    type="text"
                    value={ghConfig.remote}
                    onChange={(e) =>
                      setGhConfig((prev) => ({ ...prev, remote: e.target.value }))
                    }
                    placeholder="origin"
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block font-mono text-[10px] uppercase tracking-wider text-slate-500 font-bold mb-1">
                  GitHub Personal Access Token (Optional if using local server)
                </label>
                <input
                  type="password"
                  value={ghConfig.token}
                  onChange={(e) =>
                    setGhConfig((prev) => ({ ...prev, token: e.target.value }))
                  }
                  placeholder="ghp_... or github_pat_..."
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono text-xs"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setIsGhModalOpen(false)}
                className="px-5 py-2.5 rounded-full bg-slate-100 text-slate-700 font-mono text-xs font-bold uppercase tracking-wider"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  saveGitHubConfig(ghConfig);
                  setIsGhModalOpen(false);
                  showToast('GitHub Auto-Commit settings saved!', 'success');
                  refreshBlogsAndGit();
                }}
                className="px-6 py-2.5 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-mono text-xs font-bold uppercase tracking-wider"
              >
                Save Settings
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
