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
    title: "Chinh phục các bài thi sắp tới",
    description:
      "Luyện tập với hàng nghìn câu hỏi đã xác thực và theo dõi kết quả theo thời gian thực.",
    buttonText: "Start Practice",
    imageUrl:
      "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 2,
    badgeText: "Community",
    title: "Tham gia nhóm học tập hàng đầu",
    description:
      "Kết nối với học viên khắp nơi, chia sẻ tài liệu và cùng vươn lên trên bảng xếp hạng.",
    buttonText: "Explore Groups",
    imageUrl:
      "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 3,
    badgeText: "Special Offer",
    title: "Mở khóa bài thi thử không giới hạn",
    description:
      "Truy cập mọi danh mục bài thi cùng các báo cáo phân tích chi tiết.",
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
  const [isHovered, setIsHovered] = React.useState(false);
  const [isFocused, setIsFocused] = React.useState(false);

  const nextSlide = React.useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % slides.length);
  }, [slides.length]);

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
  };

  // Auto-play timer setup
  React.useEffect(() => {
    if (isHovered || isFocused || slides.length <= 1) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const timer = setInterval(() => {
      nextSlide();
    }, autoPlayInterval);

    return () => clearInterval(timer);
  }, [nextSlide, autoPlayInterval, isHovered, isFocused, slides.length]);

  const currentSlide = slides[currentIndex];

  return (
    <section
      aria-label="Điểm nổi bật trong học tập"
      aria-roledescription="carousel"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onFocusCapture={() => setIsFocused(true)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
          setIsFocused(false);
        }
      }}
      /* Gradient banner linh hoạt theo màu --banner-from và --banner-to */
      className="w-full h-auto min-h-[320px] md:h-96 bg-gradient-to-br from-banner-from to-banner-to rounded-3xl text-white relative overflow-hidden shadow-lg select-none border border-banner-border flex flex-col justify-between"
    >
      <div className="absolute inset-0 bg-gradient-to-r from-slate-950/65 via-slate-950/35 to-slate-950/10 pointer-events-none" />
      {/* Slide Container */}
      <div className="absolute inset-0 p-6 md:p-12 flex flex-col justify-between z-10">
        {/* Main Content Area (Text + Optional Image Layout) */}
        <div className="flex-1 flex items-center justify-between gap-6 my-auto">
          {/* Dynamic Slide Text Content */}
          <div
            key={currentIndex}
            className="max-w-md space-y-3.5 text-white transition-all duration-300 animate-in fade-in motion-reduce:animate-none"
          >
            {currentSlide.badgeText && (
              <span className="inline-block bg-background-card/20 text-white text-xs font-bold tracking-widest uppercase px-3 py-1 rounded-full backdrop-blur-md">
                {currentSlide.badgeText}
              </span>
            )}

            <h1 className="text-white text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight leading-tight line-clamp-2">
              {currentSlide.title}
            </h1>

            <p className="text-white/90 text-xs sm:text-sm leading-relaxed font-medium line-clamp-3">
              {currentSlide.description}
            </p>

            <div className="pt-2">
              <button
                onClick={currentSlide.onButtonClick}
                className="bg-background-card text-brand hover:bg-background-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-brand font-bold text-sm px-5 py-2.5 rounded-xl tracking-wide shadow-md transition-all flex items-center space-x-2 cursor-pointer active:scale-95"
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
                  className={`h-2 rounded-full transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-brand ${
                    idx === currentIndex
                      ? "w-7 bg-background-card"
                      : "w-2 bg-background-card/40 hover:bg-background-card/70"
                  }`}
                />
              ))}
            </div>

            {/* Arrow Buttons */}
            <div className="flex items-center space-x-2">
              <button
                onClick={prevSlide}
                aria-label="Trang chiếu trước"
                className="p-2 rounded-full bg-background-card/10 hover:bg-background-card/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-brand transition-colors backdrop-blur-md text-white active:scale-90"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <button
                onClick={nextSlide}
                aria-label="Trang chiếu tiếp theo"
                className="p-2 rounded-full bg-background-card/10 hover:bg-background-card/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-brand transition-colors backdrop-blur-md text-white active:scale-90"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Abstract Background Blobs */}
      <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-brand rounded-full opacity-30 blur-2xl pointer-events-none" />
      <div className="absolute top-0 right-0 w-32 h-32 bg-background-card rounded-bl-full opacity-10 pointer-events-none" />
    </section>
  );
}
