# Technical Specification

> EDITING DIRECTIVE: DEVELOPER AND AGENT EDIT THIS FILE COLLABORATIVELY. THE DEVELOPER MUST REVIEW AND APPROVE ITS CONTENT.

Purpose: Keep a concise, testable description of the experience currently being built.

## Working agreement

Developer: Begin with the running prototype, approve the intended behavior, test it directly, and update this file when the intended result changes.

Agent: Read `AGENTS.md`, `brief.md`, `research.md`, and this file, then inspect the project. Turn decisions into acceptance checks without inventing product choices or freezing details that still require testing.

Start a fresh chat with:

`Read the project documents, inspect the running prototype, and help me specify the next useful build checkpoint.`

## Current build contract

### Experience direction

The scene is **The Moonlit Midway**, an abandoned Halloween theme park that wakes for one night each year. A playful spirit called the Night Attendant invites the visitor to restart three sleeping attractions. Each completed story awards a glowing ticket stamp; completing all three will briefly illuminate the distant castle.

The approved stories are:

1. **The Last Ticket:** booth lantern → counter pumpkin → large pumpkin face. The booth wakes and offers a glowing moon-stamped ticket. Dialogue: “One moonlit ticket—for our bravest guest.”
2. **The Riderless Carousel:** hanging bell → carousel light → white horse. The carousel starts and a friendly translucent rider briefly appears. Dialogue: “Every ride remembers its favorite rider.”
3. **The Fortune After Midnight:** crescent-moon sign → wagon lantern → crystal ball. A spectral park map points toward the castle. Dialogue: “Three lights awaken what the moon left sleeping.”

Each finished story will follow the duration, replay, audiovisual, scene-locking, and accessibility requirements in `brief.md`.

### Current checkpoint: interaction and emphasis

Build and test the reusable discovery system with **The Last Ticket** only:

- Place touch and keyboard-accessible hotspots over the booth lantern, counter pumpkin, and pumpkin face.
- Every interaction gives immediate audiovisual feedback. A correct step produces a brief gold outline, a distinct sound, a small particle response, and one illuminated segment in a three-part progress indicator.
- An incorrect interaction produces a soft purple ripple and does not erase correct progress.
- With no input, the next clue receives a faint shimmer after 6 seconds, a poetic text hint after 12 seconds, and a brief subtle outline after 20 seconds.
- Emphasis may dim the surrounding scene, but the next object must remain readable and the hint must not directly reveal the answer.
- Progress, hint timers, feedback, and interaction must all stop while paused.
- While a story sequence plays, all unrelated scene interaction is disabled. The scene clearly returns to exploration afterward.

Acceptance checks:

- The three targets remain aligned with the artwork across supported phone viewport sizes.
- Each target works with touch, pointer, Enter, and Space and has an accurate accessible name.
- Correct, incorrect, and next-clue states are visually distinct without relying on color alone.
- The complete trigger can be discovered without instructions and can be repeated without reloading.
- Reduced-motion mode replaces pulsing and particle movement with restrained static emphasis.

After the third correct tap, **The Last Ticket** plays as an approximately 8.2-second sequence: the booth awakens, a glowing moon-ticket rises, the Night Attendant delivers the approved line, and the ticket dissolves into golden sparks. All interaction is locked during the sequence. Pause freezes its animation, audio, and remaining timeline; resume continues from the same beat. The experience then returns to exploration with replay instructions.

## Scope and revisions

This checkpoint does not yet implement the other two trigger sequences, the final castle illumination, or final sourced audio assets. The next behavior that must be Developer-verified is the complete discovery, story, pause/resume, and replay loop for The Last Ticket.

The current artwork is treated as one aligned composition. Interaction emphasis will use positioned HTML/CSS or SVG overlays so it does not depend on regenerating the scene art.

## Saving the transcript

When directed, save the complete conversation as `transcripts/spec-YYYY-MM-DD_HHMMSS.md`, label messages `Developer` and `Agent`, and confirm the path.
