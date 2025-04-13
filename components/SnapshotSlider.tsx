"use client";

import { useTimeTravelStore } from "@/lib/store";
import { Pause, Play } from "lucide-react";
import type React from "react";

export default function SnapshotSlider() {
  const snapshots = useTimeTravelStore((state) => state.snapshots);
  const currentSnapshotIndex = useTimeTravelStore(
    (state) => state.currentSnapshotIndex
  );
  const loadSnapshot = useTimeTravelStore((state) => state.loadSnapshot);
  const isPlaying = useTimeTravelStore((state) => state.isPlaying);
  const togglePlayPause = useTimeTravelStore((state) => state.togglePlayPause);
  const playbackInterval = useTimeTravelStore(
    (state) => state.playbackInterval
  );
  const setPlaybackInterval = useTimeTravelStore(
    (state) => state.setPlaybackInterval
  );

  const totalSnapshots = snapshots.length;

  const handleSliderChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const sliderValue = Number.parseInt(event.target.value, 10);
    const snapshotIndex = totalSnapshots - 1 - sliderValue;
    if (
      !Number.isNaN(snapshotIndex) &&
      snapshotIndex >= 0 &&
      snapshotIndex < totalSnapshots
    ) {
      loadSnapshot(snapshotIndex);
    }
  };

  const handleSpeedChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newInterval = Number.parseInt(event.target.value, 10);
    if (!Number.isNaN(newInterval)) {
      setPlaybackInterval(newInterval);
    }
  };

  const sliderValue =
    currentSnapshotIndex !== null && totalSnapshots > 0
      ? totalSnapshots - 1 - currentSnapshotIndex
      : 0;

  const isDisabled = totalSnapshots < 2;

  return (
    <div className="mt-4 p-4 border rounded-md bg-gray-50 space-y-3">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Playback</h2>
        <div className="flex items-center space-x-2">
          <button
            onClick={togglePlayPause}
            disabled={isDisabled}
            className={`p-1.5 rounded hover:bg-gray-200 transition-colors ${
              isDisabled ? "opacity-50 cursor-not-allowed" : ""
            }`}
            title={
              isDisabled
                ? "Need at least 2 snapshots"
                : isPlaying
                ? "Pause"
                : "Play"
            }
            type="button"
          >
            {isPlaying ? <Pause size={16} /> : <Play size={16} />}
          </button>
          <select
            value={playbackInterval}
            onChange={handleSpeedChange}
            disabled={isDisabled}
            className={`text-xs p-1 border rounded bg-white dark:bg-gray-800 dark:border-gray-600 ${
              isDisabled ? "opacity-50 cursor-not-allowed" : ""
            }`}
            title={isDisabled ? "Need at least 2 snapshots" : "Playback Speed"}
          >
            <option value={100}>1x</option>
            <option value={50}>2x</option>
            <option value={25}>4x</option>
            <option value={10}>10x</option>
          </select>
        </div>
      </div>

      <input
        id="snapshot-slider"
        type="range"
        min="0"
        max={Math.max(0, totalSnapshots - 1)}
        value={sliderValue}
        onChange={handleSliderChange}
        disabled={isDisabled}
        className={`w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700 ${
          isDisabled ? "opacity-50 cursor-not-allowed" : ""
        }`}
        title={
          isDisabled
            ? "Need at least 2 snapshots to scrub"
            : "Scrub through snapshots"
        }
      />

      <div className="text-xs text-gray-500 text-right">
        Snapshot{" "}
        {currentSnapshotIndex !== null ? currentSnapshotIndex + 1 : "-"} /{" "}
        {totalSnapshots}
        {" ("}
        {currentSnapshotIndex !== null && snapshots[currentSnapshotIndex]
          ? new Date(
              snapshots[currentSnapshotIndex].timestamp
            ).toLocaleTimeString()
          : "--:--:--"}
        {")"}
      </div>
    </div>
  );
}
