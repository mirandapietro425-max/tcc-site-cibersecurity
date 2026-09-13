# CyberShield V56 — Desktop no-hover / always-on motion audit

## Objective
Ensure visual motion exists without requiring hover, touch, pointer movement, or an initial click.

## Changes
- Home visual entry no longer depends on boot interaction; V56 auto-releases the visual experience and triggers the existing module start handler once available.
- Removed `site-v54-interactions.js` from the six main pages to avoid duplicate audio/interaction ownership.
- Added `responsive-v56-final.css` with page-specific always-on motion for Radar, Playbook, Laboratório, Privacidade and Cadeia.
- Added `experience-v56-always-on.js` as a lightweight visual runtime and bfcache recovery path.
- Desktop cursor remains optional enhancement only.
- Mobile keeps automatic motion and touch-safe layouts.
- Reduced-motion remains respected.
