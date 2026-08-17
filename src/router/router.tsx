import { createBrowserRouter } from "react-router-dom";
import SignupPage from "@/pages/auth/signup-page";
import LoginPage from "@/pages/auth/login-page";
import HomePage from "@/pages/home/home-page";
import TestPage from "@/pages/test/test-page";
import ProfilePage from "@/pages/profile/profile-page";
import FlashcardsPage from "@/pages/flashcards/flashcards-page";
import FlashcardsListPage from "@/pages/flashcards/flashcards-list-page";
import UserManagementPage from "@/pages/dashboard/user-management-page";
import CourseManagementPage from "@/pages/dashboard/course-management-page";
import ExamListPage from "@/pages/test/test-list-page";
import ExamResultPage from "@/pages/test/test-result-page";
import EditDeckPage from "@/pages/flashcards/edit-deck-page";
import { AdminRoute } from "@/router/AdminRoute";
import NewsPage from "@/pages/home/news-page";
import ChatPage from "@/pages/community/chat-page";
import ForumPage from "@/pages/community/forum-page";
import FAQPage from "@/pages/help/faq-page";
import NewsManagementPage from "@/pages/dashboard/news-management-page";
import NewsContentPage from "@/pages/home/news-content-page";
import ExamsManagementPage from "@/pages/dashboard/exams-management-page";
import QuestionManagementPage from "@/pages/dashboard/question-management-page";
import ForumPostDetailPage from "@/pages/community/post-page";

export const router = createBrowserRouter([
  // Auth Routes
  {
    path: "/signup",
    element: <SignupPage />,
  },
  {
    path: "/login",
    element: <LoginPage />,
  },

  // Main App Routes
  {
    path: "/",
    element: <HomePage />,
  },
  {
    path: "/news",
    element: <NewsPage />,
  },
  {
    path: "/news/:id",
    element: <NewsContentPage />,
  },
  {
    path: "/profile",
    element: <ProfilePage />,
  },
  {
    path: "/faq",
    element: <FAQPage />,
  },

  // Flashcards Routes
  {
    path: "/flashcards",
    element: <FlashcardsPage />,
  },
  {
    path: "/flashcards-list",
    element: <FlashcardsListPage />,
  },
  {
    path: "/deck/edit",
    element: <EditDeckPage />,
  },

  // Test & Exam Routes
  {
    path: "/test",
    element: <ExamListPage />,
  },
  {
    path: "/test/result",
    element: <ExamResultPage />,
  },
  {
    path: "/test/:id",
    element: <TestPage />,
  },

  // Community & Forum Routes
  {
    path: "/chat",
    element: <ChatPage />,
  },
  {
    path: "/forum",
    element: <ForumPage />,
  },
  {
    path: "/forum/:id",
    element: <ForumPostDetailPage />,
  },

  // Protected Admin Routes
  {
    path: "/dashboard/user",
    element: (
      <AdminRoute>
        <UserManagementPage />
      </AdminRoute>
    ),
  },
  {
    path: "/dashboard/course",
    element: (
      <AdminRoute>
        <CourseManagementPage />
      </AdminRoute>
    ),
  },
  {
    path: "/dashboard/exam",
    element: (
      <AdminRoute>
        <ExamsManagementPage />
      </AdminRoute>
    ),
  },
  {
    path: "/dashboard/question",
    element: (
      <AdminRoute>
        <QuestionManagementPage />
      </AdminRoute>
    ),
  },
  {
    path: "/dashboard/news",
    element: (
      <AdminRoute>
        <NewsManagementPage />
      </AdminRoute>
    ),
  },
]);
