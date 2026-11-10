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
  Share2,
  Check,
  Download,
  Edit3,
  List,
  X,
} from 'lucide-react';
import { MagneticButton } from '../ui/MagneticButton';
import { MarkdownRenderer } from '../ui/MarkdownRenderer';
import {
  fetchAllBlogs,
  getAllBlogsSync,
  getBlogBySlugSync,
} from '../../services/blogService';
import {
  type BlogPost,
  extractHeadings,
  formatDisplayDate,
  serializeToMarkdown,
} from '../../utils/markdown';
import { BlogCard } from '../sections/BlogSection';
import { useAuth } from '../../context/AuthContext';

const SPEC_ICONS = [Rocket, Target, Cpu, Activity];

export const BlogDetailPage: React.FC = () => {
  const { slug = '' } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const pageRef = useRef<HTMLDivElement>(null);

  const [post, setPost] = useState<BlogPost | undefined>(() =>
    getBlogBySlugSync(slug)
  );
  const [allPosts, setAllPosts] = useState<BlogPost[]>(() =>
    getAllBlogsSync(false)
  );
  const [copiedLink, setCopiedLink] = useState(false);
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    setPost(getBlogBySlugSync(slug));

    let mounted = true;
    fetchAllBlogs(true).then((fresh) => {
      if (!mounted) return;
      setAllPosts(fresh.filter((p) => p.status !== 'DRAFT'));
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

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2200);
  };

  const handleDownloadMd = () => {
    if (!post) return;
    const mdString = post.rawMarkdown || serializeToMarkdown(post);
    const blob = new Blob([mdString], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${post.slug}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (!post) {
    return (
      <div className="min-h-screen bg-[#eef2f5] text-slate-900 pt-32 pb-20 px-6 flex flex-col items-center justify-center text-center">
        <div className="bg-white rounded-3xl p-10 md:p-14 border border-slate-200 shadow-lg max-w-lg">
          <span className="font-mono text-xs text-blue-600 uppercase tracking-[0.25em] font-bold block mb-3">
            404 // TRANSMISSION NOT FOUND
          </span>
          <h1 className="font-orbitron text-3xl md:text-4xl font-black uppercase text-slate-900 mb-4">
            Mission Log Missing
          </h1>
          <p className="text-slate-600 text-sm leading-relaxed mb-8">
            The requested markdown blog article could not be located in the mission archive.
          </p>
          <button
            onClick={() => navigate('/blog')}
            className="px-8 py-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-full font-mono text-xs uppercase tracking-widest font-bold transition-colors"
          >
            Return to Blog Archive
          </button>
        </div>
      </div>
    );
  }

  const headings = extractHeadings(post.content);
  const relatedPosts = allPosts
    .filter((p) => p.slug !== post.slug)
    .slice(0, 3);

  return (
    <div
      ref={pageRef}
      className="min-h-screen bg-[#eef2f5] text-slate-900 pt-24 pb-20 px-6 md:px-12 selection:bg-blue-500/20"
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
        {/* Top Navigation Bar */}
        <div className="reveal-anim mb-10 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/blog')}
              className="group flex items-center gap-3 text-slate-500 hover:text-slate-900 transition-colors"
            >
              <div className="w-10 h-10 rounded-full border border-slate-300 bg-white flex items-center justify-center group-hover:border-blue-500 group-hover:bg-blue-50 transition-all shadow-sm">
                <ArrowLeft size={16} />
              </div>
              <span className="font-mono text-xs md:text-sm tracking-widest uppercase font-semibold">
                All Logs
              </span>
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={handleDownloadMd}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-slate-200 hover:border-blue-400 text-slate-700 hover:text-blue-600 font-mono text-[11px] uppercase tracking-wider font-bold transition-all shadow-sm"
              title="Download raw Markdown (.md) file"
            >
              <Download size={13} /> .MD File
            </button>

            <button
              onClick={handleShare}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-slate-200 hover:border-blue-400 text-slate-700 hover:text-blue-600 font-mono text-[11px] uppercase tracking-wider font-bold transition-all shadow-sm"
            >
              {copiedLink ? (
                <>
                  <Check size={13} className="text-emerald-600" /> Copied URL
                </>
              ) : (
                <>
                  <Share2 size={13} /> Share
                </>
              )}
            </button>

            {user && (
              <button
                onClick={() =>
                  navigate(`/admin/dashboard?tab=blogs&edit=${post.slug}`)
                }
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900 hover:bg-blue-600 text-white font-mono text-[11px] uppercase tracking-wider font-bold transition-all shadow-sm"
              >
                <Edit3 size={13} /> Edit in Admin
              </button>
            )}
          </div>
        </div>

        {/* Category & Meta Badges */}
        <div className="reveal-anim mb-6 flex flex-wrap items-center gap-4">
          <div className="bg-blue-100 border border-blue-200 px-4 py-2 rounded-full flex items-center gap-2 shadow-sm">
            <div className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
            <span className="text-[10px] font-mono tracking-[0.2em] uppercase text-blue-700 font-bold">
              {post.category}
            </span>
          </div>

          <span className="font-mono text-xs md:text-sm text-slate-500 font-semibold">
            {formatDisplayDate(post.date)}
          </span>

          <span className="text-slate-300">•</span>

          <span className="font-mono text-xs text-slate-500 flex items-center gap-1.5 font-semibold">
            <Clock size={14} className="text-blue-600" />
            {post.readTime}
          </span>

          {post.status === 'DRAFT' && (
            <span className="px-3 py-1 rounded-full bg-amber-100 border border-amber-300 text-amber-800 font-mono text-[10px] font-bold uppercase tracking-widest">
              DRAFT PREVIEW
            </span>
          )}
        </div>

        {/* Title & Subtitle */}
        <h1 className="reveal-anim font-orbitron text-4xl md:text-6xl lg:text-7xl font-black uppercase tracking-tighter leading-[1.08] mb-5 text-slate-900">
          {post.title}
        </h1>

        {post.subtitle && (
          <p className="reveal-anim font-orbitron text-lg md:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500 uppercase tracking-wider mb-10">
            {post.subtitle}
          </p>
        )}

        {/* Hero Image */}
        <div className="reveal-anim relative w-full aspect-video md:aspect-[21/9] rounded-[2rem] overflow-hidden mb-16 shadow-[0_20px_60px_rgba(37,99,235,0.15)] group bg-slate-900">
          <img
            src={post.coverImage}
            alt={post.title}
            className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent opacity-90" />

          <div className="absolute bottom-6 left-6 right-6 flex flex-wrap justify-between items-end gap-4">
            <div className="flex items-center gap-3 bg-white/20 backdrop-blur-md px-4 py-2 rounded-xl border border-white/30">
              <Activity size={18} className="text-cyan-300" />
              <span className="font-mono text-[10px] md:text-xs tracking-widest uppercase text-white font-bold drop-shadow-md">
                {post.recordId || 'SYS.TELEMETRY'} // {post.author}
              </span>
            </div>

            <div className="hidden sm:flex items-center gap-2 bg-slate-950/60 backdrop-blur-md px-3.5 py-1.5 rounded-xl border border-white/20 text-white font-mono text-[10px] tracking-widest uppercase">
              SOURCE: {post.slug}.md
            </div>
          </div>
        </div>

        {/* Main 12-Col Body + Sidebar */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 lg:gap-16">
          {/* Left 8 Columns: Markdown Article Body */}
          <div className="md:col-span-8">
            <div className="reveal-anim">
              {/* Lead Excerpt Callout */}
              {post.excerpt && (
                <p className="text-xl text-slate-700 leading-relaxed font-medium mb-10 pb-8 border-b border-slate-200/80">
                  {post.excerpt}
                </p>
              )}

              {/* Full Markdown Content */}
              <MarkdownRenderer content={post.content} />

              {/* Gallery Section (if present in .md frontmatter) */}
              {post.gallery && post.gallery.length > 0 && (
                <div className="mt-14 pt-10 border-t border-slate-200/80">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="w-2 h-2 bg-blue-600 rounded-sm" />
                    <span className="font-mono text-xs uppercase tracking-[0.25em] text-blue-600 font-bold">
                      Visual Documentation
                    </span>
                  </div>
                  <h3 className="font-orbitron text-2xl md:text-3xl font-bold uppercase text-slate-900 mb-6">
                    Mission Image Gallery
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {post.gallery.map((imgUrl, idx) => (
                      <div
                        key={idx}
                        onClick={() => setLightboxImage(imgUrl)}
                        className="rounded-3xl overflow-hidden relative group shadow-md cursor-pointer aspect-[16/10] bg-slate-900 border border-slate-200"
                      >
                        <img
                          src={imgUrl}
                          alt={`${post.title} gallery ${idx + 1}`}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                          <span className="font-mono text-[10px] text-white uppercase tracking-widest font-bold bg-black/50 backdrop-blur-sm px-3 py-1 rounded-full">
                            Expand Frame 0{idx + 1}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tags Footer */}
              {post.tags && post.tags.length > 0 && (
                <div className="mt-12 pt-8 border-t border-slate-200 flex flex-wrap items-center gap-2">
                  <span className="font-mono text-xs uppercase tracking-widest text-slate-400 font-bold mr-2">
                    TAGS:
                  </span>
                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3.5 py-1.5 rounded-full bg-white border border-slate-200 text-slate-700 font-mono text-[11px] tracking-wider uppercase font-bold shadow-sm"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right 4 Columns: Telemetry Specs & Table of Contents Sidebar */}
          <div className="md:col-span-4 space-y-8">
            {/* Author & Mission Specs Card */}
            <div className="reveal-anim bg-white border border-white shadow-[0_20px_40px_rgba(0,0,0,0.04)] rounded-3xl p-6 md:p-8 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-slate-50 to-transparent pointer-events-none" />
              <h4 className="font-orbitron font-bold text-lg text-slate-900 uppercase mb-6 tracking-wider relative z-10">
                Telemetry & Specs
              </h4>

              <div className="space-y-5 relative z-10">
                {/* Author */}
                <div className="flex items-start gap-4 pb-5 border-b border-slate-100">
                  <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center shrink-0 border border-blue-100 shadow-sm">
                    <User size={18} className="text-blue-600" />
                  </div>
                  <div>
                    <span className="block text-[10px] font-mono text-slate-400 uppercase tracking-widest mb-0.5 font-semibold">
                      Author / Division
                    </span>
                    <span className="font-bold text-slate-900 text-sm block">
                      {post.author}
                    </span>
                    {post.authorRole && (
                      <span className="font-mono text-[11px] text-blue-600 font-semibold">
                        {post.authorRole}
                      </span>
                    )}
                  </div>
                </div>

                {/* Custom Specs from Frontmatter */}
                {(post.specs || []).map((spec, idx) => {
                  const IconComp = SPEC_ICONS[idx % SPEC_ICONS.length];
                  return (
                    <div key={idx} className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-full bg-cyan-50/80 flex items-center justify-center shrink-0 border border-cyan-100 shadow-sm">
                        <IconComp size={18} className="text-blue-600" />
                      </div>
                      <div>
                        <span className="block text-[10px] font-mono text-slate-400 uppercase tracking-widest mb-1 font-semibold">
                          {spec.label}
                        </span>
                        <span className="font-bold text-slate-900 text-sm">
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
              <div className="reveal-anim bg-white border border-white shadow-[0_20px_40px_rgba(0,0,0,0.04)] rounded-3xl p-6 md:p-8">
                <h4 className="font-orbitron font-bold text-sm text-slate-900 uppercase mb-4 tracking-wider flex items-center gap-2">
                  <List size={16} className="text-blue-600" />
                  Section Index
                </h4>
                <nav className="space-y-2.5">
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
                      className={`block text-xs font-medium text-slate-600 hover:text-blue-600 transition-colors py-1 border-l-2 border-slate-100 hover:border-blue-600 ${
                        h.level === 3 ? 'pl-6 text-[11px]' : 'pl-3 font-semibold'
                      }`}
                    >
                      {h.text}
                    </a>
                  ))}
                </nav>
              </div>
            )}

            {/* CTA Card */}
            <div className="reveal-anim bg-slate-900 rounded-3xl p-6 md:p-8 relative overflow-hidden group shadow-2xl">
              <div className="absolute inset-0 bg-gradient-to-br from-slate-800 to-slate-900" />
              <div className="absolute -top-12 -right-12 w-32 h-32 bg-blue-500 opacity-20 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700" />
              <div className="relative z-10">
                <h4 className="font-orbitron font-bold text-xl text-white uppercase mb-3 leading-tight">
                  Explore More Logs
                </h4>
                <p className="text-slate-300 text-sm mb-6 leading-relaxed">
                  Follow BRACU Diganta's engineering breakthroughs across avionics, aerodynamics, and satellite telemetry.
                </p>
                <MagneticButton
                  onClick={() => navigate('/blog')}
                  className="w-full bg-blue-600 text-white hover:bg-blue-500 border border-blue-500 shadow-lg shadow-blue-600/20 px-6 py-4 rounded-xl font-bold uppercase tracking-wider text-xs transition-all text-center"
                >
                  All Blog Transmissions
                </MagneticButton>
              </div>
            </div>
          </div>
        </div>

        {/* Related Blog Posts */}
        {relatedPosts.length > 0 && (
          <div className="mt-24 pt-16 border-t border-slate-200/80">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
              <div>
                <span className="font-mono text-xs text-blue-600 uppercase tracking-[0.25em] font-bold block mb-2">
                  Continue Reading
                </span>
                <h3 className="font-orbitron text-3xl md:text-4xl font-black uppercase text-slate-900 tracking-tight">
                  Related Transmissions
                </h3>
              </div>
              <button
                onClick={() => navigate('/blog')}
                className="font-mono text-xs text-blue-600 hover:text-slate-900 uppercase tracking-widest font-bold transition-colors"
              >
                View Full Archive →
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
