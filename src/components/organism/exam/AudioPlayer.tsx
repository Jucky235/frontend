import * as React from "react";
import { Volume2, Square } from "lucide-react";

interface AudioPlayerProps {
  questionId: string | number;
  audioPath: string;
  playingAudioId: string | null;
  onToggleAudio: (questionId: string | number, url: string) => void;
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
        className={`flex items-center space-x-2 text-xs font-bold px-4 py-2 rounded-xl transition-all cursor-pointer select-none border border-border ${
          isPlaying
            ? "bg-rose-50 text-rose-600 border-rose-200"
            : "bg-background text-foreground-muted hover:bg-background-hover"
        }`}
      >
        {isPlaying ? (
          <>
            <Square className="w-4 h-4 fill-current" />
            <span>Dừng âm thanh</span>
          </>
        ) : (
          <>
            <Volume2 className="w-4 h-4" />
            <span>Phát âm thanh</span>
          </>
        )}
      </button>
    </div>
  );
};
