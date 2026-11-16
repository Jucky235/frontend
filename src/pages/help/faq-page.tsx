import * as React from "react";
import {
  Search,
  ChevronDown,
  HelpCircle,
  BookOpen,
  CreditCard,
  UserCheck,
  Mail,
  Sparkles,
  MessageSquare,
} from "lucide-react";
import Header from "@/components/organism/common/Header";
import Footer from "@/components/organism/common/Footer";

export interface FAQItem {
  id: string;
  category: string;
  question: string;
  answer: string;
}

const CATEGORIES = [
  {
    id: "all",
    name: "Tất cả câu hỏi",
    icon: <HelpCircle className="w-4 h-4" />,
  },
  {
    id: "courses",
    name: "Khóa học và ôn tập",
    icon: <BookOpen className="w-4 h-4" />,
  },
  { id: "exams", name: "Bài thi thử", icon: <Sparkles className="w-4 h-4" /> },
  {
    id: "billing",
    name: "Tài khoản và thanh toán",
    icon: <CreditCard className="w-4 h-4" />,
  },
  { id: "general", name: "Chung", icon: <UserCheck className="w-4 h-4" /> },
];

const FAQ_DATA: FAQItem[] = [
  {
    id: "faq-1",
    category: "courses",
    question: "Bài luyện tập chấm điểm bằng AI hoạt động như thế nào?",
    answer:
      "AI phân tích bài viết và bản ghi âm của bạn theo tiêu chí chấm điểm TOEFL/IELTS chính thức. Chỉ trong vài giây, bạn sẽ nhận được bảng điểm chi tiết, góp ý về ngữ pháp, phát âm và gợi ý cải thiện.",
  },
  {
    id: "faq-2",
    category: "exams",
    question: "Bài thi thử có giới hạn thời gian như bài thi thật không?",
    answer:
      "Có. Tất cả bài thi thử đều tuân theo cấu trúc và thời gian của bài thi chính thức, gồm các phần đọc, nghe, nói và viết.",
  },
  {
    id: "faq-3",
    category: "courses",
    question: "Tôi có thể xem tài liệu khóa học khi ngoại tuyến không?",
    answer:
      "Bạn có thể tải ghi chú bài học, thẻ từ vựng và bản chép lời âm thanh để học ngoại tuyến. Bài kiểm tra tương tác và chấm điểm AI cần kết nối internet.",
  },
  {
    id: "faq-4",
    category: "billing",
    question: "Chính sách hoàn tiền của bạn như thế nào?",
    answer:
      "Chúng tôi hoàn tiền trong vòng 7 ngày cho mọi gói cao cấp. Nếu chưa hài lòng với tiến độ hoặc công cụ, hãy liên hệ bộ phận hỗ trợ trong 7 ngày để được hoàn tiền đầy đủ.",
  },
  {
    id: "faq-5",
    category: "general",
    question: "Làm cách nào để kết nối với nhóm học và gia sư?",
    answer:
      "Bạn có thể tham gia các kênh thảo luận trực tiếp trong mục Trò chuyện và Diễn đàn. Thành viên cao cấp cũng có thể đặt buổi góp ý riêng với gia sư ngôn ngữ ngay trên bảng điều khiển.",
  },
  {
    id: "faq-6",
    category: "billing",
    question: "Tôi có thể đổi hoặc hủy gói bất cứ lúc nào không?",
    answer:
      "Có. Bạn có thể nâng cấp, hạ cấp hoặc hủy gói bất cứ lúc nào trong phần Cài đặt tài khoản. Quyền truy cập vẫn duy trì đến hết chu kỳ thanh toán hiện tại.",
  },
];

export default function FAQPage() {
  const [selectedCategory, setSelectedCategory] = React.useState("all");
  const [searchQuery, setSearchQuery] = React.useState("");
  const [openItems, setOpenItems] = React.useState<Record<string, boolean>>({
    "faq-1": true, // Keep first FAQ open by default
  });

  const toggleAccordion = (id: string) => {
    setOpenItems((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const filteredFAQs = FAQ_DATA.filter((faq) => {
    const matchesCategory =
      selectedCategory === "all" || faq.category === selectedCategory;
    const matchesSearch =
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="faq-page font-inter">
      <Header />

      <main className="flex-1 w-full max-w-5xl mx-auto px-4 sm:px-6 py-10 space-y-10">
        {/* Hero Section */}
        <div className="faq-hero space-y-4">
          <div className="faq-hero-decoration" />

          <div className="faq-hero-badge">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Trung tâm trợ giúp</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Câu hỏi thường gặp
          </h1>
          <p className="text-xs sm:text-sm opacity-90 max-w-xl mx-auto font-medium leading-relaxed">
            Bạn có thắc mắc về nền tảng, bài thi thử hoặc các gói đăng ký?
            Xem câu trả lời bên dưới hoặc tìm kiếm chủ đề bạn cần.
          </p>

          {/* Search Input Bar */}
          <div className="faq-search-wrapper">
            <Search className="faq-search-icon w-4 h-4" />
            <input
              type="text"
              placeholder="Tìm từ khóa hoặc câu hỏi..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="faq-search-input"
            />
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex items-center justify-center flex-wrap gap-2">
          {CATEGORIES.map((cat) => {
            const isActive = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`faq-category-btn cursor-pointer ${
                  isActive ? "is-active" : "is-inactive"
                }`}
              >
                <span>{cat.icon}</span>
                <span>{cat.name}</span>
              </button>
            );
          })}
        </div>

        {/* Accordion FAQ List */}
        <div className="space-y-4 max-w-3xl mx-auto">
          {filteredFAQs.length > 0 ? (
            filteredFAQs.map((faq) => {
              const isOpen = !!openItems[faq.id];
              return (
                <div key={faq.id} className="faq-accordion-item">
                  <button
                    onClick={() => toggleAccordion(faq.id)}
                    className="faq-accordion-trigger cursor-pointer"
                  >
                    <span>{faq.question}</span>
                    <ChevronDown
                      className={`faq-accordion-chevron w-4 h-4 ${
                        isOpen ? "is-open" : ""
                      }`}
                    />
                  </button>

                  {isOpen && (
                    <div className="faq-accordion-content">{faq.answer}</div>
                  )}
                </div>
              );
            })
          ) : (
            <div className="faq-empty-state">
              <HelpCircle className="faq-empty-state-icon w-8 h-8" />
              <p className="faq-empty-state-text">
                Không tìm thấy câu hỏi phù hợp với "{searchQuery}".
              </p>
            </div>
          )}
        </div>

        {/* Support Callout Footer Card */}
        <div className="faq-support-card max-w-3xl mx-auto">
          <div className="flex items-center space-x-4">
            <div className="faq-support-icon">
              <MessageSquare className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h3 className="faq-support-title">Bạn còn thắc mắc?</h3>
              <p className="faq-support-text">
                Không tìm thấy câu trả lời phù hợp? Hãy liên hệ với đội ngũ hỗ trợ.
              </p>
            </div>
          </div>

          <button className="faq-support-btn cursor-pointer active:scale-95">
            <Mail className="w-4 h-4" />
            <span>Liên hệ hỗ trợ</span>
          </button>
        </div>
      </main>

      <Footer />
    </div>
  );
}
