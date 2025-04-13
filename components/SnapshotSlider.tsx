"use client";

import { useTimeTravelStore } from "@/lib/store";
import type React from "react"; // Import React

export default function SnapshotSlider() {
  const snapshots = useTimeTravelStore((state) => state.snapshots);
  const currentSnapshotIndex = useTimeTravelStore(
    (state) => state.currentSnapshotIndex
  );
  const loadSnapshot = useTimeTravelStore((state) => state.loadSnapshot);

  const totalSnapshots = snapshots.length;

  // Handle slider changes
  const handleSliderChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const sliderValue = Number.parseInt(event.target.value, 10);
    // Map slider value (0=oldest, max=newest) to snapshot index (0=newest, max=oldest)
    const snapshotIndex = totalSnapshots - 1 - sliderValue;
    if (
      !Number.isNaN(snapshotIndex) &&
      snapshotIndex >= 0 &&
      snapshotIndex < totalSnapshots
    ) {
      loadSnapshot(snapshotIndex);
    }
  };

  // Calculate the current slider value based on the current snapshot index
  // Slider value: 0 corresponds to the oldest, max corresponds to the newest
  const sliderValue =
    currentSnapshotIndex !== null && totalSnapshots > 0
      ? totalSnapshots - 1 - currentSnapshotIndex
      : 0;

  // Disable slider if there are less than 2 snapshots
  const isDisabled = totalSnapshots < 2;

  return (
    <div className="mt-4 p-4 border rounded-md bg-gray-50">
      <label
        htmlFor="snapshot-slider"
        className="block text-sm font-medium text-gray-700 mb-1"
      >
        Scrub History
      </label>
      <input
        id="snapshot-slider"
        type="range"
        min="0"
        max={Math.max(0, totalSnapshots - 1)} // Ensure max is at least 0
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
      {/* Optional: Display current position/total */}
      {!isDisabled && totalSnapshots > 0 && (
        <div className="text-xs text-gray-500 mt-1 text-right">
          {/* Displaying 1-based index for user-friendliness */}
          Snapshot{" "}
          {currentSnapshotIndex !== null
            ? currentSnapshotIndex + 1
            : "-"} / {totalSnapshots}
          {" ("}
          {currentSnapshotIndex !== null && snapshots[currentSnapshotIndex]
            ? new Date(
                snapshots[currentSnapshotIndex].timestamp
              ).toLocaleTimeString()
            : "--:--:--"}
          {")"}
        </div>
      )}
    </div>
  );
}
