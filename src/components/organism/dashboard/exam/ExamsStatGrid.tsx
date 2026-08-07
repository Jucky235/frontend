import { BookOpen, FileCheck, Clock, Archive } from "lucide-react";

interface ExamsStatGridProps {
  stats: {
    total: number;
    active: number;
    inactive: number;
    outdated: number;
  };
}

export default function ExamsStatGrid({ stats }: ExamsStatGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="bg-white border border-neutral-200/80 p-5 rounded-2xl shadow-xs flex items-center space-x-4">
        <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
          <BookOpen className="w-5 h-5" />
        </div>
        <div>
          <p className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">
            Total Exams
          </p>
          <p className="text-xl font-extrabold text-neutral-800 mt-0.5">
            {stats.total}
          </p>
        </div>
      </div>

      <div className="bg-white border border-neutral-200/80 p-5 rounded-2xl shadow-xs flex items-center space-x-4">
        <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
          <FileCheck className="w-5 h-5" />
        </div>
        <div>
          <p className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">
            Active
          </p>
          <p className="text-xl font-extrabold text-neutral-800 mt-0.5">
            {stats.active}
          </p>
        </div>
      </div>

      <div className="bg-white border border-neutral-200/80 p-5 rounded-2xl shadow-xs flex items-center space-x-4">
        <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
          <Clock className="w-5 h-5" />
        </div>
        <div>
          <p className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">
            Inactive
          </p>
          <p className="text-xl font-extrabold text-neutral-800 mt-0.5">
            {stats.inactive}
          </p>
        </div>
      </div>

      <div className="bg-white border border-neutral-200/80 p-5 rounded-2xl shadow-xs flex items-center space-x-4">
        <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold">
          <Archive className="w-5 h-5" />
        </div>
        <div>
          <p className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">
            Outdated
          </p>
          <p className="text-xl font-extrabold text-neutral-800 mt-0.5">
            {stats.outdated}
          </p>
        </div>
      </div>
    </div>
  );
}
