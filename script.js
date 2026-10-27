const scene = document.getElementById('scene');
const startScreen = document.getElementById('startScreen');
const enterButton = document.getElementById('enterButton');
const pauseToggle = document.getElementById('pauseToggle');
const pauseScreen = document.getElementById('pauseScreen');
const replayButton = document.getElementById('replayButton');
const carouselButton = document.getElementById('carouselButton');
const attractionLabel = document.getElementById('attractionLabel');
const progressLabel = document.getElementById('progressLabel');
const hintText = document.getElementById('hintText');
const hintButton = document.getElementById('hintButton');
const storyOverlay = document.getElementById('storyOverlay');
const storyTitle = document.getElementById('storyTitle');
const storySpeaker = document.getElementById('storySpeaker');
const journeyProgress = document.getElementById('journeyProgress');
const storyText = document.getElementById('storyText');
const midwayHotspots = [...document.querySelectorAll('.midway-hotspot')];
const storyProgress = document.getElementById('storyProgress');
const progressSteps = [...document.querySelectorAll('.progress-step')];

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const arrowDirections = { ArrowLeft: [-1, 0], ArrowRight: [1, 0], ArrowUp: [0, -1], ArrowDown: [0, 1] };

let isStarted = false;
let isPaused = false;
let storyPlaying = false;
let crystalPlaying = false;
let audioContext = null;
let ambientWind = null;
let ambientCallsStarted = false;
let activeStoryHint = '';
let requestedHints = 0;
let hintStepKey = '';
const soundBuffers = new Map();
let soundLoading = null;

const timerGroups = {
  ambience: [],
  hints: [],
  story: [],
  feedback: [],
  crystal: [],
  decoys: []
};

const lastTicket = {
  title: 'The Last Ticket',
  sequence: ['booth-lantern', 'crystal-ball', 'pumpkin-face'],
  current: 0,
  complete: false
};

const carouselStory = {
  title: 'The Riderless Carousel',
  sequence: ['bell', 'carousel-light', 'horse'],
  current: 0,
  complete: false
};
const fortuneStory = {
  title: 'The Fortune After Midnight',
  sequence: ['moon-sign', 'wagon-lantern', 'crystal-ball'],
  current: 0,
  complete: false
};
const recoveredMemories = new Set();
let activeAttraction = lastTicket;

const progressHints = [
  ['The midway has gone dark. One lantern still flickers beside the ticket window.', 'Look beneath the pumpkin roof, on the left side of the booth window.', 'Tap the flickering lantern beside the booth window to wake the midway lights.'],
  ['A green glow answers from across the midway.', 'Look inside the fortune-teller’s wagon on the right.', 'The glowing green crystal ball is waiting inside the right-hand wagon.'],
  ['Bring the magic back to the booth’s biggest smile.', 'Look above the ticket window, beneath the curling stem.', 'The giant smiling pumpkin above the booth holds the last spark.']
];

const carouselHints = [
  ['A sleeping ride is waiting for its opening chime.', 'Look for the little brass bell hanging high above the pumpkin booth.', 'Tap the hanging brass bell near the middle of the bunting.'],
  ['The carousel heard you. Its roof needs a little starlight.', 'Look along the golden front edge of the carousel roof on the left.', 'Tap the flickering bulb on the right end of the carousel’s front roof trim.'],
  ['A white horse remembers a rider who never said goodbye.', 'Look beneath the glowing carousel roof on the left.', 'Tap the white horse at the front of the carousel.']
];

const fortuneHints = [
  ['Her last ride is over, but her wish is still missing. The wagon’s moon remembers.', 'Look for the crescent hanging above the fortune-teller’s wagon on the right.', 'Tap the crescent-moon sign hanging above the wagon.'],
  ['A forgotten wish needs a little light to be read.', 'Look beside the wagon’s curtained entrance, just above the crystal ball.', 'Tap the small hanging lantern beside the right-hand wagon entrance.'],
  ['The crystal holds the wish she left behind.', 'The green crystal ball inside the wagon is waiting for you again.', 'Tap the green crystal ball to reveal her forgotten wish.']
];

const cueClasses = ['cue-lantern', 'cue-crystal', 'cue-pumpkin', 'cue-bell', 'cue-carousel-light', 'cue-horse', 'cue-moon-sign', 'cue-wagon-lantern'];
const cueForTarget = { 'booth-lantern': 'cue-lantern', 'crystal-ball': 'cue-crystal', 'pumpkin-face': 'cue-pumpkin', bell: 'cue-bell', 'carousel-light': 'cue-carousel-light', horse: 'cue-horse', 'moon-sign': 'cue-moon-sign', 'wagon-lantern': 'cue-wagon-lantern' };

function currentHints() {
  if (activeAttraction === fortuneStory) return fortuneHints;
  return activeAttraction === carouselStory ? carouselHints : progressHints;
}

function clearVisualCues() {
  scene.classList.remove(...cueClasses);
}

const decoyResponses = {
  horse: 'A ghostly horse leaps off the carousel… and slips back into its painted saddle. No ticket stamp, just a little mischief!',
  bell: 'Ding-ding-ding! The bell rings itself silly. The midway laughs, but your ticket stays the same.',
  'moon-sign': 'The moon spins a purple spell… then forgets what it was casting. Your ticket progress is safe.'
};

const targetTones = {
  'booth-lantern': 340,
  'crystal-ball': 430,
  'pumpkin-face': 540,
  bell: 720,
  'carousel-light': 520,
  horse: 390,
  'moon-sign': 480,
  'wagon-lantern': 570
};

function startTimer(timer) {
  timer.startedAt = performance.now();
  timer.timeoutId = window.setTimeout(() => {
    const group = timerGroups[timer.group];
    const index = group.indexOf(timer);
    if (index >= 0) group.splice(index, 1);
    timer.callback();
  }, timer.remaining);
}

function scheduleTimer(group, delay, callback) {
  const timer = {
    group,
    callback,
    remaining: delay,
    startedAt: 0,
    timeoutId: null
  };

  timerGroups[group].push(timer);
  startTimer(timer);
  return timer;
}

function clearTimerGroup(group) {
  timerGroups[group].forEach((timer) => window.clearTimeout(timer.timeoutId));
  timerGroups[group] = [];
}

function clearAttractionTimers() {
  // Ambient calls span the whole visit; changing attractions must not cancel them.
  Object.keys(timerGroups).filter((group) => group !== 'ambience').forEach(clearTimerGroup);
}

function pauseTimers() {
  Object.values(timerGroups).flat().forEach((timer) => {
    if (timer.timeoutId === null) return;
    window.clearTimeout(timer.timeoutId);
    timer.remaining = Math.max(0, timer.remaining - (performance.now() - timer.startedAt));
    timer.timeoutId = null;
  });
}

function resumeTimers() {
  Object.values(timerGroups).flat().forEach((timer) => {
    if (timer.timeoutId === null) startTimer(timer);
  });
}

function setHint(text) {
  hintText.textContent = text;
}

function getExplorationHint() {
  if (activeAttraction === fortuneStory && fortuneStory.complete) return 'Her wish is fulfilled. The park shines again—ready to welcome its next guest.';
  if (activeAttraction === carouselStory && carouselStory.complete) {
    return 'Her ticket finally bought one last ride. Follow her wish into the fortune-teller’s wagon.';
  }
  if (activeAttraction === lastTicket && lastTicket.complete) {
    return 'An unused ticket, stamped with a horse. Its owner’s favorite ride must remember her.';
  }

  return currentHints()[activeAttraction.current][requestedHints];
}

function setMidwayHotspotsEnabled(enabled) {
  midwayHotspots.forEach((hotspot) => {
    hotspot.disabled = !enabled;
  });
  replayButton.disabled = !enabled;
  carouselButton.disabled = !enabled;
  updateHintButton(enabled);
}

function updateHintButton(enabled = isStarted && !isPaused && !storyPlaying && !crystalPlaying) {
  hintButton.hidden = !isStarted || !scene.classList.contains('has-power') || activeAttraction.complete;
  hintButton.disabled = !enabled || activeAttraction.complete || requestedHints >= 2;
  hintButton.textContent = requestedHints >= 2 ? 'Hint shown' : requestedHints === 1 ? 'Stronger hint' : 'Hint';
}

function showRequestedGlow() {
  const name = activeAttraction.sequence[activeAttraction.current];
  const target = midwayHotspots.find((hotspot) => hotspot.dataset.midwayTarget === name);
  if (!target) return;
  target.classList.add('hint-outline');
  scene.classList.add(cueForTarget[name]);
}

function setPaused(paused) {
  isPaused = paused;
  pauseToggle.textContent = paused ? 'Resume' : 'Pause';
  pauseToggle.setAttribute('aria-label', paused ? 'Resume the scene' : 'Pause the scene');
  pauseToggle.setAttribute('aria-pressed', String(paused));
  pauseScreen.hidden = !paused;
  scene.classList.toggle('is-paused', paused);
  setMidwayHotspotsEnabled(isStarted && !paused && !storyPlaying && !crystalPlaying);
  replayButton.disabled = paused || storyPlaying;

  if (audioContext && audioContext.state === 'running' && paused) {
    audioContext.suspend();
  }

  if (audioContext && audioContext.state === 'suspended' && !paused) {
    audioContext.resume();
  }

  if (paused) {
    pauseTimers();
    setHint('The midway is paused. Press resume when you are ready.');
  } else {
    resumeTimers();
    setHint(storyPlaying || crystalPlaying ? activeStoryHint : getExplorationHint());
  }
}

function createAudioContext() {
  if (!audioContext) {
    const AudioCtor = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtor) return null;
    audioContext = new AudioCtor();
  }

  if (audioContext.state === 'suspended' && !isPaused) {
    audioContext.resume().catch(() => {});
  }

  return audioContext;
}

function makeNoiseBuffer(ctx) {
  const buffer = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate);
  const channel = buffer.getChannelData(0);
  for (let i = 0; i < channel.length; i += 1) {
    channel[i] = (Math.random() * 2 - 1) * 0.45;
  }
  return buffer;
}

function loadRecordedAudio(ctx) {
  if (soundLoading) return soundLoading;
  // Decode after Enter unlocks audio. Failed files leave the synthetic fallback intact.
  const audioFiles = { wind: 'wind.wav', bell: 'bell.wav', gust: 'gust.wav', owl: 'owl.mp3' };
  soundLoading = Promise.all(Object.entries(audioFiles).map(async ([name, file]) => {
    try {
      const response = await fetch(`assets/audio/${file}`);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const buffer = await ctx.decodeAudioData(await response.arrayBuffer());
      soundBuffers.set(name, buffer);
      if (name === 'wind') {
        const previous = ambientWind;
        const noise = ctx.createBufferSource();
        const gain = ctx.createGain();
        noise.buffer = buffer;
        noise.loop = true;
        gain.gain.setValueAtTime(0, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.16, ctx.currentTime + 1);
        noise.connect(gain);
        gain.connect(ctx.destination);
        noise.start();
        ambientWind = { noise, gain };
        if (previous) {
          previous.gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 1);
          previous.noise.stop(ctx.currentTime + 1);
          previous.noise.onended = () => {
            previous.noise.disconnect();
            previous.gain.disconnect();
          };
        }
      }
    } catch (error) {
      console.warn(name === 'owl' ? 'Owl recording unavailable; keeping wind ambience.' : `Using fallback audio for ${name}:`, error.message);
    }
  }));
  return soundLoading;
}

function playRecordedSound(name, volume = 0.12) {
  const buffer = soundBuffers.get(name);
  if (!buffer || !audioContext || isPaused) return false;
  const source = audioContext.createBufferSource();
  const gain = audioContext.createGain();
  source.buffer = buffer;
  gain.gain.value = volume;
  source.connect(gain);
  gain.connect(audioContext.destination);
  source.onended = () => {
    source.disconnect();
    gain.disconnect();
  };
  source.start();
  return true;
}

function startAmbientAudio() {
  const ctx = createAudioContext();
  if (!ctx) return;

  if (!ambientWind) {
    const noise = ctx.createBufferSource();
    noise.buffer = makeNoiseBuffer(ctx);

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 900;

    const gain = ctx.createGain();
    gain.gain.value = 0.06;

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    noise.loop = true;
    noise.start();
    ambientWind = { noise, gain };
  }
  loadRecordedAudio(ctx);

  if (!ambientCallsStarted) {
    ambientCallsStarted = true;
    scheduleOwlCall(18000);
  }
}

function scheduleOwlCall(delay = 24000) {
  scheduleTimer('ambience', delay, () => {
    // Do not compete with story dialogue or fall back to the rejected synthetic call.
    if (isStarted && !isPaused && !storyPlaying && !crystalPlaying) playRecordedSound('owl', 0.18);
    scheduleOwlCall();
  });
}

function playTone({ frequency = 180, duration = 0.26, type = 'sine', volume = 0.09 }) {
  const ctx = createAudioContext();
  if (!ctx) return;

  const oscillator = ctx.createOscillator();
  const gain = ctx.createGain();
  oscillator.type = type;
  oscillator.frequency.setValueAtTime(frequency, ctx.currentTime);
  gain.gain.setValueAtTime(0.0001, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(volume, ctx.currentTime + 0.04);
  gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);

  oscillator.connect(gain);
  gain.connect(ctx.destination);
  oscillator.start();
  oscillator.stop(ctx.currentTime + duration);
}

function setStoryOverlay(title, text, visible = true, speaker = 'The Night Attendant') {
  storyTitle.textContent = title;
  storySpeaker.textContent = speaker;
  storyText.textContent = text;
  storyOverlay.classList.toggle('hidden', !visible);
  storyOverlay.classList.toggle('visible', visible);
}

function updateProgress() {
  syncHintStep();
  updateHintButton();
  progressSteps.forEach((step, index) => {
    step.classList.toggle('complete', index < activeAttraction.current);
  });
  storyProgress.setAttribute('aria-label', `${activeAttraction.title} progress: ${activeAttraction.current} of 3`);
  attractionLabel.textContent = activeAttraction.title;
  progressLabel.textContent = activeAttraction === fortuneStory ? 'Wish clues' : activeAttraction === carouselStory ? 'Ride clues' : 'Ticket clues';
  journeyProgress.textContent = `Memories restored: ${recoveredMemories.size} of 3`;
}

function syncHintStep() {
  const stepKey = `${activeAttraction.title}:${activeAttraction.current}`;
  if (stepKey !== hintStepKey) {
    hintStepKey = stepKey;
    requestedHints = 0;
  }
}

function resetProgressiveHints() {
  syncHintStep();
  updateHintButton();
  clearTimerGroup('hints');
  clearVisualCues();
  midwayHotspots.forEach((hotspot) => {
    hotspot.classList.remove('hint-shimmer', 'hint-outline');
  });

  if (!isStarted || isPaused || storyPlaying || crystalPlaying || activeAttraction.complete) return;

  const expectedTarget = midwayHotspots.find((hotspot) => (
    hotspot.dataset.midwayTarget === activeAttraction.sequence[activeAttraction.current]
  ));
  if (!expectedTarget) return;

  // Only the opening lantern guides automatically; later target glows are requested.
  const opening = activeAttraction === lastTicket && lastTicket.current === 0;
  if (opening) {
    scheduleTimer('hints', 6000, () => {
      expectedTarget.classList.add('hint-shimmer');
      scene.classList.add('cue-lantern');
    });
  } else if (requestedHints >= 2) {
    showRequestedGlow();
  }
  scheduleTimer('hints', 12000, () => {
    if (requestedHints === 0) setHint(currentHints()[activeAttraction.current][1]);
  });
  scheduleTimer('hints', 20000, () => {
    if (requestedHints > 0) return;
    setHint(opening ? currentHints()[0][2] : 'Still searching? Tap Hint for another clue; a second request will show you where to look.');
  });
}

function showTapFeedback(target, type) {
  clearTimerGroup('feedback');
  midwayHotspots.forEach((hotspot) => {
    hotspot.classList.remove('tap-correct', 'tap-incorrect');
  });

  const feedbackClass = type === 'correct' ? 'tap-correct' : 'tap-incorrect';
  target.classList.add(feedbackClass);

  scheduleTimer('feedback', 900, () => target.classList.remove(feedbackClass));
}

function clearCarouselState() {
  carouselStory.current = 0;
  carouselStory.complete = false;
  scene.classList.remove('carousel-mode', 'carousel-bell-awake', 'carousel-lit', 'story-carousel', 'carousel-gallop', 'carousel-wave', 'carousel-depart');
}

function enterCarousel() {
  clearFortuneState();
  recoveredMemories.delete(carouselStory);
  recoveredMemories.delete(fortuneStory);
  clearAttractionTimers();
  clearVisualCues();
  clearCarouselState();
  activeAttraction = carouselStory;
  scene.classList.add('carousel-mode', 'has-power');
  midwayHotspots.forEach((hotspot) => hotspot.classList.remove('step-complete', 'tap-correct', 'tap-incorrect', 'hint-shimmer', 'hint-outline', 'decoy-active'));
  replayButton.hidden = true;
  replayButton.textContent = 'Replay carousel';
  carouselButton.hidden = false;
  carouselButton.textContent = 'Return to ticket booth';
  setStoryOverlay('', '', false);
  updateProgress();
  setMidwayHotspotsEnabled(true);
  setHint(getExplorationHint());
  resetProgressiveHints();
}

function finishCarouselStory() {
  clearTimerGroup('story');
  storyPlaying = false;
  carouselStory.complete = true;
  recoveredMemories.add(carouselStory);
  updateProgress();
  activeStoryHint = '';
  scene.classList.remove('story-playing', 'story-lock', 'story-carousel', 'carousel-gallop', 'carousel-wave', 'carousel-depart');
  setStoryOverlay('', '', false);
  setMidwayHotspotsEnabled(!isPaused);
  replayButton.hidden = false;
  carouselButton.textContent = 'Follow her wish →';
  setHint('“One last ride! Now… where did I leave my wish?” She points toward the fortune-teller’s wagon.');
}

function startCarouselStory() {
  clearTimerGroup('hints');
  clearTimerGroup('decoys');
  clearVisualCues();
  midwayHotspots.forEach((hotspot) => hotspot.classList.remove('decoy-active', 'hint-shimmer', 'hint-outline'));
  storyPlaying = true;
  activeStoryHint = 'The bell chimes. The carousel lights chase around its roof.';
  scene.classList.add('story-playing', 'story-lock', 'story-carousel', 'carousel-lit');
  setMidwayHotspotsEnabled(false);
  setHint(activeStoryHint);
  if (!playRecordedSound('bell')) playTone({ frequency: 784, duration: 0.5, type: 'triangle', volume: 0.07 });
  scheduleTimer('story', 1200, () => {
    scene.classList.add('carousel-gallop');
    activeStoryHint = 'A white horse leaps free, carrying a rider made of moonlight!';
    setHint(activeStoryHint);
  });
  // A short original music-box phrase follows the same pause-aware story clock.
  [523, 659, 784, 659, 587, 698, 880, 784].forEach((frequency, index) => {
    scheduleTimer('story', 1300 + index * 520, () => playTone({ frequency, duration: 0.4, type: 'sine', volume: 0.05 }));
  });
  scheduleTimer('story', 3400, () => {
    scene.classList.add('carousel-wave');
    activeStoryHint = 'Her unused ticket finally buys her the ride she missed.';
    setHint(activeStoryHint);
    setStoryOverlay(carouselStory.title, '“One last ride! Now… where did I leave my wish?”', true, 'The Forgotten Guest');
  });
  scheduleTimer('story', 6200, () => {
    scene.classList.add('carousel-depart');
    activeStoryHint = 'She leaves a trail of moonlight toward the fortune-teller’s wagon.';
    setHint(activeStoryHint);
    playTone({ frequency: 1046, duration: 0.8, volume: 0.045 });
  });
  scheduleTimer('story', 8200, finishCarouselStory);
}

function handleOrderedAttractionTap(target, actual) {
  const attraction = activeAttraction;
  if (attraction.complete) {
    if (decoyResponses[actual]) playDecoy(target, actual);
    else {
      showTapFeedback(target, 'incorrect');
      playTone({ frequency: 180, duration: 0.2, volume: 0.04 });
      setHint(getExplorationHint());
    }
    return;
  }
  if (actual !== attraction.sequence[attraction.current]) {
    if (decoyResponses[actual]) playDecoy(target, actual);
    else {
      showTapFeedback(target, 'incorrect');
      playTone({ frequency: 130, duration: 0.2, volume: 0.04 });
      setHint('Another memory is waiting. Your progress is safe.');
    }
    return;
  }
  showTapFeedback(target, 'correct');
  target.classList.add('step-complete');
  attraction.current += 1;
  updateProgress();
  playTone({ frequency: targetTones[actual], duration: 0.35, type: 'triangle', volume: 0.07 });
  if (actual === 'bell') {
    playDecoy(target, actual);
    scene.classList.add('carousel-bell-awake');
  }
  if (actual === 'carousel-light') scene.classList.add('carousel-lit');
  if (actual === 'moon-sign') {
    playDecoy(target, actual);
    scene.classList.add('fortune-moonlit');
  }
  if (actual === 'wagon-lantern') scene.classList.add('fortune-lantern-lit');
  if (attraction.current === 3) {
    if (attraction === fortuneStory) startFortuneStory();
    else startCarouselStory();
    return;
  }
  setHint(`${attraction.current} of 3 clues awake. ${getExplorationHint()}`);
  resetProgressiveHints();
}

function clearFortuneState() {
  fortuneStory.current = 0;
  fortuneStory.complete = false;
  scene.classList.remove('fortune-mode', 'fortune-moonlit', 'fortune-lantern-lit', 'story-fortune', 'wish-revealed', 'wish-travelling', 'park-restored');
}

function enterFortune() {
  clearAttractionTimers();
  clearVisualCues();
  clearFortuneState();
  recoveredMemories.delete(fortuneStory);
  activeAttraction = fortuneStory;
  scene.classList.remove('carousel-mode', 'crystal-used');
  scene.classList.add('fortune-mode', 'has-power');
  midwayHotspots.forEach((hotspot) => hotspot.classList.remove('step-complete', 'tap-correct', 'tap-incorrect', 'hint-shimmer', 'hint-outline', 'decoy-active'));
  replayButton.hidden = true;
  replayButton.textContent = 'Replay her wish';
  carouselButton.hidden = false;
  carouselButton.textContent = 'Return to ticket booth';
  setStoryOverlay('', '', false);
  updateProgress();
  setMidwayHotspotsEnabled(true);
  setHint(getExplorationHint());
  resetProgressiveHints();
}

function startFortuneStory() {
  clearTimerGroup('hints');
  clearTimerGroup('decoys');
  clearVisualCues();
  midwayHotspots.forEach((hotspot) => hotspot.classList.remove('decoy-active', 'hint-shimmer', 'hint-outline'));
  storyPlaying = true;
  scene.classList.add('story-playing', 'story-lock', 'story-fortune');
  setMidwayHotspotsEnabled(false);
  activeStoryHint = 'The crystal opens a window into the wish she left behind.';
  setHint(activeStoryHint);
  playTone({ frequency: 330, duration: 0.8, volume: 0.065 });
  scheduleTimer('story', 1200, () => {
    scene.classList.add('wish-revealed');
    setStoryOverlay(fortuneStory.title, '“I wish the midway could shine again—for everyone.”', true, 'Her Forgotten Wish');
    activeStoryHint = 'Her wish was never for herself. She wanted the park to welcome everyone again.';
    setHint(activeStoryHint);
    playTone({ frequency: 523, duration: 0.8, type: 'triangle', volume: 0.06 });
  });
  scheduleTimer('story', 4100, () => {
    scene.classList.add('wish-travelling');
    activeStoryHint = 'Her wish lifts from the crystal and flies toward the dark castle.';
    setHint(activeStoryHint);
    playRecordedSound('gust', 0.1);
    playTone({ frequency: 659, duration: 0.9, volume: 0.055 });
  });
  scheduleTimer('story', 6200, () => {
    scene.classList.add('park-restored');
    setStoryOverlay('The Midway Remembers', '“A little wonder should never stay forgotten.”', true);
    activeStoryHint = 'The castle glows. Ticket, ride, and wish are reunited—the park can welcome visitors again.';
    setHint(activeStoryHint);
    [523, 659, 784].forEach((frequency) => playTone({ frequency, duration: 1, volume: 0.035 }));
  });
  scheduleTimer('story', 8700, () => {
    storyPlaying = false;
    fortuneStory.complete = true;
    recoveredMemories.add(fortuneStory);
    activeStoryHint = '';
    scene.classList.remove('story-playing', 'story-lock', 'story-fortune', 'wish-revealed', 'wish-travelling');
    updateProgress();
    setStoryOverlay('', '', false);
    setMidwayHotspotsEnabled(!isPaused);
    replayButton.hidden = false;
    carouselButton.textContent = 'Start another visit';
    setHint(getExplorationHint());
  });
}

function resetLastTicket() {
  hintStepKey = '';
  requestedHints = 0;
  recoveredMemories.clear();
  clearFortuneState();
  activeAttraction = lastTicket;
  clearCarouselState();
  clearVisualCues();
  carouselButton.hidden = true;
  carouselButton.textContent = 'Explore the carousel';
  replayButton.textContent = 'Replay · lights out';
  clearTimerGroup('story');
  clearTimerGroup('crystal');
  clearTimerGroup('decoys');
  crystalPlaying = false;
  lastTicket.current = 0;
  lastTicket.complete = false;
  storyPlaying = false;
  activeStoryHint = '';
  scene.classList.remove('has-power', 'crystal-releasing', 'spirit-arrived', 'crystal-used', 'pumpkin-awake', 'cue-lantern', 'cue-crystal', 'cue-pumpkin');
  replayButton.hidden = true;
  scene.classList.remove(
    'story-lock',
    'story-playing',
    'story-last-ticket',
    'phase-awake',
    'phase-ticket',
    'phase-stamp',
    'phase-release'
  );
  midwayHotspots.forEach((hotspot) => {
    hotspot.classList.remove('step-complete', 'tap-correct', 'tap-incorrect', 'hint-shimmer', 'hint-outline', 'decoy-active');
  });
  updateProgress();
  setStoryOverlay('The Last Ticket', 'One moonlit ticket—for our bravest guest.', false);
}

function finishLastTicketStory() {
  clearTimerGroup('story');
  storyPlaying = false;
  recoveredMemories.add(lastTicket);
  updateProgress();
  activeStoryHint = '';
  scene.classList.remove(
    'story-lock',
    'story-playing',
    'story-last-ticket',
    'phase-awake',
    'phase-ticket',
    'phase-stamp',
    'phase-release'
  );
  setStoryOverlay('The Last Ticket', '“One moonlit ticket—for our bravest guest.”', false);
  setMidwayHotspotsEnabled(!isPaused);
  replayButton.hidden = false;
  carouselButton.hidden = false;
  carouselButton.disabled = isPaused;
  replayButton.disabled = isPaused;
  setHint('A horse is stamped on the unused ticket. Follow it to the carousel: perhaps her favorite ride remembers.');
}

function startLastTicketStory() {
  clearTimerGroup('hints');
  scene.classList.remove('cue-lantern', 'cue-crystal', 'cue-pumpkin');
  clearTimerGroup('decoys');
  midwayHotspots.forEach((hotspot) => hotspot.classList.remove('decoy-active', 'hint-shimmer', 'hint-outline'));
  lastTicket.complete = true;
  storyPlaying = true;
  activeStoryHint = 'The pumpkin flares orange! Its magic wakes the ticket window.';
  setMidwayHotspotsEnabled(false);
  scene.classList.add('story-lock', 'story-playing', 'story-last-ticket', 'phase-awake', 'pumpkin-awake');
  setHint(activeStoryHint);
  playTone({ frequency: 190, duration: 0.55, type: 'sawtooth', volume: 0.05 });

  scheduleTimer('story', 1200, () => {
    scene.classList.add('phase-ticket');
    activeStoryHint = 'An unused ticket rises from the window, bearing the stamp of a carousel horse.';
    setHint(activeStoryHint);
    playTone({ frequency: 420, duration: 0.55, type: 'triangle', volume: 0.07 });
  });

  scheduleTimer('story', 3400, () => {
    scene.classList.add('phase-stamp');
    activeStoryHint = 'The park’s final guest never used her ticket. You can finish the visit she left behind.';
    setHint(activeStoryHint);
    setStoryOverlay('The Last Ticket', '“One ticket was never used. Perhaps her favorite ride remembers.”', true);
    if (!playRecordedSound('bell', 0.09)) playTone({ frequency: 660, duration: 0.6, type: 'sine', volume: 0.08 });
  });

  scheduleTimer('story', 6100, () => {
    scene.classList.add('phase-release');
    activeStoryHint = 'The ticket dissolves into golden sparks.';
    setHint(activeStoryHint);
    playTone({ frequency: 780, duration: 0.7, type: 'sine', volume: 0.055 });
  });

  scheduleTimer('story', 8200, finishLastTicketStory);
}

function releaseCrystalGhost() {
  clearTimerGroup('hints');
  scene.classList.remove('cue-lantern', 'cue-crystal', 'cue-pumpkin');
  clearTimerGroup('decoys');
  midwayHotspots.forEach((hotspot) => hotspot.classList.remove('hint-shimmer', 'hint-outline', 'decoy-active'));
  crystalPlaying = true;
  setMidwayHotspotsEnabled(false);
  scene.classList.add('crystal-releasing', 'crystal-used');
  activeStoryHint = 'A friendly green ghost bursts out of the crystal ball! Follow it across the midway.';
  setHint(activeStoryHint);
  if (!playRecordedSound('gust', 0.14)) playTone({ frequency: 280, duration: 1.3, type: 'sine', volume: 0.075 });
  scheduleTimer('crystal', 3100, () => {
    scene.classList.add('spirit-arrived');
    activeStoryHint = 'The ghost dives into the pumpkin! Its green eyes and grin are waiting for your touch.';
    setHint(activeStoryHint);
    playTone({ frequency: 620, duration: 0.6, type: 'triangle', volume: 0.065 });
  });
  scheduleTimer('crystal', 4100, () => {
    scene.classList.remove('crystal-releasing');
    crystalPlaying = false;
    setMidwayHotspotsEnabled(!isPaused);
    resetProgressiveHints();
  });
}

function playDecoy(target, name) {
  // One reaction at a time makes rapid tapping restart cleanly and keeps timers bounded.
  clearTimerGroup('decoys');
  midwayHotspots.forEach((hotspot) => hotspot.classList.remove('decoy-active'));
  void target.offsetWidth;
  target.classList.add('decoy-active');
  if (name !== 'bell' || !playRecordedSound('bell')) {
    playTone({ frequency: { horse: 170, bell: 720, 'moon-sign': 250 }[name], duration: 0.5, type: 'sine', volume: 0.055 });
  }
  setHint(decoyResponses[name]);
  scheduleTimer('decoys', 2400, () => target.classList.remove('decoy-active'));
}

function handleMidwayTap(event) {
  const target = event.currentTarget;
  if (!isStarted || isPaused || storyPlaying || crystalPlaying) return;

  const actual = target.dataset.midwayTarget;

  if (activeAttraction === carouselStory || activeAttraction === fortuneStory) {
    handleOrderedAttractionTap(target, actual);
    return;
  }

  if (decoyResponses[actual]) {
    playDecoy(target, actual);
    return;
  }

  if (lastTicket.complete) {
    if (actual !== lastTicket.sequence[0]) {
      showTapFeedback(target, 'incorrect');
      playTone({ frequency: 130, duration: 0.18, type: 'square', volume: 0.05 });
      setHint('The stamped ticket points back to the booth lantern.');
      return;
    }

    resetLastTicket();
  }

  const expected = lastTicket.sequence[lastTicket.current];
  if (actual !== expected) {
    showTapFeedback(target, 'incorrect');
    playTone({ frequency: 130, duration: 0.18, type: 'square', volume: 0.05 });
    setHint('The midway shivers, but your ticket stamps remain. Another clue is waiting.');
    resetProgressiveHints();
    return;
  }

  showTapFeedback(target, 'correct');
  target.classList.add('step-complete');
  if (actual === 'booth-lantern') {
    scene.classList.add('has-power');
    playTone({ frequency: 190, duration: 0.45, type: 'sawtooth', volume: 0.035 });
  }
  lastTicket.current += 1;
  updateProgress();
  playTone({ frequency: targetTones[actual], duration: 0.24, type: 'triangle', volume: 0.075 });

  if (actual === 'crystal-ball') {
    releaseCrystalGhost();
    return;
  }

  if (lastTicket.current < lastTicket.sequence.length) {
    setHint(`${actual === 'booth-lantern' ? 'The whole midway lights up! ' : ''}${lastTicket.current} of 3 ticket stamps glow. ${getExplorationHint()}`);
    resetProgressiveHints();
    return;
  }

  startLastTicketStory();
}

function moveHotspotFocus(event) {
  const direction = arrowDirections[event.key];
  if (!direction || event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
  if (!isStarted || isPaused || storyPlaying || crystalPlaying || event.currentTarget.disabled) return;

  event.preventDefault();
  const origin = event.currentTarget.getBoundingClientRect();
  let nearest = null;
  let bestScore = Infinity;
  midwayHotspots.forEach((hotspot) => {
    if (hotspot === event.currentTarget || hotspot.disabled) return;
    const bounds = hotspot.getBoundingClientRect();
    const dx = bounds.x + bounds.width / 2 - origin.x - origin.width / 2;
    const dy = bounds.y + bounds.height / 2 - origin.y - origin.height / 2;
    const forward = dx * direction[0] + dy * direction[1];
    if (forward <= 1) return;
    // Prefer nearby objects in the pressed direction over distant diagonal ones.
    const sideways = Math.abs(dx * direction[1] - dy * direction[0]);
    const score = Math.hypot(dx, dy) + sideways * 2;
    if (score < bestScore) {
      bestScore = score;
      nearest = hotspot;
    }
  });
  nearest?.focus({ preventScroll: true });
}

function startHotspotFocus(event) {
  if (event.defaultPrevented || !arrowDirections[event.key] || event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
  if (!isStarted || isPaused || storyPlaying || crystalPlaying) return;
  // A pointer-started visit may leave focus on the hidden Enter button or body.
  // Do not steal arrow keys from Hint, Pause, or any other interactive control.
  const focused = document.activeElement;
  if (focused !== enterButton && focused?.closest('button, a, input, textarea, select, [contenteditable]')) return;
  const firstTarget = midwayHotspots.find((hotspot) => !hotspot.disabled);
  if (!firstTarget) return;
  event.preventDefault();
  firstTarget.focus({ preventScroll: true });
}

function bindMidwayInteractions() {
  midwayHotspots.forEach((hotspot) => {
    hotspot.addEventListener('click', handleMidwayTap);
    hotspot.addEventListener('keydown', moveHotspotFocus);
  });
  document.addEventListener('keydown', startHotspotFocus);
}

function prepareMidwayInteractionMap() {
  midwayHotspots.forEach((hotspot, index) => {
    hotspot.style.setProperty('--glint-delay', `${-index * 0.7}s`);
    const sparks = document.createElement('span');
    sparks.className = 'clue-sparks';
    sparks.setAttribute('aria-hidden', 'true');
    sparks.textContent = '✦';
    hotspot.appendChild(sparks);
  });
  Object.keys(decoyResponses).forEach((name) => {
    const target = midwayHotspots.find((hotspot) => hotspot.dataset.midwayTarget === name);
    const reaction = target.querySelector('svg').cloneNode(true);
    reaction.setAttribute('class', 'object-reaction');
    target.appendChild(reaction);
  });
  document.querySelectorAll('.story-target').forEach((element) => {
    element.classList.add('legacy-story-target');
    element.setAttribute('aria-hidden', 'true');
    element.tabIndex = -1;
  });
}

function beginExperience(event) {
  isStarted = true;
  scene.classList.add('is-started');
  startScreen.classList.add('hidden');
  setMidwayHotspotsEnabled(true);
  createAudioContext();
  startAmbientAudio();
  setHint(getExplorationHint());
  resetProgressiveHints();
  if (event?.detail === 0) midwayHotspots[0].focus({ preventScroll: true });
}

enterButton.addEventListener('click', beginExperience);
hintButton.addEventListener('click', () => {
  if (!isStarted || isPaused || storyPlaying || crystalPlaying || activeAttraction.complete || !scene.classList.contains('has-power')) return;
  requestedHints = Math.min(2, requestedHints + 1);
  clearTimerGroup('hints');
  setHint(currentHints()[activeAttraction.current][requestedHints]);
  if (requestedHints === 2) showRequestedGlow();
  updateHintButton();
});
replayButton.addEventListener('click', () => {
  if (!isStarted || isPaused || storyPlaying) return;
  if (activeAttraction === fortuneStory) {
    enterFortune();
    return;
  }
  if (activeAttraction === carouselStory) {
    enterCarousel();
    return;
  }
  resetLastTicket();
  setMidwayHotspotsEnabled(true);
  setHint(getExplorationHint());
  resetProgressiveHints();
});
carouselButton.addEventListener('click', () => {
  if (!isStarted || isPaused || storyPlaying || crystalPlaying) return;
  if (activeAttraction === carouselStory && carouselStory.complete) {
    enterFortune();
  } else if (activeAttraction !== lastTicket) {
    resetLastTicket();
    setMidwayHotspotsEnabled(true);
    setHint(getExplorationHint());
    resetProgressiveHints();
  } else if (lastTicket.complete) enterCarousel();
});
pauseToggle.addEventListener('click', () => {
  if (!isStarted) return;
  setPaused(!isPaused);
});

prepareMidwayInteractionMap();
bindMidwayInteractions();
updateProgress();
setHint('The midway is listening for a first clue.');
if (reduceMotion) {
  setHint('Reduced motion is active. Tap feedback will remain visible without animation.');
}
