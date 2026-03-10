"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { Play, Pause, Download } from "lucide-react";
import { formatDuration } from "@/lib/utils";

interface AudioPlayerInlineProps {
  audioUrl: string;
  duration: number;
}

export default function AudioPlayerInline({ audioUrl, duration }: AudioPlayerInlineProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [audioDuration, setAudioDuration] = useState(duration);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onTimeUpdate = () => setCurrentTime(audio.currentTime);
    const onLoadedMetadata = () => setAudioDuration(audio.duration);
    const onEnded = () => setIsPlaying(false);

    audio.addEventListener("timeupdate", onTimeUpdate);
    audio.addEventListener("loadedmetadata", onLoadedMetadata);
    audio.addEventListener("ended", onEnded);

    return () => {
      audio.removeEventListener("timeupdate", onTimeUpdate);
      audio.removeEventListener("loadedmetadata", onLoadedMetadata);
      audio.removeEventListener("ended", onEnded);
    };
  }, []);

  const togglePlay = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    setIsPlaying(!isPlaying);
  }, [isPlaying]);

  const seek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current;
    if (!audio) return;
    const time = parseFloat(e.target.value);
    audio.currentTime = time;
    setCurrentTime(time);
  };

  const progress = audioDuration ? (currentTime / audioDuration) * 100 : 0;

  return (
    <div className="flex items-center gap-3">
      <audio ref={audioRef} src={audioUrl} preload="metadata" />

      <button
        onClick={togglePlay}
        className="w-9 h-9 rounded-full bg-primary flex items-center justify-center text-white hover:bg-primary-dark transition-colors shrink-0"
      >
        {isPlaying ? <Pause size={16} /> : <Play size={16} className="ml-0.5" />}
      </button>

      <div className="flex-1 flex flex-col gap-1">
        {/* Waveform-like progress bar */}
        <div className="relative h-[28px] flex items-center">
          <input
            type="range"
            min={0}
            max={audioDuration || duration}
            step={0.1}
            value={currentTime}
            onChange={seek}
            className="w-full h-1 cursor-pointer absolute inset-0 opacity-0 z-10"
          />
          {/* Visual waveform bars */}
          <div className="flex items-center gap-[2px] w-full h-full">
            {Array.from({ length: 40 }).map((_, i) => {
              // Deterministic bar heights
              const heights = [12, 18, 8, 22, 14, 20, 10, 24, 16, 6, 20, 12, 18, 8, 24, 14, 22, 10, 16, 20, 8, 18, 12, 24, 6, 20, 14, 22, 10, 16, 18, 8, 24, 12, 20, 14, 6, 22, 16, 18];
              const h = heights[i % heights.length];
              const barProgress = (i / 40) * 100;
              const isFilled = barProgress <= progress;
              return (
                <div
                  key={i}
                  className="flex-1 rounded-full transition-colors duration-100"
                  style={{
                    height: `${h}px`,
                    backgroundColor: isFilled ? "#10B981" : "#D1D5DB",
                  }}
                />
              );
            })}
          </div>
        </div>
        <div className="flex items-center justify-between text-[10px] text-muted-foreground">
          <span>{formatDuration(Math.floor(currentTime))}</span>
          <span>{formatDuration(duration)}</span>
        </div>
      </div>

      <a
        href={audioUrl}
        download
        className="p-1.5 rounded-lg hover:bg-gray-100 text-muted-foreground transition-colors shrink-0"
        title="Herunterladen"
      >
        <Download size={16} />
      </a>
    </div>
  );
}
