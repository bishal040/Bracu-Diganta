import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import {
  ArrowLeft,
  Search,
  BookOpen,
  X,
  Compass,
  Layers,
  ChevronRight,
  Clock,
} from 'lucide-react';
import { BlogCard } from '../sections/BlogSection';
import { fetchAllBlogs, getAllBlogsSync } from '../../services/blogService';
import { type BlogPost, formatDisplayDate } from '../../utils/markdown';

export const BlogPage: React.FC = () => {
  const navigate = useNavigate();
  const pageRef = useRef<HTMLDivElement>(null);

  const [posts, setPosts] = useState<BlogPost[]>(() => getAllBlogsSync(false));
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('ALL');

  useEffect(() => {
    window.scrollTo(0, 0);
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
    if (!pageRef.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.blog-page-reveal',
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          stagger: 0.06,
          ease: 'power3.out',
          delay: 0.05,
        }
      );
    }, pageRef);
    return () => ctx.revert();
  }, []);

  const categories = [
    'ALL',
    ...Array.from(new Set(posts.map((p) => p.category))).filter(Boolean),
  ];

  const filteredPosts = posts.filter((post) => {
    const matchesCategory =
      activeCategory === 'ALL' || post.category === activeCategory;
    if (!matchesCategory) return false;

    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      post.title.toLowerCase().includes(q) ||
      (post.subtitle || '').toLowerCase().includes(q) ||
      post.excerpt.toLowerCase().includes(q) ||
      post.author.toLowerCase().includes(q) ||
      post.category.toLowerCase().includes(q) ||
      (post.tags || []).some((t) => t.toLowerCase().includes(q)) ||
      post.content.toLowerCase().includes(q)
    );
  });

  const featuredPost =
    !searchQuery.trim() && activeCategory === 'ALL'
      ? filteredPosts.find((p) => p.featured) || filteredPosts[0]
      : null;

  const remainingPosts = featuredPost
    ? filteredPosts.filter((p) => p.slug !== featuredPost.slug)
    : filteredPosts;

  return (
    <div
      ref={pageRef}
      className="min-h-screen bg-[#eef2f5] text-slate-900 pt-24 md:pt-28 pb-20 selection:bg-blue-500/20 relative"
    >
      {/* Background Telemetry Grid */}
      <div
        className="fixed inset-0 pointer-events-none opacity-35"
        style={{
          backgroundImage:
            'radial-gradient(circle at center, #94a3b8 1px, transparent 1px)',
          backgroundSize: '36px 36px',
        }}
      />

      <div className="w-full max-w-[1600px] mx-auto px-3 sm:px-6 lg:px-10 relative z-10">
        {/* Top Breadcrumb Bar */}
        <div className="blog-page-reveal flex flex-wrap items-center justify-between gap-4 mb-5">
          <button
            onClick={() => navigate('/')}
            className="group inline-flex items-center gap-2.5 text-slate-600 hover:text-slate-900 transition-colors"
          >
            <div className="w-9 h-9 rounded-full border border-slate-300 bg-white flex items-center justify-center group-hover:border-blue-500 group-hover:bg-blue-50 transition-all shadow-sm">
              <ArrowLeft size={15} />
            </div>
            <span className="font-mono text-xs tracking-wider uppercase font-bold">
              Return to Main Hub
            </span>
          </button>

          <div className="hidden sm:flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-slate-500">
            <BookOpen size={14} className="text-blue-600" />
            <span className="font-bold text-slate-700">
              BRACU DIGANTA AEROSPACE JOURNAL
            </span>
            <span>•</span>
            <span className="text-blue-600 font-bold">
              {posts.length} PUBLISHED CHAPTERS
            </span>
          </div>
        </div>

        {/* Book Volume Banner Header */}
        <div className="blog-page-reveal bg-white rounded-3xl border border-slate-200/90 shadow-[0_15px_45px_rgba(15,23,42,0.05)] p-5 sm:p-8 lg:p-10 mb-6 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#2563EB] via-cyan-400 to-blue-600" />

          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div>
              <div className="flex flex-wrap items-center gap-2.5 mb-3">
                <div className="bg-blue-50 border border-blue-200 px-3.5 py-1 rounded-full flex items-center gap-2">
                  <BookOpen size={13} className="text-blue-600" />
                  <span className="text-xs font-mono tracking-wider uppercase text-blue-700 font-bold">
                    Technical Compendium & Mission Logs
                  </span>
                </div>
                <span className="font-mono text-xs uppercase tracking-wider text-slate-400 font-bold">
                  VOL. 2026
                </span>
              </div>

              <h1 className="font-orbitron text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight uppercase leading-tight">
                Diganta{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#2563EB] to-cyan-500">
                  Engineering Journal
                </span>
              </h1>
              <p className="text-slate-600 text-sm sm:text-base mt-2 max-w-2xl leading-relaxed">
                Organized technical monographs, avionics architecture briefs, and field testing records authored by the BRACU Diganta engineering divisions.
              </p>
            </div>

            {/* Search Input */}
            <div className="w-full lg:w-96 shrink-0">
              <div className="relative">
                <Search
                  size={17}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search chapters, subsystems, keywords..."
                  className="w-full pl-11 pr-10 py-3 bg-[#f8fafc] border border-slate-200 rounded-2xl text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white transition-all"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                  >
                    <X size={15} />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Mobile & Tablet Category Bar */}
          <div className="flex lg:hidden flex-wrap items-center gap-2 mt-6 pt-5 border-t border-slate-100">
            {categories.map((cat) => {
              const isActive = activeCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-4 py-2 rounded-xl font-mono text-xs font-bold tracking-wider uppercase transition-all ${
                    isActive
                      ? 'bg-[#2563EB] text-white shadow-sm'
                      : 'bg-slate-100 text-slate-600 hover:bg-blue-50 hover:text-blue-600'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>

        {/* 12-Column Organized Book Index + Publication Spread */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* LEFT COLUMN (3 cols on Desktop): Volume Index & Category Directory */}
          <aside className="hidden lg:block lg:col-span-3 sticky top-24 space-y-5">
            {/* Subject / Division Filter Card */}
            <div className="bg-white rounded-3xl border border-slate-200/90 shadow-[0_12px_35px_rgba(15,23,42,0.04)] p-5">
              <div className="flex items-center justify-between pb-3.5 mb-3.5 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <Layers size={15} className="text-blue-600" />
                  <h2 className="font-orbitron text-xs font-bold uppercase tracking-wider text-slate-900">
                    Subject Divisions
                  </h2>
                </div>
                <span className="font-mono text-xs text-slate-400 font-bold">
                  {categories.length}
                </span>
              </div>

              <div className="space-y-1.5">
                {categories.map((cat) => {
                  const isActive = activeCategory === cat;
                  const count =
                    cat === 'ALL'
                      ? posts.length
                      : posts.filter((p) => p.category === cat).length;
                  return (
                    <button
                      key={cat}
                      onClick={() => setActiveCategory(cat)}
                      className={`w-full text-left px-3.5 py-2.5 rounded-xl font-mono text-xs font-bold uppercase tracking-wider flex items-center justify-between transition-all ${
                        isActive
                          ? 'bg-blue-600 text-white shadow-sm'
                          : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                      }`}
                    >
                      <span className="truncate pr-2">{cat}</span>
                      <span
                        className={`px-2 py-0.5 rounded-full text-xs ${
                          isActive
                            ? 'bg-white/20 text-white'
                            : 'bg-slate-100 text-slate-500'
                        }`}
                      >
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Book Volume Table of Chapters */}
            <div className="bg-white rounded-3xl border border-slate-200/90 shadow-[0_12px_35px_rgba(15,23,42,0.04)] p-5">
              <div className="flex items-center justify-between pb-3.5 mb-3.5 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <Compass size={15} className="text-blue-600" />
                  <h2 className="font-orbitron text-xs font-bold uppercase tracking-wider text-slate-900">
                    Volume Chapters
                  </h2>
                </div>
                <span className="font-mono text-xs text-blue-600 font-bold">
                  INDEX
                </span>
              </div>

              <div className="space-y-2.5">
                {posts.map((post, idx) => (
                  <button
                    key={post.slug}
                    onClick={() => navigate(`/blog/${post.slug}`)}
                    className="w-full text-left p-3 rounded-2xl border border-slate-100 hover:border-blue-300 hover:bg-blue-50/40 transition-all group"
                  >
                    <div className="flex items-center justify-between font-mono text-xs text-slate-400 mb-1">
                      <span className="font-bold text-blue-600">
                        CH. {String(idx + 1).padStart(2, '0')}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock size={11} />
                        {post.readTime}
                      </span>
                    </div>
                    <div className="font-orbitron text-xs font-bold text-slate-800 group-hover:text-blue-600 uppercase leading-snug line-clamp-2">
                      {post.title}
                    </div>
                    <div className="font-mono text-xs text-slate-400 mt-1 flex items-center justify-between">
                      <span>{formatDisplayDate(post.date)}</span>
                      <ChevronRight
                        size={13}
                        className="text-slate-300 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-all"
                      />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </aside>

          {/* RIGHT MAIN COLUMN (9 cols on Desktop): Featured Chapter + Chapters Grid */}
          <div className="lg:col-span-9 space-y-6">
            {/* Lead Featured Chapter */}
            {featuredPost && (
              <div className="blog-page-reveal">
                <BlogCard
                  post={featuredPost}
                  featuredLayout={true}
                  chapterNumber={1}
                  onClick={() => navigate(`/blog/${featuredPost.slug}`)}
                />
              </div>
            )}

            {/* Remaining Chapters Grid */}
            {remainingPosts.length > 0 ? (
              <div className="blog-page-reveal grid grid-cols-1 md:grid-cols-2 gap-6">
                {remainingPosts.map((post, idx) => (
                  <BlogCard
                    key={post.slug}
                    post={post}
                    chapterNumber={featuredPost ? idx + 2 : idx + 1}
                    onClick={() => navigate(`/blog/${post.slug}`)}
                  />
                ))}
              </div>
            ) : (
              !featuredPost && (
                <div className="bg-white rounded-3xl p-12 text-center border border-slate-200/80 shadow-sm">
                  <p className="font-orbitron text-xl font-bold text-slate-800 uppercase mb-2">
                    No matching chapters found
                  </p>
                  <p className="text-slate-500 text-sm md:text-base mb-6">
                    Try clearing your search query or selecting a different division filter.
                  </p>
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setActiveCategory('ALL');
                    }}
                    className="px-6 py-2.5 bg-blue-600 text-white rounded-full font-mono text-xs uppercase tracking-wider font-bold hover:bg-blue-700 transition-colors"
                  >
                    Reset Filters
                  </button>
                </div>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
