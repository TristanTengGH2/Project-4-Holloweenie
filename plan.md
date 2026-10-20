# Implementation Plan

> EDITING DIRECTIVE: DEVELOPER AND AGENT EDIT THIS FILE COLLABORATIVELY. THE DEVELOPER MUST REVIEW AND APPROVE ITS CONTENT.

Purpose: Track the next useful build checkpoints, verification, and consequential revisions.

## Working agreement

Developer: Keep the browser preview running, choose priorities, test results directly, and plan only the next few checkpoints.

Agent: Read the project documents and inspect the files. Keep each checkpoint small enough to run and judge. Do not expand scope or mark Developer verification complete.

Start or continue a fresh chat with:

`Read the project documents, inspect the current build, and help me complete the next unchecked checkpoint.`

## Checkpoints

Main risk: the visual targets are embedded in a detailed image, so hotspots and outlines can drift when the phone viewport changes. Use percentage-based regions tied to the shared 941 × 1672 artwork coordinate system and verify them at multiple viewport sizes.

- [x] **Map the three booth targets.** Added semantic, keyboard-accessible hotspot elements for the booth lantern, counter pumpkin, and pumpkin face. Verified their shared artwork-relative alignment in 390 × 844 and 320 × 700 renders.
- [x] **Build shared emphasis feedback.** Added correct and incorrect tap states plus a three-segment ticket-stamp indicator. The Developer approved the functional feedback; tighter object-shaped halos remain deferred polish.
- [ ] **Add progressive hints.** Implemented the approved 6-, 12-, and 20-second escalation with pause-aware timers. Developer verification of pause timing remains.
- [ ] **Connect The Last Ticket trigger and story.** Implemented the approved object order, preserved progress after incorrect taps, and added an 8.2-second locked audiovisual ticket sequence with completion dialogue and replay. Developer verification of touch, pause/resume, replay, and reduced-motion behavior remains.
- [ ] **Developer review.** Test the complete sequence directly at phone size and approve its discoverability, timing, and return to exploration.

Do not begin the carousel or fortune-wagon triggers until the shared interaction pattern has passed Developer review.

## Evidence and revisions

Record non-identifying playtest observations, separating what Users did or said from your interpretation. Use the findings to choose revision priorities and record what changed and how you verified the improvement.

Keep implementation progress and verification here. Update `research.md` when evidence changes a decision and `spec.md` when intended behavior changes; link to those updates rather than duplicating them. Record consequential changes, not every small adjustment.

## Saving transcripts

When directed, save the complete conversation as `transcripts/plan-YYYY-MM-DD_HHMMSS.md` or `transcripts/build-YYYY-MM-DD_HHMMSS.md`, label messages `Developer` and `Agent`, and confirm the path.
