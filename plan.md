# Time Travel Editor — Core Plan

## Goal
A local-first web app that tracks and visualizes text changes over time. Users can scrub through a visual timeline to restore any previous state with a video-like playback below the editor.

## Stack
- React + TypeScript
- Zustand (for state management)
- Tailwind CSS (shadcn/ui for styling)
- No backend, all data stored in memory or localStorage
- TypeScript. No 'any' types. Name variables well, use abstractions to ensure maintainability.
- Optional: `diff-match-patch` for visual diffs (will do this later)

## Components

### 1. Editor
- `<textarea>` bound to a `content` state
- On every change or interval, snapshot the current text

### 2. Snapshot Manager
- Stores array of snapshots:
```ts
type Snapshot = { content: string; timestamp: number };
```
- Snapshots stored in-memory or `localStorage`
- Max: 50–100 snapshots (oldest trimmed)

### 3. Timeline UI
- Horizontal scrollable bar
- Each snapshot = clickable dot (or block)
- Hover: show timestamp
- Click: load snapshot into editor
- Highlight current state

### 4. Playback Controls
- Play/Pause button = autoplay snapshots
- Optional: scrubber for drag navigation
- Optional: "Fork" to create new branch from old snapshot (future versioning)

## Optional Features
- Diff viewer using `diff-match-patch`
- Save/export timeline to JSON
- Import existing timeline
- Snapshot tagging or annotations

## UX Goals
- Instant, local, no login
- Smooth timeline interaction
- Minimalist, dark mode-friendly
- Fast keyboard interaction (e.g. arrow keys to jump)

## Out of Scope (for now)
- Collaborative editing
- File types beyond plaintext
- Auth or cloud sync
