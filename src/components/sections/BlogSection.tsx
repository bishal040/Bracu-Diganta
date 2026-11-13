import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowUpRight } from 'lucide-react';
import { MagneticButton } from '../ui/MagneticButton';
import {
  fetchAllBlogs,
  getAllBlogsSync,
  resolveBlogImageUrl,
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
  const coverSrc = resolveBlogImageUrl(post.coverImage);

  if (featuredLayout) {
    return (
      <article
        onClick={onClick}
        className="group bg-white rounded-3xl border border-slate-200/80 shadow-[0_8px_30px_rgba(15,23,42,0.04)] hover:shadow-[0_20px_50px_rgba(37,99,235,0.08)] hover:border-blue-200 transition-all duration-300 overflow-hidden cursor-pointer grid grid-cols-1 lg:grid-cols-12"
      >
        {/* Image Side */}
        <div className="lg:col-span-7 relative aspect-[16/10] lg:aspect-auto lg:min-h-[380px] overflow-hidden bg-slate-100">
          <img
            src={coverSrc}
            alt={post.title}
            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            loading="lazy"
          />
        </div>

        {/* Content Side */}
        <div className="lg:col-span-5 p-6 sm:p-8 lg:p-10 flex flex-col justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-2.5 mb-4 font-mono text-xs text-slate-500">
              <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-600 font-bold uppercase tracking-wider">
                {post.category}
              </span>
              <span>•</span>
              <span>{formatDisplayDate(post.date)}</span>
              <span>•</span>
              <span>{post.readTime}</span>
            </div>

            <h3 className="font-orbitron text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900 tracking-tight leading-snug mb-3 group-hover:text-blue-600 transition-colors">
              {post.title}
            </h3>

            <p className="text-slate-600 text-sm sm:text-base leading-relaxed line-clamp-3">
              {post.excerpt}
            </p>
          </div>

          <div className="pt-6 mt-6 border-t border-slate-100 flex items-center justify-between gap-4">
            <div className="min-w-0">
              <div className="text-sm font-semibold text-slate-900 truncate">
                {post.author}
              </div>
              {post.authorRole && (
                <div className="text-xs text-slate-400 truncate">
                  {post.authorRole}
                </div>
              )}
            </div>

            <span className="inline-flex items-center gap-1.5 font-mono text-xs font-bold uppercase tracking-wider text-blue-600 group-hover:translate-x-0.5 transition-transform shrink-0">
              Read Article <ArrowUpRight size={15} />
            </span>
          </div>
        </div>
      </article>
    );
  }

  return (
    <article
      onClick={onClick}
      className="group bg-white rounded-2xl border border-slate-200/80 shadow-[0_4px_20px_rgba(15,23,42,0.03)] hover:shadow-[0_16px_40px_rgba(37,99,235,0.08)] hover:-translate-y-1 hover:border-blue-200 transition-all duration-300 overflow-hidden cursor-pointer flex flex-col justify-between"
    >
      <div>
        {/* Clean Image without cluttered overlays */}
        <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-100">
          <img
            src={coverSrc}
            alt={post.title}
            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            loading="lazy"
          />
          <div className="absolute top-3.5 left-3.5">
            <span className="px-3 py-1 rounded-full bg-white/95 backdrop-blur-xs text-blue-600 font-mono text-xs font-bold uppercase tracking-wider shadow-xs">
              {post.category}
            </span>
          </div>
        </div>

        {/* Clean Minimalist Body */}
        <div className="p-6">
          <div className="flex items-center gap-2 font-mono text-xs text-slate-400 mb-2.5">
            <span>{formatDisplayDate(post.date)}</span>
            <span>•</span>
            <span>{post.readTime}</span>
          </div>

          <h3 className="font-orbitron text-lg font-bold text-slate-900 tracking-tight leading-snug mb-2.5 group-hover:text-blue-600 transition-colors line-clamp-2">
            {post.title}
          </h3>

          <p className="text-slate-600 text-sm leading-relaxed line-clamp-2">
            {post.excerpt}
          </p>
        </div>
      </div>

      {/* Minimal Footer */}
      <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between text-xs">
        <span className="font-medium text-slate-700 truncate pr-3">
          {post.author}
        </span>

        <span className="inline-flex items-center gap-1 font-mono font-bold uppercase tracking-wider text-blue-600 shrink-0 group-hover:translate-x-0.5 transition-transform">
          Read <ArrowUpRight size={14} />
        </span>
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
        { opacity: 0, y: 24 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          stagger: 0.08,
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
      className="py-24 md:py-32 relative z-10 bg-[#f8fafc] border-t border-slate-200/60"
    >
      <div className="w-full max-w-[1380px] mx-auto px-4 sm:px-6 lg:px-10 relative z-10">
        {/* Clean Minimalist Header */}
        <div className="blog-section-reveal flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
          <div>
            <span className="font-mono text-xs tracking-[0.2em] uppercase text-blue-600 font-bold block mb-2">
              Mission Logs & Publications
            </span>
            <h2 className="font-orbitron text-3xl sm:text-4xl font-black tracking-tight uppercase text-slate-900">
              Engineering{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#2563EB] to-cyan-500">
                Blog
              </span>
            </h2>
          </div>

          <MagneticButton
            className="inline-flex items-center gap-2.5 bg-slate-900 text-white hover:bg-blue-600 px-6 py-3 rounded-full text-xs font-mono uppercase tracking-wider font-bold transition-all"
            onClick={() => {
              navigate('/blog');
              window.scrollTo(0, 0);
            }}
          >
            <span className="flex items-center gap-2">
              All Articles <ArrowUpRight size={15} />
            </span>
          </MagneticButton>
        </div>

        {/* Minimal Category Filter Pills */}
        {categories.length > 1 && (
          <div className="blog-section-reveal flex flex-wrap gap-2 mb-8">
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
        )}

        {/* Featured Post */}
        {featuredPost && (
          <div className="blog-section-reveal mb-8">
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

        {/* 3-Column Post Grid */}
        {gridPosts.length > 0 && (
          <div className="blog-section-reveal grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
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
