import * as React from "react";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";

export interface BannerSlide {
  id?: string | number;
  badgeText?: string;
  title: string;
  description: string;
  buttonText?: string;
  onButtonClick?: () => void;
  imageUrl?: string; // Optional image or illustration URL per slide
}

interface HeroBannerProps {
  slides?: BannerSlide[];
  autoPlayInterval?: number; // In milliseconds (e.g., 5000 = 5s)
}

const DEFAULT_SLIDES: BannerSlide[] = [
  {
    id: 1,
    badgeText: "New Released",
    title: "Master Your Upcoming Exams",
    description:
      "Practice with thousands of verified questions and real-time performance tracking.",
    buttonText: "Start Practice",
    imageUrl:
      "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 2,
    badgeText: "Community",
    title: "Join Top Study Groups",
    description:
      "Connect with peers worldwide, share resources, and climb the leaderboard together.",
    buttonText: "Explore Groups",
    imageUrl:
      "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 3,
    badgeText: "Special Offer",
    title: "Unlock Unlimited Mock Tests",
    description:
      "Get complete access to all exam categories with detailed analytical reports.",
    buttonText: "Upgrade Now",
    imageUrl:
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80",
  },
];

export default function HeroBanner({
  slides = DEFAULT_SLIDES,
  autoPlayInterval = 5000,
}: HeroBannerProps) {
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const [isPaused, setIsPaused] = React.useState(false);

  const nextSlide = React.useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % slides.length);
  }, [slides.length]);

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
  };

  // Auto-play timer setup
  React.useEffect(() => {
    if (isPaused || slides.length <= 1) return;

    const timer = setInterval(() => {
      nextSlide();
    }, autoPlayInterval);

    return () => clearInterval(timer);
  }, [nextSlide, autoPlayInterval, isPaused, slides.length]);

  const currentSlide = slides[currentIndex];

  return (
    <section
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      /* Gradient banner linh hoạt theo màu --banner-from và --banner-to */
      className="w-full h-auto min-h-[320px] md:h-96 bg-gradient-to-br from-banner-from to-banner-to rounded-3xl text-white relative overflow-hidden shadow-lg select-none border border-banner-border flex flex-col justify-between"
    >
      {/* Slide Container */}
      <div className="absolute inset-0 p-6 md:p-12 flex flex-col justify-between z-10">
        {/* Main Content Area (Text + Optional Image Layout) */}
        <div className="flex-1 flex items-center justify-between gap-6 my-auto">
          {/* Dynamic Slide Text Content */}
          <div
            key={currentIndex}
            className="max-w-md space-y-3.5 transition-all duration-300 animate-in fade-in"
          >
            {currentSlide.badgeText && (
              <span className="inline-block bg-white/20 text-xs font-bold tracking-widest uppercase px-3 py-1 rounded-full backdrop-blur-md">
                {currentSlide.badgeText}
              </span>
            )}

            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight leading-tight line-clamp-2">
              {currentSlide.title}
            </h1>

            <p className="text-xs sm:text-sm opacity-90 leading-relaxed font-medium line-clamp-3">
              {currentSlide.description}
            </p>

            <div className="pt-2">
              <button
                onClick={currentSlide.onButtonClick}
                className="bg-white text-brand hover:bg-neutral-100 font-bold text-sm px-5 py-2.5 rounded-xl tracking-wide shadow-md transition-all flex items-center space-x-2 cursor-pointer active:scale-95"
              >
                <span>{currentSlide.buttonText || "Get Started"}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Optional Slide Image / Illustration */}
          {currentSlide.imageUrl && (
            <div className="hidden lg:block w-72 xl:w-80 shrink-0">
              <img
                src={currentSlide.imageUrl}
                alt={currentSlide.title}
                className="w-full h-44 object-cover rounded-2xl shadow-xl border border-white/20 opacity-95 transition-all duration-500 hover:scale-[1.02]"
              />
            </div>
          )}
        </div>

        {/* Fixed Navigation Controls & Pagination Dots */}
        {slides.length > 1 && (
          <div className="flex items-center justify-between pt-4 border-t border-white/10 shrink-0">
            {/* Pagination Dots */}
            <div className="flex items-center space-x-2">
              {slides.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentIndex(idx)}
                  aria-label={`Go to slide ${idx + 1}`}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    idx === currentIndex
                      ? "w-7 bg-white"
                      : "w-2 bg-white/40 hover:bg-white/70"
                  }`}
                />
              ))}
            </div>

            {/* Arrow Buttons */}
            <div className="flex items-center space-x-2">
              <button
                onClick={prevSlide}
                aria-label="Previous Slide"
                className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors backdrop-blur-md text-white active:scale-90"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <button
                onClick={nextSlide}
                aria-label="Next Slide"
                className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors backdrop-blur-md text-white active:scale-90"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Abstract Background Blobs */}
      <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-brand rounded-full opacity-30 blur-2xl pointer-events-none" />
      <div className="absolute top-0 right-0 w-32 h-32 bg-white rounded-bl-full opacity-10 pointer-events-none" />
    </section>
  );
}
