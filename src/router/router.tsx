import { createBrowserRouter } from "react-router-dom";
import SignupPage from "@/pages/auth/signup-page";
import LoginPage from "@/pages/auth/login-page";
export const router = createBrowserRouter([
  {
    path: "/signup",
    element: <SignupPage />,
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
]);
