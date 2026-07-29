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
    <div className="min-h-screen w-full bg-neutral-50 font-inter flex flex-col justify-between">
      <Header />

      <main className="flex-1 w-full max-w-5xl mx-auto px-4 sm:px-6 py-10 space-y-10">
        {/* Hero Section */}
        <div className="bg-gradient-to-br from-blue-600 via-indigo-600 to-indigo-700 rounded-3xl p-8 sm:p-12 text-white text-center relative overflow-hidden shadow-lg space-y-4">
          <div className="inline-flex items-center space-x-1.5 bg-white/20 text-xs font-bold px-3.5 py-1 rounded-full backdrop-blur-md uppercase tracking-wider">
            <HelpCircle className="w-3.5 h-3.5 text-indigo-200" />
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
          <div className="max-w-xl mx-auto pt-4">
            <div className="relative">
              <Search className="w-4 h-4 text-neutral-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search keywords or questions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3.5 bg-white text-neutral-800 placeholder-neutral-400 rounded-2xl text-xs font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-[#5A67FF] transition-all"
              />
            </div>
          </div>

          {/* Background decoration */}
          <div className="absolute -top-12 -left-12 w-40 h-40 bg-indigo-400 rounded-full opacity-20 blur-2xl pointer-events-none" />
        </div>

        {/* Category Tabs */}
        <div className="flex items-center justify-center flex-wrap gap-2">
          {CATEGORIES.map((cat) => {
            const isActive = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  isActive
                    ? "bg-[#5A67FF] text-white shadow-sm"
                    : "bg-white text-neutral-600 hover:bg-neutral-100 border border-neutral-200/80"
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
                <div
                  key={faq.id}
                  className="bg-white border border-neutral-200/80 rounded-2xl overflow-hidden shadow-xs transition-all"
                >
                  <button
                    onClick={() => toggleAccordion(faq.id)}
                    className="w-full p-5 flex items-center justify-between text-left font-extrabold text-xs sm:text-sm text-neutral-800 hover:text-[#5A67FF] transition-colors cursor-pointer space-x-4"
                  >
                    <span>{faq.question}</span>
                    <ChevronDown
                      className={`w-4 h-4 text-neutral-400 shrink-0 transition-transform duration-200 ${
                        isOpen ? "rotate-180 text-[#5A67FF]" : ""
                      }`}
                    />
                  </button>

                  {isOpen && (
                    <div className="px-5 pb-5 text-xs text-neutral-600 font-medium leading-relaxed border-t border-neutral-100 pt-3">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            <div className="text-center py-12 bg-white border border-neutral-200/80 rounded-2xl space-y-3">
              <HelpCircle className="w-8 h-8 text-neutral-300 mx-auto" />
              <p className="text-xs font-bold text-neutral-500">
                No matching questions found for "{searchQuery}".
              </p>
            </div>
          )}
        </div>

        {/* Support Callout Footer Card */}
        <div className="bg-indigo-50/60 border border-indigo-100 rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 max-w-3xl mx-auto">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-2xl bg-[#5A67FF] text-white flex items-center justify-center shrink-0 shadow-xs">
              <MessageSquare className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h3 className="text-sm font-extrabold text-neutral-800">
                Still have questions?
              </h3>
              <p className="text-xs text-neutral-500 font-medium">
                Can't find the answer you're looking for? Reach out to our
                support team.
              </p>
            </div>
          </div>

          <button className="bg-[#5A67FF] hover:bg-indigo-600 text-white text-xs font-bold px-5 py-3 rounded-xl shadow-xs transition-all flex items-center space-x-2 shrink-0 cursor-pointer active:scale-95">
            <Mail className="w-4 h-4" />
            <span>Contact Support</span>
          </button>
        </div>
      </main>

      <Footer />
    </div>
  );
}
