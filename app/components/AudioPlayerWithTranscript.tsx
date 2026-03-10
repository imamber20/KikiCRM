"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
} from "lucide-react";
import { TranscriptLine } from "@/lib/dummyCalls";
import { cn } from "@/lib/utils";

interface AudioPlayerWithTranscriptProps {
  audioUrl: string;
  transcript: TranscriptLine[];
}

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

const PLAYBACK_RATES = [0.5, 0.75, 1, 1.25, 1.5, 2];

export default function AudioPlayerWithTranscript({
  audioUrl,
  transcript,
}: AudioPlayerWithTranscriptProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const transcriptRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [muted, setMuted] = useState(false);
  const [activeLineIndex, setActiveLineIndex] = useState(-1);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onTimeUpdate = () => setCurrentTime(audio.currentTime);
    const onLoadedMetadata = () => setDuration(audio.duration);
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

  // Auto-scroll to active line
  useEffect(() => {
    const idx = transcript.findIndex(
      (line) => currentTime >= line.startTime && currentTime <= line.endTime
    );
    if (idx !== -1 && idx !== activeLineIndex) {
      setActiveLineIndex(idx);
      const el = document.getElementById(`transcript-line-${idx}`);
      if (el && transcriptRef.current) {
        el.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }
  }, [currentTime, transcript, activeLineIndex]);

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

  const skip = (seconds: number) => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = Math.max(0, Math.min(audio.currentTime + seconds, duration));
  };

  const seek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current;
    if (!audio) return;
    const time = parseFloat(e.target.value);
    audio.currentTime = time;
    setCurrentTime(time);
  };

  const cycleRate = () => {
    const audio = audioRef.current;
    if (!audio) return;
    const idx = PLAYBACK_RATES.indexOf(playbackRate);
    const next = PLAYBACK_RATES[(idx + 1) % PLAYBACK_RATES.length];
    audio.playbackRate = next;
    setPlaybackRate(next);
  };

  const toggleMute = () => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.muted = !muted;
    setMuted(!muted);
  };

  const seekToLine = (line: TranscriptLine) => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = line.startTime;
    setCurrentTime(line.startTime);
    if (!isPlaying) {
      audio.play();
      setIsPlaying(true);
    }
  };

  return (
    <div className="space-y-4">
      <audio ref={audioRef} src={audioUrl} preload="metadata" />

      {/* Player controls */}
      <div className="bg-muted/50 rounded-2xl p-4 border border-border">
        {/* Progress bar */}
        <div className="flex items-center gap-3 mb-3">
          <span className="text-xs text-muted-foreground w-10 text-right font-mono">
            {formatTime(currentTime)}
          </span>
          <input
            type="range"
            min={0}
            max={duration || 0}
            step={0.1}
            value={currentTime}
            onChange={seek}
            className="flex-1 h-1 cursor-pointer"
          />
          <span className="text-xs text-muted-foreground w-10 font-mono">
            {formatTime(duration)}
          </span>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-4">
          <button
            onClick={toggleMute}
            className="p-2 rounded-lg hover:bg-muted transition-colors text-muted-foreground"
            title={muted ? "Ton an" : "Ton aus"}
          >
            {muted ? <VolumeX size={18} /> : <Volume2 size={18} />}
          </button>
          <button
            onClick={() => skip(-10)}
            className="p-2 rounded-lg hover:bg-muted transition-colors text-muted-foreground"
            title="-10s"
          >
            <SkipBack size={18} />
          </button>
          <button
            onClick={togglePlay}
            className="w-11 h-11 rounded-full bg-primary text-white flex items-center justify-center hover:bg-primary-dark transition-colors shadow-md"
          >
            {isPlaying ? <Pause size={20} /> : <Play size={20} className="ml-0.5" />}
          </button>
          <button
            onClick={() => skip(10)}
            className="p-2 rounded-lg hover:bg-muted transition-colors text-muted-foreground"
            title="+10s"
          >
            <SkipForward size={18} />
          </button>
          <button
            onClick={cycleRate}
            className="px-2.5 py-1.5 rounded-lg hover:bg-muted transition-colors text-xs font-semibold text-muted-foreground min-w-[48px]"
          >
            {playbackRate}x
          </button>
        </div>
      </div>

      {/* Transcript */}
      <div
        ref={transcriptRef}
        className="max-h-[400px] overflow-y-auto space-y-2 pr-1"
      >
        {transcript.map((line, lineIdx) => {
          const isActiveLine =
            currentTime >= line.startTime && currentTime <= line.endTime;

          return (
            <div
              key={lineIdx}
              id={`transcript-line-${lineIdx}`}
              onClick={() => seekToLine(line)}
              className={cn(
                "p-3 rounded-xl cursor-pointer transition-all duration-200",
                isActiveLine
                  ? "bg-primary/5 border border-primary/20"
                  : "hover:bg-muted/50 border border-transparent"
              )}
            >
              <span
                className={cn(
                  "text-xs font-semibold inline-block mb-1 px-2 py-0.5 rounded-full",
                  line.speaker === "Kiki"
                    ? "bg-emerald-100 text-emerald-700"
                    : "bg-blue-100 text-blue-700"
                )}
              >
                {line.speaker}
              </span>
              <p className="text-sm leading-relaxed">
                {line.words.map((word, wordIdx) => {
                  const isActiveWord =
                    isActiveLine &&
                    currentTime >= word.start &&
                    currentTime <= word.end;

                  return (
                    <span
                      key={wordIdx}
                      className={cn(
                        "transition-all duration-100",
                        isActiveWord &&
                          "font-bold bg-primary/20 text-primary-dark rounded px-0.5"
                      )}
                    >
                      {word.word}{" "}
                    </span>
                  );
                })}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
