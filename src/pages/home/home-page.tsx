import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  Brain,
  CalendarDays,
  Clock3,
  Layers,
  MessageCircle,
  MessagesSquare,
  Play,
  Sparkles,
  Target,
  Trophy,
} from "lucide-react";
import Header from "@/components/organism/common/Header";
import Footer from "@/components/organism/common/Footer";
import HeroBanner, { type BannerSlide } from "@/components/organism/home/HeroBanner";
import FeatureCard, { type FeatureItem } from "@/components/organism/common/FeatureCard";
import { useGetDailyExamQuery } from "@/redux/exam/examApiSlice";

type StudyFocus = "practice" | "vocabulary" | "community";

const focusOptions: {
  id: StudyFocus;
  label: string;
  title: string;
  description: string;
  action: string;
  to: string;
  icon: typeof Target;
  secondaryAction: string;
  secondaryTo: string;
  secondaryIcon: typeof Target;
}[] = [
  {
    id: "practice",
    label: "Practice",
    title: "Take a focused test",
    description: "Build confidence with exam questions and instant feedback.",
    action: "Find a test",
    to: "/test",
    icon: Target,
    secondaryAction: "Look up a word",
    secondaryTo: "/dictionary",
    secondaryIcon: BookOpen,
  },
  {
    id: "vocabulary",
    label: "Vocabulary",
    title: "Grow your word bank",
    description: "Look up new words, then revisit them with flashcards.",
    action: "Explore vocabulary",
    to: "/dictionary",
    icon: BookOpen,
    secondaryAction: "Review flashcards",
    secondaryTo: "/flashcards-list",
    secondaryIcon: Brain,
  },
  {
    id: "community",
    label: "Community",
    title: "Learn with other people",
    description: "Join a conversation and turn practice into a habit.",
    action: "Open chat",
    to: "/chat",
    icon: MessageCircle,
    secondaryAction: "Visit the forum",
    secondaryTo: "/forum",
    secondaryIcon: MessagesSquare,
  },
];

export default function HomePage() {
  const navigate = useNavigate();
  const [studyFocus, setStudyFocus] = useState<StudyFocus>("practice");
  const { data: dailyExam, isLoading: isDailyLoading } = useGetDailyExamQuery();
  const dailyExamPath = dailyExam?.id ? `/test/${dailyExam.id}` : "/test";
  const selectedFocus = focusOptions.find((option) => option.id === studyFocus)!;
  const FocusIcon = selectedFocus.icon;
  const SecondaryIcon = selectedFocus.secondaryIcon;

  const bannerSlides: BannerSlide[] = [
    {
      id: "flashcard-games",
      badgeText: "A fresh way to review",
      title: "Make vocabulary more playful",
      description: "Try quick word games and turn a few spare minutes into a useful study session.",
      buttonText: "Explore flashcard games",
      imageUrl: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=800&q=80",
      onButtonClick: () => navigate("/flashcard/hub"),
    },
    {
      id: "community-forum",
      badgeText: "Learn together",
      title: "Ask questions. Share what works.",
      description: "Trade study tips, get another perspective, and help someone else along the way.",
      buttonText: "Join the forum",
      imageUrl: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=800&q=80",
      onButtonClick: () => navigate("/forum"),
    },
  ];

  const features: FeatureItem[] = [
    {
      title: "Practice exams",
      desc: "Work through exam questions at your own pace and see where to focus next.",
      icon: <Layers className="h-5 w-5 text-brand" />,
      to: "/test",
      actionText: "Browse exams",
    },
    {
      title: "Dictionary",
      desc: "Look up English words and explore definitions, examples, and translations.",
      icon: <BookOpen className="h-5 w-5 text-brand" />,
      to: "/dictionary",
      actionText: "Look up a word",
    },
    {
      title: "Flashcards",
      desc: "Review vocabulary with decks built for quick, repeatable study sessions.",
      icon: <Brain className="h-5 w-5 text-brand" />,
      to: "/flashcards-list",
      actionText: "Browse decks",
    },
    {
      title: "Learning roadmap",
      desc: "Explore a guided path and decide what skill you want to work on next.",
      icon: <Target className="h-5 w-5 text-brand" />,
      to: "/roadmap",
      actionText: "View your path",
    },
    {
      title: "Community chat",
      desc: "Connect with learners and practice sharing ideas in English.",
      icon: <MessageCircle className="h-5 w-5 text-brand" />,
      to: "/chat",
      actionText: "Join a chat",
    },
    {
      title: "Leaderboard",
      desc: "See how the community is doing and celebrate everyone’s progress.",
      icon: <Trophy className="h-5 w-5 text-status-warning" />,
      to: "/ranking",
      actionText: "View rankings",
    },
  ];

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <Header />

      <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-16 px-4 py-8 sm:px-6 lg:gap-20 lg:py-12">
        <section className="relative isolate overflow-hidden rounded-[2rem] border border-border bg-background-card shadow-sm">
          <div className="pointer-events-none absolute -right-24 -top-32 -z-10 h-[30rem] w-[30rem] rounded-full bg-brand/10 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-40 left-1/4 -z-10 h-72 w-72 rounded-full bg-violet-500/10 blur-3xl" />
          <div className="grid items-center gap-10 p-6 sm:p-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-14 lg:p-14">
            <div className="space-y-7">
              <div className="inline-flex items-center gap-2 rounded-full border border-brand/20 bg-brand/10 px-3.5 py-1.5 text-xs font-bold tracking-wide text-brand">
                <Sparkles className="h-3.5 w-3.5" />
                YOUR SPACE TO LEARN ENGLISH
              </div>
              <div className="space-y-4">
                <h1 className="max-w-2xl text-4xl font-black leading-[1.06] tracking-tight sm:text-5xl lg:text-6xl">
                  Small steps. <span className="text-brand">Stronger English.</span>
                </h1>
                <p className="max-w-xl text-base leading-7 text-foreground-subtle sm:text-lg">
                  Practice for your next exam, discover useful words, and build a learning routine that feels like yours.
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <Link
                  to={selectedFocus.to}
                  className="group inline-flex items-center gap-2 rounded-xl bg-brand px-5 py-3.5 text-sm font-bold text-brand-foreground shadow-lg shadow-brand/20 transition hover:-translate-y-0.5 hover:bg-brand-hover hover:shadow-xl active:translate-y-0"
                >
                  <Play className="h-4 w-4 fill-current" />
                  {selectedFocus.action}
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
                <Link
                  to={selectedFocus.secondaryTo}
                  className="inline-flex items-center gap-2 rounded-xl border border-border bg-background-card px-5 py-3.5 text-sm font-bold transition hover:-translate-y-0.5 hover:border-brand/40 hover:bg-background-hover active:translate-y-0"
                >
                  <SecondaryIcon className="h-4 w-4 text-brand" />
                  {selectedFocus.secondaryAction}
                </Link>
              </div>

              <div className="flex flex-wrap items-center gap-x-5 gap-y-2 pt-1 text-xs font-medium text-foreground-subtle">
                <span className="inline-flex items-center gap-1.5"><Clock3 className="h-3.5 w-3.5 text-brand" />Study at your pace</span>
                <span className="inline-flex items-center gap-1.5"><Target className="h-3.5 w-3.5 text-brand" />Choose your next goal</span>
              </div>
            </div>

            <div className="relative mx-auto w-full max-w-lg">
              <div className="absolute -inset-4 rounded-[2rem] bg-gradient-to-br from-brand/15 via-transparent to-violet-500/15 blur-xl" />
              <div className="relative overflow-hidden rounded-[1.75rem] border border-border bg-background p-5 shadow-xl sm:p-6">
                <div className="mb-6 flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.16em] text-brand">Your next session</p>
                    <h2 className="mt-1 text-xl font-extrabold tracking-tight">What sounds good?</h2>
                  </div>
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand/10 text-brand">
                    <FocusIcon className="h-5 w-5" />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 rounded-xl bg-background-hover/70 p-1.5" role="group" aria-label="Choose a study focus">
                  {focusOptions.map((option) => (
                    <button
                      key={option.id}
                      type="button"
                      aria-pressed={studyFocus === option.id}
                      onClick={() => setStudyFocus(option.id)}
                      className={`rounded-lg px-2 py-2.5 text-xs font-bold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 ${studyFocus === option.id ? "bg-background-card text-brand shadow-sm" : "text-foreground-subtle hover:text-foreground"}`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>

                <div className="min-h-36 py-6" aria-live="polite">
                  <h3 className="text-lg font-extrabold">{selectedFocus.title}</h3>
                  <p className="mt-2 max-w-sm text-sm leading-6 text-foreground-subtle">{selectedFocus.description}</p>
                </div>
                <Link
                  to={selectedFocus.to}
                  className="group flex w-full items-center justify-between rounded-xl border border-border bg-background-card px-4 py-3.5 text-sm font-bold transition hover:border-brand/30 hover:bg-brand/5"
                >
                  <span>{selectedFocus.action}</span>
                  <ArrowUpRight className="h-4 w-4 text-brand transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </Link>

                <div className="mt-4 flex items-center gap-3 rounded-xl bg-brand/5 p-3.5">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-brand/10 text-brand"><CalendarDays className="h-4 w-4" /></div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-bold">Daily challenge</p>
                    <p className="truncate text-[11px] text-foreground-subtle">{isDailyLoading ? "Finding today’s test…" : dailyExam?.name ?? "A fresh practice session is ready"}</p>
                  </div>
                  <Link to={dailyExamPath} aria-label="Open daily challenge" className="rounded-lg p-2 text-brand transition hover:bg-brand/10"><ArrowRight className="h-4 w-4" /></Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="space-y-6" aria-labelledby="tools-heading">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div className="space-y-2">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-brand">Find your flow</p>
              <h2 id="tools-heading" className="text-2xl font-extrabold tracking-tight sm:text-3xl">A good place to start</h2>
              <p className="max-w-xl text-sm leading-6 text-foreground-subtle">Pick a tool for the kind of practice you need today. You can switch it up whenever you like.</p>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((item) => <FeatureCard key={item.title} {...item} />)}
          </div>
        </section>

        <section className="space-y-5">
          <div className="flex items-end justify-between gap-4">
            <div className="space-y-2">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-brand">Keep the momentum</p>
              <h2 className="text-2xl font-extrabold tracking-tight sm:text-3xl">More ways to make progress</h2>
            </div>
          </div>
          <HeroBanner slides={bannerSlides} autoPlayInterval={6500} />
        </section>

      </main>

      <Footer />
    </div>
  );
}
