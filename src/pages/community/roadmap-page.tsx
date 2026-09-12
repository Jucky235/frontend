import * as React from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Check,
  Lock,
  Play,
  Star,
  Trophy,
  Flame,
  Zap,
  BookOpen,
  Headphones,
  Mic,
  PenTool,
  Sparkles,
  Gift,
  Flag,
  Cloud,
  Trees,
  Mountain,
  Compass,
} from "lucide-react";

type LessonStatus = "completed" | "current" | "locked";

interface LessonNode {
  id: string;
  title: string;
  description: string;
  type: "listening" | "reading" | "speaking" | "writing" | "quiz" | "chest";
  status: LessonStatus;
  stars: number;
}

interface UnitSection {
  id: string;
  unitNumber: number;
  title: string;
  description: string;
  color: string;
  lessons: LessonNode[];
}

const ROADMAP_DATA: UnitSection[] = [
  {
    id: "unit-1",
    unitNumber: 1,
    title: "Foundations & Basics",
    description: "Master core vocabulary and sentence structures",
    color: "bg-emerald-500",
    lessons: [
      {
        id: "l-1",
        title: "Basic Greetings",
        description: "Learn basic conversational hellos and goodbyes.",
        type: "listening",
        status: "completed",
        stars: 3,
      },
      {
        id: "l-2",
        title: "Essential Nouns",
        description: "Common everyday objects and simple sentences.",
        type: "reading",
        status: "completed",
        stars: 3,
      },
      {
        id: "l-3",
        title: "Pronunciation Intro",
        description: "Practice fundamental vowel and consonant sounds.",
        type: "speaking",
        status: "completed",
        stars: 2,
      },
      {
        id: "l-4",
        title: "Unit 1 Checkpoint",
        description: "Test your knowledge on Unit 1 fundamentals.",
        type: "quiz",
        status: "current",
        stars: 0,
      },
      {
        id: "l-5",
        title: "Bonus Chest",
        description: "Claim your Unit 1 reward chest!",
        type: "chest",
        status: "locked",
        stars: 0,
      },
    ],
  },
  {
    id: "unit-2",
    unitNumber: 2,
    title: "Daily Life & Routine",
    description: "Express your daily activities and timing",
    color: "bg-indigo-500",
    lessons: [
      {
        id: "l-6",
        title: "Telling Time",
        description: "Hours, minutes, and time expressions.",
        type: "listening",
        status: "locked",
        stars: 0,
      },
      {
        id: "l-7",
        title: "Food & Dining",
        description: "Order food and express dietary preferences.",
        type: "reading",
        status: "locked",
        stars: 0,
      },
      {
        id: "l-8",
        title: "Work & Hobbies",
        description: "Talk about occupations and free-time fun.",
        type: "speaking",
        status: "locked",
        stars: 0,
      },
      {
        id: "l-9",
        title: "Unit 2 Master Challenge",
        description: "Comprehensive exam for Unit 2 mastery.",
        type: "quiz",
        status: "locked",
        stars: 0,
      },
      {
        id: "l-10",
        title: "Mastery Chest",
        description: "Claim your Unit 2 reward chest!",
        type: "chest",
        status: "locked",
        stars: 0,
      },
    ],
  },
];

function getLessonIcon(type: LessonNode["type"]) {
  switch (type) {
    case "listening":
      return <Headphones className="w-6 h-6" />;
    case "reading":
      return <BookOpen className="w-6 h-6" />;
    case "speaking":
      return <Mic className="w-6 h-6" />;
    case "writing":
      return <PenTool className="w-6 h-6" />;
    case "quiz":
      return <Trophy className="w-6 h-6" />;
    case "chest":
      return <Gift className="w-6 h-6 animate-bounce text-amber-300" />;
  }
}

export default function GrandHorizontalRoadmapPage() {
  const navigate = useNavigate();
  const [activeLesson, setActiveLesson] = React.useState<LessonNode | null>(
    null,
  );
  const currentScrollRef = React.useRef<HTMLDivElement>(null);

  // Expanded dimensions
  const NODE_SPACING_X = 200; // Increased distance between nodes
  const AMP_Y = 120; // Expanded wave height
  const BASE_Y = 260; // Center vertical baseline inside 520px height

  // Calculate coordinates for lessons & background decorations
  const { allLessons, cloudDecorations, landscapeDecorations } =
    React.useMemo(() => {
      const lessonsList: Array<{
        lesson: LessonNode;
        unit: UnitSection;
        x: number;
        y: number;
      }> = [];

      let globalIdx = 0;
      ROADMAP_DATA.forEach((unit) => {
        unit.lessons.forEach((lesson) => {
          const x = 120 + globalIdx * NODE_SPACING_X;
          const y = BASE_Y + Math.sin(globalIdx * 1.0) * AMP_Y;
          lessonsList.push({ lesson, unit, x, y });
          globalIdx++;
        });
      });

      // Generate Cloud Decorations
      const clouds = Array.from({ length: 8 }).map((_, i) => ({
        id: `cloud-${i}`,
        x: 80 + i * 380,
        y: 30 + (i % 3) * 25,
        scale: 0.8 + (i % 2) * 0.4,
      }));

      // Generate Landscape Environment Decorations
      const landscapes = Array.from({ length: 6 }).map((_, i) => ({
        id: `landscape-${i}`,
        x: 180 + i * 450,
        y: i % 2 === 0 ? 60 : 420,
        type: i % 2 === 0 ? "mountain" : "trees",
      }));

      return {
        allLessons: lessonsList,
        cloudDecorations: clouds,
        landscapeDecorations: landscapes,
      };
    }, []);

  // Construct SVG Bezier Smooth Curve path
  const svgPathD = React.useMemo(() => {
    if (allLessons.length < 2) return "";
    let d = `M ${allLessons[0].x} ${allLessons[0].y}`;

    for (let i = 0; i < allLessons.length - 1; i++) {
      const p1 = allLessons[i];
      const p2 = allLessons[i + 1];
      const cx1 = p1.x + (p2.x - p1.x) / 2;
      const cy1 = p1.y;
      const cx2 = p1.x + (p2.x - p1.x) / 2;
      const cy2 = p2.y;
      d += ` C ${cx1} ${cy1}, ${cx2} ${cy2}, ${p2.x} ${p2.y}`;
    }
    return d;
  }, [allLessons]);

  const handleNodeClick = (lesson: LessonNode) => {
    if (lesson.status === "locked") return;
    setActiveLesson(lesson);
  };

  const totalWidth = 240 + allLessons.length * NODE_SPACING_X;

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 via-background to-emerald-50/20 dark:from-neutral-950 dark:via-background dark:to-neutral-900 text-foreground flex flex-col justify-between overflow-hidden">
      {/* Top Header Navigation */}
      <header className="sticky top-0 z-30 w-full bg-background/80 backdrop-blur-md border-b border-border px-6 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="flex items-center space-x-1.5 text-sm font-bold text-foreground-subtle hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </button>
          <div className="h-4 w-px bg-border" />
          <div className="flex items-center space-x-2">
            <Compass className="w-5 h-5 text-brand" />
            <h1 className="font-extrabold text-lg text-foreground tracking-tight">
              World Roadmap
            </h1>
          </div>
        </div>

        {/* User Stats / Streaks */}
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-1.5 text-amber-500 font-extrabold text-sm bg-amber-500/10 px-3 py-1.5 rounded-full border border-amber-500/20">
            <Flame className="w-5 h-5 fill-amber-500 animate-pulse" />
            <span>7 Days</span>
          </div>
          <div className="flex items-center space-x-1.5 text-sky-500 font-extrabold text-sm bg-sky-500/10 px-3 py-1.5 rounded-full border border-sky-500/20">
            <Zap className="w-5 h-5 fill-sky-500" />
            <span>450 XP</span>
          </div>
        </div>
      </header>

      {/* Main Expanded Horizontal Scrollable World */}
      <main
        ref={currentScrollRef}
        className="flex-1 overflow-x-auto scrollbar-thin scrollbar-thumb-border py-8 px-12 flex items-center relative"
      >
        <div
          className="relative h-[520px] flex items-center my-auto select-none"
          style={{ width: `${totalWidth}px` }}
        >
          {/* Background Cloud Decorations */}
          {cloudDecorations.map((cloud) => (
            <div
              key={cloud.id}
              className="absolute pointer-events-none opacity-40 text-sky-300 dark:text-neutral-700 transition-transform duration-1000 hover:translate-x-2"
              style={{
                left: `${cloud.x}px`,
                top: `${cloud.y}px`,
                transform: `scale(${cloud.scale})`,
              }}
            >
              <Cloud className="w-16 h-16 fill-current" />
            </div>
          ))}

          {/* Background Landscape / Mountain Elements */}
          {landscapeDecorations.map((item) => (
            <div
              key={item.id}
              className="absolute pointer-events-none opacity-25 text-emerald-600 dark:text-emerald-800"
              style={{ left: `${item.x}px`, top: `${item.y}px` }}
            >
              {item.type === "mountain" ? (
                <Mountain className="w-20 h-20" />
              ) : (
                <Trees className="w-16 h-16" />
              )}
            </div>
          ))}

          {/* SVG Smooth Connecting Path Track */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
            {/* Outer Thick Shadow Path */}
            <path
              d={svgPathD}
              fill="none"
              stroke="currentColor"
              strokeWidth="22"
              strokeLinecap="round"
              className="text-neutral-300/60 dark:text-neutral-800"
            />
            {/* Inner Dirt Track Path */}
            <path
              d={svgPathD}
              fill="none"
              stroke="currentColor"
              strokeWidth="14"
              strokeLinecap="round"
              className="text-amber-100 dark:text-neutral-900"
            />
            {/* Active Stepping Trail Overlay */}
            <path
              d={svgPathD}
              fill="none"
              stroke="currentColor"
              strokeWidth="6"
              strokeLinecap="round"
              strokeDasharray="12 12"
              className="text-brand animate-pulse"
            />
          </svg>

          {/* Render Unit Banners & Expanded Nodes */}
          {allLessons.map(({ lesson, unit, x, y }, index) => {
            const isFirstOfUnit =
              index === 0 || allLessons[index - 1].unit.id !== unit.id;
            const isSelected = activeLesson?.id === lesson.id;
            const isCurrent = lesson.status === "current";

            return (
              <React.Fragment key={lesson.id}>
                {/* Large Horizontal Unit Banner Landmark */}
                {isFirstOfUnit && (
                  <div
                    className="absolute top-4 z-10 flex flex-col items-center"
                    style={{ left: `${x - 60}px` }}
                  >
                    <div
                      className={`px-5 py-2.5 rounded-2xl text-white font-extrabold text-sm shadow-xl ${unit.color} flex items-center space-x-2 border-2 border-white/20 tracking-wide`}
                    >
                      <Sparkles className="w-4 h-4" />
                      <span>
                        Unit {unit.unitNumber}: {unit.title}
                      </span>
                    </div>
                    {/* Flag Post Decoration */}
                    <div className="w-1 h-8 bg-neutral-300 dark:bg-neutral-700 rounded-full" />
                  </div>
                )}

                {/* Lesson Node Container */}
                <div
                  className="absolute z-20 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center"
                  style={{ left: `${x}px`, top: `${y}px` }}
                >
                  {/* Current Mascot Indicator (Duolingo Style Avatar) */}
                  {isCurrent && (
                    <div className="absolute -top-12 z-30 flex flex-col items-center animate-bounce">
                      <div className="bg-brand text-white px-2.5 py-1 rounded-full text-[10px] font-black uppercase shadow-lg tracking-wider">
                        START
                      </div>
                      <div className="w-0 h-0 border-l-4 border-l-transparent border-r-4 border-r-transparent border-t-4 border-t-brand" />
                    </div>
                  )}

                  {/* Pulsing Outer Ring for Current Active Lesson */}
                  {isCurrent && (
                    <span className="absolute -inset-3 rounded-full bg-brand/30 animate-ping pointer-events-none" />
                  )}

                  {/* Node Button */}
                  <button
                    type="button"
                    onClick={() => handleNodeClick(lesson)}
                    disabled={lesson.status === "locked"}
                    className={`w-20 h-20 rounded-full flex items-center justify-center shadow-2xl transition-all duration-300 transform active:scale-95 ${
                      lesson.type === "chest"
                        ? "bg-amber-500 text-white ring-8 ring-amber-500/20 hover:scale-110"
                        : lesson.status === "completed"
                          ? "bg-emerald-500 text-white ring-6 ring-emerald-500/20 hover:scale-105"
                          : lesson.status === "current"
                            ? "bg-brand text-white ring-8 ring-brand/30 hover:scale-110"
                            : "bg-neutral-200 dark:bg-neutral-800 text-neutral-400 cursor-not-allowed"
                    } ${isSelected ? "ring-4 ring-foreground" : ""}`}
                  >
                    {lesson.status === "completed" ? (
                      <Check className="w-9 h-9 stroke-[3]" />
                    ) : lesson.status === "locked" ? (
                      <Lock className="w-7 h-7" />
                    ) : (
                      getLessonIcon(lesson.type)
                    )}
                  </button>

                  {/* Star Rating Badges */}
                  {lesson.status === "completed" && lesson.type !== "chest" && (
                    <div className="flex items-center space-x-1 mt-2 bg-background-card px-2.5 py-1 rounded-full border border-border shadow-md">
                      {[...Array(3)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3.5 h-3.5 ${
                            i < lesson.stars
                              ? "text-amber-400 fill-amber-400"
                              : "text-neutral-300 dark:text-neutral-700"
                          }`}
                        />
                      ))}
                    </div>
                  )}

                  {/* Node Title Label */}
                  <span
                    className={`text-xs font-black mt-2 text-center max-w-[130px] truncate ${
                      lesson.status === "locked"
                        ? "text-foreground-subtle opacity-50"
                        : "text-foreground"
                    }`}
                  >
                    {lesson.title}
                  </span>
                </div>
              </React.Fragment>
            );
          })}
        </div>
      </main>

      {/* Interactive Modal Sheet for Active Lesson */}
      {activeLesson && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-sm bg-background-card border border-border rounded-3xl p-6 shadow-2xl space-y-5 animate-in zoom-in-95 duration-200">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-xs font-extrabold uppercase text-brand tracking-wider">
                  {activeLesson.type} Lesson
                </span>
                <h3 className="text-2xl font-black text-foreground mt-0.5">
                  {activeLesson.title}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setActiveLesson(null)}
                className="text-foreground-subtle hover:text-foreground text-base font-bold"
              >
                ✕
              </button>
            </div>

            <p className="text-sm text-foreground-subtle leading-relaxed">
              {activeLesson.description}
            </p>

            {activeLesson.status === "completed" &&
              activeLesson.type !== "chest" && (
                <div className="flex items-center justify-center space-x-2 py-3 bg-background-hover rounded-2xl border border-border/50">
                  {[...Array(3)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-7 h-7 ${
                        i < activeLesson.stars
                          ? "text-amber-400 fill-amber-400"
                          : "text-neutral-300 dark:text-neutral-700"
                      }`}
                    />
                  ))}
                </div>
              )}

            <button
              type="button"
              onClick={() => navigate(`/exam/${activeLesson.id}`)}
              className="w-full py-4 rounded-2xl bg-brand text-white font-black text-base flex items-center justify-center space-x-2 shadow-xl shadow-brand/25 hover:bg-brand-hover transition-all active:scale-98"
            >
              <Play className="w-5 h-5 fill-white" />
              <span>
                {activeLesson.type === "chest"
                  ? "Open Reward Chest"
                  : activeLesson.status === "completed"
                    ? "Review Practice"
                    : "Start (+20 XP)"}
              </span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
