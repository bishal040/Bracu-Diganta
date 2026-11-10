import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import gsap from 'gsap';
import {
  ArrowLeft,
  ArrowRight,
  Activity,
  Clock,
  Cpu,
  Rocket,
  Target,
  User,
  List,
  BookOpen,
  ChevronRight,
  Layers,
  Image as ImageIcon,
  X,
} from 'lucide-react';
import { MarkdownRenderer } from '../ui/MarkdownRenderer';
import {
  fetchAllBlogs,
  getAllBlogsSync,
  getBlogBySlugSync,
  resolveBlogImageUrl,
} from '../../services/blogService';
import {
  type BlogPost,
  extractHeadings,
  formatDisplayDate,
} from '../../utils/markdown';

const SPEC_ICONS = [Rocket, Target, Cpu, Activity];

export const BlogDetailPage: React.FC = () => {
  const { slug = '' } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const pageRef = useRef<HTMLDivElement>(null);

  const [post, setPost] = useState<BlogPost | undefined>(() =>
    getBlogBySlugSync(slug)
  );
  const [allPosts, setAllPosts] = useState<BlogPost[]>(() =>
    getAllBlogsSync(false)
  );
  const [activeHeadingId, setActiveHeadingId] = useState<string>('');
  const [readingProgress, setReadingProgress] = useState<number>(0);
  const [mobileTocOpen, setMobileTocOpen] = useState<boolean>(false);
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    setPost(getBlogBySlugSync(slug));
    setMobileTocOpen(false);

    let mounted = true;
    fetchAllBlogs(false).then((fresh) => {
      if (!mounted) return;
      setAllPosts(fresh);
      const found = fresh.find((p) => p.slug === slug);
      if (found) setPost(found);
    });

    return () => {
      mounted = false;
    };
  }, [slug]);

  const headings = post ? extractHeadings(post.content) : [];

  // Reading progress bar + ScrollSpy for active book chapter heading
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      if (docHeight > 0) {
        setReadingProgress(
          Math.min(100, Math.max(0, (scrollTop / docHeight) * 100))
        );
      }

      if (headings.length > 0) {
        let currentId = headings[0].id;
        for (const h of headings) {
          const el = document.getElementById(h.id);
          if (el) {
            const rect = el.getBoundingClientRect();
            if (rect.top <= 160) {
              currentId = h.id;
            }
          }
        }
        setActiveHeadingId(currentId);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [headings.length, slug]);

  useEffect(() => {
    if (!pageRef.current || !post) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.reveal-anim',
        { opacity: 0, y: 18 },
        {
          opacity: 1,
          y: 0,
          duration: 0.65,
          stagger: 0.06,
          ease: 'power3.out',
        }
      );
    }, pageRef);

    return () => ctx.revert();
  }, [post?.slug]);

  if (!post) {
    return (
      <div className="min-h-screen bg-[#eef2f5] text-slate-900 pt-28 pb-20 px-4 sm:px-8 flex flex-col items-center justify-center text-center">
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200 shadow-lg max-w-lg w-full">
          <span className="font-mono text-xs text-blue-600 uppercase tracking-widest font-bold block mb-3">
            404 // ARTICLE NOT FOUND
          </span>
          <h1 className="font-orbitron text-2xl sm:text-3xl font-black uppercase text-slate-900 mb-4">
            Article Not Found
          </h1>
          <p className="text-slate-600 text-base leading-relaxed mb-8">
            The requested blog article could not be found in the publication archive.
          </p>
          <button
            onClick={() => navigate('/blog')}
            className="px-8 py-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-full font-mono text-xs uppercase tracking-widest font-bold transition-colors"
          >
            Return to Blog
          </button>
        </div>
      </div>
    );
  }

  const currentIndex = allPosts.findIndex((p) => p.slug === post.slug);
  const prevPost = currentIndex > 0 ? allPosts[currentIndex - 1] : null;
  const nextPost =
    currentIndex >= 0 && currentIndex < allPosts.length - 1
      ? allPosts[currentIndex + 1]
      : null;

  const coverSrc = resolveBlogImageUrl(post.coverImage);

  return (
    <div
      ref={pageRef}
      className="min-h-screen bg-[#eef2f5] text-slate-900 pt-20 sm:pt-24 pb-16 selection:bg-blue-500/20"
    >
      {/* Top Fixed Reading Progress Indicator */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-slate-200/60 z-50 pointer-events-none">
        <div
          className="h-full bg-gradient-to-r from-[#2563EB] to-cyan-400 transition-all duration-150"
          style={{ width: `${readingProgress}%` }}
        />
      </div>

      {/* Subtle Background Grid */}
      <div
        className="fixed inset-0 pointer-events-none opacity-35"
        style={{
          backgroundImage:
            'radial-gradient(circle at center, #94a3b8 1px, transparent 1px)',
          backgroundSize: '36px 36px',
        }}
      />

      {/* Full-Width Responsive Publication Container (minimal side margins, edge-to-edge structured layout) */}
      <div className="w-full max-w-[1600px] mx-auto px-3 sm:px-6 lg:px-10 relative z-10">
        {/* Top Breadcrumb & Volume Bar */}
        <div className="reveal-anim flex flex-wrap items-center justify-between gap-3 py-3 mb-4 border-b border-slate-200/80">
          <div className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm font-mono">
            <button
              onClick={() => navigate('/blog')}
              className="inline-flex items-center gap-2 text-slate-600 hover:text-blue-600 font-bold uppercase tracking-wider transition-colors"
            >
              <ArrowLeft size={15} />
              <span>Engineering Journal</span>
            </button>
            <ChevronRight size={14} className="text-slate-400" />
            <span className="text-blue-600 font-bold uppercase tracking-wider truncate max-w-[180px] sm:max-w-none">
              {post.category}
            </span>
          </div>

          <div className="flex items-center gap-4 font-mono text-xs text-slate-500">
            <span className="hidden sm:inline-flex items-center gap-1.5 font-semibold">
              <BookOpen size={14} className="text-blue-600" />
              ISSUE // {post.recordId || 'LOG-01'}
            </span>
            <span className="px-2.5 py-1 rounded-md bg-white border border-slate-200 text-slate-700 font-bold">
              {Math.round(readingProgress)}% READ
            </span>
          </div>
        </div>

        {/* =================================================================== */}
        {/* EDITORIAL BOOK HEADER SPREAD (Split Title + Cover Figure)           */}
        {/* =================================================================== */}
        <header className="reveal-anim bg-white rounded-2xl sm:rounded-3xl border border-slate-200/90 shadow-[0_8px_30px_rgba(15,23,42,0.04)] overflow-hidden mb-6 sm:mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-12">
            {/* Left 7 Cols: Title, Abstract & Author Metadata */}
            <div className="lg:col-span-7 p-5 sm:p-8 md:p-10 lg:p-12 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-slate-100">
              <div>
                {/* Meta Row */}
                <div className="flex flex-wrap items-center gap-3 mb-4">
                  <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-50 border border-blue-200/80 text-blue-700 font-mono text-xs font-bold uppercase tracking-wider">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse" />
                    {post.category}
                  </span>
                  <span className="font-mono text-xs sm:text-sm text-slate-500 font-semibold">
                    {formatDisplayDate(post.date)}
                  </span>
                  <span className="text-slate-300">•</span>
                  <span className="font-mono text-xs sm:text-sm text-slate-500 font-semibold flex items-center gap-1.5">
                    <Clock size={14} className="text-blue-600" />
                    {post.readTime}
                  </span>
                </div>

                {/* Balanced Publication Title */}
                <h1 className="font-orbitron text-2xl sm:text-3xl md:text-4xl font-black uppercase text-slate-900 tracking-tight leading-[1.18] mb-3">
                  {post.title}
                </h1>

                {post.subtitle && (
                  <p className="font-orbitron text-sm sm:text-base md:text-lg font-bold text-blue-600 uppercase tracking-wide mb-5">
                    {post.subtitle}
                  </p>
                )}

                {/* Abstract / Lead Summary Box */}
                {post.excerpt && (
                  <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border-l-4 border-blue-600 text-slate-700 text-sm sm:text-base leading-relaxed">
                    <span className="block font-mono text-xs font-bold uppercase tracking-wider text-blue-600 mb-1">
                      Abstract // Executive Summary
                    </span>
                    {post.excerpt}
                  </div>
                )}
              </div>

              {/* Author & Publication Stamp Footer */}
              <div className="pt-6 mt-6 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-sm">
                    <User size={18} />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-slate-900">
                      {post.author}
                    </div>
                    <div className="font-mono text-xs text-slate-500">
                      {post.authorRole || 'BRACU Diganta Research Division'}
                    </div>
                  </div>
                </div>

                {post.tags && post.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {post.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2.5 py-1 rounded-md bg-slate-100 text-slate-600 font-mono text-xs font-semibold"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Right 5 Cols: Cover Figure */}
            <div
              onClick={() => setLightboxImage(coverSrc)}
              className="lg:col-span-5 relative min-h-[240px] sm:min-h-[320px] lg:min-h-full bg-slate-900 overflow-hidden cursor-zoom-in group"
            >
              <img
                src={coverSrc}
                alt={post.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/75 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-white">
                <div className="flex items-center gap-2 bg-black/55 backdrop-blur-md px-3.5 py-1.5 rounded-xl border border-white/15">
                  <Activity size={14} className="text-cyan-400" />
                  <span className="font-mono text-xs uppercase tracking-wider font-bold">
                    FIG 0.0 // COVER TELEMETRY
                  </span>
                </div>
                <span className="font-mono text-xs bg-black/55 backdrop-blur-md px-3 py-1 rounded-lg border border-white/15 hidden sm:inline">
                  Click to Enlarge
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* Mobile / Tablet Collapsible Chapter Index (< lg) */}
        {headings.length > 0 && (
          <div className="lg:hidden mb-6 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <button
              type="button"
              onClick={() => setMobileTocOpen((prev) => !prev)}
              className="w-full px-5 py-3.5 flex items-center justify-between font-orbitron text-xs sm:text-sm font-bold uppercase text-slate-900"
            >
              <span className="flex items-center gap-2">
                <List size={16} className="text-blue-600" />
                Chapter Outline ({headings.length} Sections)
              </span>
              <ChevronRight
                size={16}
                className={`text-slate-400 transition-transform ${
                  mobileTocOpen ? 'rotate-90' : ''
                }`}
              />
            </button>
            {mobileTocOpen && (
              <nav className="px-5 pb-4 pt-1 border-t border-slate-100 space-y-1.5">
                {headings.map((h, idx) => (
                  <a
                    key={idx}
                    href={`#${h.id}`}
                    onClick={(e) => {
                      e.preventDefault();
                      setMobileTocOpen(false);
                      document
                        .getElementById(h.id)
                        ?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="flex items-center gap-2.5 py-1.5 text-sm text-slate-600 hover:text-blue-600 font-medium"
                  >
                    <span className="font-mono text-xs text-blue-600 font-bold">
                      0{idx + 1}.
                    </span>
                    <span>{h.text}</span>
                  </a>
                ))}
              </nav>
            )}
          </div>
        )}

        {/* =================================================================== */}
        {/* 3-COLUMN BOOK FOLIO LAYOUT (Left Index | Center Book Page | Specs)  */}
        {/* =================================================================== */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 xl:gap-8 items-start">
          {/* LEFT COLUMN (3 Cols on Desktop): Sticky Book Chapter Index & Journal Directory */}
          <aside className="hidden lg:block lg:col-span-3 sticky top-24 space-y-6">
            {/* Chapter Outline Card */}
            {headings.length > 0 && (
              <div className="bg-white rounded-2xl border border-slate-200/90 shadow-[0_6px_25px_rgba(15,23,42,0.03)] overflow-hidden">
                <div className="px-5 py-4 bg-slate-50/80 border-b border-slate-100 flex items-center justify-between">
                  <h3 className="font-orbitron font-bold text-xs uppercase tracking-wider text-slate-900 flex items-center gap-2">
                    <List size={15} className="text-blue-600" />
                    Chapter Outline
                  </h3>
                  <span className="font-mono text-xs text-slate-400 font-semibold">
                    {headings.length} SEC
                  </span>
                </div>

                <nav className="p-3 space-y-1">
                  {headings.map((h, idx) => {
                    const isActive = activeHeadingId === h.id;
                    return (
                      <a
                        key={idx}
                        href={`#${h.id}`}
                        onClick={(e) => {
                          e.preventDefault();
                          document
                            .getElementById(h.id)
                            ?.scrollIntoView({ behavior: 'smooth' });
                        }}
                        className={`flex items-start gap-2.5 px-3 py-2 rounded-xl text-sm transition-all ${
                          isActive
                            ? 'bg-blue-50 text-blue-700 font-bold shadow-xs'
                            : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 font-medium'
                        } ${h.level === 3 ? 'pl-6 text-xs' : ''}`}
                      >
                        <span
                          className={`font-mono text-xs mt-0.5 shrink-0 ${
                            isActive ? 'text-blue-600 font-bold' : 'text-slate-400'
                          }`}
                        >
                          0{idx + 1}
                        </span>
                        <span className="leading-snug">{h.text}</span>
                      </a>
                    );
                  })}
                </nav>
              </div>
            )}

            {/* Journal Publications Switcher (Flip between articles like chapters in a book) */}
            <div className="bg-white rounded-2xl border border-slate-200/90 shadow-[0_6px_25px_rgba(15,23,42,0.03)] overflow-hidden">
              <div className="px-5 py-4 bg-slate-50/80 border-b border-slate-100 flex items-center justify-between">
                <h3 className="font-orbitron font-bold text-xs uppercase tracking-wider text-slate-900 flex items-center gap-2">
                  <Layers size={15} className="text-blue-600" />
                  Journal Chapters
                </h3>
                <span className="font-mono text-xs text-blue-600 font-bold">
                  VOL. 2026
                </span>
              </div>

              <div className="divide-y divide-slate-100">
                {allPosts.map((item, idx) => {
                  const isCurrent = item.slug === post.slug;
                  return (
                    <button
                      key={item.slug}
                      onClick={() => navigate(`/blog/${item.slug}`)}
                      className={`w-full text-left p-4 transition-colors flex items-start gap-3 ${
                        isCurrent
                          ? 'bg-blue-50/60 border-l-4 border-blue-600'
                          : 'hover:bg-slate-50'
                      }`}
                    >
                      <span
                        className={`font-orbitron text-xs font-bold px-2 py-0.5 rounded mt-0.5 shrink-0 ${
                          isCurrent
                            ? 'bg-blue-600 text-white'
                            : 'bg-slate-100 text-slate-500'
                        }`}
                      >
                        CH.{idx + 1}
                      </span>
                      <div className="min-w-0">
                        <p
                          className={`text-sm font-bold leading-snug line-clamp-2 ${
                            isCurrent ? 'text-blue-700' : 'text-slate-800'
                          }`}
                        >
                          {item.title}
                        </p>
                        <span className="block font-mono text-xs text-slate-400 mt-1">
                          {item.readTime}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </aside>

          {/* CENTER COLUMN (6 Cols on Desktop): The Structured "Book Page" Sheet */}
          <main className="lg:col-span-6 min-w-0">
            <article className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200/90 shadow-[0_12px_40px_rgba(15,23,42,0.04)] overflow-hidden">
              {/* Top Book Folio Running Header */}
              <div className="px-5 sm:px-8 md:px-10 py-3.5 bg-slate-50/70 border-b border-slate-100 flex items-center justify-between text-xs font-mono text-slate-500">
                <span className="uppercase tracking-wider font-semibold truncate">
                  BRACU DIGANTA // {post.category}
                </span>
                <span className="uppercase tracking-wider font-bold text-slate-700 shrink-0 ml-2">
                  {post.recordId || 'DOC-01'}
                </span>
              </div>

              {/* Main Editorial Reading Canvas */}
              <div className="p-5 sm:p-8 md:p-10 lg:p-12">
                <MarkdownRenderer content={post.content} />

                {/* Inline Visual Figures Section inside the Book Page */}
                {post.gallery && post.gallery.length > 0 && (
                  <div className="mt-12 pt-8 border-t border-slate-200">
                    <div className="flex items-center justify-between mb-5">
                      <div>
                        <span className="font-mono text-xs uppercase tracking-wider text-blue-600 font-bold block">
                          Appendix // Photographic Plates
                        </span>
                        <h3 className="font-orbitron text-lg sm:text-xl font-bold uppercase text-slate-900">
                          Mission Visual Figures
                        </h3>
                      </div>
                      <span className="font-mono text-xs text-slate-500 font-semibold">
                        {post.gallery.length} Plates
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {post.gallery.map((imgUrl, idx) => {
                        const resolvedGalleryUrl = resolveBlogImageUrl(imgUrl);
                        return (
                          <figure
                            key={idx}
                            onClick={() => setLightboxImage(resolvedGalleryUrl)}
                            className="rounded-2xl overflow-hidden border border-slate-200 bg-slate-900 cursor-zoom-in group shadow-xs"
                          >
                            <div className="aspect-[16/10] overflow-hidden relative">
                              <img
                                src={resolvedGalleryUrl}
                                alt={`${post.title} figure ${idx + 1}`}
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                loading="lazy"
                              />
                            </div>
                            <figcaption className="px-4 py-2.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between font-mono text-xs text-slate-600">
                              <span className="font-semibold">
                                PLATE 0{idx + 1}
                              </span>
                              <span className="text-blue-600 font-bold">
                                Expand ↗
                              </span>
                            </figcaption>
                          </figure>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* Book Page Bottom Turner (Previous / Next Chapter Navigation) */}
              <div className="px-5 sm:px-8 md:px-10 py-6 bg-slate-50/80 border-t border-slate-200/80 grid grid-cols-1 sm:grid-cols-2 gap-4">
                {prevPost ? (
                  <button
                    onClick={() => navigate(`/blog/${prevPost.slug}`)}
                    className="group text-left p-4 rounded-2xl bg-white border border-slate-200 hover:border-blue-400 transition-all shadow-2xs flex items-center gap-3"
                  >
                    <div className="w-9 h-9 rounded-xl bg-slate-100 group-hover:bg-blue-600 group-hover:text-white text-slate-600 flex items-center justify-center shrink-0 transition-colors">
                      <ArrowLeft size={16} />
                    </div>
                    <div className="min-w-0">
                      <span className="block font-mono text-xs text-slate-400 uppercase font-bold">
                        Previous Chapter
                      </span>
                      <span className="block text-sm font-bold text-slate-900 group-hover:text-blue-600 truncate">
                        {prevPost.title}
                      </span>
                    </div>
                  </button>
                ) : (
                  <button
                    onClick={() => navigate('/blog')}
                    className="group text-left p-4 rounded-2xl bg-white border border-slate-200 hover:border-blue-400 transition-all shadow-2xs flex items-center gap-3"
                  >
                    <div className="w-9 h-9 rounded-xl bg-slate-100 group-hover:bg-blue-600 group-hover:text-white text-slate-600 flex items-center justify-center shrink-0 transition-colors">
                      <ArrowLeft size={16} />
                    </div>
                    <div>
                      <span className="block font-mono text-xs text-slate-400 uppercase font-bold">
                        Index
                      </span>
                      <span className="block text-sm font-bold text-slate-900 group-hover:text-blue-600">
                        All Journal Chapters
                      </span>
                    </div>
                  </button>
                )}

                {nextPost ? (
                  <button
                    onClick={() => navigate(`/blog/${nextPost.slug}`)}
                    className="group text-right p-4 rounded-2xl bg-white border border-slate-200 hover:border-blue-400 transition-all shadow-2xs flex items-center justify-end gap-3"
                  >
                    <div className="min-w-0">
                      <span className="block font-mono text-xs text-slate-400 uppercase font-bold">
                        Next Chapter
                      </span>
                      <span className="block text-sm font-bold text-slate-900 group-hover:text-blue-600 truncate">
                        {nextPost.title}
                      </span>
                    </div>
                    <div className="w-9 h-9 rounded-xl bg-slate-100 group-hover:bg-blue-600 group-hover:text-white text-slate-600 flex items-center justify-center shrink-0 transition-colors">
                      <ArrowRight size={16} />
                    </div>
                  </button>
                ) : (
                  <button
                    onClick={() => navigate('/blog')}
                    className="group text-right p-4 rounded-2xl bg-white border border-slate-200 hover:border-blue-400 transition-all shadow-2xs flex items-center justify-end gap-3"
                  >
                    <div>
                      <span className="block font-mono text-xs text-slate-400 uppercase font-bold">
                        Archive
                      </span>
                      <span className="block text-sm font-bold text-slate-900 group-hover:text-blue-600">
                        Browse Full Archive
                      </span>
                    </div>
                    <div className="w-9 h-9 rounded-xl bg-slate-100 group-hover:bg-blue-600 group-hover:text-white text-slate-600 flex items-center justify-center shrink-0 transition-colors">
                      <ArrowRight size={16} />
                    </div>
                  </button>
                )}
              </div>
            </article>
          </main>

          {/* RIGHT COLUMN (3 Cols on Desktop): Sticky Technical Dossier & Quick Figures */}
          <aside className="lg:col-span-3 lg:sticky lg:top-24 space-y-6">
            {/* Technical Specifications Dossier Card */}
            <div className="bg-white rounded-2xl border border-slate-200/90 shadow-[0_6px_25px_rgba(15,23,42,0.03)] overflow-hidden">
              <div className="px-5 py-4 bg-slate-900 text-white flex items-center justify-between">
                <h4 className="font-orbitron font-bold text-xs uppercase tracking-wider flex items-center gap-2">
                  <Cpu size={15} className="text-cyan-400" />
                  Technical Dossier
                </h4>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              </div>

              <div className="p-5 divide-y divide-slate-100">
                {(post.specs || []).map((spec, idx) => {
                  const IconComp = SPEC_ICONS[idx % SPEC_ICONS.length];
                  return (
                    <div
                      key={idx}
                      className="py-3.5 first:pt-0 last:pb-0 flex items-start gap-3"
                    >
                      <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 border border-blue-100">
                        <IconComp size={16} />
                      </div>
                      <div className="min-w-0">
                        <span className="block text-xs font-mono text-slate-500 uppercase tracking-wider font-semibold">
                          {spec.label}
                        </span>
                        <span className="font-bold text-slate-900 text-sm sm:text-base block">
                          {spec.value}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Quick Figure Plates Preview in Right Sidebar */}
            {post.gallery && post.gallery.length > 0 && (
              <div className="bg-white rounded-2xl border border-slate-200/90 shadow-[0_6px_25px_rgba(15,23,42,0.03)] overflow-hidden">
                <div className="px-5 py-4 bg-slate-50/80 border-b border-slate-100 flex items-center justify-between">
                  <h4 className="font-orbitron font-bold text-xs uppercase tracking-wider text-slate-900 flex items-center gap-2">
                    <ImageIcon size={15} className="text-blue-600" />
                    Figure Plates
                  </h4>
                  <span className="font-mono text-xs text-slate-400 font-bold">
                    {post.gallery.length}
                  </span>
                </div>
                <div className="p-4 grid grid-cols-2 gap-2.5">
                  {post.gallery.map((imgUrl, idx) => {
                    const resolvedUrl = resolveBlogImageUrl(imgUrl);
                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setLightboxImage(resolvedUrl)}
                        className="aspect-square rounded-xl overflow-hidden border border-slate-200 bg-slate-900 group relative"
                      >
                        <img
                          src={resolvedUrl}
                          alt={`Plate ${idx + 1}`}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                        <span className="absolute bottom-1.5 right-1.5 px-1.5 py-0.5 rounded bg-black/65 text-white font-mono text-[10px] font-bold">
                          0{idx + 1}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Publication Archive Card */}
            <div className="bg-slate-900 rounded-2xl p-6 text-white relative overflow-hidden shadow-lg">
              <div className="absolute -top-10 -right-10 w-28 h-28 bg-blue-500/20 rounded-full blur-2xl pointer-events-none" />
              <h4 className="font-orbitron font-bold text-base uppercase mb-2">
                Diganta Research Archive
              </h4>
              <p className="text-slate-300 text-sm leading-relaxed mb-5">
                Explore all technical logs, satellite subsystem analyses, and flight test reports.
              </p>
              <button
                onClick={() => navigate('/blog')}
                className="w-full py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-mono text-xs font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-2"
              >
                <span>Open Full Journal</span>
                <ArrowRight size={14} />
              </button>
            </div>
          </aside>
        </div>
      </div>

      {/* Lightbox Modal for Gallery Images */}
      {lightboxImage && (
        <div
          onClick={() => setLightboxImage(null)}
          className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4 md:p-10 cursor-zoom-out"
        >
          <button
            onClick={() => setLightboxImage(null)}
            className="absolute top-6 right-6 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
          >
            <X size={24} />
          </button>
          <img
            src={lightboxImage}
            alt="Expanded mission figure"
            className="max-w-full max-h-[88vh] rounded-2xl shadow-2xl object-contain"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
};
