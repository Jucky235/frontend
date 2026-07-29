import * as React from "react";
import {
  Calendar,
  Clock,
  ArrowRight,
  Sparkles,
  Search,
  BookOpen,
} from "lucide-react";
import Header from "@/components/organism/common/Header";
import Footer from "@/components/organism/common/Footer";

export interface Article {
  id: string | number;
  title: string;
  excerpt: string;
  category: "Updates" | "Exams" | "Community" | "Tips";
  date: string;
  readTime: string;
  imageUrl?: string;
  featured?: boolean;
}

const ARTICLES: Article[] = [
  {
    id: 1,
    title: "Introducing New Interactive Speaking Practice & Mock Exams",
    excerpt:
      "We are excited to launch our brand-new AI-assisted speaking practice module and timed IELTS & TOEFL mock exams designed to simulate real test conditions.",
    category: "Updates",
    date: "Jul 28, 2026",
    readTime: "4 min read",
    imageUrl:
      "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&q=80&w=1000",
    featured: true,
  },
  {
    id: 2,
    title: "5 Proven Strategies to Boost Your Vocabulary Retainability",
    excerpt:
      "Discover how spaced repetition algorithms and context-based flashcards can double your word retention rate in under 30 days.",
    category: "Tips",
    date: "Jul 24, 2026",
    readTime: "6 min read",
    imageUrl:
      "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&q=80&w=600",
  },
  {
    id: 3,
    title: "August Leaderboard Tournament Season Starts Next Week",
    excerpt:
      "Get ready to compete! Compete with thousands of learners globally, climb the monthly ranks, and earn exclusive profile badges.",
    category: "Community",
    date: "Jul 20, 2026",
    readTime: "3 min read",
    imageUrl:
      "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=600",
  },
  {
    id: 4,
    title: "Understanding the 2026 Updated Scoring Criteria for Grammar Tests",
    excerpt:
      "A complete breakdown of how test items are evaluated and practical examples to help you avoid common traps.",
    category: "Exams",
    date: "Jul 15, 2026",
    readTime: "5 min read",
    imageUrl:
      "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&q=80&w=600",
  },
  {
    id: 5,
    title: "Community Spotlight: How Alex Reached Band 8.5 in 3 Months",
    excerpt:
      "Read Alex's personal study routine, daily practice breakdown, and recommended resource stack.",
    category: "Community",
    date: "Jul 10, 2026",
    readTime: "7 min read",
    imageUrl:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=600",
  },
];

const CATEGORIES = ["All", "Updates", "Exams", "Community", "Tips"];

export default function NewsPage() {
  const [selectedCategory, setSelectedCategory] = React.useState("All");
  const [searchQuery, setSearchQuery] = React.useState("");

  // Separate featured article from regular list
  const featuredArticle = ARTICLES.find((item) => item.featured) || ARTICLES[0];

  // Filter articles based on selected category and search input
  const filteredArticles = ARTICLES.filter((article) => {
    const matchesCategory =
      selectedCategory === "All" || article.category === selectedCategory;
    const matchesSearch =
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.excerpt.toLowerCase().includes(searchQuery.toLowerCase());

    return (
      matchesCategory && matchesSearch && article.id !== featuredArticle.id
    );
  });

  return (
    <div className="min-h-screen w-full bg-neutral-50 font-inter flex flex-col justify-between">
      <Header />

      <main className="flex-1 w-full max-w-5xl mx-auto px-4 sm:px-6 py-10 space-y-10">
        {/* Title Header Block */}
        <div className="space-y-3">
          <div className="inline-flex items-center space-x-2 bg-indigo-50 border border-indigo-100 text-[#5A67FF] text-xs font-bold px-3 py-1 rounded-full">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Latest Updates & Articles</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-neutral-800 tracking-tight">
            News & Announcement Center
          </h1>
          <p className="text-sm text-neutral-500 max-w-2xl font-medium leading-relaxed">
            Stay tuned with our latest product releases, exam preparation
            guides, community highlights, and study strategies.
          </p>
        </div>

        {/* Featured Article Banner */}
        {featuredArticle && (
          <section className="bg-white border border-neutral-200/80 rounded-3xl overflow-hidden shadow-xs hover:shadow-md transition-shadow group">
            <div className="grid grid-cols-1 md:grid-cols-2">
              <div className="h-56 md:h-full relative overflow-hidden bg-neutral-100">
                <img
                  src={featuredArticle.imageUrl}
                  alt={featuredArticle.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>

              <div className="p-6 sm:p-8 flex flex-col justify-between space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center space-x-3 text-xs font-bold">
                    <span className="bg-[#5A67FF]/10 text-[#5A67FF] px-2.5 py-1 rounded-full">
                      {featuredArticle.category}
                    </span>
                    <span className="text-amber-600 bg-amber-50 px-2.5 py-1 rounded-full flex items-center space-x-1">
                      <Sparkles className="w-3 h-3" />
                      <span>Featured Post</span>
                    </span>
                  </div>

                  <h2 className="text-xl sm:text-2xl font-extrabold text-neutral-800 tracking-tight leading-snug group-hover:text-[#5A67FF] transition-colors">
                    {featuredArticle.title}
                  </h2>

                  <p className="text-xs sm:text-sm text-neutral-600 line-clamp-3 leading-relaxed">
                    {featuredArticle.excerpt}
                  </p>
                </div>

                <div className="pt-4 border-t border-neutral-100 flex items-center justify-between text-xs text-neutral-400 font-semibold">
                  <div className="flex items-center space-x-4">
                    <span className="flex items-center space-x-1">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{featuredArticle.date}</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{featuredArticle.readTime}</span>
                    </span>
                  </div>

                  <button className="text-[#5A67FF] font-bold flex items-center space-x-1 hover:underline">
                    <span>Read Article</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Filter Controls & Search Bar */}
        <section className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-2">
          {/* Category Tabs */}
          <div className="flex items-center space-x-2 overflow-x-auto pb-2 sm:pb-0 w-full sm:w-auto scrollbar-none">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                  selectedCategory === cat
                    ? "bg-[#5A67FF] text-white shadow-xs"
                    : "bg-white text-neutral-600 border border-neutral-200/80 hover:bg-neutral-100"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="relative w-full sm:w-64 shrink-0">
            <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search news..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-white border border-neutral-200/80 rounded-xl text-xs font-medium text-neutral-800 focus:outline-none focus:border-[#5A67FF] transition-colors"
            />
          </div>
        </section>

        {/* Articles Grid */}
        <section className="space-y-6">
          {filteredArticles.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredArticles.map((article) => (
                <article
                  key={article.id}
                  className="bg-white border border-neutral-200/80 rounded-2xl overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between group cursor-pointer"
                >
                  <div>
                    {/* Card Thumbnail */}
                    <div className="h-44 w-full overflow-hidden bg-neutral-100 relative">
                      <img
                        src={article.imageUrl}
                        alt={article.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-md text-[#5A67FF] text-[10px] font-extrabold px-2.5 py-1 rounded-md shadow-xs">
                        {article.category}
                      </span>
                    </div>

                    {/* Card Body */}
                    <div className="p-5 space-y-2.5">
                      <h3 className="text-base font-extrabold text-neutral-800 line-clamp-2 group-hover:text-[#5A67FF] transition-colors leading-snug">
                        {article.title}
                      </h3>
                      <p className="text-xs text-neutral-500 line-clamp-2 leading-relaxed font-medium">
                        {article.excerpt}
                      </p>
                    </div>
                  </div>

                  {/* Card Footer */}
                  <div className="px-5 pb-5 pt-2 flex items-center justify-between text-[11px] font-semibold text-neutral-400 border-t border-neutral-50/80 mt-2">
                    <span className="flex items-center space-x-1">
                      <Calendar className="w-3 h-3" />
                      <span>{article.date}</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <Clock className="w-3 h-3" />
                      <span>{article.readTime}</span>
                    </span>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="bg-white border border-neutral-200/80 rounded-2xl p-12 text-center space-y-3">
              <BookOpen className="w-8 h-8 text-neutral-300 mx-auto" />
              <h3 className="text-base font-bold text-neutral-700">
                No articles found
              </h3>
              <p className="text-xs text-neutral-400">
                Try adjusting your search query or selecting a different
                category.
              </p>
            </div>
          )}
        </section>

        {/* Newsletter CTA Subscription */}
        <section className="w-full bg-gradient-to-br from-blue-600 to-indigo-600 rounded-3xl p-8 text-white relative overflow-hidden shadow-lg flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 z-10 max-w-md">
            <h3 className="text-xl sm:text-2xl font-extrabold tracking-tight">
              Stay ahead of product updates
            </h3>
            <p className="text-xs sm:text-sm opacity-90 leading-relaxed font-medium">
              Get key announcements, test preparation tips, and weekly learning
              insights delivered right to your inbox.
            </p>
          </div>

          <div className="z-10 w-full md:w-auto flex items-center space-x-2">
            <input
              type="email"
              placeholder="Enter your email"
              className="bg-white/10 text-white placeholder-white/60 border border-white/20 text-xs px-4 py-3 rounded-xl focus:outline-none focus:bg-white/20 transition-all w-full md:w-64"
            />
            <button className="bg-white text-[#5A67FF] hover:bg-neutral-100 text-xs font-bold px-5 py-3 rounded-xl transition-all shrink-0 cursor-pointer active:scale-95 shadow-md">
              Subscribe
            </button>
          </div>

          {/* Abstract Blobs */}
          <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-indigo-500 rounded-full opacity-30 blur-2xl pointer-events-none" />
        </section>
      </main>

      <Footer />
    </div>
  );
}
