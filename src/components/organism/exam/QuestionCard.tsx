import * as React from "react";
import { AudioPlayer } from "./AudioPlayer";
import { QuestionOption } from "./QuestionOption";

interface Question {
  id: string;
  content: string;
  audioPath?: string;
  imagePath?: string;
  options: Record<string, string>;
  right_answer: string;
  explanation?: string;
}

interface QuestionCardProps {
  question: Question;
  index: number;
  userSelection?: string;
  isSubmitted: boolean;
  isSubmitting: boolean;
  playingAudioId: string | null;
  onToggleAudio: (questionId: string, url: string) => void;
  onSelectOption: (questionId: string, optionKey: string) => void;
}

export const QuestionCard: React.FC<QuestionCardProps> = ({
  question: q,
  index,
  userSelection,
  isSubmitted,
  isSubmitting,
  playingAudioId,
  onToggleAudio,
  onSelectOption,
}) => {
  return (
    <div className="bg-white border border-neutral-200 rounded-2xl p-6 shadow-xs space-y-5">
      {/* Title & Media */}
      <div className="flex items-start space-x-3">
        <span className="text-sm font-black text-indigo-500 bg-indigo-50 w-6 h-6 rounded-md flex items-center justify-center shrink-0 mt-0.5">
          {index + 1}
        </span>
        <div className="space-y-4 w-full">
          <h2 className="text-base font-bold text-neutral-800 leading-snug">
            {q.content}
          </h2>

          {q.audioPath && (
            <AudioPlayer
              questionId={q.id}
              audioPath={q.audioPath}
              playingAudioId={playingAudioId}
              onToggleAudio={onToggleAudio}
            />
          )}

          {q.imagePath && (
            <div className="w-full max-w-md bg-neutral-100 border border-neutral-200 rounded-xl overflow-hidden shadow-xs">
              <img
                src={q.imagePath}
                alt={`Question visual illustration ${index + 1}`}
                className="w-full h-auto object-cover block"
                loading="lazy"
              />
            </div>
          )}
        </div>
      </div>

      {/* Options Loop */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
        {Object.entries(q.options).map(([optKey, optText]) => (
          <QuestionOption
            key={optKey}
            optKey={optKey}
            optText={optText}
            isSelected={userSelection === optKey}
            isCorrect={q.right_answer === optKey}
            isSubmitted={isSubmitted}
            isSubmitting={isSubmitting}
            onSelectOption={(key) => onSelectOption(q.id, key)}
          />
        ))}
      </div>

      {/* Explanation */}
      {isSubmitted && q.explanation && (
        <div className="mt-4 p-4 bg-blue-50 text-blue-800 text-sm rounded-xl border border-blue-100 font-medium">
          <strong className="block mb-1 text-blue-900 uppercase text-xs tracking-wider">
            Explanation
          </strong>
          {q.explanation}
        </div>
      )}
    </div>
  );
};
