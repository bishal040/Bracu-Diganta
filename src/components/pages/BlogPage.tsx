import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import {
  ArrowLeft,
  Search,
  BookOpen,
  X,
} from 'lucide-react';
import { BlogCard } from '../sections/BlogSection';
import { fetchAllBlogs, getAllBlogsSync } from '../../services/blogService';
import { type BlogPost } from '../../utils/markdown';

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
        { opacity: 0, y: 25 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.08,
          ease: 'power3.out',
          delay: 0.1,
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
      className="min-h-screen bg-[#eef2f5] text-slate-900 pt-28 pb-24 px-4 md:px-10 selection:bg-blue-500/20 relative"
    >
      {/* Background Telemetry Grid */}
      <div
        className="fixed inset-0 pointer-events-none opacity-40"
        style={{
          backgroundImage:
            'radial-gradient(circle at center, #94a3b8 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />

      <div className="max-w-[90rem] mx-auto relative z-10">
        {/* Top Bar Navigation */}
        <div className="blog-page-reveal flex items-center justify-between mb-8">
          <button
            onClick={() => navigate('/')}
            className="group flex items-center gap-3 text-slate-600 hover:text-slate-900 transition-colors"
          >
            <div className="w-10 h-10 rounded-full border border-slate-300 bg-white flex items-center justify-center group-hover:border-blue-500 group-hover:bg-blue-50 transition-all shadow-sm">
              <ArrowLeft size={16} />
            </div>
            <span className="font-mono text-xs md:text-sm tracking-wider uppercase font-bold">
              Return to Hub
            </span>
          </button>
        </div>

        {/* Hero Header */}
        <div className="blog-page-reveal pb-10 mb-10 border-b border-slate-200/80 flex flex-col lg:flex-row lg:items-end justify-between gap-8">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-blue-100 border border-blue-200 px-4 py-1.5 rounded-full flex items-center gap-2 shadow-sm">
                <BookOpen size={14} className="text-blue-600" />
                <span className="text-xs font-mono tracking-wider uppercase text-blue-700 font-bold">
                  Technical Publications & Mission Logs
                </span>
              </div>
            </div>

            <h1 className="font-orbitron text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight uppercase leading-tight">
              Diganta{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#2563EB] to-cyan-500">
                Engineering Blog
              </span>
            </h1>
          </div>

          {/* Search Input */}
          <div className="w-full lg:w-96">
            <div className="relative">
              <Search
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search articles, topics, subsystems..."
                className="w-full pl-12 pr-10 py-3.5 bg-white border border-slate-200 rounded-full text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 shadow-sm transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                >
                  <X size={16} />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="blog-page-reveal flex flex-wrap items-center gap-2.5 mb-10">
          {categories.map((cat) => {
            const isActive = activeCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-5 py-2.5 rounded-full font-mono text-xs font-bold tracking-wider uppercase transition-all ${
                  isActive
                    ? 'bg-[#2563EB] text-white shadow-[0_8px_20px_rgba(37,99,235,0.3)]'
                    : 'bg-white text-slate-600 hover:bg-blue-50 hover:text-blue-600 border border-slate-200/80 shadow-sm'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Featured Post */}
        {featuredPost && (
          <div className="blog-page-reveal">
            <BlogCard
              post={featuredPost}
              featuredLayout={true}
              onClick={() => navigate(`/blog/${featuredPost.slug}`)}
            />
          </div>
        )}

        {/* Posts Grid */}
        {remainingPosts.length > 0 ? (
          <div className="blog-page-reveal grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {remainingPosts.map((post) => (
              <BlogCard
                key={post.slug}
                post={post}
                onClick={() => navigate(`/blog/${post.slug}`)}
              />
            ))}
          </div>
        ) : (
          !featuredPost && (
            <div className="bg-white rounded-3xl p-12 text-center border border-slate-200/80 shadow-sm">
              <p className="font-orbitron text-xl font-bold text-slate-800 uppercase mb-2">
                No matching articles found
              </p>
              <p className="text-slate-500 text-sm md:text-base mb-6">
                Try clearing your search query or selecting a different category.
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
  );
};
