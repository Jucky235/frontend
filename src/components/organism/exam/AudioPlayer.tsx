import * as React from "react";
import { Volume2, Square } from "lucide-react";

interface AudioPlayerProps {
  questionId: string;
  audioPath: string;
  playingAudioId: string | null;
  onToggleAudio: (questionId: string, url: string) => void;
}

export const AudioPlayer: React.FC<AudioPlayerProps> = ({
  questionId,
  audioPath,
  playingAudioId,
  onToggleAudio,
}) => {
  const isPlaying = playingAudioId === questionId;

  return (
    <div className="flex items-center pt-1">
      <button
        type="button"
        onClick={() => onToggleAudio(questionId, audioPath)}
        className={`flex items-center space-x-2 text-xs font-bold px-4 py-2 rounded-xl transition-all cursor-pointer select-none border border-neutral-200 ${
          isPlaying
            ? "bg-rose-50 text-rose-600 border-rose-200"
            : "bg-neutral-50 text-neutral-700 hover:bg-neutral-100"
        }`}
      >
        {isPlaying ? (
          <>
            <Square className="w-4 h-4 fill-current" />
            <span>Stop Audio</span>
          </>
        ) : (
          <>
            <Volume2 className="w-4 h-4" />
            <span>Play Audio</span>
          </>
        )}
      </button>
    </div>
  );
};
