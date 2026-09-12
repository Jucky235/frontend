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
      <div className="examstat-card">
        <div className="examstat-icon-wrapper variant-brand">
          <BookOpen className="w-5 h-5" />
        </div>
        <div>
          <p className="examstat-label">Total Exams</p>
          <p className="examstat-value">{stats.total}</p>
        </div>
      </div>

      <div className="examstat-card">
        <div className="examstat-icon-wrapper variant-success">
          <FileCheck className="w-5 h-5" />
        </div>
        <div>
          <p className="examstat-label">Active</p>
          <p className="examstat-value">{stats.active}</p>
        </div>
      </div>

      <div className="examstat-card">
        <div className="examstat-icon-wrapper variant-warning">
          <Clock className="w-5 h-5" />
        </div>
        <div>
          <p className="examstat-label">Inactive</p>
          <p className="examstat-value">{stats.inactive}</p>
        </div>
      </div>

      <div className="examstat-card">
        <div className="examstat-icon-wrapper variant-danger">
          <Archive className="w-5 h-5" />
        </div>
        <div>
          <p className="examstat-label">Outdated</p>
          <p className="examstat-value">{stats.outdated}</p>
        </div>
      </div>
    </div>
  );
}
