"use client";

import Editor from "@/components/Editor";
import SnapshotSlider from "@/components/SnapshotSlider";
import Timeline from "@/components/Timeline";
import { useTimeTravelStore } from "@/lib/store";
import { useCallback, useEffect, useRef } from "react";

const IS_DEV = true;

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
    stopPlayback,
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
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Time Travel Editor</h1>
      <Editor content={currentContent} setContent={handleContentChange} />
      <Timeline />
      <SnapshotSlider />
    </div>
  );
}
