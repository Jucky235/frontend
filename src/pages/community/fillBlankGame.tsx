import * as React from "react";
import {
  CheckCircle2,
  XCircle,
  ArrowRight,
  RotateCcw,
  Award,
} from "lucide-react";

export interface FillBlankQuestion {
  sentence: string;
  options: string[];
  answer: string;
}

export interface FillBlankExercise {
  type: "fill_blank";
  title: string;
  questions: FillBlankQuestion[];
}

interface FillBlankGameProps {
  exercise: FillBlankExercise;
  onComplete?: (score: number, total: number) => void;
}

export default function FillBlankGame({
  exercise,
  onComplete,
}: FillBlankGameProps) {
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const [selectedOption, setSelectedOption] = React.useState<string | null>(
    null,
  );
  const [isAnswered, setIsAnswered] = React.useState(false);
  const [score, setScore] = React.useState(0);
  const [isFinished, setIsFinished] = React.useState(false);

  const currentQuestion = exercise.questions[currentIndex];

  const handleSelectOption = (option: string) => {
    if (isAnswered) return;
    setSelectedOption(option);
  };

  const handleCheckAnswer = () => {
    if (!selectedOption || isAnswered) return;

    const isCorrect = selectedOption === currentQuestion.answer;
    if (isCorrect) {
      setScore((prev) => prev + 1);
    }
    setIsAnswered(true);
  };

  const handleNextQuestion = () => {
    if (currentIndex + 1 < exercise.questions.length) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      setIsFinished(true);
      if (onComplete) {
        onComplete(
          score + (selectedOption === currentQuestion.answer ? 1 : 0),
          exercise.questions.length,
        );
      }
    }
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setScore(0);
    setIsFinished(false);
  };

  // Render Completion Summary
  if (isFinished) {
    const percentage = Math.round((score / exercise.questions.length) * 100);
    return (
      <div className="w-full max-w-lg mx-auto bg-background-card border border-border rounded-3xl p-8 shadow-2xl text-center space-y-6 animate-in zoom-in-95 duration-200">
        <div className="w-20 h-20 mx-auto bg-brand/10 rounded-full flex items-center justify-center text-brand">
          <Award className="w-10 h-10" />
        </div>
        <div>
          <h2 className="text-2xl font-black text-foreground">
            {exercise.title} Completed!
          </h2>
          <p className="text-foreground-subtle mt-1 text-sm">
            Great job working through your practice set.
          </p>
        </div>

        <div className="bg-background-hover p-4 rounded-2xl border border-border/60 flex justify-around items-center">
          <div>
            <span className="text-xs text-foreground-subtle font-bold uppercase tracking-wider block">
              Score
            </span>
            <span className="text-2xl font-black text-foreground">
              {score} / {exercise.questions.length}
            </span>
          </div>
          <div className="h-8 w-px bg-border" />
          <div>
            <span className="text-xs text-foreground-subtle font-bold uppercase tracking-wider block">
              Accuracy
            </span>
            <span className="text-2xl font-black text-brand">
              {percentage}%
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={handleRestart}
          className="w-full py-3.5 rounded-2xl bg-brand text-white font-extrabold flex items-center justify-center space-x-2 shadow-lg shadow-brand/20 hover:bg-brand-hover transition-all active:scale-98"
        >
          <RotateCcw className="w-5 h-5" />
          <span>Try Again</span>
        </button>
      </div>
    );
  }

  // Split sentence around '_____' or '___'
  const sentenceParts = currentQuestion.sentence.split(/_{3,}/g);

  return (
    <div className="w-full max-w-xl mx-auto bg-background-card border border-border rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
      {/* Header & Progress Bar */}
      <div className="space-y-2">
        <div className="flex justify-between items-center text-xs font-black uppercase text-foreground-subtle tracking-wider">
          <span>{exercise.title}</span>
          <span>
            Question {currentIndex + 1} of {exercise.questions.length}
          </span>
        </div>
        <div className="w-full bg-neutral-200 dark:bg-neutral-800 h-2.5 rounded-full overflow-hidden">
          <div
            className="bg-brand h-full transition-all duration-300"
            style={{
              width: `${((currentIndex + 1) / exercise.questions.length) * 100}%`,
            }}
          />
        </div>
      </div>

      {/* Sentence Display Area */}
      <div className="p-6 bg-background-hover rounded-2xl border border-border/80 text-lg sm:text-xl font-bold text-foreground text-center leading-relaxed">
        {sentenceParts[0]}
        <span className="inline-block px-3 py-1 mx-1.5 min-w-[80px] border-b-4 border-brand bg-brand/10 text-brand rounded-lg font-black text-center">
          {selectedOption ?? "____"}
        </span>
        {sentenceParts[1]}
      </div>

      {/* Multiple Choice Options Grid */}
      <div className="grid grid-cols-2 gap-3">
        {currentQuestion.options.map((option, idx) => {
          const isSelected = selectedOption === option;
          const isCorrect = option === currentQuestion.answer;

          let btnStyle =
            "bg-background-card border-border hover:border-brand/50 text-foreground";

          if (isAnswered) {
            if (isCorrect) {
              btnStyle =
                "bg-emerald-500/10 border-emerald-500 text-emerald-600 dark:text-emerald-400 font-extrabold";
            } else if (isSelected && !isCorrect) {
              btnStyle =
                "bg-red-500/10 border-red-500 text-red-600 dark:text-red-400 font-extrabold";
            } else {
              btnStyle = "opacity-40 border-border text-foreground-subtle";
            }
          } else if (isSelected) {
            btnStyle =
              "bg-brand/10 border-brand text-brand font-black ring-2 ring-brand/30";
          }

          return (
            <button
              key={idx}
              type="button"
              disabled={isAnswered}
              onClick={() => handleSelectOption(option)}
              className={`p-4 border-2 rounded-2xl text-base font-bold transition-all duration-150 flex items-center justify-between active:scale-98 ${btnStyle}`}
            >
              <span>{option}</span>
              {isAnswered && isCorrect && (
                <CheckCircle2 className="w-5 h-5 text-emerald-500" />
              )}
              {isAnswered && isSelected && !isCorrect && (
                <XCircle className="w-5 h-5 text-red-500" />
              )}
            </button>
          );
        })}
      </div>

      {/* Action Footer Button */}
      {!isAnswered ? (
        <button
          type="button"
          disabled={!selectedOption}
          onClick={handleCheckAnswer}
          className="w-full py-4 rounded-2xl bg-brand text-white font-black text-base shadow-xl shadow-brand/20 hover:bg-brand-hover disabled:opacity-40 disabled:cursor-not-allowed transition-all active:scale-98"
        >
          Check Answer
        </button>
      ) : (
        <button
          type="button"
          onClick={handleNextQuestion}
          className="w-full py-4 rounded-2xl bg-emerald-500 text-white font-black text-base flex items-center justify-center space-x-2 shadow-xl shadow-emerald-500/20 hover:bg-emerald-600 transition-all active:scale-98 animate-in fade-in"
        >
          <span>
            {currentIndex + 1 === exercise.questions.length
              ? "Finish Exercise"
              : "Next Question"}
          </span>
          <ArrowRight className="w-5 h-5" />
        </button>
      )}
    </div>
  );
}
