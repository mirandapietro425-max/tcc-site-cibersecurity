# CyberShield — V70 base + Hexad UX Review Release

This build keeps the uploaded V70 corrected site as the base and adds the current Hexad cinematic experience.

## Entry
- `index.html`: main CyberShield site
- `hexad.html`: dedicated Hexad experience, intended to open in a new tab

## UX fixes
- Added a prominent `HEXAD ↗` top navigation entry with `target="_blank"` and `rel="noopener noreferrer"`.
- Added an in-hero Hexad portal CTA, also opening a new tab.
- Replaced the stale `hexad.html` with the current cinematic V72 experience.
- Added the eight final Portuguese-BR narration files with deterministic names expected by the runtime.
- Verified local HTML asset references in the base package.
- Preserved the existing corrected V70 pages instead of replacing them wholesale.

## Experience
Hexad flow:
film → six-force exploration → incident investigation → simulation → restoration → synthesis.

## Research direction
The review benchmarked current immersive work such as CSSDA's Event Horizon, The Spark, GQ & AP The Extraordinary Lab, La Revoltosa, Studio K95, ZERO, and other WebGL storytelling references. The implementation prioritizes narrative clarity, direct manipulation, visible orientation, progressive loading, reduced-motion support, and keeping interaction meaningful to the story.
