import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import gsap from 'gsap';
import {
  ArrowLeft,
  Activity,
  Clock,
  Cpu,
  Rocket,
  Target,
  User,
  List,
  X,
} from 'lucide-react';
import { MagneticButton } from '../ui/MagneticButton';
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
import { BlogCard } from '../sections/BlogSection';

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
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    setPost(getBlogBySlugSync(slug));

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

  useEffect(() => {
    if (!pageRef.current || !post) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.reveal-anim',
        { opacity: 0, y: 25 },
        {
          opacity: 1,
          y: 0,
          duration: 0.85,
          stagger: 0.08,
          ease: 'power3.out',
          delay: 0.1,
        }
      );
    }, pageRef);

    return () => ctx.revert();
  }, [post?.slug]);

  if (!post) {
    return (
      <div className="min-h-screen bg-[#eef2f5] text-slate-900 pt-32 pb-20 px-6 flex flex-col items-center justify-center text-center">
        <div className="bg-white rounded-3xl p-10 md:p-14 border border-slate-200 shadow-lg max-w-lg">
          <span className="font-mono text-xs text-blue-600 uppercase tracking-widest font-bold block mb-3">
            404 // ARTICLE NOT FOUND
          </span>
          <h1 className="font-orbitron text-2xl md:text-3xl font-black uppercase text-slate-900 mb-4">
            Article Not Found
          </h1>
          <p className="text-slate-600 text-base leading-relaxed mb-8">
            The requested blog article could not be found.
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

  const headings = extractHeadings(post.content);
  const relatedPosts = allPosts
    .filter((p) => p.slug !== post.slug)
    .slice(0, 3);
  const coverSrc = resolveBlogImageUrl(post.coverImage);

  return (
    <div
      ref={pageRef}
      className="min-h-screen bg-[#eef2f5] text-slate-900 pt-28 pb-20 px-6 md:px-12 selection:bg-blue-500/20"
    >
      {/* Background Grid Pattern */}
      <div
        className="fixed inset-0 pointer-events-none opacity-40"
        style={{
          backgroundImage:
            'radial-gradient(circle at center, #94a3b8 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />

      <div className="max-w-5xl mx-auto relative z-10">
        {/* Clean Public Back Navigation */}
        <div className="reveal-anim mb-8">
          <button
            onClick={() => navigate('/blog')}
            className="group flex items-center gap-3 text-slate-600 hover:text-slate-900 transition-colors"
          >
            <div className="w-10 h-10 rounded-full border border-slate-300 bg-white flex items-center justify-center group-hover:border-blue-500 group-hover:bg-blue-50 transition-all shadow-sm">
              <ArrowLeft size={16} />
            </div>
            <span className="font-mono text-xs md:text-sm tracking-wider uppercase font-bold">
              Back to Blog
            </span>
          </button>
        </div>

        {/* Category & Meta Badges — Consistent, readable text-xs / text-sm */}
        <div className="reveal-anim mb-5 flex flex-wrap items-center gap-4">
          <div className="bg-blue-100 border border-blue-200 px-4 py-1.5 rounded-full flex items-center gap-2 shadow-sm">
            <div className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
            <span className="text-xs font-mono tracking-wider uppercase text-blue-700 font-bold">
              {post.category}
            </span>
          </div>

          <span className="font-mono text-xs md:text-sm text-slate-500 font-semibold">
            {formatDisplayDate(post.date)}
          </span>

          <span className="text-slate-300">•</span>

          <span className="font-mono text-xs md:text-sm text-slate-500 flex items-center gap-1.5 font-semibold">
            <Clock size={14} className="text-blue-600" />
            {post.readTime}
          </span>
        </div>

        {/* Title & Subtitle — Balanced, proportional scale */}
        <h1 className="reveal-anim font-orbitron text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black uppercase tracking-tight leading-[1.15] mb-4 text-slate-900">
          {post.title}
        </h1>

        {post.subtitle && (
          <p className="reveal-anim font-orbitron text-base md:text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500 uppercase tracking-wide mb-8">
            {post.subtitle}
          </p>
        )}

        {/* Hero Image */}
        <div className="reveal-anim relative w-full aspect-video md:aspect-[21/9] rounded-[2rem] overflow-hidden mb-12 shadow-[0_20px_60px_rgba(37,99,235,0.15)] group bg-slate-900">
          <img
            src={coverSrc}
            alt={post.title}
            className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent opacity-90" />

          <div className="absolute bottom-5 left-5 right-5 flex flex-wrap justify-between items-end gap-4">
            <div className="flex items-center gap-2.5 bg-white/20 backdrop-blur-md px-4 py-2 rounded-xl border border-white/30">
              <Activity size={16} className="text-cyan-300" />
              <span className="font-mono text-xs tracking-wider uppercase text-white font-bold drop-shadow-md">
                {post.recordId || 'SYS.TELEMETRY'} // {post.author}
              </span>
            </div>
          </div>
        </div>

        {/* Main 12-Col Body + Sidebar */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 lg:gap-12">
          {/* Left 8 Columns: Article Body */}
          <div className="md:col-span-8">
            <div className="reveal-anim">
              {/* Lead Excerpt Callout */}
              {post.excerpt && (
                <p className="text-base md:text-lg text-slate-700 leading-relaxed font-medium mb-8 pb-6 border-b border-slate-200/80">
                  {post.excerpt}
                </p>
              )}

              {/* Full Markdown Content */}
              <MarkdownRenderer content={post.content} />

              {/* Gallery Section */}
              {post.gallery && post.gallery.length > 0 && (
                <div className="mt-12 pt-8 border-t border-slate-200/80">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="w-2 h-2 bg-blue-600 rounded-sm" />
                    <span className="font-mono text-xs uppercase tracking-widest text-blue-600 font-bold">
                      Visual Documentation
                    </span>
                  </div>
                  <h3 className="font-orbitron text-xl md:text-2xl font-bold uppercase text-slate-900 mb-6">
                    Mission Image Gallery
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {post.gallery.map((imgUrl, idx) => {
                      const resolvedGalleryUrl = resolveBlogImageUrl(imgUrl);
                      return (
                        <div
                          key={idx}
                          onClick={() => setLightboxImage(resolvedGalleryUrl)}
                          className="rounded-2xl overflow-hidden relative group shadow-md cursor-pointer aspect-[16/10] bg-slate-900 border border-slate-200"
                        >
                          <img
                            src={resolvedGalleryUrl}
                            alt={`${post.title} gallery ${idx + 1}`}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                            loading="lazy"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                            <span className="font-mono text-xs text-white uppercase tracking-wider font-bold bg-black/50 backdrop-blur-sm px-3 py-1 rounded-full">
                              View Image 0{idx + 1}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Tags Footer */}
              {post.tags && post.tags.length > 0 && (
                <div className="mt-10 pt-6 border-t border-slate-200 flex flex-wrap items-center gap-2">
                  <span className="font-mono text-xs uppercase tracking-wider text-slate-500 font-bold mr-2">
                    TAGS:
                  </span>
                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3.5 py-1.5 rounded-full bg-white border border-slate-200 text-slate-700 font-mono text-xs tracking-wide font-semibold shadow-sm"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right 4 Columns: Telemetry Specs & Section Index Sidebar */}
          <div className="md:col-span-4 space-y-6">
            {/* Author & Mission Specs Card */}
            <div className="reveal-anim bg-white border border-white shadow-[0_20px_40px_rgba(0,0,0,0.04)] rounded-3xl p-6 md:p-7 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-slate-50 to-transparent pointer-events-none" />
              <h4 className="font-orbitron font-bold text-base md:text-lg text-slate-900 uppercase mb-5 tracking-wider relative z-10">
                Mission Specs
              </h4>

              <div className="space-y-5 relative z-10">
                {/* Author */}
                <div className="flex items-start gap-3.5 pb-5 border-b border-slate-100">
                  <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center shrink-0 border border-blue-100 shadow-sm">
                    <User size={18} className="text-blue-600" />
                  </div>
                  <div>
                    <span className="block text-xs font-mono text-slate-500 uppercase tracking-wider mb-0.5 font-semibold">
                      Author / Division
                    </span>
                    <span className="font-bold text-slate-900 text-sm md:text-base block">
                      {post.author}
                    </span>
                    {post.authorRole && (
                      <span className="font-mono text-xs text-blue-600 font-semibold">
                        {post.authorRole}
                      </span>
                    )}
                  </div>
                </div>

                {/* Custom Specs from Frontmatter */}
                {(post.specs || []).map((spec, idx) => {
                  const IconComp = SPEC_ICONS[idx % SPEC_ICONS.length];
                  return (
                    <div key={idx} className="flex items-start gap-3.5">
                      <div className="w-10 h-10 rounded-full bg-cyan-50/80 flex items-center justify-center shrink-0 border border-cyan-100 shadow-sm">
                        <IconComp size={18} className="text-blue-600" />
                      </div>
                      <div>
                        <span className="block text-xs font-mono text-slate-500 uppercase tracking-wider mb-0.5 font-semibold">
                          {spec.label}
                        </span>
                        <span className="font-bold text-slate-900 text-sm md:text-base">
                          {spec.value}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Table of Contents (if headings exist) */}
            {headings.length > 0 && (
              <div className="reveal-anim bg-white border border-white shadow-[0_20px_40px_rgba(0,0,0,0.04)] rounded-3xl p-6 md:p-7">
                <h4 className="font-orbitron font-bold text-base text-slate-900 uppercase mb-4 tracking-wider flex items-center gap-2">
                  <List size={16} className="text-blue-600" />
                  Article Sections
                </h4>
                <nav className="space-y-2">
                  {headings.map((h, idx) => (
                    <a
                      key={idx}
                      href={`#${h.id}`}
                      onClick={(e) => {
                        e.preventDefault();
                        document
                          .getElementById(h.id)
                          ?.scrollIntoView({ behavior: 'smooth' });
                      }}
                      className={`block text-sm text-slate-600 hover:text-blue-600 transition-colors py-1 border-l-2 border-slate-100 hover:border-blue-600 ${
                        h.level === 3 ? 'pl-5' : 'pl-3 font-semibold'
                      }`}
                    >
                      {h.text}
                    </a>
                  ))}
                </nav>
              </div>
            )}

            {/* CTA Card */}
            <div className="reveal-anim bg-slate-900 rounded-3xl p-6 md:p-7 relative overflow-hidden group shadow-2xl">
              <div className="absolute inset-0 bg-gradient-to-br from-slate-800 to-slate-900" />
              <div className="absolute -top-12 -right-12 w-32 h-32 bg-blue-500 opacity-20 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700" />
              <div className="relative z-10">
                <h4 className="font-orbitron font-bold text-lg md:text-xl text-white uppercase mb-3 leading-tight">
                  Explore More Articles
                </h4>
                <p className="text-slate-300 text-sm leading-relaxed mb-6">
                  Follow BRACU Diganta's engineering breakthroughs across avionics, aerodynamics, and satellite telemetry.
                </p>
                <MagneticButton
                  onClick={() => navigate('/blog')}
                  className="w-full bg-blue-600 text-white hover:bg-blue-500 border border-blue-500 shadow-lg shadow-blue-600/20 px-6 py-3.5 rounded-xl font-bold uppercase tracking-wider text-xs transition-all text-center"
                >
                  All Blog Articles
                </MagneticButton>
              </div>
            </div>
          </div>
        </div>

        {/* Related Blog Posts */}
        {relatedPosts.length > 0 && (
          <div className="mt-20 pt-14 border-t border-slate-200/80">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
              <div>
                <span className="font-mono text-xs text-blue-600 uppercase tracking-widest font-bold block mb-2">
                  Continue Reading
                </span>
                <h3 className="font-orbitron text-2xl md:text-3xl font-black uppercase text-slate-900 tracking-tight">
                  More Articles
                </h3>
              </div>
              <button
                onClick={() => navigate('/blog')}
                className="font-mono text-xs md:text-sm text-blue-600 hover:text-slate-900 uppercase tracking-wider font-bold transition-colors"
              >
                View All Articles →
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedPosts.map((rel) => (
                <BlogCard
                  key={rel.slug}
                  post={rel}
                  onClick={() => navigate(`/blog/${rel.slug}`)}
                />
              ))}
            </div>
          </div>
        )}
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
            alt="Expanded mission frame"
            className="max-w-full max-h-[88vh] rounded-2xl shadow-2xl object-contain"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
};
