import * as React from "react";
import {
  LogOut,
  LayoutGrid,
  Layers,
  Settings,
  ArrowRight,
  User,
} from "lucide-react";

export default function HomePage() {
  // Mock data for dashboard menu blocks
  const features = [
    {
      title: "Practice Sets",
      desc: "Manage and run your interactive flashcard collection arrays.",
      icon: <Layers className="w-6 h-6 text-[#5A67FF]" />,
    },
    {
      title: "Performance Monitor",
      desc: "Analyze your learning completion statistics and scores.",
      icon: <LayoutGrid className="w-6 h-6 text-indigo-500" />,
    },
    {
      title: "System Parameters",
      desc: "Fine-tune application localizations and workspace configurations.",
      icon: <Settings className="w-6 h-6 text-neutral-500" />,
    },
  ];

  return (
    <div className="min-h-screen w-full bg-neutral-50 font-inter flex flex-col justify-between">
      {/* 1. Dynamic Top Navigation Hub Bar */}
      <header className="w-full bg-white border-b border-neutral-200 px-6 py-4 flex items-center justify-between sticky top-0 z-50 shadow-xs">
        <div className="flex items-center space-x-2">
          <div className="w-9 h-9 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center text-white font-extrabold text-lg shadow-md">
            J
          </div>
          <span className="font-bold text-lg text-neutral-800 tracking-tight">
            Workspace
          </span>
        </div>

        <div className="flex items-center space-x-4">
          <button
            type="button"
            className="w-9 h-9 bg-neutral-100 rounded-full flex items-center justify-center text-neutral-600 hover:bg-neutral-200 transition-colors"
          >
            <User className="w-4 h-4" />
          </button>
          <button
            type="button"
            className="flex items-center space-x-1.5 text-sm font-semibold text-neutral-500 hover:text-red-500 transition-colors px-2 py-1"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </header>

      {/* 2. Main Layout Container Area */}
      <main className="flex-1 w-full max-w-5xl mx-auto px-6 py-10 flex flex-col space-y-12">
        {/* Banner Hero Intro Segment */}
        <section className="w-full bg-gradient-to-br from-blue-600 to-indigo-600 rounded-3xl p-8 md:p-12 text-white relative overflow-hidden shadow-lg">
          <div className="relative z-10 max-w-md space-y-4">
            <span className="bg-white/20 text-xs font-bold tracking-widest uppercase px-3 py-1 rounded-full backdrop-blur-md">
              Dashboard Overview
            </span>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight leading-tight">
              Welcome back to your dashboard hub!
            </h1>
            <p className="text-sm opacity-90 leading-relaxed font-medium">
              Everything is set up and configured correctly. Select a practice
              deck below or navigate into options blocks.
            </p>
            <div className="pt-2">
              <button className="bg-white text-[#5A67FF] hover:bg-neutral-100 font-bold text-sm px-5 py-3 rounded-xl tracking-wide shadow-md transition-all flex items-center space-x-2 cursor-pointer active:scale-95">
                <span>Get Started</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Abstract background blobs to tie down into login screen style guidelines */}
          <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-indigo-500 rounded-full opacity-30 blur-2xl pointer-events-none" />
          <div className="absolute top-0 right-0 w-32 h-32 bg-white rounded-bl-full opacity-10 pointer-events-none" />
        </section>

        {/* 3. Features Metric Block Matrix Grid */}
        <section className="space-y-6">
          <h2 className="text-xl font-extrabold text-neutral-800 tracking-tight">
            Available Layout Modules
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {features.map((item, index) => (
              <div
                key={index}
                className="bg-white border border-neutral-200/80 hover:border-indigo-200 p-6 rounded-2xl transition-all shadow-xs hover:shadow-md group flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="w-12 h-12 bg-neutral-100 group-hover:bg-indigo-50 rounded-xl flex items-center justify-center transition-colors">
                    {item.icon}
                  </div>
                  <h3 className="text-base font-bold text-neutral-800 group-hover:text-[#5A67FF] transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-xs text-neutral-500 leading-relaxed font-medium">
                    {item.desc}
                  </p>
                </div>

                <div className="pt-2">
                  <span className="text-xs font-bold text-[#5A67FF] inline-flex items-center space-x-1 cursor-pointer">
                    <span>Open Module</span>
                    <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-1" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* 4. Footer Baseline Component Group */}
      <footer className="w-full bg-white border-t border-neutral-200 py-6 text-center text-xs text-neutral-400 font-medium">
        &copy; 2026 Workspace System. All rights reserved.
      </footer>
    </div>
  );
}
