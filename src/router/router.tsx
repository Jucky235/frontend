import { createBrowserRouter } from "react-router-dom";
import SignupPage from "@/pages/auth/signup-page";
import LoginPage from "@/pages/auth/login-page";
import HomePage from "@/pages/home/home-page";
import TestPage from "@/pages/test/test-page";

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
    path: "/test",
    element: <TestPage />,
  },
]);
