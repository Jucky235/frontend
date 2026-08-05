// ScoreCard.tsx
import { CheckCircle2, RefreshCw } from "lucide-react";

interface ScoreCardProps {
  score: number;
  totalQuestions: number;
  onReset: () => void;
}

export const ScoreCard: React.FC<ScoreCardProps> = ({
  score,
  totalQuestions,
  onReset,
}) => {
  const percentage =
    totalQuestions > 0 ? Math.round((score / totalQuestions) * 100) : 0;

  return (
    <div className="w-full bg-white border border-neutral-200 p-6 rounded-2xl shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4 animate-in fade-in slide-in-from-top-4">
      <div className="flex items-center space-x-4">
        <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
          <CheckCircle2 className="w-6 h-6" />
        </div>
        <div>
          <h3 className="font-extrabold text-neutral-800 text-lg">
            Test Complete!
          </h3>
          <p className="text-xs text-neutral-500 font-medium mt-0.5">
            You answered {score} out of {totalQuestions} correctly.
          </p>
        </div>
      </div>
      <div className="flex items-center space-x-4 w-full sm:w-auto">
        <div className="bg-neutral-50 px-5 py-2.5 rounded-xl border border-neutral-200 text-center flex-1 sm:flex-initial">
          <span className="text-xs font-bold text-neutral-400 block uppercase tracking-wider">
            Score
          </span>
          <span className="text-xl font-black text-neutral-800">
            {percentage}%
          </span>
        </div>
        <button
          type="button"
          onClick={onReset}
          className="bg-neutral-900 hover:bg-neutral-800 text-white p-3.5 rounded-xl transition-colors cursor-pointer"
        >
          <RefreshCw className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
