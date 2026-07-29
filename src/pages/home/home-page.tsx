import {
  Layers,
  LayoutGrid,
  MessageSquare,
  Trophy,
  BookOpen,
  Brain,
} from "lucide-react";
import Header from "@/components/organism/common/Header";
import Footer from "@/components/organism/common/Footer";
import HeroBanner, {
  type BannerSlide,
} from "@/components/organism/home/HeroBanner";
import FeatureCard, {
  type FeatureItem,
} from "@/components/organism/common/FeatureCard";

export default function HomePage() {
  // Hero Banner Slider Data
  const bannerSlides: BannerSlide[] = [
    {
      id: 1,
      badgeText: "Welcome Back",
      title: "Master English Exams & Vocabulary",
      description:
        "Practice with verified questions, flashcards, and real-time performance tracking designed to boost your score.",
      buttonText: "Start Learning",
      onButtonClick: () => console.log("Start Learning clicked"),
    },
    {
      id: 2,
      badgeText: "Community",
      title: "Join Study Groups & Leaderboards",
      description:
        "Compete with learners worldwide, share study tips, and track your rank in real time.",
      buttonText: "View Leaderboard",
      onButtonClick: () => console.log("View Leaderboard clicked"),
    },
    {
      id: 3,
      badgeText: "New Feature",
      title: "Interactive Grammar Courses",
      description:
        "Dive into comprehensive lessons with step-by-step guidance tailored for all skill levels.",
      buttonText: "Explore Courses",
      onButtonClick: () => console.log("Explore Courses clicked"),
    },
  ];

  // Updated Features with tailored descriptions and icons
  const features: FeatureItem[] = [
    {
      title: "Test your ability",
      desc: "Challenging practice exams designed to evaluate your current proficiency level.",
      icon: <Layers className="w-6 h-6 text-[#5A67FF]" />,
    },
    {
      title: "Test your memory with words",
      desc: "Interactive flashcard decks and spaced-repetition drills to master vocabulary fast.",
      icon: <Brain className="w-6 h-6 text-indigo-500" />,
    },
    {
      title: "Joining the chat",
      desc: "Connect with native speakers and fellow learners in active study channels.",
      icon: <MessageSquare className="w-6 h-6 text-[#5A67FF]" />,
    },
    {
      title: "Compete with others",
      desc: "Climb monthly leaderboards, earn achievement badges, and track your progress.",
      icon: <Trophy className="w-6 h-6 text-amber-500" />,
    },
    {
      title: "Understand more with courses",
      desc: "Structured lessons covering core grammar, reading comprehension, and listening skills.",
      icon: <BookOpen className="w-6 h-6 text-indigo-500" />,
    },
    {
      title: "Discuss, share your own ideas",
      desc: "Engage in community forums to ask questions, post tips, and exchange study material.",
      icon: <LayoutGrid className="w-6 h-6 text-[#5A67FF]" />,
    },
  ];

  return (
    <div className="min-h-screen w-full bg-neutral-50 font-inter flex flex-col justify-between">
      <Header />

      <main className="flex-1 w-full max-w-5xl mx-auto px-6 py-10 flex flex-col space-y-12">
        {/* Hero Slider Banner */}
        <HeroBanner slides={bannerSlides} autoPlayInterval={6000} />

        {/* Feature Cards Grid */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-extrabold text-neutral-800 tracking-tight">
              What to do
            </h2>
            <span className="text-xs font-semibold text-neutral-400">
              Pick a learning activity
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {features.map((item, index) => (
              <FeatureCard key={index} {...item} />
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
