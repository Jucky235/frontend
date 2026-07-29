import * as React from "react";
import {
  MessageSquare,
  Search,
  Plus,
  ThumbsUp,
  MessageCircle,
  Eye,
  Pin,
  Filter,
  Flame,
  HelpCircle,
  BookOpen,
  Sparkles,
  Award,
} from "lucide-react";
import Header from "@/components/organism/common/Header";
import Footer from "@/components/organism/common/Footer";

export interface ForumPost {
  id: string | number;
  title: string;
  excerpt: string;
  author: {
    name: string;
    avatar: string;
    badge?: string;
  };
  category: string;
  tags: string[];
  upvotes: number;
  replies: number;
  views: number;
  timestamp: string;
  isPinned?: boolean;
  isSolved?: boolean;
}

const CATEGORIES = [
  {
    id: "all",
    name: "All Topics",
    icon: <MessageSquare className="w-4 h-4" />,
  },
  { id: "exams", name: "Exam Strategy", icon: <Award className="w-4 h-4" /> },
  {
    id: "grammar",
    name: "Vocabulary & Grammar",
    icon: <BookOpen className="w-4 h-4" />,
  },
  { id: "qa", name: "Q&A Help", icon: <HelpCircle className="w-4 h-4" /> },
  {
    id: "resources",
    name: "Study Resources",
    icon: <Sparkles className="w-4 h-4" />,
  },
];

const INITIAL_POSTS: ForumPost[] = [
  {
    id: 1,
    title: "Official TOEFL & IELTS Mock Exam Guidelines for August 2026",
    excerpt:
      "Important updates regarding time limits, new speaking section evaluation criteria, and automated scoring breakdown.",
    author: {
      name: "Admin Team",
      avatar:
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150",
      badge: "Staff",
    },
    category: "Exam Strategy",
    tags: ["Announcement", "IELTS", "TOEFL"],
    upvotes: 142,
    replies: 38,
    views: 1205,
    timestamp: "2 hours ago",
    isPinned: true,
  },
  {
    id: 2,
    title: "How do you effectively memorize 30+ new vocabulary words daily?",
    excerpt:
      "I'm using spaced repetition flashcards, but I keep forgetting context usage when writing essays. Any advice on retention techniques?",
    author: {
      name: "David Chen",
      avatar:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150",
    },
    category: "Vocabulary & Grammar",
    tags: ["Vocabulary", "StudyTips", "Memory"],
    upvotes: 45,
    replies: 19,
    views: 430,
    timestamp: "4 hours ago",
    isSolved: true,
  },
  {
    id: 3,
    title:
      "Share your favorite listening practice podcasts for Band 8+ preparation",
    excerpt:
      "Looking for native-speaking podcasts covering academic topics, natural conversations, and accents suitable for advanced practice.",
    author: {
      name: "Sarah Jenkins",
      avatar:
        "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=150",
    },
    category: "Study Resources",
    tags: ["Listening", "Podcasts", "Resources"],
    upvotes: 29,
    replies: 12,
    views: 280,
    timestamp: "6 hours ago",
  },
  {
    id: 4,
    title: "Difference between 'In spite of' vs 'Despite' in formal writing?",
    excerpt:
      "Could someone explain when to use these prepositions correctly in academic essays? Examples would be greatly appreciated!",
    author: {
      name: "Alex Morgan",
      avatar:
        "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=150",
    },
    category: "Q&A Help",
    tags: ["Grammar", "Writing", "Question"],
    upvotes: 18,
    replies: 8,
    views: 195,
    timestamp: "Yesterday",
    isSolved: true,
  },
];

export default function ForumPage() {
  const [selectedCategory, setSelectedCategory] = React.useState("all");
  const [searchQuery, setSearchQuery] = React.useState("");
  const [sortBy, setSortBy] = React.useState<"latest" | "popular">("latest");
  const [posts, setPosts] = React.useState<ForumPost[]>(INITIAL_POSTS);

  const handleUpvote = (id: string | number) => {
    setPosts((prev) =>
      prev.map((post) =>
        post.id === id ? { ...post, upvotes: post.upvotes + 1 } : post,
      ),
    );
  };

  const filteredPosts = posts
    .filter((post) => {
      const matchesCategory =
        selectedCategory === "all" ||
        post.category.toLowerCase().includes(selectedCategory.toLowerCase());
      const matchesSearch =
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    })
    .sort((a, b) => {
      if (a.isPinned) return -1;
      if (b.isPinned) return 1;
      if (sortBy === "popular") return b.upvotes - a.upvotes;
      return 0;
    });

  return (
    <div className="min-h-screen w-full bg-neutral-50 font-inter flex flex-col justify-between">
      <Header />

      <main className="flex-1 w-full max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-8">
        {/* Banner Section */}
        <div className="bg-gradient-to-br from-blue-600 via-indigo-600 to-indigo-700 rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden shadow-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="space-y-2 z-10 max-w-xl">
            <span className="inline-flex items-center space-x-1.5 bg-white/20 text-xs font-bold px-3 py-1 rounded-full backdrop-blur-md uppercase tracking-wider">
              <Flame className="w-3.5 h-3.5 text-amber-300 fill-current" />
              <span>Community Forum</span>
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Discuss, Ask & Share Knowledge
            </h1>
            <p className="text-xs sm:text-sm opacity-90 font-medium leading-relaxed">
              Connect with fellow learners, exchange study notes, ask questions,
              and practice with global peers.
            </p>
          </div>

          <button className="z-10 bg-white text-[#5A67FF] hover:bg-neutral-100 font-bold text-xs sm:text-sm px-5 py-3 rounded-xl shadow-md transition-all flex items-center space-x-2 cursor-pointer active:scale-95 shrink-0">
            <Plus className="w-4 h-4" />
            <span>New Discussion</span>
          </button>

          {/* Background decoration */}
          <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-indigo-500 rounded-full opacity-30 blur-2xl pointer-events-none" />
        </div>

        {/* Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Left Sidebar - Categories */}
          <aside className="space-y-6">
            <div className="bg-white border border-neutral-200/80 rounded-2xl p-4 shadow-xs space-y-3">
              <h2 className="text-xs font-bold text-neutral-400 uppercase tracking-wider px-2">
                Categories
              </h2>
              <nav className="space-y-1">
                {CATEGORIES.map((cat) => {
                  const isActive = selectedCategory === cat.id;
                  return (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.id)}
                      className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        isActive
                          ? "bg-indigo-50 text-[#5A67FF]"
                          : "text-neutral-600 hover:bg-neutral-100"
                      }`}
                    >
                      <span
                        className={
                          isActive ? "text-[#5A67FF]" : "text-neutral-400"
                        }
                      >
                        {cat.icon}
                      </span>
                      <span>{cat.name}</span>
                    </button>
                  );
                })}
              </nav>
            </div>

            {/* Quick Stats / Community Info Widget */}
            <div className="bg-white border border-neutral-200/80 rounded-2xl p-5 shadow-xs space-y-4">
              <h3 className="text-xs font-extrabold text-neutral-800 uppercase tracking-wider">
                Community Stats
              </h3>
              <div className="grid grid-cols-2 gap-3 text-center">
                <div className="bg-neutral-50 p-3 rounded-xl border border-neutral-100">
                  <div className="text-base font-black text-[#5A67FF]">
                    1,280
                  </div>
                  <div className="text-[10px] font-bold text-neutral-400">
                    Discussions
                  </div>
                </div>
                <div className="bg-neutral-50 p-3 rounded-xl border border-neutral-100">
                  <div className="text-base font-black text-indigo-500">
                    4,520
                  </div>
                  <div className="text-[10px] font-bold text-neutral-400">
                    Members
                  </div>
                </div>
              </div>
            </div>
          </aside>

          {/* Main Feed */}
          <section className="lg:col-span-3 space-y-6">
            {/* Controls Bar (Search & Filter) */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white border border-neutral-200/80 p-3 rounded-2xl shadow-xs">
              <div className="relative w-full sm:w-80">
                <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search discussions or tags..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-neutral-100 border border-transparent rounded-xl text-xs font-medium text-neutral-800 focus:outline-none focus:bg-white focus:border-[#5A67FF] transition-all"
                />
              </div>

              {/* Sort Options */}
              <div className="flex items-center space-x-2 w-full sm:w-auto justify-end">
                <Filter className="w-3.5 h-3.5 text-neutral-400" />
                <div className="bg-neutral-100 p-1 rounded-xl flex items-center space-x-1">
                  <button
                    onClick={() => setSortBy("latest")}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      sortBy === "latest"
                        ? "bg-white text-[#5A67FF] shadow-xs"
                        : "text-neutral-500 hover:text-neutral-800"
                    }`}
                  >
                    Latest
                  </button>
                  <button
                    onClick={() => setSortBy("popular")}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      sortBy === "popular"
                        ? "bg-white text-[#5A67FF] shadow-xs"
                        : "text-neutral-500 hover:text-neutral-800"
                    }`}
                  >
                    Top
                  </button>
                </div>
              </div>
            </div>

            {/* Discussion Thread Cards */}
            <div className="space-y-4">
              {filteredPosts.map((post) => (
                <article
                  key={post.id}
                  className={`bg-white border rounded-2xl p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4 ${
                    post.isPinned
                      ? "border-indigo-200 bg-indigo-50/20"
                      : "border-neutral-200/80"
                  }`}
                >
                  <div className="space-y-3">
                    {/* Header Meta (Author, Category, Pinned status) */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2.5">
                        <img
                          src={post.author.avatar}
                          alt={post.author.name}
                          className="w-8 h-8 rounded-full object-cover border border-neutral-200"
                        />
                        <div>
                          <div className="flex items-center space-x-1.5">
                            <span className="text-xs font-extrabold text-neutral-800">
                              {post.author.name}
                            </span>
                            {post.author.badge && (
                              <span className="bg-[#5A67FF] text-white text-[9px] font-bold px-1.5 py-0.5 rounded-md">
                                {post.author.badge}
                              </span>
                            )}
                          </div>
                          <span className="text-[10px] text-neutral-400 font-medium">
                            {post.timestamp}
                          </span>
                        </div>
                      </div>

                      {/* Status Badges */}
                      <div className="flex items-center space-x-2">
                        {post.isPinned && (
                          <span className="bg-amber-100 text-amber-700 text-[10px] font-extrabold px-2.5 py-1 rounded-md flex items-center space-x-1">
                            <Pin className="w-3 h-3 fill-current" />
                            <span>Pinned</span>
                          </span>
                        )}
                        {post.isSolved && (
                          <span className="bg-emerald-100 text-emerald-700 text-[10px] font-extrabold px-2.5 py-1 rounded-md">
                            Solved
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Title & Excerpt */}
                    <div className="space-y-1.5">
                      <h2 className="text-base font-extrabold text-neutral-800 hover:text-[#5A67FF] transition-colors cursor-pointer leading-snug">
                        {post.title}
                      </h2>
                      <p className="text-xs text-neutral-500 font-medium line-clamp-2 leading-relaxed">
                        {post.excerpt}
                      </p>
                    </div>

                    {/* Tags */}
                    <div className="flex items-center space-x-2 pt-1">
                      {post.tags.map((tag) => (
                        <span
                          key={tag}
                          className="text-[10px] font-bold text-neutral-500 bg-neutral-100 px-2.5 py-1 rounded-md hover:bg-neutral-200 transition-colors cursor-pointer"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Card Footer Metrics */}
                  <div className="pt-3 border-t border-neutral-100 flex items-center justify-between text-xs font-semibold text-neutral-400">
                    <div className="flex items-center space-x-4">
                      {/* Upvote Button */}
                      <button
                        onClick={() => handleUpvote(post.id)}
                        className="flex items-center space-x-1.5 text-neutral-500 hover:text-[#5A67FF] transition-colors cursor-pointer"
                      >
                        <ThumbsUp className="w-3.5 h-3.5" />
                        <span className="font-bold">{post.upvotes}</span>
                      </button>

                      {/* Replies */}
                      <div className="flex items-center space-x-1.5">
                        <MessageCircle className="w-3.5 h-3.5" />
                        <span>{post.replies} replies</span>
                      </div>

                      {/* Views */}
                      <div className="flex items-center space-x-1.5 hidden sm:flex">
                        <Eye className="w-3.5 h-3.5" />
                        <span>{post.views} views</span>
                      </div>
                    </div>

                    <span className="text-[11px] font-bold text-[#5A67FF]">
                      {post.category}
                    </span>
                  </div>
                </article>
              ))}
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
