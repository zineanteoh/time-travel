"use client";

import Editor from "@/components/Editor";
import Playback from "@/components/Playbaack";
import Timeline from "@/components/Timeline";
import { RetroGrid } from "@/components/magicui/retro-grid";
import { useTimeTravelStore } from "@/lib/store";
import { useCallback, useEffect, useRef } from "react";

export default function Home() {
  const {
    currentContent,
    setCurrentContent,
    addSnapshot,
    loadSnapshot,
    snapshots,
    isPlaying,
    playbackInterval,
    stepPlayback,
  } = useTimeTravelStore();

  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (snapshots.length > 0) {
      loadSnapshot(0);
    }
  }, [loadSnapshot, snapshots.length]);

  useEffect(() => {
    if (isPlaying) {
      intervalRef.current = setInterval(() => {
        stepPlayback();
      }, playbackInterval);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isPlaying, playbackInterval, stepPlayback]);

  const handleContentChange = useCallback(
    (newContent: string) => {
      setCurrentContent(newContent);
      addSnapshot(newContent);
    },
    [setCurrentContent, addSnapshot]
  );

  return (
    <div className="relative min-h-screen">
      <RetroGrid className="absolute inset-0 w-full h-full" />
      <div className="flex flex-col items-center justify-center min-h-screen p-4 relative z-10">
        <div className="w-full max-w-3xl space-y-6">
          <h1 className="text-center">
            <span className="pointer-events-none z-10 whitespace-pre-wrap bg-gradient-to-b from-[#ffd319] via-[#ff2975] to-[#8c1eff] bg-clip-text text-center text-7xl font-bold leading-none tracking-tighter text-transparent">
              Time Travel Editor
            </span>
          </h1>
          <Editor content={currentContent} setContent={handleContentChange} />
          <Timeline />
          <Playback />
        </div>
      </div>
    </div>
  );
}
