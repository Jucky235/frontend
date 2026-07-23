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
import { Edit } from "lucide-react";

export const router = createBrowserRouter([
  {
    path: "/signup",
    element: <SignupPage />,
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/",
    element: <HomePage />,
  },
  {
    path: "/test/:id",
    element: <TestPage />,
  },
  {
    path: "/profile",
    element: <ProfilePage />,
  },
  {
    path: "/flashcards",
    element: <FlashcardsPage />,
  },
  {
    path: "/flashcards-list",
    element: <FlashcardsListPage />,
  },
  {
    path: "/dashboard/user",
    element: <UserManagementPage />,
  },
  {
    path: "/dashboard/course",
    element: <CourseManagementPage />,
  },
  {
    path: "/test",
    element: <ExamListPage />,
  },
  {
    path: "/test/result",
    element: <ExamResultPage />,
  },
  {
    path: "/deck/edit",
    element: <EditDeckPage />,
  },
]);
