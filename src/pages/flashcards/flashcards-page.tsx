import * as React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  LogOut,
  User,
  ArrowLeft,
  RotateCw,
  HelpCircle,
  RotateCcw,
  BookOpen,
  Tag,
  Layers,
  Clock,
  Target,
  ListChecks,
  Loader2,
  AlertCircle,
  Brain,
  CheckCircle2,
  XCircle,
  HelpCircle as HardIcon,
  Sparkles,
} from "lucide-react";

import {
  useGetDeckByIdQuery,
  useGetDueCardsQuery,
  useSubmitCardReviewMutation,
  FSRSRating,
  type Flashcard,
} from "@/redux/flashcard/flashcardApiSlice";

import {
  startSession,
  toggleFlip,
  recordRating,
  resetFlashcardState,
} from "@/redux/flashcard/flashcardSlice";

// Selectors helper (adjust path to RootState if typed elsewhere)
import type { RootState } from "@/redux/store";

export default function FlashcardsPage() {
  const { deckId } = useParams<{ deckId: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // 1. Redux State
  const { cards, currentCardIndex, isFlipped, userRatings } = useSelector(
    (state: RootState) => state.flashcard,
  );

  // 2. Local Session UI State
  const [isFinished, setIsFinished] = React.useState(false);
  const [elapsedSeconds, setElapsedSeconds] = React.useState(0);

  // 3. API Queries & Mutations
  const {
    data: deck,
    isLoading: isDeckLoading,
    isError: isDeckError,
    refetch: refetchDeck,
  } = useGetDeckByIdQuery(deckId || "", { skip: !deckId });

  const {
    data: dueCards,
    isLoading: isDueLoading,
    refetch: refetchDueCards,
  } = useGetDueCardsQuery(
    { deckId: deckId || "", limit: 20 },
    { skip: !deckId },
  );

  const [submitCardReview] = useSubmitCardReviewMutation();

  // 4. Initialize Redux Flashcard Session
  React.useEffect(() => {
    if (!deckId) return;

    // Prioritize due cards for spaced repetition; fallback to deck's total cards list
    const activeCardsList: Flashcard[] =
      dueCards && dueCards.length > 0
        ? dueCards
        : deck?.cards && deck.cards.length > 0
          ? deck.cards
          : [];

    if (activeCardsList.length > 0) {
      dispatch(startSession({ deckId, cards: activeCardsList }));
      setIsFinished(false);
      setElapsedSeconds(0);
    }

    return () => {
      dispatch(resetFlashcardState());
    };
  }, [deckId, deck, dueCards, dispatch]);

  const activeCard = cards[currentCardIndex];
  const totalCards = cards.length;
  const cardsRemaining = Math.max(0, totalCards - currentCardIndex);
  const progressPercent =
    totalCards > 0 ? Math.round((currentCardIndex / totalCards) * 100) : 0;

  // Calculate live session statistics based on FSRS Ratings
  const ratingsList = Object.values(userRatings);
  const totalReviewed = ratingsList.length;
  const successfulReviews = ratingsList.filter(
    (r) => r === FSRSRating.GOOD || r === FSRSRating.EASY,
  ).length;
  const accuracyPercent =
    totalReviewed > 0
      ? Math.round((successfulReviews / totalReviewed) * 100)
      : 0;

  // 5. Session Timer
  React.useEffect(() => {
    if (isFinished || isDeckLoading || isDueLoading || !totalCards) return;
    const interval = setInterval(() => {
      setElapsedSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [isFinished, isDeckLoading, isDueLoading, totalCards]);

  const formatTime = (totalSecs: number) => {
    const mins = Math.floor(totalSecs / 60)
      .toString()
      .padStart(2, "0");
    const secs = (totalSecs % 60).toString().padStart(2, "0");
    return `${mins}:${secs}`;
  };

  // 6. Handle Card Rating Submission (FSRS Algorithm backend sync)
  const handleScore = async (rating: FSRSRating) => {
    if (!activeCard || !deckId) return;

    // Record local state immediately
    dispatch(recordRating({ cardId: activeCard.id, rating }));

    // Persist card review progress to API
    try {
      await submitCardReview({
        cardId: activeCard.id,
        deckId,
        rating,
      }).unwrap();
    } catch (error) {
      console.error("Failed to submit card review rating:", error);
    }

    // Advance session or show summary screen on last card
    if (currentCardIndex >= totalCards - 1) {
      setIsFinished(true);
    }
  };

  const handleRestartSession = () => {
    refetchDueCards();
    refetchDeck();
    dispatch(resetFlashcardState());
  };

  const isLoading = isDeckLoading || isDueLoading;

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 dark:bg-slate-950">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600 mb-4" />
        <p className="text-slate-600 dark:text-slate-400 font-medium">
          Fetching review cards...
        </p>
      </div>
    );
  }

  if (isDeckError || !deck || totalCards === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50 dark:bg-slate-950 px-4">
        <div className="text-center space-y-4 max-w-md bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800">
          <AlertCircle className="w-12 h-12 text-rose-500 mx-auto" />
          <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
            {!deck ? "Deck Not Found" : "No Due Flashcards"}
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            {!deck
              ? "The requested flashcard deck could not be located."
              : "Great job! You have no cards due for review in this deck right now."}
          </p>
          <div className="flex justify-center gap-3 pt-2">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" /> Go Back
            </button>
            <button
              type="button"
              onClick={() => {
                refetchDeck();
                refetchDueCards();
              }}
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans">
      {/* Header */}
      <header className="h-16 border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md sticky top-0 z-10 px-6 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="inline-flex items-center text-sm font-medium text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-1.5" />
            <span className="hidden sm:inline">Exit Session</span>
          </button>
          <div className="h-4 w-px bg-slate-200 dark:bg-slate-800 hidden sm:block" />
          <div className="flex items-center space-x-2">
            <div className="w-7 h-7 rounded-md bg-blue-600 text-white font-bold text-xs flex items-center justify-center">
              FSRS
            </div>
            <span className="font-semibold text-sm text-slate-800 dark:text-slate-200">
              Spaced Repetition Hub
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            type="button"
            className="p-2 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 rounded-lg transition-colors"
          >
            <User className="w-4 h-4" />
          </button>
          <button
            type="button"
            className="inline-flex items-center space-x-1.5 px-3 py-1.5 text-xs font-medium text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50 rounded-lg transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 w-full max-w-6xl mx-auto px-6 py-8">
        {!isFinished ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Active Card Session */}
            <div className="lg:col-span-7 space-y-6">
              {/* Progress Header */}
              <div className="space-y-3">
                <div className="flex justify-between items-end">
                  <div>
                    <span className="text-xs font-semibold tracking-wide text-blue-600 dark:text-blue-400 uppercase flex items-center gap-1">
                      <Brain className="w-3.5 h-3.5" /> FSRS Review Mode
                    </span>
                    <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100 mt-0.5">
                      {deck.name}
                    </h1>
                  </div>
                  <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                    Card {currentCardIndex + 1} of {totalCards}
                  </span>
                </div>

                <div className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-600 transition-all duration-300 ease-out"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>

              {/* Flashcard Component */}
              <div
                onClick={() => dispatch(toggleFlip())}
                className="relative min-h-[320px] bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all duration-200 p-8 flex flex-col justify-between cursor-pointer select-none group"
              >
                <div className="flex justify-between items-center">
                  <span className="inline-flex items-center space-x-1.5 text-xs font-medium text-slate-400">
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>
                      {isFlipped ? "Back (Answer)" : "Front (Question)"}
                    </span>
                  </span>
                  <span className="text-xs font-medium px-2 py-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-500">
                    {isFlipped ? "Showing Answer" : "Click to Reveal"}
                  </span>
                </div>

                <div className="my-auto py-6 text-center space-y-4">
                  <p className="text-xl font-medium text-slate-800 dark:text-slate-100 leading-relaxed">
                    {activeCard?.frontContent}
                  </p>

                  {isFlipped && (
                    <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-3">
                      <p className="text-xl font-semibold text-blue-600 dark:text-blue-400 leading-relaxed">
                        {activeCard?.backContent}
                      </p>
                      {activeCard?.explanation && (
                        <p className="text-sm text-slate-500 dark:text-slate-400 italic">
                          {activeCard.explanation}
                        </p>
                      )}
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-center space-x-1.5 text-xs text-slate-400 group-hover:text-slate-500 transition-colors">
                  <RotateCw className="w-3.5 h-3.5" />
                  <span>
                    Click anywhere to{" "}
                    {isFlipped ? "hide answer" : "reveal answer"}
                  </span>
                </div>
              </div>

              {/* FSRS Rating Buttons (1: Again, 2: Hard, 3: Good, 4: Easy) */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <button
                  type="button"
                  onClick={() => handleScore(FSRSRating.AGAIN)}
                  className="flex flex-col items-center justify-center py-3 px-2 bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/40 dark:hover:bg-rose-900/60 text-rose-700 dark:text-rose-300 font-medium rounded-xl border border-rose-200 dark:border-rose-900/50 transition-all active:scale-[0.97]"
                >
                  <XCircle className="w-5 h-5 text-rose-500 mb-1" />
                  <span className="text-xs font-bold">Again</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleScore(FSRSRating.HARD)}
                  className="flex flex-col items-center justify-center py-3 px-2 bg-amber-50 hover:bg-amber-100 dark:bg-amber-950/40 dark:hover:bg-amber-900/60 text-amber-700 dark:text-amber-300 font-medium rounded-xl border border-amber-200 dark:border-amber-900/50 transition-all active:scale-[0.97]"
                >
                  <HardIcon className="w-5 h-5 text-amber-500 mb-1" />
                  <span className="text-xs font-bold">Hard</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleScore(FSRSRating.GOOD)}
                  className="flex flex-col items-center justify-center py-3 px-2 bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/40 dark:hover:bg-blue-900/60 text-blue-700 dark:text-blue-300 font-medium rounded-xl border border-blue-200 dark:border-blue-900/50 transition-all active:scale-[0.97]"
                >
                  <CheckCircle2 className="w-5 h-5 text-blue-500 mb-1" />
                  <span className="text-xs font-bold">Good</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleScore(FSRSRating.EASY)}
                  className="flex flex-col items-center justify-center py-3 px-2 bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/40 dark:hover:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 font-medium rounded-xl border border-emerald-200 dark:border-emerald-900/50 transition-all active:scale-[0.97]"
                >
                  <Sparkles className="w-5 h-5 text-emerald-500 mb-1" />
                  <span className="text-xs font-bold">Easy</span>
                </button>
              </div>
            </div>

            {/* Sidebar Stats */}
            <aside className="lg:col-span-5 space-y-4 lg:sticky lg:top-24">
              {/* Deck Info */}
              <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                  <Layers className="w-4 h-4 text-blue-500" />
                  Deck Metadata
                </h3>
                <div className="space-y-2 text-sm pt-1">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500 dark:text-slate-400">
                      Category
                    </span>
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                      <Tag className="w-3 h-3" />
                      {deck.category}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500 dark:text-slate-400">
                      Total Cards
                    </span>
                    <span className="font-semibold text-slate-700 dark:text-slate-300">
                      {totalCards}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500 dark:text-slate-400">
                      Remaining
                    </span>
                    <span className="font-semibold text-slate-700 dark:text-slate-300">
                      {cardsRemaining}
                    </span>
                  </div>
                </div>
              </div>

              {/* Accuracy Display */}
              <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                  <Target className="w-4 h-4 text-blue-500" />
                  Session Mastery Rate
                </h3>

                <div className="flex flex-col items-center justify-center py-2">
                  <div className="text-3xl font-extrabold text-slate-900 dark:text-slate-100">
                    {accuracyPercent}%
                  </div>
                  <span className="text-xs font-medium text-slate-400">
                    Good & Easy Retention
                  </span>
                </div>
              </div>

              {/* Session Timer */}
              <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Clock className="w-5 h-5 text-blue-500" />
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      Elapsed Time
                    </h4>
                    <p className="text-xs text-slate-500">
                      Active session timer
                    </p>
                  </div>
                </div>
                <span className="text-lg font-mono font-bold text-slate-800 dark:text-slate-200">
                  {formatTime(elapsedSeconds)}
                </span>
              </div>
            </aside>
          </div>
        ) : (
          /* Session Complete Screen */
          <div className="max-w-2xl mx-auto">
            <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm text-center space-y-6">
              <div className="w-16 h-16 bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center mx-auto">
                <HelpCircle className="w-8 h-8" />
              </div>

              <div className="space-y-1">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                  Review Batch Complete!
                </h2>
                <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto">
                  Your FSRS memory intervals have been updated in the database.
                </p>
              </div>

              <div className="py-4">
                <div className="text-4xl font-black text-blue-600 dark:text-blue-400">
                  {accuracyPercent}%
                </div>
                <p className="text-xs font-medium text-slate-400 uppercase tracking-wider mt-1">
                  Mastery Rate
                </p>
              </div>

              {/* Per-card FSRS Breakdown */}
              <div className="text-left space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <ListChecks className="w-4 h-4" /> Card Breakdown & Ratings
                </h3>
                <div className="max-h-60 overflow-y-auto space-y-2 pr-1">
                  {cards.map((card, idx) => {
                    const rating = userRatings[card.id];
                    const ratingLabel =
                      rating === FSRSRating.AGAIN
                        ? "Again"
                        : rating === FSRSRating.HARD
                          ? "Hard"
                          : rating === FSRSRating.GOOD
                            ? "Good"
                            : rating === FSRSRating.EASY
                              ? "Easy"
                              : "Unreviewed";

                    return (
                      <div
                        key={card.id || idx}
                        className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/40 rounded-lg text-sm"
                      >
                        <div className="flex items-center space-x-3 overflow-hidden">
                          <span className="text-xs font-mono text-slate-400 w-4">
                            {idx + 1}.
                          </span>
                          <span className="truncate text-slate-700 dark:text-slate-300 font-medium">
                            {card.frontContent}
                          </span>
                        </div>
                        <span
                          className={`text-xs font-bold px-2 py-1 rounded shrink-0 ml-2 ${
                            rating === FSRSRating.AGAIN
                              ? "bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300"
                              : rating === FSRSRating.HARD
                                ? "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300"
                                : rating === FSRSRating.GOOD
                                  ? "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300"
                                  : "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"
                          }`}
                        >
                          {ratingLabel}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleRestartSession}
                  className="inline-flex items-center justify-center space-x-2 w-full max-w-xs py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition-all active:scale-[0.98]"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Start New Review Batch</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      <footer className="py-6 border-t border-slate-200 dark:border-slate-800 text-center text-xs text-slate-400">
        &copy; 2026 Workspace System. All rights reserved.
      </footer>
    </div>
  );
}
