import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export type Snapshot = {
	content: string;
	timestamp: number;
};

interface TimeTravelState {
	snapshots: Snapshot[];
	addSnapshot: (content: string) => void;
	loadSnapshot: (index: number) => string;
	deleteSnapshot: (index: number) => void;
	clearAllSnapshots: () => void;
	currentContent: string;
	setCurrentContent: (content: string) => void;
	currentSnapshotIndex: number | null;

	isPlaying: boolean;
	playbackIndex: number | null;
	playbackInterval: number;

	togglePlayPause: () => void;
	setPlaybackIndex: (index: number | null) => void;
	stepPlayback: () => void;
	stopPlayback: () => void;
	setPlaybackInterval: (interval: number) => void;
}

export const useTimeTravelStore = create<TimeTravelState>()(
	persist(
		(set, get) => ({
			snapshots: [],
			currentContent: "",
			currentSnapshotIndex: null,
			isPlaying: false,
			playbackIndex: null,
			playbackInterval: 100,

			addSnapshot: (content) => {
				const now = Date.now();
				const newSnapshot: Snapshot = { content, timestamp: now };
				const currentSnapshots = get().snapshots;

				const updatedSnapshots = [newSnapshot, ...currentSnapshots];

				set({
					snapshots: updatedSnapshots,
					currentContent: content,
					currentSnapshotIndex: 0,
				});
				get().stopPlayback();
			},

			loadSnapshot: (index) => {
				const snapshots = get().snapshots;
				if (index >= 0 && index < snapshots.length) {
					const loadedContent = snapshots[index].content;
					set({ currentContent: loadedContent, currentSnapshotIndex: index });
					get().stopPlayback();
					return loadedContent;
				}

				return get().currentContent;
			},

			deleteSnapshot: (indexToDelete) => {
				const currentSnapshots = get().snapshots;
				const currentSnapshotIndex = get().currentSnapshotIndex;
				if (indexToDelete >= 0 && indexToDelete < currentSnapshots.length) {
					const updatedSnapshots = currentSnapshots.filter(
						(_, index) => index !== indexToDelete,
					);

					let nextSnapshotIndex = currentSnapshotIndex;
					if (currentSnapshotIndex !== null) {
						if (indexToDelete === currentSnapshotIndex) {
							nextSnapshotIndex = null;
						} else if (indexToDelete < currentSnapshotIndex) {
							nextSnapshotIndex = currentSnapshotIndex - 1;
						}
					}

					set({
						snapshots: updatedSnapshots,
						currentSnapshotIndex: nextSnapshotIndex,
					});
					get().stopPlayback();
				}
			},

			clearAllSnapshots: () => {
				set({ snapshots: [], currentContent: "", currentSnapshotIndex: null });
				get().stopPlayback();
			},

			togglePlayPause: () => {
				set((state) => {
					const currentlyPlaying = !state.isPlaying;
					let startIndex: number | null;

					if (
						currentlyPlaying &&
						state.currentSnapshotIndex === 0 &&
						state.snapshots.length > 1
					) {
						startIndex = state.snapshots.length - 1;
					} else {
						startIndex =
							state.playbackIndex ??
							state.currentSnapshotIndex ??
							(state.snapshots.length > 0 ? state.snapshots.length - 1 : null);
					}

					if (
						currentlyPlaying &&
						startIndex !== null &&
						state.snapshots.length > 0 &&
						startIndex < state.snapshots.length
					) {
						const startContent =
							state.snapshots[startIndex]?.content ?? state.currentContent;
						return {
							isPlaying: true,
							playbackIndex: startIndex,
							currentSnapshotIndex: startIndex,
							currentContent: startContent,
						};
					}
					return { isPlaying: false };
				});
			},

			setPlaybackIndex: (index) => {
				set({ playbackIndex: index });
			},

			stepPlayback: () => {
				set((state) => {
					if (!state.isPlaying || state.snapshots.length === 0) {
						return { isPlaying: false, playbackIndex: null };
					}

					const currentIndex =
						state.playbackIndex ??
						state.currentSnapshotIndex ??
						state.snapshots.length - 1;
					const nextIndex = currentIndex - 1;

					if (nextIndex >= 0 && nextIndex < state.snapshots.length) {
						const nextContent = state.snapshots[nextIndex].content;
						return {
							playbackIndex: nextIndex,
							currentContent: nextContent,
							currentSnapshotIndex: nextIndex,
						};
					}
					const finalIndex = 0;
					const finalContent = state.snapshots[finalIndex]?.content ?? "";
					return {
						isPlaying: false,
						playbackIndex: finalIndex,
						currentSnapshotIndex: finalIndex,
						currentContent: finalContent,
					};
				});
			},

			stopPlayback: () => {
				set((state) => ({
					isPlaying: false,
					playbackIndex: null,
					currentSnapshotIndex:
						state.playbackIndex ?? state.currentSnapshotIndex,
				}));
			},

			setPlaybackInterval: (interval) => {
				set({ playbackInterval: interval });
			},

			setCurrentContent: (content) => {
				get().stopPlayback();
				set({ currentContent: content, currentSnapshotIndex: null });
			},
		}),
		{
			name: "time-travel-storage",
			storage: createJSONStorage(() => localStorage),
			partialize: (state) => ({
				snapshots: state.snapshots,
				currentContent: state.currentContent,
			}),
		},
	),
);
