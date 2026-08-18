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
    name: "All Questions",
    icon: <HelpCircle className="w-4 h-4" />,
  },
  {
    id: "courses",
    name: "Courses & Prep",
    icon: <BookOpen className="w-4 h-4" />,
  },
  { id: "exams", name: "Mock Exams", icon: <Sparkles className="w-4 h-4" /> },
  {
    id: "billing",
    name: "Account & Billing",
    icon: <CreditCard className="w-4 h-4" />,
  },
  { id: "general", name: "General", icon: <UserCheck className="w-4 h-4" /> },
];

const FAQ_DATA: FAQItem[] = [
  {
    id: "faq-1",
    category: "courses",
    question: "How do the AI-scored practice tests work?",
    answer:
      "Our AI engine analyzes your written essays and spoken recordings against official TOEFL/IELTS scoring rubrics. Within seconds, you receive a detailed score breakdown, grammar/pronunciation feedback, and actionable improvement tips.",
  },
  {
    id: "faq-2",
    category: "exams",
    question: "Are the mock exams timed like the actual tests?",
    answer:
      "Yes! All simulated mock exams strictly follow official test formats and time limits (including reading, listening, speaking, and writing sections) to recreate authentic exam conditions.",
  },
  {
    id: "faq-3",
    category: "courses",
    question: "Can I access course materials offline?",
    answer:
      "You can download lesson notes, vocabulary flashcards, and audio transcripts via our mobile app for offline study. Interactive quizzes and AI scoring require an active internet connection.",
  },
  {
    id: "faq-4",
    category: "billing",
    question: "What is your refund policy?",
    answer:
      "We offer a 7-day money-back guarantee for all premium subscriptions. If you are not satisfied with your progress or platform tools, simply reach out to support within 7 days for a full refund.",
  },
  {
    id: "faq-5",
    category: "general",
    question: "How can I connect with study groups and tutors?",
    answer:
      "You can join live discussion channels in our Community Chat and Forum pages. Premium members can also book 1-on-1 feedback sessions with certified language tutors directly from their dashboard.",
  },
  {
    id: "faq-6",
    category: "billing",
    question: "Can I change or cancel my plan anytime?",
    answer:
      "Absolutely. You can upgrade, downgrade, or cancel your subscription at any time from your Account Settings. Your access will remain active until the end of your current billing period.",
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
            <span>Help Center</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Frequently Asked Questions
          </h1>
          <p className="text-xs sm:text-sm opacity-90 max-w-xl mx-auto font-medium leading-relaxed">
            Have questions about our platform, mock exams, or subscriptions?
            Find quick answers below or search your topic.
          </p>

          {/* Search Input Bar */}
          <div className="faq-search-wrapper">
            <Search className="faq-search-icon w-4 h-4" />
            <input
              type="text"
              placeholder="Search keywords or questions..."
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
                No matching questions found for "{searchQuery}".
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
              <h3 className="faq-support-title">Still have questions?</h3>
              <p className="faq-support-text">
                Can't find the answer you're looking for? Reach out to our
                support team.
              </p>
            </div>
          </div>

          <button className="faq-support-btn cursor-pointer active:scale-95">
            <Mail className="w-4 h-4" />
            <span>Contact Support</span>
          </button>
        </div>
      </main>

      <Footer />
    </div>
  );
}
