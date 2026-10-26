# Moonlit Midway — Virtual Hallo'weenie

A browser-based Halloween theme-park prototype for smartphone exploration, developed for Project 4. Intended for ages 10 and older.

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

The first attraction, The Last Ticket, has an ordered three-tap trigger, audiovisual feedback, progress indicators, timed hints, and an approximately 8.2-second ticket animation. Tap the booth lantern, counter pumpkin, and large pumpkin face. Pause/resume and replay are implemented but need a recorded physical-phone test. The carousel and fortune-wagon stories are approved concepts, not implemented attractions.

This is a work-in-progress submission, not a claim that all brief requirements have passed. In particular, physical-phone verification, peer playtesting, final audio sourcing, visible ambient effects, and final credits verification remain open.

## Project documents

- [Brief and deliverables](brief.md)
- [Design and research evidence](research.md)
- [Intended behavior and technical structure](spec.md)
- [Implementation status, verification, and next priorities](plan.md)
- [Development conversation](transcripts/session-2026-10-19_211448.md)

## Files

`index.html` defines the scene and controls, `styles.css` defines layout and effects, and `script.js` coordinates interaction, audio, hints, and story timing. The five scene PNGs live in `reference/halloween_pixel_aligned_layers_only/`; the story ticket lives in `assets/images/`.
