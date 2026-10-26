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

### Deployment and development record

- Live HTTPS prototype: https://tristantenggh2.github.io/Project-4-Holloweenie/
- Deployment: GitHub Pages, `main` branch, repository root. On October 19, GitHub reported build success for `d4cfae9`; the live HTML, background, and ticket image returned HTTP 200. This is delivery evidence, not proof of mobile usability.
- [Actual commit history](https://github.com/TristanTengGH2/Project-4-Holloweenie/commits/main/) and [snapshot with local inspection command](GIT_LOG.md).
- [Credits and licensing gaps](CREDITS.md).

### Testing evidence and limits

| Evidence | Result | Limitation |
| --- | --- | --- |
| October 19 browser screenshots requested at 390 × 844 and 320 × 700 | Images loaded and hotspot positions were inspected. | Screenshots also showed clipped UI; viewport sizing and Pause visibility need a fresh check. These were desktop captures, not physical-phone tests. |
| Developer feedback on the trigger | Described it as functionally acceptable; reported broad halos and an unclear small-object clue. | No recorded device, browser, task completion time, or unassisted peer test. |
| Story payoff screenshot | Generated ticket and dialogue rendered. | The story state was manually staged for the screenshot; this did not test the complete sequence, replay, or pause timing. |
| JavaScriptCore parse attempt | Script reached a missing-browser-`document` error. | This is not a passing browser runtime or interaction test. |
| Automated tap testing attempt | Could not complete with the available setup. | Do not mark touch, keyboard, replay, or timer acceptance checks passed. |

### Next verification priorities

1. Open the live URL on a physical phone; record device/browser, fit without scrolling, readable controls, and reliable target taps. Check Pause remains fully visible.
2. Complete the booth sequence, make a wrong tap after one correct step, replay, and pause during each story beat. Verify that resume preserves remaining timing and no interaction advances while paused.
3. Verify hint escalation at 6, 12, and 20 seconds and reduced-motion behavior. Record observed results, not just intended behavior.
4. Run an unassisted peer playtest. Record anonymized observations, separate interpretation, then select revisions.
5. Resolve Phase 1 gaps: at least three visible ambient effects, verified public-domain/CC0 audio sources, accessible credits, and a complete requirement check. Existing CSS effects behind opaque scene art do not establish visible ambience.

### Deferred refinements and remaining Phase 2 work

Originally deferred: tighter halos and the unclear counter-pumpkin clue. These were revisited in the interaction revision below. Remaining: carousel and fortune-wagon stories, final castle response, final audio, full credits verification, and debrief. No peer playtesting or physical-phone pass has yet been documented.

### Interaction revision — October 26, 2026

Final pumpkin reaction: the last correct tap changes the green face to orange-gold, flares gently for 1.2 seconds, illuminates the booth window, and launches the existing ticket sequence. Its warm face/window state persists after completion and resets on Replay. Reviewed a phone-sized screenshot of the awakening.

Latest verification supersedes the earlier reduced-motion uncertainty: the normal touch suite passed sequence/progress, all decoys, lights-on, ghost pause/resume and arrival, orange pumpkin state, story pause/resume, completion, replay reset, hint timing, and target sizing at 390 × 844 and 320 × 700. Its virtual-time/reload portion failed before loading the reduced-motion page. A separate fresh Chrome session with reduced motion and real-time waits then passed: steady lantern, static visible ghost, green pumpkin arrival, steady orange face/window, story pause/resume, completion, and full Replay reset. No physical-phone or peer playtest is claimed. These approved interaction updates are being published together to GitHub Pages.

Crystal-ball payoff and decoys: the Developer approved a large friendly green ghost crossing from the wagon into the pumpkin, with the ball's own pulse replacing its halo. Added a 4.1-second reaction with pause-aware timers and a temporary interaction lock; the pumpkin stays green afterward as the final clue. Added staggered object glints and distinct horse, bell, and moon decoy reactions. The effects are original inline SVG/CSS layered above the aligned artwork, not newly generated bitmap assets. Discovery halos are suppressed for touch/pointer use; keyboard focus remains. Reduced-motion presentation uses stationary illuminated objects and a static ghost instead of flight.

Verification: headless Chrome touch checks confirmed all three decoys preserve progress, no touch halo appears on the crystal ball, ghost playback locks targets, ghost position/timers freeze on pause, the pumpkin lights green on arrival, and replay clears spirit/power state. Existing story completion/replay, hint timing, and 44-pixel targets at 390 × 844 and 320 × 700 also passed. Visually reviewed ghost, horse, and pumpkin screenshots. Moved hints to the bottom after finding the top panel obscured the hanging bell. An initial exact animation-position check failed; sampling after the browser settled passed on the second run. That run then failed the reduced-motion ghost assertion in the virtual-time harness; static-ghost presentation remains unverified, and no further test variations were attempted. No physical-phone verification is claimed.

Lantern reveal: the Developer approved a lights-off opening with only the booth lantern flickering; its first correct tap now enables the entire existing lighting overlay. A masked duplicate of the aligned lighting image isolates the beacon without regenerating art. Added an explicit Replay control that resets progress and power, leaving the lantern as the opening clue again. The lights stay on after completion. Browser touch checks passed for off/on state, story completion, replay reset, pause/resume, decoys, and phone target sizing; screenshots of the two lighting states were reviewed. This remains a local change pending publication.

Follow-up visual refinement: the Developer found the horse trace poorly fitted and highlights too thin. Moved the horse region onto the foreground white horse and replaced its angular trace with a curved silhouette. Highlight paths now use non-scaling strokes (2 CSS pixels normally, 3 for correct taps and strong hints) with a broader glow. Reviewed a magnified Chrome mobile screenshot of the horse feedback; `git diff --check` passed. These remain approximate hand-traced outlines, pending Developer visual review.

The Developer requested obvious pause feedback, closer outlines, useful hints, a visible second target, and tappable decoys. Approved replacement sequence: booth lantern → green crystal ball on the right → pumpkin face.

Implemented a grey pause screen and Resume control; shaped SVG strokes for target emphasis; escalating object/location hints; and purple feedback for the carousel horse, bell, and crescent sign. The phone frame now preserves the full artwork aspect ratio to keep the crystal ball visible. The obscured counter-pumpkin target is retired.

Verified with headless Chrome using emulated mobile viewports and dispatched touch events: correct sequence advances; horse decoy preserves progress; pause shows its overlay and disables all six targets; pausing before the first story beat freezes remaining story timers; resuming completes the story; replay restarts from the lantern. Chrome virtual time verified the 20-second crystal-ball outline and explicit hint. At 390 × 844 and 320 × 700 all six targets measured at least 44 × 44 CSS pixels, remained on screen, and the Pause control was fully visible. Screenshots of pause and hints were visually reviewed. This supersedes the earlier failed browser-automation attempt, but is not physical-phone or peer-test evidence.

Record non-identifying playtest observations, separating what Users did or said from your interpretation. Use the findings to choose revision priorities and record what changed and how you verified the improvement.

Keep implementation progress and verification here. Update `research.md` when evidence changes a decision and `spec.md` when intended behavior changes; link to those updates rather than duplicating them. Record consequential changes, not every small adjustment.

## Saving transcripts

When directed, save the complete conversation as `transcripts/plan-YYYY-MM-DD_HHMMSS.md` or `transcripts/build-YYYY-MM-DD_HHMMSS.md`, label messages `Developer` and `Agent`, and confirm the path.
