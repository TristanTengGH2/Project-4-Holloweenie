# Moonlit Midway — Virtual Hallo'weenie

A browser-based Halloween theme-park prototype for smartphone exploration, developed for Project 4. Intended for ages 10 and older. Restore the memories of the park's forgotten final guest: her unused ticket, her last carousel ride, and her wish to make the midway shine for everyone again.

## Play and review

- [Live prototype on GitHub Pages](https://tristantenggh2.github.io/Project-4-Holloweenie/)
- [Repository](https://github.com/TristanTengGH2/Project-4-Holloweenie)
- [Git commit history](https://github.com/TristanTengGH2/Project-4-Holloweenie/commits/main/)
- [Credits and asset provenance](CREDITS.md)
- [Development history snapshot](GIT_LOG.md)

GitHub Pages deploys the root of `main`. Pushing a commit to `main` triggers a new deployment.

## Run locally

From the project directory:

```sh
python3 -m http.server 4173
```

Open http://localhost:4173 and press Enter on the start screen. Stop the server with Ctrl+C. No package installation or build command is required.

Keyboard: after clicking Enter, press any arrow key to focus the booth lantern without pressing Tab first. Further arrows move to nearby objects in that direction; Enter or Space activates them. At an edge, focus stays put. Tab still moves through objects and controls, including Hint, Pause, replay and attraction navigation. Arrow keys do not activate objects or replace those controls' normal behavior.

## Prototype status

The scene opens with its lighting overlay off and a flickering booth lantern as the first clue. Tap the lantern to switch on the midway's lights. After the ticket story, use **Replay · lights out** to reset the opening. Reduced-motion mode uses a steady lantern.

After power is restored, all eight tappable objects get faint neutral glints. Hint gives a text clue; a second press adds the stronger target glow. Hint requests reset each step. A correct crystal-ball tap releases a large friendly ghost that flies into the pumpkin, whose eyes and grin turn green for the final tap. Tapping the pumpkin turns its face orange-gold, lights the booth window, and launches the ticket story. The horse, bell, and moon sign play harmless visual reactions outside their real sequences. Hints sit near the bottom so the attractions stay visible. See `plan.md` for verification results and remaining checks.

All three stories are implemented. The Last Ticket uses the booth lantern → green crystal ball → pumpkin face and reveals a horse-stamped ticket. Choose **Explore the carousel**, then tap bell → carousel roof light → white horse for the guest's last ride. Choose **Follow her wish**, then tap crescent-moon sign → wagon-entrance lantern → crystal ball to restore the castle. The sequences last 8.2, 8.2, and 8.7 seconds respectively. Bell/horse/moon targets act as decoys outside their real story sequences. Pause greys out the scene and exposes Resume; each story can replay, and returning to the booth resets the visit. Cyan cues start after six seconds; stronger text hints follow at 12 and 20 seconds. Memories restored counts completed stories separately from the current three-step trigger.

The full journey has passed normal and reduced-motion browser checks with emulated touch. The latest normal journey also passed after the requested-hint revision; focused hint-test limits are recorded in `plan.md`. The Developer reports that audio works and that one peer tested on their base-model iPhone 14: the experience worked, highlighting was too easy, and the art looked noticeably AI-generated. The Developer accepts the art style. This is reported feedback, not an independently observed test of the latest revision.

CC0 wind, bell, and gust assets accompany the original synthesized melody and feedback. See [credits and verified audio sources](CREDITS.md). The Developer's audio approval resolves the previously deferred listening check.

The synthetic owl has been replaced with a Developer-approved NPS public-domain spotted-owl recording. Its first quiet call occurs after 18 seconds, then at 24-second intervals during exploration; Pause preserves the countdown and playback position. Missing owl audio is skipped rather than replaced with the rejected synthetic sound.

Three visible ambient effects sit within the artwork: slowly drifting fog, occasional flying bats, and gentle light shimmer after power returns. They begin after Enter, freeze with Pause, and become static under reduced motion. Tristan Teng reports that the published version works on his phone and approves the layout.

Developer and creative direction: Tristan Teng. He confirms the scene was AI-generated using GPT-5.6 Sol without outside references. Course-template attribution requirements and the course-provided debrief remain open; earlier automated-test limits are retained in the [current requirement checklist](plan.md#current-requirement-checklist). Developer approval is not represented as completion of those automated checks.

## Project documents

- [Brief and deliverables](brief.md)
- [Design and research evidence](research.md)
- [Intended behavior and technical structure](spec.md)
- [Implementation status, verification, and next priorities](plan.md)
- [Development conversation](transcripts/session-2026-10-19_211448.md)

## Files

`index.html` defines the scene and controls, `styles.css` defines layout and effects, and `script.js` coordinates interaction, audio, hints, and story timing. The five scene PNGs live in `reference/halloween_pixel_aligned_layers_only/`; the story ticket lives in `assets/images/`.
