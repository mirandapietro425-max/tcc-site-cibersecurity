# CyberShield HEXAD V87 — Continuous Film + Dimensional Fixes

## Principal changes
- 8 narrations preserved intact; no cuts.
- Added `assets/hexad/audio/narration/narration-master.mp3`, a single continuous master assembled from the 8 original files, eliminating inter-file playback gaps.
- Film audio is now driven by one continuous master track and the same `376.659s` master timeline.
- Storyboard frames remain the primary visual narrative and are pre-warmed ahead of each cue; frame activation waits for the next image to be ready, preventing blank pauses.
- Mobile/tablet portrait now uses a dedicated vertical cinematic layout instead of the desktop 1800vh model.
- Mobile storyboard window is sized explicitly for 16:9 artwork rather than allowing the 16:9 frame to collapse inside the full portrait viewport.
- 3D remains contextual/secondary and does not gate first paint.
