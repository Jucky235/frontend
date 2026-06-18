import * as React from "react";
import { Lock } from "lucide-react";

export default function LoginPage() {
  const [formData, setFormData] = React.useState({
    username: "",
    email: "",
    password: "",
    acceptTerms: false,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Submitting Form Data:", formData);
  };

  return (
    <div className="relative min-h-screen w-full bg-white font-inter overflow-x-hidden flex flex-col justify-between pb-8">
      {/* 1. Top Decorative Blob Backdrop */}
      <div className="absolute top-0 right-0 left-0 h-[38vh] bg-gradient-to-br from-blue-600 to-indigo-600 rounded-b-[35%] md:rounded-b-[45%] flex flex-col justify-center px-10 text-white shadow-lg">
        <p className="text-xl font-medium tracking-wide opacity-90">
          Welcome Back,
        </p>
        <h1 className="text-4xl md:text-5xl font-extrabold mt-1 tracking-tight">
          Log In!
        </h1>

        {/* Extra organic peak mimicking the image's top-right corner extension */}
        <div className="absolute top-0 right-0 w-32 h-20 bg-indigo-600 rounded-bl-full opacity-40 blur-sm pointer-events-none" />
      </div>

      {/* Spacer to push content below the absolute header layout */}
      <div className="h-[40vh]" />

      {/* 2. Main Input Form Container */}
      <form
        onSubmit={handleSubmit}
        className="flex-1 w-full max-w-md mx-auto px-8 flex flex-col justify-start space-y-6"
      >
        {/* User Name Input Field */}
        <div className="relative border border-neutral-300 rounded-xl px-4 py-3 focus-within:border-indigo-500 transition-colors">
          <label className="absolute -top-2.5 left-4 bg-white px-1 text-xs font-semibold text-neutral-500 tracking-wide">
            EMAIL ADDRESS
          </label>
          <input
            type="text"
            placeholder="Jacob josef"
            value={formData.username}
            onChange={(e) =>
              setFormData({ ...formData, username: e.target.value })
            }
            className="w-full bg-transparent text-sm text-neutral-800 placeholder-neutral-400 outline-none pt-1"
            required
          />
        </div>

        {/* Password Input Field */}
        <div className="relative border border-neutral-300 rounded-xl px-4 py-3 flex items-center justify-between focus-within:border-indigo-500 transition-colors">
          <label className="absolute -top-2.5 left-4 bg-white px-1 text-xs font-semibold text-neutral-500 tracking-wide">
            Password
          </label>
          <input
            type="password"
            placeholder="Enter password"
            value={formData.password}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
            className="w-full bg-transparent text-sm text-neutral-800 placeholder-neutral-400 outline-none pt-1 pr-2"
            required
          />
          <Lock
            className="w-5 h-5 text-neutral-400 shrink-0"
            strokeWidth={1.5}
          />
        </div>

        {/* 3. Toggle/Checkbox Switch Row */}
        <div className="flex items-center justify-between pt-1">
          {/* Left Side: Remember Me Toggle */}
          <div className="flex items-center space-x-3">
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={formData.acceptTerms}
                onChange={(e) =>
                  setFormData({ ...formData, acceptTerms: e.target.checked })
                }
                className="sr-only peer"
              />
              {/* Custom rounded capsule toggle background */}
              <div className="w-9 h-5 bg-neutral-300 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-500" />
            </label>
            <span className="text-xs text-neutral-500 font-medium">
              Remember me
            </span>
          </div>

          {/* Right Side: Forgot Password Hyperlink */}
          <a
            href="/forgot-password"
            className="text-xs font-semibold text-[#5A67FF] hover:text-indigo-600 transition-colors"
            onClick={(e) => {
              // If you are using react-router-dom navigation programmatically later:
              // e.preventDefault();
              // navigate('/forgot-password');
            }}
          >
            Forgot password?
          </a>
        </div>
        {/* 4. Action Sign Up Button */}
        <div className="pt-4">
          <button
            type="submit"
            className="w-full bg-[#5A67FF] hover:bg-indigo-600 text-white font-bold text-base py-3.5 rounded-full tracking-wide transition-all shadow-[0_8px_20px_rgba(90,103,255,0.35)] cursor-pointer active:scale-[0.99]"
          >
            Log in
          </button>
        </div>
      </form>

      {/* 5. Bottom Social Sign-in Bar */}
      <div className="w-full max-w-xs mx-auto flex items-center justify-center space-x-8 pt-8">
        <button
          type="button"
          className="text-[#4F96FF] hover:scale-110 transition-transform cursor-pointer"
        ></button>
        <button
          type="button"
          className="text-[#EA4335] hover:scale-110 transition-transform cursor-pointer"
        ></button>
        <button
          type="button"
          className="text-[#0077B5] hover:scale-110 transition-transform cursor-pointer"
        ></button>
      </div>
    </div>
  );
}
