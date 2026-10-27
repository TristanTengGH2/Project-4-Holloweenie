# Technical Specification

> EDITING DIRECTIVE: DEVELOPER AND AGENT EDIT THIS FILE COLLABORATIVELY. THE DEVELOPER MUST REVIEW AND APPROVE ITS CONTENT.

Purpose: Keep a concise, testable description of the experience currently being built.

## Working agreement

Developer: Begin with the running prototype, approve the intended behavior, test it directly, and update this file when the intended result changes.

Agent: Read `AGENTS.md`, `brief.md`, `research.md`, and this file, then inspect the project. Turn decisions into acceptance checks without inventing product choices or freezing details that still require testing.

Start a fresh chat with:

`Read the project documents, inspect the running prototype, and help me specify the next useful build checkpoint.`

## Current build contract

Live prototype: https://tristantenggh2.github.io/Project-4-Holloweenie/

Repository and history: [GitHub](https://github.com/TristanTengGH2/Project-4-Holloweenie), [commits](https://github.com/TristanTengGH2/Project-4-Holloweenie/commits/main/). Asset attribution and licensing status: [CREDITS.md](CREDITS.md).

### System structure

This is a static HTML/CSS/JavaScript application with no package dependencies or build step. GitHub Pages serves the root of `main`. The scene images share a 941 × 1672 coordinate system; percentage-positioned native buttons supply accessible touch targets. The artwork scales inside the viewport and can crop horizontally, so target alignment must be checked at each supported phone size.

`script.js` tracks start, pause, story playback, ordered progress, and completion. Hint and story callbacks use timer groups that preserve remaining delay on pause. CSS animates the ticket and feedback. After Enter unlocks audio, Web Audio loads local CC0 wind, bell, and gust buffers alongside the original synthesized melody and feedback. A loading failure retains synthetic fallbacks without blocking play; late-loaded effects are not played out of sync. Suspending the shared audio context freezes both recordings and synthesis. Story completion unlocks exploration and allows replay from the first target. Reduced-motion behavior uses the device preference read before entry plus CSS media rules; see `plan.md` for browser evidence.

The three HUD marks count trigger steps for the selected attraction. A separate Memories restored counter tracks completed stories, so step progress and overall narrative progress are distinct.

### Visible ambient effects

Three effect types run within the aligned artwork: the supplied transparent fog slowly drifts horizontally; small groups of original SVG bats occasionally cross the sky above the opaque scene layers; and the existing lighting overlay gently varies in opacity after power is restored. Lighting remains off before the booth-lantern trigger. Bats and fog do not receive pointer input or cover controls with interactive elements. All CSS animation remains paused until Enter, and the shared Pause freezes the effects at their current positions. Reduced-motion mode uses stationary fog/bats and steady lights. The Developer approved the earlier sound balance; the replacement owl recording still needs their listening approval.

Ambient audio combines the looping CC0 wind with an NPS public-domain spotted-owl recording. The first call is scheduled 18 seconds after Enter; later calls are scheduled every 24 seconds, quietly, with starts skipped during stories/ghost reactions. One shared pause-aware ambience timer spans attraction changes, preserving remaining delay on Pause; suspending the audio context also freezes an already playing call. If the owl file fails, retain wind and skip the owl without reviving the rejected synthetic call.

### Experience direction

The scene is **The Moonlit Midway**, a Halloween theme park that has forgotten its final guest. The Night Attendant asks the visitor to finish her interrupted visit: recover her unused ticket, give her the last carousel ride she missed, then discover her wish that the park shine for everyone again. Each completed story restores one memory. Completing all three restores the distant castle and midway lights. The tone stays playful and welcoming, without depicting real-world suffering.

The approved stories are:

1. **The Last Ticket:** booth lantern → green crystal ball in the right-hand wagon → large pumpkin face. An unused ticket appears with a horse emblem linking it to the carousel. Dialogue: “One ticket was never used. Perhaps her favorite ride remembers.”
2. **The Riderless Carousel:** hanging bell → carousel light → white horse. The forgotten guest finally enjoys her missed ride and points the visitor toward the wagon. Dialogue: “One last ride! Now… where did I leave my wish?”
3. **The Fortune After Midnight:** crescent-moon sign → wagon lantern → crystal ball. Her wish appears above an illustrated path to the castle: “I wish the midway could shine again—for everyone.” A star carries it to the castle and restores the park. Final dialogue: “A little wonder should never stay forgotten.”

Each finished story will follow the duration, replay, audiovisual, scene-locking, and accessibility requirements in `brief.md`.

### Current checkpoint: one connected three-story visit

The discovery system supports all three attractions. The first attraction's rules are:

- Place touch and keyboard-accessible hotspots over the booth lantern, green crystal ball, and pumpkin face. The crystal ball replaces the counter pumpkin because the Developer found the pumpkin obscured by fog.
- Begin with the full emitted-lighting PNG hidden. On entry, isolate the booth lantern's illumination with a soft mask and let it flicker gently; reduced-motion mode shows a steady lantern. The first correct lantern tap switches on the entire lighting layer, visibly waking the park and revealing the green crystal ball. Keep the lights on through the story and afterward. A Replay control resets progress and switches all lights off so the opening can be experienced again. Sunset and brightness baked into the background remain visible.
- Every interaction gives immediate audiovisual feedback and correct steps illuminate one segment in a three-part progress indicator. Object illumination and scene reactions replace the discovery halos; retain keyboard focus outlines for accessibility.
- An incorrect interaction produces a soft purple ripple and does not erase correct progress.
- Keep the six-second automatic opening lantern glow. After its correct tap, show a native Hint button and faint neutral glints on all eight tappable objects, including decoys; these do not distinguish correct targets. First Hint press gives a location clue; second gives the explicit clue plus cyan object emphasis. Reset requested hints on every correct step or attraction change. Disable Hint during Pause, ghost reactions, and stories; hide it before power and after story completion. Preserve the requested clue across Pause/Resume.
- A correct crystal-ball tap starts a 4.1-second reaction: the orb swells, a large friendly green ghost rises out of the wagon and crosses the midway, then dives into the pumpkin's eyes and grin, which stay green and pulse to invite the final tap. Lock other taps during the flight so it can finish before the ticket story. Pause freezes the ghost animation and its timers; reduced-motion mode shows a static ghost, then the lit pumpkin without flight. Replay clears both the ghost and pumpkin illumination.
- The final pumpkin tap turns its green face warm orange-gold with a gentle 1.2-second flare. The booth window fills with amber light as the existing 8.2-second ticket story begins. Warm face/window illumination persists after the story; Replay resets it. Reduced-motion mode uses steady illumination instead of the flare.
- Only the opening glow is automatic. Later target-specific pulses/sparks require two Hint presses. Timed text still escalates at 12 seconds; at 20 seconds it offers the Hint button instead of revealing the target automatically. Requested clues are not overwritten by those timers. The pumpkin's steady green face remains the ghost's direct payoff, not a timed hint. Reduced motion uses static glints and target illumination.
- The carousel horse, hanging bell, and crescent-moon sign are tappable decoys. After power they intermittently glint to invite exploration. Tapping makes a spectral horse leap, a bell swing, or a purple moon spin, with a distinct synthesized tone, star effect, and flavor text. No progress is awarded or erased, and decoys do not postpone hint escalation. Repeated taps restart the current decoy effect; only one decoy reaction plays at a time. Reduced-motion mode uses stationary illuminated silhouettes.
- Emphasis may dim the surrounding scene, but the next object must remain readable and the hint must not directly reveal the answer.
- Progress, hint timers, feedback, and interaction must all stop while paused.
- Pause adds a grey, desaturated overlay with a centered Paused message. The same control becomes Resume and remains above the overlay; all target buttons are disabled until resumed.
- While a story sequence plays, all unrelated scene interaction is disabled. The scene clearly returns to exploration afterward.

Acceptance checks:

- Targets remain aligned with the artwork across supported phone viewport sizes. The neighboring wagon lantern and crystal ball use a shared vertical divider for their 44px touch regions, leaving a 4px gap while retaining each visible object inside its own target. Their scene-light effects remain at the original artwork coordinates.
- Each target works with touch, pointer, Enter, and Space and has an accurate accessible name.
- Arrow keys move focus spatially among enabled scene targets without activating them. Prefer the nearest target in the pressed direction, penalizing sideways distance; retain focus if none exists. Preserve the existing Tab order for all objects and controls. Keyboard activation of the start button focuses the booth lantern; touch/mouse entry does not force keyboard focus. Modified arrows and arrows on Hint/Pause/navigation controls are left alone. Pause, ghost reactions and story input locks also block arrow navigation.
- After touch/mouse entry, the first unmodified arrow key focuses the initial lantern if focus is on the page or hidden Enter button; no preliminary Tab is needed. That press only establishes focus, without advancing progress or immediately navigating away from the lantern. This also restores scene focus after clicking a non-interactive part of the page, but never steals focus from Hint/Pause/navigation or editable controls.
- Correct, incorrect, and next-clue states are visually distinct without relying on color alone.
- The complete trigger can be discovered without instructions and can be repeated without reloading.
- Reduced-motion mode replaces pulsing and particle movement with restrained static emphasis.

After the third correct tap, **The Last Ticket** plays as an approximately 8.2-second sequence: the booth awakens, a glowing moon-ticket rises, the Night Attendant delivers the approved line, and the ticket dissolves into golden sparks. All interaction is locked during the sequence. Pause freezes its animation, audio, and remaining timeline; resume continues from the same beat. The experience then returns to exploration with replay instructions.

### The Riderless Carousel

After completing the ticket story, an Explore the carousel button selects the second attraction within the same scene. A visible attraction label and the shared three-step progress indicator identify the selected story. The booth remains lit. The trigger order is brass bell → bulb on the front-right carousel roof trim → white horse. The bell rings, the light brightens the roof, and the horse launches the story. In carousel mode, bell and horse are real clues rather than decoys; incorrect taps never reset progress. The moon sign remains a decoy.

Hints use the same requested two-level system and pause-aware timed text as the booth after power. On the second Hint press, the bell gently swings, the carousel bulb flickers, or the horse gleams, with static equivalents under reduced motion. Targets remain native buttons with at least 44-pixel tap regions.

The 8.2-second payoff has a beginning (bell and chasing roof lights), middle (a white horse and friendly ghost rider emerge to an original synthesized music-box phrase; the approved dialogue appears), and end (rider fades into autumn sparks and returns to the carousel). Generated artwork is an overlay within the existing composition, not a second scene or page. All other taps/navigation are disabled during playback; Pause freezes both audio and animation/timers. Reduced-motion mode presents the rider stationary and suppresses the flight and light cycling.

On completion, Follow her wish selects the fortune-wagon story; Replay carousel resets the carousel and later story progress. Return to ticket booth resets the full experience to its lights-off opening. Carousel asset and generation prompt are packaged at `reference/carousel-story-asset.zip`; credits are in `CREDITS.md`.

### The Fortune After Midnight and stronger discovery cues

The third sequence uses the crescent sign, a new wagon-entrance lantern target, then the existing green crystal ball. Each uses shared ordered progress and sounds; the moon spins briefly, the lantern lights, and the final tap starts an 8.7-second locked story. At 1.2 seconds a wish card and illustrated route appear, at 4.1 seconds a star flies toward the castle, and at 6.2 seconds the castle brightens with the final dialogue. At 8.7 seconds exploration resumes with all three memories restored. The restored lights persist until replay/restart. Replay her wish resets the third story only; Start another visit returns to the dark booth and resets all memories.

After the second Hint press for a step, cyan sparks and cyan object illumination contrast with the warm scenery. The crystal's core and ghost remain green; correct-tap successes remain warm gold, and decoy reactions remain purple. Text and moving/steady sparks ensure clues do not depend on color alone. Reduced-motion mode replaces spark movement and wish flight with stationary effects. All story timers and effects share Pause and input locking.

## Scope and revisions

All three narrative sequences are implemented. The Developer confirms audio works and reports one peer testing on their base-model iPhone 14: functional, too easy to discover through highlighting, and noticeably AI-generated art. That feedback motivated requested hints and neutral glints; the Developer accepts the art style. The revised hint system has not yet had a reported peer retest. See the current checklist in `plan.md` for verification limits, publication, provenance, and debrief gaps.

The current artwork is treated as one aligned composition. Interaction emphasis will use positioned HTML/CSS or SVG overlays so it does not depend on regenerating the scene art.

## Saving the transcript

When directed, save the complete conversation as `transcripts/spec-YYYY-MM-DD_HHMMSS.md`, label messages `Developer` and `Agent`, and confirm the path.
