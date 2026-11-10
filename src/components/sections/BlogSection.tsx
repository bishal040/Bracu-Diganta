import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  ArrowUpRight,
  Clock,
  Activity,
  Sparkles,
  FileCode2,
  User,
} from 'lucide-react';
import { MagneticButton } from '../ui/MagneticButton';
import {
  fetchAllBlogs,
  getAllBlogsSync,
} from '../../services/blogService';
import { type BlogPost, formatDisplayDate } from '../../utils/markdown';

gsap.registerPlugin(ScrollTrigger);

interface BlogCardProps {
  post: BlogPost;
  featuredLayout?: boolean;
  onClick: () => void;
}

export const BlogCard: React.FC<BlogCardProps> = ({
  post,
  featuredLayout = false,
  onClick,
}) => {
  if (featuredLayout) {
    return (
      <article
        onClick={onClick}
        className="group relative bg-white rounded-[2.25rem] border border-slate-200/80 shadow-[0_15px_45px_rgba(15,23,42,0.05)] hover:shadow-[0_25px_65px_rgba(37,99,235,0.14)] hover:border-blue-300/80 transition-all duration-500 overflow-hidden cursor-pointer grid grid-cols-1 lg:grid-cols-12 mb-10"
      >
        {/* Left Image Column */}
        <div className="lg:col-span-7 relative min-h-[280px] md:min-h-[380px] overflow-hidden bg-slate-900">
          <img
            src={post.coverImage}
            alt={post.title}
            className="w-full h-full object-cover transition-transform duration-1000 ease-out group-hover:scale-105"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/75 via-slate-950/20 to-transparent" />

          {/* Top Floating Telemetry Pills */}
          <div className="absolute top-6 left-6 right-6 flex flex-wrap items-center justify-between gap-2">
            <div className="bg-white/95 backdrop-blur-md px-4 py-1.5 rounded-full flex items-center gap-2 shadow-sm border border-white/60">
              <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
              <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-blue-700 font-bold">
                {post.category}
              </span>
            </div>

            <div className="bg-slate-900/80 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/15 flex items-center gap-2 text-white">
              <Sparkles size={12} className="text-cyan-400" />
              <span className="font-mono text-[10px] tracking-[0.2em] uppercase font-bold">
                FEATURED TRANSMISSION
              </span>
            </div>
          </div>

          {/* Bottom Image HUD */}
          <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between text-white/90">
            <div className="flex items-center gap-2 bg-black/40 backdrop-blur-md px-3.5 py-1.5 rounded-xl border border-white/15">
              <Activity size={14} className="text-cyan-400" />
              <span className="font-mono text-[10px] tracking-widest uppercase font-bold">
                {post.recordId || 'LOG-VERIFIED'}
              </span>
            </div>
            <div className="hidden sm:flex items-center gap-1.5 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/15 font-mono text-[10px] tracking-widest uppercase">
              <FileCode2 size={12} className="text-blue-400" />
              <span>{post.slug}.md</span>
            </div>
          </div>
        </div>

        {/* Right Editorial Content Column */}
        <div className="lg:col-span-5 p-8 md:p-10 lg:p-12 flex flex-col justify-between relative">
          <div>
            {/* Date & Read Time */}
            <div className="flex flex-wrap items-center gap-3 mb-4 font-mono text-[11px] tracking-[0.18em] uppercase text-slate-400 font-bold">
              <span className="text-blue-600">{formatDisplayDate(post.date)}</span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <Clock size={12} className="text-slate-400" />
                {post.readTime}
              </span>
            </div>

            {/* Title */}
            <h3 className="font-orbitron text-2xl md:text-3xl font-black text-slate-900 uppercase tracking-tight leading-[1.15] mb-3 group-hover:text-blue-600 transition-colors">
              {post.title}
            </h3>

            {post.subtitle && (
              <p className="font-orbitron text-xs md:text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">
                {post.subtitle}
              </p>
            )}

            <p className="text-slate-600 text-sm md:text-base leading-relaxed mb-6 line-clamp-3">
              {post.excerpt}
            </p>

            {/* Tags */}
            {post.tags && post.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {post.tags.slice(0, 4).map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 rounded-full bg-[#eef2f5] text-slate-600 font-mono text-[10px] tracking-wider uppercase font-bold"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Author & Read CTA */}
          <div className="pt-6 border-t border-slate-100 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shrink-0">
                <User size={16} />
              </div>
              <div>
                <div className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  {post.author}
                </div>
                <div className="font-mono text-[10px] text-slate-400 uppercase tracking-widest">
                  {post.authorRole || post.category}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-widest text-blue-600 group-hover:text-slate-900 transition-colors shrink-0">
              <span className="hidden sm:inline">Read Log</span>
              <div className="w-10 h-10 rounded-full bg-blue-50 group-hover:bg-blue-600 text-blue-600 group-hover:text-white flex items-center justify-center transition-all duration-300 shadow-sm">
                <ArrowUpRight
                  size={18}
                  className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform"
                />
              </div>
            </div>
          </div>
        </div>
      </article>
    );
  }

  return (
    <article
      onClick={onClick}
      className="group relative bg-white rounded-[2rem] border border-slate-200/80 shadow-[0_12px_35px_rgba(15,23,42,0.04)] hover:shadow-[0_25px_55px_rgba(37,99,235,0.12)] hover:-translate-y-1.5 hover:border-blue-300/80 transition-all duration-500 overflow-hidden cursor-pointer flex flex-col justify-between"
    >
      {/* Top Hover Accent Bar */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#2563EB] to-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20" />

      <div>
        {/* Image Container */}
        <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-900">
          <img
            src={post.coverImage}
            alt={post.title}
            className="w-full h-full object-cover transition-transform duration-1000 ease-out group-hover:scale-110"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-slate-950/15 to-transparent" />

          {/* Category Badge */}
          <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-md px-3.5 py-1.5 rounded-full flex items-center gap-2 shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse" />
            <span className="font-mono text-[10px] tracking-[0.18em] uppercase text-blue-700 font-bold">
              {post.category}
            </span>
          </div>

          {/* Record ID Badge */}
          <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-white">
            <span className="font-mono text-[10px] tracking-widest uppercase bg-black/45 backdrop-blur-md px-2.5 py-1 rounded-lg border border-white/15 font-bold flex items-center gap-1.5">
              <Activity size={11} className="text-cyan-400" />
              {post.recordId || 'SYS.LOG'}
            </span>
            <span className="font-mono text-[10px] tracking-widest uppercase bg-black/45 backdrop-blur-md px-2.5 py-1 rounded-lg border border-white/15 text-slate-200">
              {post.readTime}
            </span>
          </div>
        </div>

        {/* Text Content */}
        <div className="p-6 md:p-7">
          <div className="flex items-center gap-2 font-mono text-[10px] tracking-[0.2em] uppercase text-slate-400 font-bold mb-3">
            <span className="text-blue-600">{formatDisplayDate(post.date)}</span>
          </div>

          <h3 className="font-orbitron text-xl font-bold text-slate-900 uppercase tracking-tight leading-snug mb-3 group-hover:text-blue-600 transition-colors line-clamp-2">
            {post.title}
          </h3>

          <p className="text-slate-600 text-sm leading-relaxed mb-5 line-clamp-3">
            {post.excerpt}
          </p>

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {post.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="px-2.5 py-1 rounded-full bg-[#eef2f5] text-slate-600 font-mono text-[9px] tracking-wider uppercase font-bold"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Card Footer */}
      <div className="px-6 md:px-7 py-4 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between">
        <div className="truncate pr-2">
          <span className="block text-[11px] font-bold text-slate-800 uppercase tracking-wider truncate">
            {post.author}
          </span>
          <span className="block font-mono text-[9px] text-slate-400 uppercase tracking-widest truncate">
            {post.authorRole || 'Engineering Log'}
          </span>
        </div>

        <div className="flex items-center gap-2 font-mono text-[10px] font-bold uppercase tracking-widest text-blue-600 group-hover:text-slate-900 transition-colors shrink-0">
          <span>Read</span>
          <div className="w-8 h-8 rounded-full bg-white border border-slate-200 group-hover:bg-blue-600 group-hover:border-blue-600 text-slate-700 group-hover:text-white flex items-center justify-center transition-all duration-300 shadow-sm">
            <ArrowUpRight size={14} />
          </div>
        </div>
      </div>
    </article>
  );
};

export const BlogSection: React.FC = () => {
  const navigate = useNavigate();
  const sectionRef = useRef<HTMLElement>(null);
  const [posts, setPosts] = useState<BlogPost[]>(() => getAllBlogsSync(false));
  const [activeCategory, setActiveCategory] = useState<string>('ALL');

  useEffect(() => {
    let mounted = true;
    fetchAllBlogs(false).then((fresh) => {
      if (mounted && fresh.length > 0) {
        setPosts(fresh);
      }
    });
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (!sectionRef.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.blog-section-reveal',
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 80%',
          },
        }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  const categories = [
    'ALL',
    ...Array.from(new Set(posts.map((p) => p.category))).filter(Boolean),
  ];

  const filteredPosts =
    activeCategory === 'ALL'
      ? posts
      : posts.filter((p) => p.category === activeCategory);

  const featuredPost =
    filteredPosts.find((p) => p.featured) || filteredPosts[0];
  const gridPosts = filteredPosts
    .filter((p) => p.slug !== featuredPost?.slug)
    .slice(0, 3);

  return (
    <section
      id="blog"
      ref={sectionRef}
      className="py-24 md:py-32 relative z-10 bg-[#eef2f5] border-t border-slate-200/60"
    >
      {/* Subtle Telemetry Grid Overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-35"
        style={{
          backgroundImage:
            'radial-gradient(circle at center, #94a3b8 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />

      <div className="max-w-[90rem] mx-auto px-4 md:px-8 relative z-10">
        {/* Section Header */}
        <div className="blog-section-reveal flex flex-col md:flex-row md:items-end justify-between mb-12 md:mb-16 gap-6">
          <div>
            <div className="flex gap-1 mb-4">
              <div className="w-2 h-2 bg-blue-600" />
              <div className="w-2 h-2 bg-blue-400" />
              <div className="w-2 h-2 bg-blue-200" />
            </div>
            <div className="flex items-center gap-3 mb-2">
              <span className="font-mono text-xs tracking-[0.3em] uppercase text-blue-600 font-bold">
                Markdown Mission Logs
              </span>
            </div>
            <h2 className="font-orbitron text-4xl md:text-6xl font-black tracking-widest uppercase drop-shadow-sm text-transparent bg-clip-text bg-gradient-to-r from-[#2563EB] to-cyan-500">
              Engineering Blog
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <MagneticButton
              className="inline-flex items-center gap-3 bg-gray-900 text-white hover:bg-blue-600 px-8 py-4 rounded-full text-xs font-mono uppercase tracking-[0.2em] font-bold transition-all shadow-lg"
              onClick={() => {
                navigate('/blog');
                window.scrollTo(0, 0);
              }}
            >
              <span className="flex items-center gap-3">
                View All Articles <ArrowUpRight size={16} />
              </span>
            </MagneticButton>
          </div>
        </div>

        {/* Category Filter Pills */}
        {categories.length > 1 && (
          <div className="blog-section-reveal flex flex-wrap gap-2 mb-10">
            {categories.map((cat) => {
              const isActive = activeCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-5 py-2.5 rounded-full font-mono text-[11px] font-bold tracking-[0.15em] uppercase transition-all ${
                    isActive
                      ? 'bg-[#2563EB] text-white shadow-[0_8px_20px_rgba(37,99,235,0.3)]'
                      : 'bg-white/80 text-slate-600 hover:bg-white hover:text-blue-600 border border-slate-200/80'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        )}

        {/* Featured Post Card */}
        {featuredPost && (
          <div className="blog-section-reveal">
            <BlogCard
              post={featuredPost}
              featuredLayout={true}
              onClick={() => {
                navigate(`/blog/${featuredPost.slug}`);
                window.scrollTo(0, 0);
              }}
            />
          </div>
        )}

        {/* Blog Cards Grid */}
        {gridPosts.length > 0 && (
          <div className="blog-section-reveal grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {gridPosts.map((post) => (
              <BlogCard
                key={post.slug}
                post={post}
                onClick={() => {
                  navigate(`/blog/${post.slug}`);
                  window.scrollTo(0, 0);
                }}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
