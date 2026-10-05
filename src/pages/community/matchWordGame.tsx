import * as React from "react";
import { Check, RotateCcw, Trophy } from "lucide-react";

export interface WordMatchingPair {
  word: string;
  meaning: string;
}

export interface WordMatchingExercise {
  type: "word_matching";
  title: string;
  pairs: WordMatchingPair[];
}

interface MatchWordGameProps {
  exercise: WordMatchingExercise;
  onComplete?: () => void;
}

// Utility to shuffle arrays
function shuffleArray<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export default function MatchWordGame({
  exercise,
  onComplete,
}: MatchWordGameProps) {
  const [selectedWord, setSelectedWord] = React.useState<string | null>(null);
  const [selectedMeaning, setSelectedMeaning] = React.useState<string | null>(
    null,
  );
  const [matchedPairs, setMatchedPairs] = React.useState<string[]>([]);
  const [errorPair, setErrorPair] = React.useState<{
    word: string;
    meaning: string;
  } | null>(null);

  // Mouse coordinate tracking for the active SVG line
  const [mousePos, setMousePos] = React.useState<{
    x: number;
    y: number;
  } | null>(null);
  const containerRef = React.useRef<HTMLDivElement>(null);
  const wordRefs = React.useRef<{ [key: string]: HTMLButtonElement | null }>(
    {},
  );
  const meaningRefs = React.useRef<{ [key: string]: HTMLButtonElement | null }>(
    {},
  );

  // Shuffle definitions once on load
  const shuffledMeanings = React.useMemo(() => {
    return shuffleArray(exercise.pairs.map((p) => p.meaning));
  }, [exercise]);

  // Track global mouse movement for the live connecting line when a word is selected
  React.useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!selectedWord || !containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      setMousePos({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    };

    if (selectedWord) {
      window.addEventListener("mousemove", handleMouseMove);
    } else {
      setMousePos(null);
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [selectedWord]);

  // Handle Match Validation Logic
  const checkMatch = React.useCallback(
    (word: string, meaning: string) => {
      const pair = exercise.pairs.find((p) => p.word === word);
      if (pair && pair.meaning === meaning) {
        const nextMatched = [...matchedPairs, word];
        setMatchedPairs(nextMatched);
        setSelectedWord(null);
        setSelectedMeaning(null);
        setMousePos(null);

        if (nextMatched.length === exercise.pairs.length && onComplete) {
          onComplete();
        }
      } else {
        setErrorPair({ word, meaning });
        setTimeout(() => {
          setErrorPair(null);
          setSelectedWord(null);
          setSelectedMeaning(null);
          setMousePos(null);
        }, 800);
      }
    },
    [exercise, matchedPairs, onComplete],
  );

  const handleWordClick = (word: string) => {
    if (matchedPairs.includes(word) || errorPair) return;

    if (selectedMeaning) {
      setSelectedWord(word);
      checkMatch(word, selectedMeaning);
    } else {
      setSelectedWord(selectedWord === word ? null : word);
    }
  };

  const handleMeaningClick = (meaning: string) => {
    const isAlreadyMatched = exercise.pairs.some(
      (p) => p.meaning === meaning && matchedPairs.includes(p.word),
    );
    if (isAlreadyMatched || errorPair) return;

    if (selectedWord) {
      setSelectedMeaning(meaning);
      checkMatch(selectedWord, meaning);
    } else {
      setSelectedMeaning(selectedMeaning === meaning ? null : meaning);
    }
  };

  const handleReset = () => {
    setSelectedWord(null);
    setSelectedMeaning(null);
    setMatchedPairs([]);
    setErrorPair(null);
    setMousePos(null);
  };

  // Calculate coordinates for SVG connector lines (Active or Completed)
  const getCoordinates = (wordKey: string, meaningKey: string) => {
    const wordEl = wordRefs.current[wordKey];
    const meaningEl = meaningRefs.current[meaningKey];
    const containerEl = containerRef.current;

    if (!wordEl || !meaningEl || !containerEl) return null;

    const containerRect = containerEl.getBoundingClientRect();
    const wordRect = wordEl.getBoundingClientRect();
    const meaningRect = meaningEl.getBoundingClientRect();

    return {
      x1: wordRect.right - containerRect.left,
      y1: wordRect.top + wordRect.height / 2 - containerRect.top,
      x2: meaningRect.left - containerRect.left,
      y2: meaningRect.top + meaningRect.height / 2 - containerRect.top,
    };
  };

  const getActiveWordCoordinates = (wordKey: string) => {
    const wordEl = wordRefs.current[wordKey];
    const containerEl = containerRef.current;

    if (!wordEl || !containerEl) return null;

    const containerRect = containerEl.getBoundingClientRect();
    const wordRect = wordEl.getBoundingClientRect();

    return {
      x: wordRect.right - containerRect.left,
      y: wordRect.top + wordRect.height / 2 - containerRect.top,
    };
  };

  const isAllMatched = matchedPairs.length === exercise.pairs.length;

  return (
    <div
      ref={containerRef}
      className="relative w-full max-w-2xl mx-auto bg-background-card border border-border rounded-3xl p-6 sm:p-8 shadow-xl space-y-6 overflow-hidden"
    >
      {/* SVG Overlay for Dynamic Connection Lines */}
      {!isAllMatched && (
        <svg className="absolute inset-0 w-full h-full pointer-events-none z-20 overflow-visible">
          <defs>
            <linearGradient
              id="line-gradient"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="0%"
            >
              <stop offset="0%" stopColor="var(--brand, #6366f1)" />
              <stop
                offset="100%"
                stopColor="var(--brand, #6366f1)"
                stopOpacity="0.8"
              />
            </linearGradient>
          </defs>

          {/* Render lines for successfully matched pairs */}
          {matchedPairs.map((word) => {
            const pair = exercise.pairs.find((p) => p.word === word);
            if (!pair) return null;
            const coords = getCoordinates(word, pair.meaning);
            if (!coords) return null;

            return (
              <g key={`matched-line-${word}`}>
                <path
                  d={`M ${coords.x1} ${coords.y1} C ${coords.x1 + 40} ${coords.y1}, ${coords.x2 - 40} ${coords.y2}, ${coords.x2} ${coords.y2}`}
                  fill="none"
                  stroke="rgb(16 185 129)"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  className="opacity-75 animate-in fade-in duration-300"
                />
                <circle
                  cx={coords.x1}
                  cy={coords.y1}
                  r="4"
                  fill="rgb(16 185 129)"
                />
                <circle
                  cx={coords.x2}
                  cy={coords.y2}
                  r="4"
                  fill="rgb(16 185 129)"
                />
              </g>
            );
          })}

          {/* Render active dragging/connecting line from selected word to cursor */}
          {selectedWord &&
            mousePos &&
            (() => {
              const startCoords = getActiveWordCoordinates(selectedWord);
              if (!startCoords) return null;

              const isErr = errorPair !== null;
              const strokeColor = isErr
                ? "rgb(239 68 68)"
                : "var(--brand, #6366f1)";

              return (
                <path
                  d={`M ${startCoords.x} ${startCoords.y} C ${startCoords.x + 50} ${startCoords.y}, ${mousePos.x - 50} ${mousePos.y}, ${mousePos.x} ${mousePos.y}`}
                  fill="none"
                  stroke={strokeColor}
                  strokeWidth="3.5"
                  strokeDasharray={isErr ? "6 6" : "none"}
                  strokeLinecap="round"
                  className={isErr ? "animate-pulse" : "transition-all"}
                />
              );
            })()}
        </svg>
      )}

      {/* Header Info */}
      <div className="flex items-center justify-between relative z-30">
        <div>
          <span className="text-xs font-black uppercase text-brand tracking-wider">
            Matching Practice
          </span>
          <h3 className="text-xl font-black text-foreground">
            {exercise.title}
          </h3>
        </div>
        <div className="text-xs font-extrabold px-3 py-1.5 rounded-full bg-brand/10 text-brand border border-brand/20">
          {matchedPairs.length} / {exercise.pairs.length} Matched
        </div>
      </div>

      {/* Completion View */}
      {isAllMatched ? (
        <div className="p-8 text-center bg-background-hover rounded-2xl border border-border space-y-5 animate-in zoom-in-95 duration-200 relative z-30">
          <div className="w-16 h-16 mx-auto bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center">
            <Trophy className="w-8 h-8" />
          </div>
          <div>
            <h4 className="text-xl font-black text-foreground">
              All Vocabulary Matched!
            </h4>
            <p className="text-sm text-foreground-subtle mt-1">
              You've successfully mastered this key vocabulary set.
            </p>
          </div>
          <button
            type="button"
            onClick={handleReset}
            className="px-6 py-3 rounded-2xl bg-brand text-white font-extrabold flex items-center justify-center space-x-2 mx-auto shadow-lg shadow-brand/20 hover:bg-brand-hover transition-all active:scale-98"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Practice Again</span>
          </button>
        </div>
      ) : (
        /* Matching Game Side-by-Side Columns */
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 relative z-30">
          {/* Words Column */}
          <div className="space-y-3">
            <h4 className="text-xs font-extrabold text-foreground-subtle uppercase tracking-wider px-1">
              Words
            </h4>
            {exercise.pairs.map(({ word }) => {
              const isMatched = matchedPairs.includes(word);
              const isSelected = selectedWord === word;
              const isError = errorPair?.word === word;

              let style =
                "bg-background-card border-border text-foreground hover:border-brand/40 shadow-xs";

              if (isMatched) {
                style =
                  "bg-emerald-500/10 border-emerald-500/40 text-emerald-600 dark:text-emerald-400 font-extrabold opacity-60 pointer-events-none shadow-none";
              } else if (isError) {
                style =
                  "bg-red-500/10 border-red-500 text-red-600 dark:text-red-400 animate-shake shadow-sm";
              } else if (isSelected) {
                style =
                  "bg-brand/10 border-brand text-brand font-black ring-2 ring-brand/30 shadow-md scale-[1.02]";
              }

              return (
                <button
                  key={word}
                  ref={(el) => (wordRefs.current[word] = el)}
                  type="button"
                  onClick={() => handleWordClick(word)}
                  className={`w-full p-4 border-2 rounded-2xl text-left text-sm font-bold transition-all duration-200 flex items-center justify-between active:scale-98 ${style}`}
                >
                  <span>{word}</span>
                  {isMatched && <Check className="w-4 h-4 text-emerald-500" />}
                </button>
              );
            })}
          </div>

          {/* Definitions Column */}
          <div className="space-y-3">
            <h4 className="text-xs font-extrabold text-foreground-subtle uppercase tracking-wider px-1">
              Definitions
            </h4>
            {shuffledMeanings.map((meaning) => {
              const matchingWord = exercise.pairs.find(
                (p) => p.meaning === meaning,
              )?.word;
              const isMatched = matchingWord
                ? matchedPairs.includes(matchingWord)
                : false;
              const isSelected = selectedMeaning === meaning;
              const isError = errorPair?.meaning === meaning;

              let style =
                "bg-background-card border-border text-foreground hover:border-brand/40 shadow-xs";

              if (isMatched) {
                style =
                  "bg-emerald-500/10 border-emerald-500/40 text-emerald-600 dark:text-emerald-400 font-extrabold opacity-60 pointer-events-none shadow-none";
              } else if (isError) {
                style =
                  "bg-red-500/10 border-red-500 text-red-600 dark:text-red-400 animate-shake shadow-sm";
              } else if (isSelected) {
                style =
                  "bg-brand/10 border-brand text-brand font-black ring-2 ring-brand/30 shadow-md scale-[1.02]";
              }

              return (
                <button
                  key={meaning}
                  ref={(el) => (meaningRefs.current[meaning] = el)}
                  type="button"
                  onClick={() => handleMeaningClick(meaning)}
                  className={`w-full p-4 border-2 rounded-2xl text-left text-xs sm:text-sm font-bold leading-snug transition-all duration-200 flex items-center justify-between active:scale-98 ${style}`}
                >
                  <span>{meaning}</span>
                  {isMatched && (
                    <Check className="w-4 h-4 text-emerald-500 shrink-0 ml-2" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
