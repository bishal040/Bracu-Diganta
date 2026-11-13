import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import gsap from 'gsap';
import {
  ArrowLeft,
  ArrowRight,
  Clock,
  ChevronRight,
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
        { opacity: 0, y: 16 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.05,
          ease: 'power3.out',
        }
      );
    }, pageRef);

    return () => ctx.revert();
  }, [post?.slug]);

  if (!post) {
    return (
      <div className="min-h-screen bg-[#f8fafc] text-slate-900 pt-28 pb-20 px-4 flex flex-col items-center justify-center text-center">
        <div className="bg-white rounded-2xl p-8 sm:p-12 border border-slate-200/80 max-w-md w-full">
          <h1 className="font-orbitron text-2xl font-bold uppercase text-slate-900 mb-3">
            Article Not Found
          </h1>
          <p className="text-slate-500 text-sm leading-relaxed mb-6">
            The requested article could not be found.
          </p>
          <button
            onClick={() => navigate('/blog')}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-full font-mono text-xs uppercase tracking-wider font-bold transition-colors"
          >
            Back to Blog
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
      className="min-h-screen bg-[#f8fafc] text-slate-900 pt-24 sm:pt-28 pb-24 selection:bg-blue-500/20"
    >
      {/* Subtle Top Reading Progress Bar */}
      <div className="fixed top-0 left-0 right-0 h-0.5 bg-slate-200/50 z-50 pointer-events-none">
        <div
          className="h-full bg-blue-600 transition-all duration-150"
          style={{ width: `${readingProgress}%` }}
        />
      </div>

      <div className="w-full max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-10">
        {/* Back Link */}
        <div className="reveal-anim mb-8">
          <button
            onClick={() => navigate('/blog')}
            className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-900 font-mono text-xs uppercase tracking-wider font-bold transition-colors"
          >
            <ArrowLeft size={15} />
            <span>Back to All Articles</span>
          </button>
        </div>

        {/* Clean Minimalist Article Header */}
        <header className="reveal-anim max-w-4xl mb-8 sm:mb-10">
          <div className="flex flex-wrap items-center gap-3 mb-4 font-mono text-xs text-slate-500">
            <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-600 font-bold uppercase tracking-wider">
              {post.category}
            </span>
            <span>•</span>
            <span>{formatDisplayDate(post.date)}</span>
            <span>•</span>
            <span className="inline-flex items-center gap-1.5">
              <Clock size={13} className="text-slate-400" />
              {post.readTime}
            </span>
          </div>

          <h1 className="font-orbitron text-2xl sm:text-3xl md:text-4xl lg:text-[42px] font-black text-slate-900 tracking-tight leading-[1.2] mb-4">
            {post.title}
          </h1>

          {post.subtitle && (
            <p className="text-base sm:text-lg text-slate-600 font-medium leading-relaxed mb-6">
              {post.subtitle}
            </p>
          )}

          {/* Author & Tags Row */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-slate-200/80">
            <div>
              <span className="text-sm font-bold text-slate-900">
                {post.author}
              </span>
              {post.authorRole && (
                <span className="text-sm text-slate-500">
                  {' '}
                  — {post.authorRole}
                </span>
              )}
            </div>

            {post.tags && post.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="font-mono text-xs text-slate-500 bg-white border border-slate-200/80 px-2.5 py-0.5 rounded-full"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </header>

        {/* Clean Cover Image */}
        <div
          onClick={() => setLightboxImage(coverSrc)}
          className="reveal-anim relative rounded-2xl sm:rounded-3xl overflow-hidden bg-slate-100 border border-slate-200/80 mb-10 sm:mb-12 max-h-[520px] cursor-zoom-in"
        >
          <img
            src={coverSrc}
            alt={post.title}
            className="w-full h-full max-h-[520px] object-cover"
          />
        </div>

        {/* Mobile Table of Contents (< lg) */}
        {headings.length > 0 && (
          <div className="lg:hidden mb-8 bg-white rounded-2xl border border-slate-200/80 overflow-hidden">
            <button
              type="button"
              onClick={() => setMobileTocOpen((prev) => !prev)}
              className="w-full px-5 py-3.5 flex items-center justify-between font-mono text-xs font-bold uppercase tracking-wider text-slate-700"
            >
              <span>On This Page ({headings.length})</span>
              <ChevronRight
                size={15}
                className={`text-slate-400 transition-transform ${
                  mobileTocOpen ? 'rotate-90' : ''
                }`}
              />
            </button>
            {mobileTocOpen && (
              <nav className="px-5 pb-4 pt-1 border-t border-slate-100 space-y-2">
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
                    className="block py-1 text-sm text-slate-600 hover:text-blue-600"
                  >
                    {h.text}
                  </a>
                ))}
              </nav>
            )}
          </div>
        )}

        {/* Clean 2-Column Reading Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 xl:gap-12 items-start">
          {/* Main Article Content (8 Columns) */}
          <main className="lg:col-span-8 bg-white rounded-2xl sm:rounded-3xl border border-slate-200/80 p-6 sm:p-10 md:p-12 shadow-[0_4px_24px_rgba(15,23,42,0.03)]">
            {post.excerpt && (
              <p className="text-base sm:text-lg text-slate-600 leading-relaxed pb-8 mb-8 border-b border-slate-100 font-medium">
                {post.excerpt}
              </p>
            )}

            <MarkdownRenderer content={post.content} />

            {/* Clean Image Gallery (if present) */}
            {post.gallery && post.gallery.length > 0 && (
              <section className="mt-12 pt-10 border-t border-slate-100">
                <h3 className="font-orbitron text-lg font-bold uppercase text-slate-900 mb-5">
                  Project Gallery
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {post.gallery.map((imgUrl, idx) => {
                    const resolved = resolveBlogImageUrl(imgUrl);
                    return (
                      <div
                        key={idx}
                        onClick={() => setLightboxImage(resolved)}
                        className="group rounded-xl overflow-hidden border border-slate-200/80 bg-slate-100 aspect-[16/10] cursor-zoom-in"
                      >
                        <img
                          src={resolved}
                          alt={`${post.title} - ${idx + 1}`}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          loading="lazy"
                        />
                      </div>
                    );
                  })}
                </div>
              </section>
            )}
          </main>

          {/* Minimalist Right Sidebar (4 Columns, Sticky) */}
          <aside className="hidden lg:block lg:col-span-4 sticky top-28 space-y-6">
            {/* On This Page Outline */}
            {headings.length > 0 && (
              <div className="bg-white rounded-2xl border border-slate-200/80 p-6">
                <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">
                  On This Page
                </h3>
                <nav className="space-y-1 border-l border-slate-200">
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
                        className={`block pl-4 py-1.5 text-sm border-l-2 -ml-px transition-colors ${
                          isActive
                            ? 'border-blue-600 text-blue-600 font-semibold'
                            : 'border-transparent text-slate-600 hover:text-slate-900'
                        } ${h.level === 3 ? 'pl-7 text-xs' : ''}`}
                      >
                        {h.text}
                      </a>
                    );
                  })}
                </nav>
              </div>
            )}

            {/* Key Specifications (Minimalist List) */}
            {post.specs && post.specs.length > 0 && (
              <div className="bg-white rounded-2xl border border-slate-200/80 p-6">
                <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">
                  Specifications
                </h3>
                <dl className="divide-y divide-slate-100">
                  {post.specs.map((spec, idx) => (
                    <div
                      key={idx}
                      className="py-2.5 first:pt-0 last:pb-0 flex items-center justify-between gap-4 text-sm"
                    >
                      <dt className="text-slate-500">{spec.label}</dt>
                      <dd className="font-mono font-semibold text-slate-900 text-right">
                        {spec.value}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>
            )}
          </aside>
        </div>

        {/* Minimal Previous / Next Article Footer */}
        {(prevPost || nextPost) && (
          <div className="mt-12 pt-8 border-t border-slate-200/80 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {prevPost ? (
              <button
                onClick={() => navigate(`/blog/${prevPost.slug}`)}
                className="group text-left bg-white rounded-2xl p-6 border border-slate-200/80 hover:border-blue-300 transition-all"
              >
                <span className="inline-flex items-center gap-1.5 font-mono text-xs text-slate-400 uppercase tracking-wider mb-1.5">
                  <ArrowLeft size={13} /> Previous Article
                </span>
                <div className="font-orbitron text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-1">
                  {prevPost.title}
                </div>
              </button>
            ) : (
              <div />
            )}

            {nextPost ? (
              <button
                onClick={() => navigate(`/blog/${nextPost.slug}`)}
                className="group text-left sm:text-right bg-white rounded-2xl p-6 border border-slate-200/80 hover:border-blue-300 transition-all"
              >
                <span className="inline-flex items-center sm:justify-end gap-1.5 font-mono text-xs text-slate-400 uppercase tracking-wider mb-1.5">
                  Next Article <ArrowRight size={13} />
                </span>
                <div className="font-orbitron text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-1">
                  {nextPost.title}
                </div>
              </button>
            ) : (
              <div />
            )}
          </div>
        )}
      </div>

      {/* Lightbox Image Modal */}
      {lightboxImage && (
        <div
          onClick={() => setLightboxImage(null)}
          className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-xs flex items-center justify-center p-4"
        >
          <button
            onClick={() => setLightboxImage(null)}
            className="absolute top-6 right-6 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
          >
            <X size={20} />
          </button>
          <img
            src={lightboxImage}
            alt="Enlarged view"
            className="max-w-full max-h-[88vh] rounded-xl object-contain"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
};
