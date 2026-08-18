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
    <div className="study-page font-inter">
      {/* 1. Dynamic Top Navigation Hub Bar */}
      <header className="study-header">
        <div className="flex items-center space-x-4">
          <button type="button" className="study-header-back-btn">
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Exit Session</span>
          </button>
          <div className="study-header-divider hidden sm:block" />
          <div className="flex items-center space-x-2">
            <div className="study-header-badge">J</div>
            <span className="study-header-title">Review Hub</span>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <button type="button" className="study-header-user-btn">
            <User className="w-4 h-4" />
          </button>
          <button type="button" className="study-header-logout-btn">
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
                  <span className="study-mode-badge">Testing Mode</span>
                  <h1 className="study-deck-title">{deckTitle}</h1>
                </div>
                <span className="study-card-counter">
                  Card {currentIndex + 1} of {cards.length}
                </span>
              </div>

              {/* Progress Bar Container */}
              <div className="study-progress-track">
                <div
                  className="study-progress-fill"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>

            {/* Interactive Animated Card View Area */}
            <div
              onClick={() => setIsFlipped(!isFlipped)}
              className="study-card group selection:bg-transparent"
            >
              {/* Pure visual highlight indicators matching system guidelines */}
              <div className="study-card-accent-bar" />

              <span className="study-card-label">
                <BookOpen className="w-3 h-3" />
                <span>{isFlipped ? "The Answer" : "The Question"}</span>
              </span>

              {/* Dynamic Content Switching Injection */}
              <div className="w-full text-center px-4 max-h-48 overflow-y-auto">
                {!isFlipped ? (
                  <p className="study-card-question">{activeCard.question}</p>
                ) : (
                  <p className="study-card-answer">{activeCard.answer}</p>
                )}
              </div>

              {/* Action Prompt Banner Area */}
              <div className="study-card-hint">
                <RotateCw className="w-3.5 h-3.5" />
                <span>Click card frame to flip</span>
              </div>
            </div>

            {/* Decision Actions Bar Segment */}
            <div className="grid grid-cols-2 gap-4 pt-2">
              <button
                type="button"
                onClick={() => handleScore(false)}
                className="study-btn-forgot cursor-pointer active:scale-95"
              >
                <XCircle className="w-4 h-4" />
                <span>Forgot It</span>
              </button>

              <button
                type="button"
                onClick={() => handleScore(true)}
                className="study-btn-knew cursor-pointer active:scale-95"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>I Knew It</span>
              </button>
            </div>
          </div>
        ) : (
          /* Session Completed Summary View Panel */
          <div className="study-summary-panel space-y-6">
            <div className="study-summary-decoration" />

            <div className="study-summary-icon">
              <HelpCircle className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h2 className="study-summary-title">Review Session Complete!</h2>
              <p className="study-summary-desc">
                You have finished working through the arrays inside this deck.
                Let's see your data output:
              </p>
            </div>

            {/* Performance Stat Blocks Grid Layout */}
            <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto pt-2">
              <div className="study-stat-success">
                <p className="study-stat-success-label">Knew It</p>
                <p className="study-stat-success-value">
                  {sessionScore.correct}
                </p>
              </div>
              <div className="study-stat-danger">
                <p className="study-stat-danger-label">Forgot It</p>
                <p className="study-stat-danger-value">
                  {sessionScore.incorrect}
                </p>
              </div>
            </div>

            <div className="pt-4 max-w-sm mx-auto">
              <button
                type="button"
                onClick={resetDeck}
                className="study-btn-restart cursor-pointer active:scale-95"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Restart Session</span>
              </button>
            </div>
          </div>
        )}
      </main>

      {/* 4. Footer Baseline Component Group */}
      <footer className="study-footer">
        &copy; 2026 Workspace System. All rights reserved.
      </footer>
    </div>
  );
}
