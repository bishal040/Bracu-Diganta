import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { ArrowLeft, Search, X } from 'lucide-react';
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
      className="min-h-screen bg-[#f8fafc] text-slate-900 pt-28 pb-24 selection:bg-blue-500/20"
    >
      <div className="w-full max-w-[1380px] mx-auto px-4 sm:px-6 lg:px-10">
        {/* Minimal Back Navigation */}
        <div className="blog-page-reveal mb-8">
          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-900 font-mono text-xs uppercase tracking-wider font-bold transition-colors"
          >
            <ArrowLeft size={15} />
            <span>Back to Home</span>
          </button>
        </div>

        {/* Clean Minimalist Header */}
        <div className="blog-page-reveal mb-10">
          <span className="font-mono text-xs tracking-[0.2em] uppercase text-blue-600 font-bold block mb-2.5">
            Engineering Publications
          </span>
          <h1 className="font-orbitron text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight uppercase mb-3">
            Diganta{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#2563EB] to-cyan-500">
              Blog
            </span>
          </h1>
          <p className="text-slate-600 text-base sm:text-lg max-w-2xl leading-relaxed">
            Technical articles, avionics design logs, and field testing updates from the BRACU Diganta aerospace team.
          </p>
        </div>

        {/* Unified Filter & Search Row */}
        <div className="blog-page-reveal flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-8 mb-10 border-b border-slate-200/80">
          {/* Category Pills */}
          <div className="flex flex-wrap items-center gap-2">
            {categories.map((cat) => {
              const isActive = activeCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-4 py-2 rounded-full font-mono text-xs font-bold tracking-wider uppercase transition-all ${
                    isActive
                      ? 'bg-blue-600 text-white'
                      : 'bg-white text-slate-600 hover:text-blue-600 border border-slate-200/80'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>

          {/* Search Input */}
          <div className="w-full lg:w-80 shrink-0">
            <div className="relative">
              <Search
                size={16}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search articles..."
                className="w-full pl-10 pr-9 py-2.5 bg-white border border-slate-200/90 rounded-full text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-500 transition-colors"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                >
                  <X size={15} />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Featured Article */}
        {featuredPost && (
          <div className="blog-page-reveal mb-10">
            <BlogCard
              post={featuredPost}
              featuredLayout={true}
              onClick={() => navigate(`/blog/${featuredPost.slug}`)}
            />
          </div>
        )}

        {/* Clean 3-Column Articles Grid */}
        {remainingPosts.length > 0 ? (
          <div className="blog-page-reveal grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
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
            <div className="bg-white rounded-2xl p-12 text-center border border-slate-200/80">
              <p className="font-orbitron text-lg font-bold text-slate-800 uppercase mb-2">
                No matching articles found
              </p>
              <p className="text-slate-500 text-sm mb-6">
                Try clearing your search or selecting another category.
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setActiveCategory('ALL');
                }}
                className="px-5 py-2.5 bg-blue-600 text-white rounded-full font-mono text-xs uppercase tracking-wider font-bold hover:bg-blue-700 transition-colors"
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
