import * as React from "react";
import { ArrowRight } from "lucide-react";

export interface FeatureItem {
  title: string;
  desc: string;
  icon: React.ReactNode;
  actionText?: string;
  onClick?: () => void;
}

export default function FeatureCard({
  title,
  desc,
  icon,
  actionText = "Open Module",
  onClick,
}: FeatureItem) {
  return (
    <div
      onClick={onClick}
      className="bg-white border border-neutral-200/80 hover:border-indigo-200 p-6 rounded-2xl transition-all shadow-xs hover:shadow-md group flex flex-col justify-between space-y-4 cursor-pointer"
    >
      <div className="space-y-3">
        <div className="w-12 h-12 bg-neutral-100 group-hover:bg-indigo-50 rounded-xl flex items-center justify-center transition-colors">
          {icon}
        </div>
        <h3 className="text-base font-bold text-neutral-800 group-hover:text-[#5A67FF] transition-colors">
          {title}
        </h3>
        <p className="text-xs text-neutral-500 leading-relaxed font-medium">
          {desc}
        </p>
      </div>

      <div className="pt-2">
        <span className="text-xs font-bold text-[#5A67FF] inline-flex items-center space-x-1">
          <span>{actionText}</span>
          <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-1" />
        </span>
      </div>
    </div>
  );
}
