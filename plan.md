# Implementation Plan

> EDITING DIRECTIVE: DEVELOPER AND AGENT EDIT THIS FILE COLLABORATIVELY. THE DEVELOPER MUST REVIEW AND APPROVE ITS CONTENT.

Purpose: Track the next useful build checkpoints, verification, and consequential revisions.

## Working agreement

Developer: Keep the browser preview running, choose priorities, test results directly, and plan only the next few checkpoints.

Agent: Read the project documents and inspect the files. Keep each checkpoint small enough to run and judge. Do not expand scope or mark Developer verification complete.

Start or continue a fresh chat with:

`Read the project documents, inspect the current build, and help me complete the next unchecked checkpoint.`

## Current requirement checklist

This supersedes the older checkpoint/status notes below. Reviewed October 26, 2026 against `brief.md`; implemented is not the same as independently verified or published.

| Requirement | Current evidence/status | Remaining action |
| --- | --- | --- |
| One vertical scene, focal point, at least three features | Implemented: pumpkin booth, carousel, fortune wagon, castle; browser fit checks at multiple phone sizes. | Final phone check after publishing the newest changes. |
| Three visible ambient effects | Fog drift, SVG bats, powered-light shimmer; normal/reduced-motion browser tests and screenshots reviewed. | Developer review of the revised, stronger fog drift. |
| Looping ambience and sourced story audio | Three publisher-declared CC0 assets and an NPS public-domain owl recording credited; decode, pause and fallback checks passed. Developer approved the replacement owl after hearing the supplied preview. | Publish local audio changes. |
| Three distinct 5–10s replayable audiovisual stories | Full normal journey passed after hint changes; story durations 8.2, 8.2, 8.7 seconds, with dialogue, progress and replay. Earlier reduced-motion journey also passed. | Retest latest revision on phone. |
| Ordered triggers, feedback, progressive hints | Opening glow retained; eight neutral glints after power; requested text then glow; timed text remains. Focused tests passed the booth help flow in normal/reduced motion before a carousel text assertion stopped both runs. | Correct the test's expected progress-prefixed text and finish requested-hint regression/layout checks before declaring full verification. |
| Start/Enter and reduced motion | Existing start and static reduced-motion ambience checked. Developer confirms Tab/Enter. Native keyboard checks now cover arrow entry without Tab, spatial movement, Hint, Pause, first-story completion and replay. | Final updated-build review. |
| One shared Pause for motion, audio, effects, timers and input | Audio context, CSS/pseudo-elements, story/hint timers, target/Hint locks checked. Owl now uses one pause-aware ambience timer; remaining countdown and audio time freeze/resume in dedicated browser checks. | Final physical-phone review; the previously identified owl timer gap is resolved. |
| Touch/keyboard usability, readable controls | Eight 44px scene targets, corrected wagon spacing, native buttons and focus outlines. Requested Hint UI reviewed at 390px. Directional keyboard tests passed at three phone sizes; native Tab, Enter/Space, Hint/Pause and first-story replay passed. | Complete the separate narrow-screen Hint-button size/layout assertions; do not claim a complete contrast audit. |
| Public HTTPS and physical smartphone | Earlier journey deployed at https://tristantenggh2.github.io/Project-4-Holloweenie/ and reported working on iPhone. | Commit/push local revisions and verify the updated deployment. |
| Peer testing and consequential revision | One peer, Developer's base-model iPhone 14; reported functional, too-easy highlighting, noticeably AI-generated art. Requested hints address discoverability; art retained by choice. | Optional peer retest of revised hints; browser version, exact test date, and unassisted observation details were not supplied. No extra testers or observations are invented. |
| Credits, sources and permitted assets | `CREDITS.md` lists code/AI assistance, visual provenance and verified publisher CC0 audio terms. | Confirm preferred Developer display name, missing scene-generation/reference-rights details, and course-template attribution requirements. |
| Project documents and Git log | README/research/spec/plan updated; Git snapshot refreshed through local commit `cca2f5c`. | Commit final changes and refresh publication status after push. |
| Course debrief | Course-provided `debrief.md` is absent from the repository. | Developer must supply its template/instructions and personal reflections; do not invent a completed debrief. |

## Historical checkpoints

Main risk: the visual targets are embedded in a detailed image, so hotspots and outlines can drift when the phone viewport changes. Use percentage-based regions tied to the shared 941 × 1672 artwork coordinate system and verify them at multiple viewport sizes.

- [x] **Map the three booth targets.** Added semantic, keyboard-accessible hotspot elements for the booth lantern, counter pumpkin, and pumpkin face. Verified their shared artwork-relative alignment in 390 × 844 and 320 × 700 renders.
- [x] **Build shared emphasis feedback.** Added correct and incorrect tap states plus a three-segment ticket-stamp indicator. The Developer approved the functional feedback; tighter object-shaped halos remain deferred polish.
- [ ] **Add progressive hints.** Implemented the approved 6-, 12-, and 20-second escalation with pause-aware timers. Developer verification of pause timing remains.
- [ ] **Connect The Last Ticket trigger and story.** Implemented the approved object order, preserved progress after incorrect taps, and added an 8.2-second locked audiovisual ticket sequence with completion dialogue and replay. Developer verification of touch, pause/resume, replay, and reduced-motion behavior remains.
- [ ] **Developer review.** Test the complete sequence directly at phone size and approve its discoverability, timing, and return to exploration.

The Developer accepted the booth's functional interaction and authorized carousel development on October 26. The fortune-wagon story remains outside the current implementation checkpoint.

## Evidence and revisions

### Approved publication checkpoint — October 26, 2026

The Developer approved the owl replacement, requested hints, and Tab/Enter/arrow-key controls, then explicitly requested commit and push. This checkpoint packages the touch-spacing fix, visible ambience and stronger fog drift, two-level requested hints and neutral tappable glints, public-domain owl recording with pause-aware scheduling, no-Tab arrow entry, source credits, peer report, and requirement checklist. Previously recorded local/uncommitted notes below describe earlier checkpoints and are superseded by this publication authorization. The separate `cca2f5c` audio commit will be pushed alongside this checkpoint. Existing successful browser results are recorded below; focused hint-test/layout and final submission gaps remain disclosed, not silently marked complete. GitHub Pages deployment status and served-file verification will be reported after the push.

### Arrow entry without Tab — October 26, 2026

The Developer reports that arrow navigation works and requested using it before pressing Tab. Added a document-level entry handler: after Enter, an unmodified arrow key focuses the first enabled scene object when page/hidden-start-button focus is active. The entry press does not activate or move beyond that object. Later arrow presses use the existing approved spatial navigation. Interactive controls retain their keys; handled scene arrows do not trigger the entry handler again. Start, Pause, ghost/story locks and modifier-key guards remain in force.

Verification: `python3 -u /tmp/check_midway_arrow_entry.py` passed real pointer entry followed by arrow-only initial focus, visible focus, a directional matrix at 320 × 568, 320 × 700 and 390 × 844 (28 moves in the correct half-plane per size), boundary behavior, unchanged progress during navigation, native Tab to Hint, Enter/Space hint activation, no arrow hijack on Hint/Pause, Pause/reaction/story locks, keyboard completion of the first story and replay, and reacquiring scene focus without Tab after blur while respecting Pause. Reviewed `/tmp/midway-arrow-key-entry.png`. The first run of this new test inadvertently retained the older test's fixed-destination expectation; after removing that test assumption in favor of directional checks, the full run passed. This supersedes the earlier incomplete arrow-test status, without changing the diagonal-friendly navigation the Developer said worked. `git diff --check` passed. Changes are local, uncommitted and not pushed.

### Spatial arrow-key navigation — October 26, 2026

The Developer approved the requested hints and replacement owl, confirmed Tab and Enter work, and asked to add arrow keys. Added directional focus movement to the eight scene buttons: choose a nearby enabled object in the pressed direction, with a sideways-distance penalty. At an edge, retain focus. Arrows never activate objects, and the existing native Tab/Enter/Space behavior is retained. Hint, Pause and navigation controls keep their normal keyboard behavior; modified arrows are not intercepted. Keyboard start focuses the initial lantern; touch/mouse start does not force focus. Existing state guards prevent movement during Pause, ghost reactions and stories. Nothing has been committed or pushed.

Verification limitation: the first run of `python3 -u /tmp/check_midway_arrow_keys.py` failed keyboard entry because its CDP Enter event lacked text/keypress input. A diagnostic event log confirmed the application started and focused the lantern when a complete Enter keystroke was sent. After correcting that test input, the second run passed keyboard entry but failed a combined assertion expecting ArrowRight to focus the crystal ball, preserve progress, and show keyboard focus. The actual destination was not logged in that assertion. Source inspection shows the current scoring can prefer the nearer upper-right pumpkin over the farther right-hand crystal ball. In accordance with `AGENTS.md`, no further test variations were run after these two failed runs. The remaining direction matrix, Tab/Space, lock, replay, and layout checks in that new script were not reached. Resolve the design choice (mostly straight directional navigation versus allowing nearer diagonals) before further implementation/verification; existing Developer-reported Tab/Enter support is not a claim that the new arrow navigation passed.

### Real owl recording and pause-aware calls — October 26, 2026

The Developer rejected the synthesized owl because it did not sound like an owl and requested a different sound. Downloaded the NPS spotted-owl recording from Yosemite (`assets/audio/owl.mp3`), unchanged apart from its filename, after verifying the individual NPS page's credit and public-domain usage notice. Source, download and terms are in `CREDITS.md`. `afinfo` identified a valid mono MP3, approximately 5.3 seconds and 87 KB. This is a genuine owl recording per the publisher, not another oscillator imitation; no listening approval of the replacement is claimed yet.

Removed the old oscillator and seven-second wall-clock interval. A single `ambience` timer now schedules the first call at 18 seconds and subsequent calls at 24 seconds, at gain 0.18. It skips new calls during stories/ghost reactions and preserves remaining delay during Pause; shared audio-context suspension freezes active calls. Attraction transitions clear only attraction-specific timer groups, preserving ambience without duplicate schedulers. Missing owl audio is skipped while wind/other effects remain available; the rejected synthetic call is never a fallback.

Verification: `python3 -u /tmp/check_midway_recorded_owl.py` passed decoding all four assets, owl duration, Enter-only initialization, initial 18-second scheduling, countdown freeze/resume, active audio time freeze, 24-second rescheduling, a single timer across carousel/wagon changes, suppression during stories/ghost reactions, and blocked-owl-file behavior. Shortened delays in the focused test exercised the same scheduling path without waiting for each full interval. The complete normal-mode touch journey (`python3 -u /tmp/check_midway_journey.py`) also passed all three stories, input locking, Pause, completion, independent replay/full reset, and target sizing. `git diff --check` passed. Latest replacement remains local and uncommitted; listening and publication remain pending.

### Requested hints, audio approval and peer report — October 26, 2026

The Developer confirms audio works, resolving the earlier deferred sound review. They report one peer tested using their base-model iPhone 14: the experience worked, highlighting made discovery too easy, and the art looked noticeably AI-generated. The Developer accepts the art style. No browser version, exact playtest date, measured completion times, or detailed unassisted-observation record was supplied. This is a reported peer test, not one observed by the agent.

Implemented the clarified discovery revision: retain the automatic opening lantern glow; after its correct tap, use faint neutral glints on all eight tappable objects, including decoys. A native Hint button requests a text clue first and explicit text plus stronger cyan target illumination second. Hint count resets on correct steps/attraction changes; Pause restores the requested text on resume; Hint is disabled during Pause, ghost reactions and stories, and hidden before power/after completion. Timed text remains at 12/20 seconds without automatically singling out later targets. Correct/incorrect reactions and narrative payoffs remain intact.

Verification: the full normal-mode touch journey passed all three stories, ordered wagon steps, decoys, Pause, castle completion, replay/reset and target sizing. Focused requested-hint tests in normal and reduced-motion modes passed opening-only automatic glow, all eight glints, timed-text callback behavior without target reveal, two manual help levels, Pause text preservation, first-story hint reset/locking, completion hiding, and entering the carousel with fresh hints. Both stopped at the carousel step's exact-text assertion. Source inspection shows the UI intentionally prefixes the next clue with `1 of 3 clues awake.`, while that test expects only the clue. No application failure was established by this assertion; further retries were stopped after two failed runs as required by `AGENTS.md`. The later narrow-screen Hint layout assertions were not reached. Reviewed `/tmp/midway-requested-hint-normal.png`; controls and clue text fit at 390 × 844. Temporary commands: `python3 -u /tmp/check_midway_requested_hints.py` (also `--reduced`) and `python3 -u /tmp/check_midway_journey.py`. No new physical-phone or peer test of this revision is claimed; changes remain local.

### Fog readability refinement — October 26, 2026

The Developer reported that the fog did not look like it was drifting. The initial 3.2%-wide excursion moved only about 12 CSS pixels over 19 seconds at a 390px phone viewport, with an eased start. Increased travel to 14% over 12 seconds and scaled the fog image to 1.18 so its edges remain outside the scene. Existing opacity, layering, input handling, and reduced-motion behavior are unchanged.

Verified with `python3 -u /tmp/check_midway_fog_drift.py`: measured 51.1 CSS pixels of travel, including 25.5 pixels by six seconds, and covered frame edges. Reviewed `/tmp/midway-fog-start.png` and `/tmp/midway-fog-six-seconds.png`; the fog changes position across the booth and midway without moving the underlying artwork. Fresh real-time playback passed animation advancement, Pause freeze, and Resume. The first test manually sought/played the animation for measurements, which overrode CSS playback state and invalidated its pause assertion; separating measurement from a fresh playback session resolved the test issue. The reduced-motion ambient suite also passed with static fog, working Pause, no scrolling, and 44px controls at three phone sizes. Sound listening remains deferred; this refinement is local and uncommitted.

### Visible ambient effects — October 26, 2026

The Developer approved drifting fog, occasional flying bats, and gentle light flicker. Reused the supplied transparent fog overlay for a slow 19-second horizontal drift. Replaced the three hidden starter bats with original SVG silhouettes in an above-art, non-interactive sky layer; they cross in small, staggered groups with quiet intervals. The supplied lighting overlay shimmers gently over 7.6 seconds only after the booth lantern restores power, preserving the dark opening. No new image or audio assets were introduced.

All CSS animation is frozen before Enter. Pause now explicitly freezes pseudo-elements as well as elements, keeping the same shared control for ambience, hints, story motion, timers, and sound. Reduced-motion mode removes these three ambient animations and presents stationary fog/bats and steady powered lights.

Verification: `python3 -u /tmp/check_midway_ambience.py` and its `--reduced` run passed: fog/bats are above opaque artwork; ambient layers do not intercept input; lights remain off until power; normal-mode visual properties change over time while reduced-motion properties remain static; Pause freezes sampled properties and Resume restores the correct behavior. No scrolling and 44px targets were checked at 320 × 568, 320 × 700, and 390 × 844. Reviewed screenshots `/tmp/midway-ambience-normal.png` and `/tmp/midway-ambience-reduced.png`; fog remains translucent, bats occupy the sky, and scene controls and clue targets remain readable.

The complete normal-mode real-touch journey (`python3 -u /tmp/check_midway_journey.py`) also passed all three stories, delayed clues, pause/resume, input locking, completion, independent replay/full restart, and target sizing at two phone widths. `git diff --check` passed. These are browser tests, not a new physical-phone test or peer playtest. Sound listening remains deferred at the Developer's request. The ambient revision and prior touch-spacing fix remain local; neither has been committed or pushed yet.

### Deferred sound review — October 26, 2026

The Developer requested moving on without listening to the audio now. Keep an iPhone sound-balance check on the pre-submission checklist and bring it up during final review; it is intentionally deferred, not completed. No timed reminder has been scheduled.

### Narrow-screen wagon target spacing — October 26, 2026

Investigated the previously failed missing-audio test. At 320 × 700, `elementFromPoint` and captured click events showed that tapping the crystal ball's center actually activated the later-painted wagon-lantern button. Both targets' percentage positions combined with 44px minimum dimensions caused an overlap. Progress stayed at one ticket clue, so the story never began; audio failure was not the cause. At 390 × 844, the first story completed with all three sound downloads blocked.

With Developer approval, changed the two CSS touch positions to use opposite sides of a shared 45.6% artwork-height divider, with centers at least 48px apart. Both buttons retain 44px minimum dimensions and a 4px vertical gap. Original artwork and scene-light positions are unchanged; no audio or story logic was changed.

The spacing test passed at 320 × 568, 320 × 700, 375 × 667, 390 × 844, and 430 × 932: all eight targets stayed at least 44px and inside the viewport; the wagon pair had a 4px gap; both button centers and both original artwork centers hit the intended button. Actual dispatched touches completed the moon → lantern → crystal trigger at every size, with audio downloads blocked. The test's first run left controls disabled between isolated cases; after explicitly re-enabling them in test setup, all cases passed. Temporary command: `python3 -u /tmp/check_midway_target_spacing.py`.

The unchanged `python3 -u /tmp/check_midway_audio.py` then passed the complete normal-mode three-story journey, audio decode/loop/pause checks, and the formerly failing blocked-audio first-story completion at 320 × 700. This resolves the missing-file recovery concern recorded in the older audio checkpoint below. `git diff --check` passed. No new reduced-motion or physical-iPhone test is claimed. This touch-spacing revision remains local and uncommitted; the CC0 audio checkpoint is already committed but not pushed.

### Sourced audio and reported phone test — October 26, 2026

After publication of the three-story journey, the Developer reported that it works fine on their phone; prior context identifies an iPhone. This is self-reported developer testing, not an observed peer playtest. Model, browser version, and a per-check breakdown were not supplied. This updates the pending phone review in the older chronological entries below; it does not cover the subsequent audio revision.

Integrated three locally hosted CC0 WAV assets: Luke.RUSTLTD's wind loop, PWL's bell chime, and remaxim's short gust. Source pages, authors, original downloads, and linked CC0 terms were checked and recorded in `CREDITS.md` and `research.md`. The original carousel phrase, owl-like call, and tap tones remain synthesized. Enter starts audio loading; a brief crossfade replaces fallback wind when the file decodes. Failed files are caught and leave synthetic fallbacks, with no late effects scheduled. All sources share the existing pauseable Web Audio context. iPhone listening review and publication of this revision remain pending.

Verification: `afinfo` identified valid PCM WAVs lasting approximately 60 seconds (wind), 2.08 seconds (bell), and 4.24 seconds (gust). The normal-mode real-touch Chrome journey passed all three stories, progress, input locks, finale, replay, and eight 44-pixel targets at two phone sizes. Additional checks confirmed Enter-only audio initialization, successful decoding of all three files, recorded wind looping, bell/gust calls during the journey, and frozen/resumed audio-context time with Pause. `git diff --check` passed. The temporary test command was `python3 -u /tmp/check_midway_audio.py`.

Verification limitation: the first extended test failed its initial cue timing assertion after spending time loading audio and testing Pause. After adjusting that timing assumption, the journey and audio checks passed. In the blocked-audio portion, all three files failed as intended and the synthetic looping wind was present, but the final first-story completion assertion failed. This second failed test run was not retried, in accordance with `AGENTS.md`. Missing-file end-to-end recovery remains unresolved; the cause has not been established. No new reduced-motion or iPhone listening result is claimed for this audio revision.

### Cohesive three-story journey — October 26, 2026

Publication checkpoint: the Developer approved the local preview and authorized publishing the three-story version on October 26. The scene, generated carousel rider, separate reference ZIP, updated narrative, and six-second cyan hints are included in this deployment. New iPhone/peer verification remains pending.

The Developer approved connecting the ticket and horse through one forgotten guest: an unused horse-stamped ticket leads to her last ride; her dialogue points toward a missing wish; the wagon reveals her wish that the park shine again for everyone. Updated the introduction and speaker labels, added an original SVG horse emblem over the ticket reveal, implemented the moon → wagon lantern → crystal-ball finale, and added a separate three-memory completion counter. The finale restores castle illumination and ends with the park welcoming future guests. The same scene, ordered progress, delayed cues, Pause, input lock, and independent replay rules are reused. New cues use cyan object illumination and sparks against amber scenery; no haptics were added, per the Developer's preference.

Normal and reduced-motion Chrome sessions passed the complete three-story visit using real touch dispatch: six-second cyan clue delay, ticket seal and narrative line, guest's wish dialogue and speaker, correct wagon order, harmless wrong taps, locked input/navigation during the finale, paused story timers, castle activation, all three memory completions, finale replay preserving the first two memories, and full reset to a dark booth. Eight targets met 44 × 44 CSS pixels and stayed on screen at 390 × 844 and 320 × 700. Reviewed screenshots of the cue, ticket, wish reveal, and castle finale. The third story lasts 8.7 seconds; first and second remain 8.2 seconds. No new physical-phone or peer test is claimed. Changes remain local pending publication.

Remaining delivery checks: Developer review of narrative/clue visibility on iPhone, peer testing when available, final sourced audio, visible ambient effects against the complete brief, credits verification, and debrief. Three implemented story sequences do not by themselves establish full assignment completion.

### Developer test and second-story checkpoint — October 26, 2026

The Developer reported testing the other behavior on an iPhone and having no friend available for a peer playtest. Record this as self-reported developer testing only: phone model, browser version, and individual test results were not supplied. No peer-test evidence is claimed, and testing can be arranged with a classmate later.

Implemented The Riderless Carousel using the approved bell → carousel light → horse sequence. It reuses the current progress, hint timers, input lock, Pause, and replay infrastructure through an active-attraction state. The booth story unlocks the carousel through an explicit same-scene button. The carousel can replay independently or return to the dark booth opening. The fortune-wagon story remains pending.

Generated one transparent horse-and-rider PNG using OpenAI's built-in image-generation tool with the existing carnival as a style reference. Kept the single scene required by the brief. Runtime asset: `assets/images/carousel-rider.png`. Requested reference package: `reference/carousel-story-asset.zip`, containing the PNG and its final prompt/provenance README. `unzip -t` passed for both files.

Verification: fresh Chrome sessions passed the full ticket → carousel flow in normal and reduced-motion modes using dispatched touch events. Checks included the six-second bell cue, ordered bell/light/horse progress, progress preservation on incorrect taps, generated rider and dialogue visibility, disabled navigation/targets during playback, frozen story timers and rider position while paused, completion, independent carousel replay, and return to the dark booth. All seven targets met the 44-pixel minimum and stayed visible at 390 × 844 and 320 × 700. Reviewed carousel and pause screenshots; suppressed exploration text/navigation during story playback to avoid overlapping the dialogue on phones. These are browser checks, not physical-iPhone or peer verification of the new story. Local implementation is not yet published.

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

Hint pacing refinement: the Developer requested a short exploration window before each visual trigger clue. Added stage-specific cue classes after six seconds of inactivity: lantern flicker after entry, crystal pulse after the first tap, and pumpkin pulse after the ghost reaction unlocks interaction. Correct-tap reactions remain immediate and early taps still work. Pause preserves the cue countdown. Text escalation remains at 12 and 20 seconds.

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
