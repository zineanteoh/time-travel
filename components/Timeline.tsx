"use client";

import { useTimeTravelStore } from "@/lib/store";
import { Trash2, X, Play, Pause } from "lucide-react";

export default function Timeline() {
  const { loadSnapshot, clearAllSnapshots, togglePlayPause, isPlaying } =
    useTimeTravelStore();
  const snapshots = useTimeTravelStore((state) => state.snapshots);
  const currentSnapshotIndex = useTimeTravelStore(
    (state) => state.currentSnapshotIndex
  );

  const handleSnapshotClick = (index: number) => {
    loadSnapshot(index);
  };

  const handleClearAllClick = () => {
    if (
      window.confirm(
        "Are you sure you want to delete all snapshots? This cannot be undone."
      )
    ) {
      clearAllSnapshots();
    }
  };

  // Timestamps are sorted newest to oldest in the snapshots array
  const earliestTimestamp = snapshots[snapshots.length - 1]?.timestamp;
  const latestTimestamp = snapshots[0]?.timestamp;
  const timeRange = Math.max(
    1,
    (latestTimestamp ?? 0) - (earliestTimestamp ?? 0)
  ); // Avoid division by zero or negative range

  const getSnapshotPosition = (index: number): number => {
    const snapshot = snapshots[index];
    if (!snapshot || earliestTimestamp === undefined) return 0; // Handle edge case where earliestTimestamp is not defined
    const timestamp = snapshot.timestamp;
    // Calculate position relative to the earliest timestamp
    return ((timestamp - earliestTimestamp) / timeRange) * 100;
  };

  const currentPosition =
    currentSnapshotIndex !== null
      ? getSnapshotPosition(currentSnapshotIndex)
      : null;

  return (
    <div className="p-4 border rounded-md bg-gray-50 flex flex-col items-start space-y-3">
      <div className="flex justify-between items-center w-full">
        <div className="flex items-center space-x-2">
          <h2 className="text-lg font-semibold">Timeline</h2>
          {snapshots.length > 1 && ( // Only show play button if there's something to play
            <button
              onClick={togglePlayPause}
              className="p-1.5 rounded hover:bg-gray-200 transition-colors"
              title={isPlaying ? "Pause" : "Play"}
              type="button"
            >
              {isPlaying ? <Pause size={16} /> : <Play size={16} />}
            </button>
          )}
        </div>
        {snapshots.length > 0 && (
          <button
            onClick={handleClearAllClick}
            className="p-1.5 rounded hover:bg-red-100 text-red-500 transition-colors"
            title="Clear all snapshots"
            type="button"
          >
            <Trash2 size={16} />
          </button>
        )}
      </div>

      {snapshots.length > 0 ? (
        <div className="relative w-full h-4 bg-gray-200 rounded-full mt-2 mb-2 group">
          {/* Snapshot dots */}
          {snapshots.map((snapshot, index) => {
            const position = getSnapshotPosition(index);
            return (
              <button
                key={snapshot.timestamp}
                onMouseEnter={() => handleSnapshotClick(index)}
                className="absolute top-1/2 w-2.5 h-2.5 bg-gray-400 rounded-full transform -translate-y-1/2 -translate-x-1/2 hover:bg-blue-500 transition-colors cursor-pointer z-10"
                style={{ left: `${position}%` }}
                title={`Snapshot ${index + 1} (${new Date(
                  snapshot.timestamp
                ).toLocaleTimeString()})`}
                type="button"
              />
            );
          })}

          {/* Current position indicator */}
          {currentPosition !== null && (
            <div
              className="absolute top-1/2 w-3 h-3 bg-blue-600 border-2 border-white rounded-full transform -translate-y-1/2 -translate-x-1/2 pointer-events-none z-20 shadow"
              style={{ left: `${currentPosition}%` }}
              title={`Current: Snapshot ${currentSnapshotIndex + 1}`}
            />
          )}
        </div>
      ) : (
        <p className="text-sm text-gray-500">No snapshots yet.</p>
      )}
    </div>
  );
}
