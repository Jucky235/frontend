import * as React from "react";
import {
  LogOut,
  User,
  ArrowLeft,
  RotateCw,
  CheckCircle2,
  XCircle,
  HelpCircle,
  RotateCcw,
  BookOpen,
} from "lucide-react";

export default function FlashcardsPage() {
  // Mock Flashcard Deck Data
  const deckTitle = "JavaScript Advanced Fundamentals";
  const [cards, setCards] = React.useState([
    {
      id: 1,
      question: "What is a closure in JavaScript?",
      answer:
        "A closure is the combination of a function bundled together with references to its surrounding state (the lexical environment). It allows an inner function to access the scope of an outer function even after the outer function has returned.",
    },
    {
      id: 2,
      question: "Explain the difference between '==' and '==='.",
      answer:
        "'==' (loose equality) performs type coercion before comparing two values, attempting to convert them to a common type. '===' (strict equality) compares both the data type and the value without coercion; it returns false if types differ.",
    },
    {
      id: 3,
      question: "What is the primary purpose of the 'use strict' directive?",
      answer:
        "It enforces stricter parsing and error handling in your code. It catches common coding bloopers, prevents accidental global variables, throws exceptions for unsafe actions, and disables features that are confusing or poorly thought out.",
    },
  ]);

  // UI State Hub
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const [isFlipped, setIsFlipped] = React.useState(false);
  const [sessionScore, setSessionScore] = React.useState({
    correct: 0,
    incorrect: 0,
  });
  const [isFinished, setIsFinished] = React.useState(false);

  const activeCard = cards[currentIndex];
  const progressPercent = Math.round((currentIndex / cards.length) * 100);

  // Handle Action Responses
  const handleScore = (knowsIt: boolean) => {
    if (knowsIt) {
      setSessionScore((prev) => ({ ...prev, correct: prev.correct + 1 }));
    } else {
      setSessionScore((prev) => ({ ...prev, incorrect: prev.incorrect + 1 }));
    }

    setIsFlipped(false);

    // Check if deck sequence is finished
    setTimeout(() => {
      if (currentIndex < cards.length - 1) {
        setCurrentIndex((prev) => prev + 1);
      } else {
        setIsFinished(true);
      }
    }, 150);
  };

  const resetDeck = () => {
    setCurrentIndex(0);
    setIsFlipped(false);
    setSessionScore({ correct: 0, incorrect: 0 });
    setIsFinished(false);
  };

  return (
    <div className="min-h-screen w-full bg-neutral-50 font-inter flex flex-col justify-between">
      {/* 1. Dynamic Top Navigation Hub Bar */}
      <header className="w-full bg-white border-b border-neutral-200 px-6 py-4 flex items-center justify-between sticky top-0 z-50 shadow-xs">
        <div className="flex items-center space-x-4">
          <button
            type="button"
            className="flex items-center space-x-1.5 text-sm font-semibold text-neutral-500 hover:text-neutral-800 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Exit Session</span>
          </button>
          <div className="h-4 w-px bg-neutral-200 hidden sm:block" />
          <div className="flex items-center space-x-2">
            <div className="w-9 h-9 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center text-white font-extrabold text-lg shadow-md">
              J
            </div>
            <span className="font-bold text-lg text-neutral-800 tracking-tight">
              Review Hub
            </span>
          </div>
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
      <main className="flex-1 w-full max-w-2xl mx-auto px-6 py-10 flex flex-col justify-center">
        {!isFinished ? (
          <div className="w-full space-y-6">
            {/* Header Track Progress Block */}
            <div className="space-y-2">
              <div className="flex justify-between items-end">
                <div>
                  <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-md uppercase tracking-wider">
                    Testing Mode
                  </span>
                  <h1 className="text-xl font-extrabold text-neutral-800 tracking-tight mt-2">
                    {deckTitle}
                  </h1>
                </div>
                <span className="text-xs font-bold text-neutral-400">
                  Card {currentIndex + 1} of {cards.length}
                </span>
              </div>

              {/* Progress Bar Container */}
              <div className="w-full h-2 bg-neutral-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-blue-600 to-indigo-600 transition-all duration-300"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>

            {/* Interactive Animated Card View Area */}
            <div
              onClick={() => setIsFlipped(!isFlipped)}
              className="w-full h-80 min-h-[320px] bg-white border border-neutral-200 rounded-3xl p-8 shadow-xs hover:shadow-md transition-all duration-300 cursor-pointer flex flex-col justify-between items-center group relative overflow-hidden selection:bg-transparent"
            >
              {/* Pure visual highlight indicators matching system guidelines */}
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-indigo-500" />

              <span className="text-[10px] font-bold tracking-widest text-neutral-400 uppercase flex items-center space-x-1">
                <BookOpen className="w-3 h-3 text-neutral-400" />
                <span>{isFlipped ? "The Answer" : "The Question"}</span>
              </span>

              {/* Dynamic Content Switching Injection */}
              <div className="w-full text-center px-4 max-h-48 overflow-y-auto">
                {!isFlipped ? (
                  <p className="text-lg md:text-xl font-bold text-neutral-800 leading-snug">
                    {activeCard.question}
                  </p>
                ) : (
                  <p className="text-sm md:text-base text-neutral-600 font-medium leading-relaxed">
                    {activeCard.answer}
                  </p>
                )}
              </div>

              {/* Action Prompt Banner Area */}
              <div className="text-xs font-bold text-neutral-400 group-hover:text-indigo-500 transition-colors flex items-center space-x-1.5">
                <RotateCw className="w-3.5 h-3.5" />
                <span>Click card frame to flip</span>
              </div>
            </div>

            {/* Decision Actions Bar Segment */}
            <div className="grid grid-cols-2 gap-4 pt-2">
              <button
                type="button"
                onClick={() => handleScore(false)}
                className="bg-white hover:bg-red-50 text-neutral-700 hover:text-red-600 border border-neutral-200 hover:border-red-200 font-bold text-sm px-5 py-3.5 rounded-xl transition-all shadow-xs flex items-center justify-center space-x-2 cursor-pointer active:scale-95"
              >
                <XCircle className="w-4 h-4" />
                <span>Forgot It</span>
              </button>

              <button
                type="button"
                onClick={() => handleScore(true)}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm px-5 py-3.5 rounded-xl tracking-wide shadow-md transition-all flex items-center justify-center space-x-2 cursor-pointer active:scale-95"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>I Knew It</span>
              </button>
            </div>
          </div>
        ) : (
          /* Session Completed Summary View Panel */
          <div className="bg-white border border-neutral-200 rounded-3xl p-8 md:p-10 text-center space-y-6 shadow-md relative overflow-hidden">
            <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-indigo-50 rounded-full opacity-60 blur-2xl pointer-events-none" />

            <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center mx-auto text-[#5A67FF]">
              <HelpCircle className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl font-extrabold text-neutral-800 tracking-tight">
                Review Session Complete!
              </h2>
              <p className="text-xs text-neutral-400 max-w-xs mx-auto font-medium">
                You have finished working through the arrays inside this deck.
                Let's see your data output:
              </p>
            </div>

            {/* Performance Stat Blocks Grid Layout */}
            <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto pt-2">
              <div className="bg-emerald-50/60 border border-emerald-100 rounded-2xl p-4">
                <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider">
                  Knew It
                </p>
                <p className="text-2xl font-black text-emerald-700 mt-1">
                  {sessionScore.correct}
                </p>
              </div>
              <div className="bg-red-50/60 border border-red-100 rounded-2xl p-4">
                <p className="text-[10px] font-bold text-red-600 uppercase tracking-wider">
                  Forgot It
                </p>
                <p className="text-2xl font-black text-red-700 mt-1">
                  {sessionScore.incorrect}
                </p>
              </div>
            </div>

            <div className="pt-4 max-w-sm mx-auto">
              <button
                type="button"
                onClick={resetDeck}
                className="w-full bg-neutral-900 hover:bg-neutral-800 text-white font-bold text-sm px-5 py-3.5 rounded-xl transition-all shadow-md flex items-center justify-center space-x-2 cursor-pointer active:scale-95"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Restart Session</span>
              </button>
            </div>
          </div>
        )}
      </main>

      {/* 4. Footer Baseline Component Group */}
      <footer className="w-full bg-white border-t border-neutral-200 py-6 text-center text-xs text-neutral-400 font-medium">
        &copy; 2026 Workspace System. All rights reserved.
      </footer>
    </div>
  );
}
