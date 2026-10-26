const scene = document.getElementById('scene');
const startScreen = document.getElementById('startScreen');
const enterButton = document.getElementById('enterButton');
const pauseToggle = document.getElementById('pauseToggle');
const pauseScreen = document.getElementById('pauseScreen');
const replayButton = document.getElementById('replayButton');
const hintText = document.getElementById('hintText');
const storyOverlay = document.getElementById('storyOverlay');
const storyTitle = document.getElementById('storyTitle');
const storyText = document.getElementById('storyText');
const midwayHotspots = [...document.querySelectorAll('.midway-hotspot')];
const storyProgress = document.getElementById('storyProgress');
const progressSteps = [...document.querySelectorAll('.progress-step')];

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

let isStarted = false;
let isPaused = false;
let storyPlaying = false;
let crystalPlaying = false;
let audioContext = null;
let ambientWind = null;
let owlTimer = null;
let activeStoryHint = '';

const timerGroups = {
  hints: [],
  story: [],
  feedback: [],
  crystal: [],
  decoys: []
};

const lastTicket = {
  sequence: ['booth-lantern', 'crystal-ball', 'pumpkin-face'],
  current: 0,
  complete: false
};

const progressHints = [
  ['The midway has gone dark. One lantern still flickers beside the ticket window.', 'Look beneath the pumpkin roof, on the left side of the booth window.', 'Tap the flickering lantern beside the booth window to wake the midway lights.'],
  ['A green glow answers from across the midway.', 'Look inside the fortune-teller’s wagon on the right.', 'The glowing green crystal ball is waiting inside the right-hand wagon.'],
  ['Bring the magic back to the booth’s biggest smile.', 'Look above the ticket window, beneath the curling stem.', 'The giant smiling pumpkin above the booth holds the last spark.']
];

const decoyResponses = {
  horse: 'A ghostly horse leaps off the carousel… and slips back into its painted saddle. No ticket stamp, just a little mischief!',
  bell: 'Ding-ding-ding! The bell rings itself silly. The midway laughs, but your ticket stays the same.',
  'moon-sign': 'The moon spins a purple spell… then forgets what it was casting. Your ticket progress is safe.'
};

const targetTones = {
  'booth-lantern': 340,
  'crystal-ball': 430,
  'pumpkin-face': 540
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
  if (lastTicket.complete) {
    return 'The ticket is stamped. Tap the booth lantern to replay the sequence.';
  }

  return progressHints[lastTicket.current][0];
}

function setMidwayHotspotsEnabled(enabled) {
  midwayHotspots.forEach((hotspot) => {
    hotspot.disabled = !enabled;
  });
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

  if (audioContext.state === 'suspended') {
    audioContext.resume();
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

  if (!owlTimer) {
    owlTimer = window.setInterval(() => {
      if (!isStarted || isPaused || storyPlaying) return;
      const owlCtx = createAudioContext();
      const oscillator = owlCtx.createOscillator();
      const gain = owlCtx.createGain();
      oscillator.type = 'triangle';
      oscillator.frequency.setValueAtTime(240, owlCtx.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(110, owlCtx.currentTime + 0.7);
      gain.gain.setValueAtTime(0.0001, owlCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.08, owlCtx.currentTime + 0.1);
      gain.gain.exponentialRampToValueAtTime(0.0001, owlCtx.currentTime + 1.2);
      oscillator.connect(gain);
      gain.connect(owlCtx.destination);
      oscillator.start();
      oscillator.stop(owlCtx.currentTime + 1.3);
    }, 7000);
  }
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

function setStoryOverlay(title, text, visible = true) {
  storyTitle.textContent = title;
  storyText.textContent = text;
  storyOverlay.classList.toggle('hidden', !visible);
  storyOverlay.classList.toggle('visible', visible);
}

function updateProgress() {
  progressSteps.forEach((step, index) => {
    step.classList.toggle('complete', index < lastTicket.current);
  });
  storyProgress.setAttribute('aria-label', `The Last Ticket progress: ${lastTicket.current} of 3`);
}

function resetProgressiveHints() {
  clearTimerGroup('hints');
  midwayHotspots.forEach((hotspot) => {
    hotspot.classList.remove('hint-shimmer', 'hint-outline');
  });

  if (!isStarted || isPaused || storyPlaying || crystalPlaying || lastTicket.complete) return;

  const expectedTarget = midwayHotspots.find((hotspot) => (
    hotspot.dataset.midwayTarget === lastTicket.sequence[lastTicket.current]
  ));
  if (!expectedTarget) return;

  scheduleTimer('hints', 6000, () => {
    expectedTarget.classList.add('hint-shimmer');
  });
  scheduleTimer('hints', 12000, () => {
    setHint(progressHints[lastTicket.current][1]);
  });
  scheduleTimer('hints', 20000, () => {
    expectedTarget.classList.remove('hint-shimmer');
    expectedTarget.classList.add('hint-outline');
    setHint(progressHints[lastTicket.current][2]);
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

function resetLastTicket() {
  clearTimerGroup('story');
  clearTimerGroup('crystal');
  clearTimerGroup('decoys');
  crystalPlaying = false;
  lastTicket.current = 0;
  lastTicket.complete = false;
  storyPlaying = false;
  activeStoryHint = '';
  scene.classList.remove('has-power', 'crystal-releasing', 'spirit-arrived', 'crystal-used', 'pumpkin-awake');
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
  replayButton.disabled = isPaused;
  setHint('The ticket is stamped and the midway shines. Replay turns the lights off for another visit.');
}

function startLastTicketStory() {
  clearTimerGroup('hints');
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
    activeStoryHint = 'A forgotten ticket rises from the glowing window.';
    setHint(activeStoryHint);
    playTone({ frequency: 420, duration: 0.55, type: 'triangle', volume: 0.07 });
  });

  scheduleTimer('story', 3400, () => {
    scene.classList.add('phase-stamp');
    activeStoryHint = 'The Night Attendant welcomes the midway’s bravest guest.';
    setHint(activeStoryHint);
    setStoryOverlay('The Last Ticket', '“One moonlit ticket—for our bravest guest.”', true);
    playTone({ frequency: 660, duration: 0.6, type: 'sine', volume: 0.08 });
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
  clearTimerGroup('decoys');
  midwayHotspots.forEach((hotspot) => hotspot.classList.remove('hint-shimmer', 'hint-outline', 'decoy-active'));
  crystalPlaying = true;
  setMidwayHotspotsEnabled(false);
  scene.classList.add('crystal-releasing', 'crystal-used');
  activeStoryHint = 'A friendly green ghost bursts out of the crystal ball! Follow it across the midway.';
  setHint(activeStoryHint);
  playTone({ frequency: 280, duration: 1.3, type: 'sine', volume: 0.075 });
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
  playTone({ frequency: { horse: 170, bell: 720, 'moon-sign': 250 }[name], duration: 0.5, type: 'sine', volume: 0.055 });
  setHint(decoyResponses[name]);
  scheduleTimer('decoys', 2400, () => target.classList.remove('decoy-active'));
}

function handleMidwayTap(event) {
  const target = event.currentTarget;
  if (!isStarted || isPaused || storyPlaying || crystalPlaying) return;

  const actual = target.dataset.midwayTarget;

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

function bindMidwayInteractions() {
  midwayHotspots.forEach((hotspot) => {
    hotspot.addEventListener('click', handleMidwayTap);
  });
}

function prepareMidwayInteractionMap() {
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

function beginExperience() {
  isStarted = true;
  scene.classList.add('is-started');
  startScreen.classList.add('hidden');
  setMidwayHotspotsEnabled(true);
  createAudioContext();
  startAmbientAudio();
  setHint(getExplorationHint());
  resetProgressiveHints();
}

enterButton.addEventListener('click', beginExperience);
replayButton.addEventListener('click', () => {
  if (!isStarted || isPaused || storyPlaying) return;
  resetLastTicket();
  setMidwayHotspotsEnabled(true);
  setHint(getExplorationHint());
  resetProgressiveHints();
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
