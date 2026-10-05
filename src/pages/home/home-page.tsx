import * as React from "react";
import { Link } from "react-router-dom";
import {
  Layers,
  LayoutGrid,
  MessageSquare,
  Trophy,
  BookOpen,
  Brain,
  ArrowRight,
  Terminal,
  ShieldCheck,
  Cpu,
  Sparkles,
  Star,
} from "lucide-react";
import Header from "@/components/organism/common/Header";
import Footer from "@/components/organism/common/Footer";
import HeroBanner, {
  type BannerSlide,
} from "@/components/organism/home/HeroBanner";
import FeatureCard, {
  type FeatureItem,
} from "@/components/organism/common/FeatureCard";
import { useGetDailyExamQuery } from "@/redux/exam/examApiSlice";

export default function HomePage() {
  // Fetch today's daily exam using RTK Query
  const { data: dailyExam, isLoading: isDailyLoading } = useGetDailyExamQuery();

  // Dynamically resolve target path for daily exam feature card using /test/
  const dailyExamPath =
    isDailyLoading || !dailyExam?.id ? "#" : `/test/${dailyExam.id}`;

  // Hero Banner Slider Data with supportive slide images
  const bannerSlides: BannerSlide[] = [
    {
      id: 1,
      badgeText: "Workspace Release 2026",
      title: "Master English Exams & Vocabulary",
      description:
        "Practice with verified questions, flashcards, and real-time performance tracking designed to boost your score.",
      buttonText: "Start Learning",
      imageUrl:
        "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=800&q=80",
      onButtonClick: () => console.log("Start Learning clicked"),
    },
    {
      id: 2,
      badgeText: "Global Community",
      title: "Join Study Groups & Leaderboards",
      description:
        "Compete with learners worldwide, share study tips, and track your rank in real time.",
      buttonText: "View Leaderboard",
      imageUrl:
        "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=800&q=80",
      onButtonClick: () => console.log("View Leaderboard clicked"),
    },
  ];

  // Features with semantic theme colors
  const features: FeatureItem[] = [
    {
      title: "Test your ability",
      desc: "Challenging practice exams designed to evaluate your current proficiency level.",
      icon: <Layers className="w-6 h-6 text-brand" />,
      to: "/test",
    },
    {
      title: "Test your memory with words",
      desc: "Interactive flashcard decks and spaced-repetition drills to master vocabulary fast.",
      icon: <Brain className="w-6 h-6 text-brand" />,
      to: "/flashcards-list",
    },
    {
      title: "Joining the chat",
      desc: "Connect with native speakers and fellow learners in active study channels.",
      icon: <MessageSquare className="w-6 h-6 text-brand" />,
      to: "/chat",
    },
    {
      title: "Compete with others in daily test",
      desc: isDailyLoading
        ? "Loading daily test..."
        : "Have your skill tested by daily test",
      icon: <Trophy className="w-6 h-6 text-status-warning" />,
      to: dailyExamPath,
    },
    {
      title: "Understand more with courses",
      desc: "Structured lessons covering core grammar, reading comprehension, and listening skills.",
      icon: <BookOpen className="w-6 h-6 text-brand" />,
      to: "/courses",
    },
    {
      title: "Discuss, share your own ideas",
      desc: "Engage in community forums to ask questions, post tips, and exchange study material.",
      icon: <LayoutGrid className="w-6 h-6 text-brand" />,
      to: "/ranking",
    },
  ];

  return (
    <div className="min-h-screen w-full bg-background font-inter flex flex-col justify-between transition-colors">
      <Header />

      <main className="flex-1 w-full max-w-6xl mx-auto px-6 py-12 flex flex-col space-y-16 animate-fade-in">
        {/* 1. Split Hero Section with subtle entrance scaling */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center pt-4 pb-4">
          <div className="lg:col-span-7 space-y-6 text-left transition-all duration-500 ease-out">
            <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold tracking-wide uppercase shadow-sm transition-transform duration-300 hover:scale-105">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Freedom to Learn & Adapt</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-foreground tracking-tight leading-[1.1]">
              Innovative platform for your{" "}
              <span className="text-primary">language growth</span>.
            </h1>

            <p className="text-foreground-subtle text-base sm:text-lg leading-relaxed max-w-xl">
              Platform-driven architecture built for open source collaboration,
              rigorous self-testing, and high-performance vocabulary retention.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link
                to="/test"
                className="px-6 py-3.5 rounded-xl bg-primary text-primary-foreground font-bold text-sm shadow-md hover:opacity-95 hover:scale-[1.02] active:scale-95 transition-all flex items-center space-x-2"
              >
                <span>Get Started</span>
                <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>

              <Link
                to="/courses"
                className="px-6 py-3.5 rounded-xl bg-background-card border border-border text-foreground font-bold text-sm hover:bg-background-hover hover:scale-[1.02] active:scale-95 transition-all"
              >
                Explore Courses
              </Link>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="bg-background-card border border-border rounded-2xl p-6 shadow-xl relative overflow-hidden space-y-6 transition-all duration-300 hover:shadow-2xl hover:border-primary/40">
              <div className="absolute top-0 right-0 w-48 h-48 bg-primary/10 rounded-full blur-3xl pointer-events-none transition-all duration-500 hover:scale-125" />

              <div className="flex items-center justify-between border-b border-border pb-4">
                <div className="flex items-center space-x-2 text-foreground font-bold text-sm">
                  <Terminal className="w-4 h-4 text-primary animate-pulse" />
                  <span>Workspace Status</span>
                </div>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 text-xs font-bold">
                  Stable 2026.3
                </span>
              </div>

              <div className="space-y-4 text-sm">
                <div className="flex items-start space-x-3 transition-transform duration-200 hover:translate-x-1">
                  <ShieldCheck className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                  <div>
                    <div className="font-bold text-foreground">
                      Verified Question Banks
                    </div>
                    <div className="text-xs text-foreground-subtle">
                      Rigorously evaluated assessment tests for maximum
                      precision.
                    </div>
                  </div>
                </div>

                <div className="flex items-start space-x-3 transition-transform duration-200 hover:translate-x-1">
                  <Cpu className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                  <div>
                    <div className="font-bold text-foreground">
                      Optimized Performance
                    </div>
                    <div className="text-xs text-foreground-subtle">
                      Lightning-fast RTK Query synchronization and reactive
                      layouts.
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-border">
                <Link
                  to="/chat"
                  className="w-full py-2.5 rounded-xl bg-background border border-border text-foreground hover:bg-background-hover font-semibold text-xs flex items-center justify-center space-x-2 transition-all hover:scale-[1.01]"
                >
                  <span>Join Community Channels</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* 2. Platform Metrics Bar with hover lift */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 rounded-2xl bg-background-card border border-border shadow-sm">
          <div className="flex flex-col space-y-1 text-center md:text-left md:border-r border-border last:border-none transition-transform duration-300 hover:scale-105">
            <span className="text-2xl sm:text-3xl font-extrabold text-foreground">
              500+
            </span>
            <span className="text-xs text-foreground-subtle font-medium">
              Practice Exams
            </span>
          </div>
          <div className="flex flex-col space-y-1 text-center md:text-left md:border-r border-border last:border-none transition-transform duration-300 hover:scale-105">
            <span className="text-2xl sm:text-3xl font-extrabold text-foreground">
              10k+
            </span>
            <span className="text-xs text-foreground-subtle font-medium">
              Active Learners
            </span>
          </div>
          <div className="flex flex-col space-y-1 text-center md:text-left md:border-r border-border last:border-none transition-transform duration-300 hover:scale-105">
            <span className="text-2xl sm:text-3xl font-extrabold text-foreground">
              98%
            </span>
            <span className="text-xs text-foreground-subtle font-medium">
              Score Improvement
            </span>
          </div>
          <div className="flex flex-col space-y-1 text-center md:text-left transition-transform duration-300 hover:scale-105">
            <span className="text-2xl sm:text-3xl font-extrabold text-foreground">
              24/7
            </span>
            <span className="text-xs text-foreground-subtle font-medium">
              Peer Collaboration
            </span>
          </div>
        </section>

        {/* 3. Hero Banner Slider Carousel */}
        <section className="w-full transition-transform duration-300 hover:scale-[1.005]">
          <HeroBanner slides={bannerSlides} autoPlayInterval={6000} />
        </section>

        {/* 4. Workflow Steps Section with smooth hover elevations */}
        <section className="space-y-8">
          <div className="text-center max-w-xl mx-auto space-y-2">
            <h2 className="text-2xl font-extrabold text-foreground tracking-tight">
              How the Workspace Works
            </h2>
            <p className="text-xs sm:text-sm text-foreground-subtle">
              Three simple steps to build permanent fluency and achieve your
              target score.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-background-card border border-border rounded-2xl p-6 space-y-4 relative transition-all duration-300 hover:-translate-y-2 hover:shadow-lg">
              <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold text-base transition-transform duration-300 hover:rotate-6">
                1
              </div>
              <h3 className="text-base font-bold text-foreground">
                Choose Your Path
              </h3>
              <p className="text-xs text-foreground-subtle leading-relaxed">
                Select from specialized exam categories, vocabulary flashcard
                sets, or structured grammar courses.
              </p>
            </div>

            <div className="bg-background-card border border-border rounded-2xl p-6 space-y-4 relative transition-all duration-300 hover:-translate-y-2 hover:shadow-lg">
              <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold text-base transition-transform duration-300 hover:rotate-6">
                2
              </div>
              <h3 className="text-base font-bold text-foreground">
                Practice & Retain
              </h3>
              <p className="text-xs text-foreground-subtle leading-relaxed">
                Engage in timed evaluation tests and spaced-repetition memory
                drills designed for rapid learning.
              </p>
            </div>

            <div className="bg-background-card border border-border rounded-2xl p-6 space-y-4 relative transition-all duration-300 hover:-translate-y-2 hover:shadow-lg">
              <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold text-base transition-transform duration-300 hover:rotate-6">
                3
              </div>
              <h3 className="text-base font-bold text-foreground">
                Track & Compete
              </h3>
              <p className="text-xs text-foreground-subtle leading-relaxed">
                Monitor performance metrics, join daily leaderboard challenges,
                and collaborate in peer chat channels.
              </p>
            </div>
          </div>
        </section>

        {/* 5. Feature Cards Grid */}
        <section className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border pb-4">
            <div>
              <h2 className="text-2xl font-extrabold text-foreground tracking-tight">
                Platform Editions & Activities
              </h2>
              <p className="text-xs font-semibold text-foreground-subtle mt-1">
                Tailored modules configured for your learning workflow
              </p>
            </div>
            <span className="text-xs font-bold text-primary px-3 py-1 bg-primary/10 rounded-lg w-fit">
              6 Core Modules Available
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((item, index) => (
              <div
                key={index}
                className="transition-all duration-300 hover:-translate-y-2 hover:shadow-md"
              >
                <FeatureCard {...item} />
              </div>
            ))}
          </div>
        </section>

        {/* 6. Testimonials Section */}
        <section className="space-y-8 py-4">
          <div className="text-center max-w-xl mx-auto space-y-2">
            <h2 className="text-2xl font-extrabold text-foreground tracking-tight">
              Trusted by Language Learners
            </h2>
            <p className="text-xs sm:text-sm text-foreground-subtle">
              See what our community members have to say about their progress.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-background-card border border-border rounded-2xl p-6 space-y-4 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
              <div className="flex items-center space-x-1 text-amber-500">
                <Star className="w-4 h-4 fill-current" />
                <Star className="w-4 h-4 fill-current" />
                <Star className="w-4 h-4 fill-current" />
                <Star className="w-4 h-4 fill-current" />
                <Star className="w-4 h-4 fill-current" />
              </div>
              <p className="text-sm text-foreground italic">
                &ldquo;The exam simulator and flashcard drills completely
                transformed how I study. The instant feedback and clean
                interface make it addictive to learn.&rdquo;
              </p>
              <div className="flex items-center space-x-3 pt-2 border-t border-border">
                <div className="w-8 h-8 rounded-full bg-primary/20 text-primary font-bold flex items-center justify-center text-xs">
                  JD
                </div>
                <div>
                  <div className="text-xs font-bold text-foreground">
                    Jonathan D.
                  </div>
                  <div className="text-[10px] text-foreground-subtle">
                    Advanced Certification Candidate
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-background-card border border-border rounded-2xl p-6 space-y-4 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
              <div className="flex items-center space-x-1 text-amber-500">
                <Star className="w-4 h-4 fill-current" />
                <Star className="w-4 h-4 fill-current" />
                <Star className="w-4 h-4 fill-current" />
                <Star className="w-4 h-4 fill-current" />
                <Star className="w-4 h-4 fill-current" />
              </div>
              <p className="text-sm text-foreground italic">
                &ldquo;Daily challenges and community chat channels keep me
                motivated every single day. Highly recommend this workspace to
                anyone serious about mastery.&rdquo;
              </p>
              <div className="flex items-center space-x-3 pt-2 border-t border-border">
                <div className="w-8 h-8 rounded-full bg-primary/20 text-primary font-bold flex items-center justify-center text-xs">
                  AL
                </div>
                <div>
                  <div className="text-xs font-bold text-foreground">
                    Anna L.
                  </div>
                  <div className="text-[10px] text-foreground-subtle">
                    Vocabulary & Grammar Student
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
