import * as React from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

export interface FeatureItem {
  title: string;
  desc: string;
  icon: React.ReactNode;
  to: string; // Changed from href to to
  actionText?: string;
}

export default function FeatureCard({
  title,
  desc,
  icon,
  to,
  actionText = "Open Module",
}: FeatureItem) {
  return (
    <Link
      to={to} // Changed href={href} to to={to}
      className="bg-background-card border border-border/80 hover:border-brand/40 p-6 rounded-2xl transition-all shadow-xs hover:shadow-md group flex flex-col justify-between space-y-4 cursor-pointer block"
    >
      <div className="space-y-3">
        <div className="w-12 h-12 bg-background-hover group-hover:bg-brand-light rounded-xl flex items-center justify-center transition-colors">
          {icon}
        </div>
        <h3 className="text-base font-bold text-foreground group-hover:text-brand transition-colors">
          {title}
        </h3>
        <p className="text-xs text-foreground-subtle leading-relaxed font-medium">
          {desc}
        </p>
      </div>

      <div className="pt-2">
        <span className="text-xs font-bold text-brand inline-flex items-center space-x-1">
          <span>{actionText}</span>
          <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-1" />
        </span>
      </div>
    </Link>
  );
}
