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

## Prototype status

The scene opens with its lighting overlay off and a flickering booth lantern as the first clue. Tap the lantern to switch on the midway's lights. After the ticket story, use **Replay · lights out** to reset the opening. Reduced-motion mode uses a steady lantern.

After power is restored, the green crystal ball pulses. Its correct tap releases a large friendly ghost that flies into the pumpkin, whose eyes and grin turn green for the final tap. Tapping the pumpkin turns its face orange-gold, lights the booth window, and launches the ticket story. The horse, bell, and moon sign intermittently glint and play harmless visual reactions when tapped. Hints sit near the bottom of the scene so the attractions stay visible. See `plan.md` for browser verification results and remaining physical-phone checks.

All three stories are implemented. The Last Ticket uses the booth lantern → green crystal ball → pumpkin face and reveals a horse-stamped ticket. Choose **Explore the carousel**, then tap bell → carousel roof light → white horse for the guest's last ride. Choose **Follow her wish**, then tap crescent-moon sign → wagon-entrance lantern → crystal ball to restore the castle. The sequences last 8.2, 8.2, and 8.7 seconds respectively. Bell/horse/moon targets act as decoys outside their real story sequences. Pause greys out the scene and exposes Resume; each story can replay, and returning to the booth resets the visit. Cyan cues start after six seconds; stronger text hints follow at 12 and 20 seconds. Memories restored counts completed stories separately from the current three-step trigger.

The full journey has passed normal and reduced-motion browser checks with emulated touch. The Developer approved publication and subsequently reported that the complete experience works on their iPhone on October 26, 2026. Device model, browser version, and individual results were not supplied. No peer playtest is recorded.

CC0 wind, bell, and gust assets now accompany the original synthesized melody and feedback. See [credits and verified audio sources](CREDITS.md). The audio revision still needs an iPhone listening check and publication.

This is a work-in-progress submission, not a claim that all brief requirements have passed. Peer playtesting, visible ambient-effects review, remaining visual/template provenance, and the final debrief remain open.

## Project documents

- [Brief and deliverables](brief.md)
- [Design and research evidence](research.md)
- [Intended behavior and technical structure](spec.md)
- [Implementation status, verification, and next priorities](plan.md)
- [Development conversation](transcripts/session-2026-10-19_211448.md)

## Files

`index.html` defines the scene and controls, `styles.css` defines layout and effects, and `script.js` coordinates interaction, audio, hints, and story timing. The five scene PNGs live in `reference/halloween_pixel_aligned_layers_only/`; the story ticket lives in `assets/images/`.
