const scene = document.getElementById('scene');
const startScreen = document.getElementById('startScreen');
const enterButton = document.getElementById('enterButton');
const pauseToggle = document.getElementById('pauseToggle');
const hintText = document.getElementById('hintText');
const storyOverlay = document.getElementById('storyOverlay');
const storyTitle = document.getElementById('storyTitle');
const storyText = document.getElementById('storyText');

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

let isStarted = false;
let isPaused = false;
let storyPlaying = false;
let audioContext = null;
let ambientWind = null;
let ambientOsc = null;
let owlTimer = null;

const stories = {
  lantern: {
    title: 'Lantern Trail',
    intro: 'The jack-o-lanterns flicker to life, and the moonlit trail begins to glow.',
    sequence: ['pumpkin', 'lantern', 'grave'],
    hints: [
      'Something in the patch is waking up.',
      'The moonlit lantern feels warmer than the rest.',
      'The oldest stone is listening for the final clue.'
    ],
    current: 0,
    done: false
  },
  crow: {
    title: 'Crow Call',
    intro: 'A feathered hush rises from the roof and the crows begin to circle.',
    sequence: ['lantern', 'pumpkin-crow', 'grave-crow'],
    hints: [
      'A hush moves through the yard; the path starts with the lantern.',
      'The hallow pumpkin answers with a darker glow.',
      'The final stone is the one that keeps the whisper.'
    ],
    current: 0,
    done: false
  },
  willow: {
    title: 'Willow Whisper',
    intro: 'The tree leans closer, and the dark whispers begin to stretch.',
    sequence: ['pumpkin-willow', 'lantern-willow', 'grave-willow'],
    hints: [
      'The tree keeps a secret in its smallest pumpkin.',
      'The silver lantern answers next.',
      'The final grave is the one that returns an echo.'
    ],
    current: 0,
    done: false
  }
};

const targetMap = new Map();

const createStoryTargetLookup = () => {
  document.querySelectorAll('.story-target').forEach((element) => {
    const key = `${element.dataset.story}:${element.dataset.target}`;
    targetMap.set(key, element);
  });
};

function setHint(text) {
  hintText.textContent = text;
}

function setPaused(paused) {
  isPaused = paused;
  pauseToggle.textContent = paused ? 'Resume' : 'Pause';
  scene.classList.toggle('is-paused', paused);

  if (audioContext && audioContext.state === 'running' && paused) {
    audioContext.suspend();
  }

  if (audioContext && audioContext.state === 'suspended' && !paused) {
    audioContext.resume();
  }

  if (paused) {
    setHint('The yard is paused. Press resume to listen again.');
  } else if (!storyPlaying) {
    setHint('The dark is listening for a first clue.');
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

function triggerSuccessEffect(target) {
  target.classList.remove('active');
  target.classList.add('correct');
  playTone({ frequency: 420, duration: 0.2, type: 'triangle', volume: 0.08 });
  setTimeout(() => target.classList.remove('correct'), 380);
}

function resetStoryProgress(storyKey) {
  const story = stories[storyKey];
  story.current = 0;
  document.querySelectorAll(`.story-target[data-story="${storyKey}"]`).forEach((element) => {
    element.classList.remove('active', 'correct', 'success');
  });
}

function setStoryOverlay(title, text, visible = true) {
  storyTitle.textContent = title;
  storyText.textContent = text;
  storyOverlay.classList.toggle('hidden', !visible);
  storyOverlay.classList.toggle('visible', visible);
}

function showStorySequence(storyKey) {
  const story = stories[storyKey];
  const targets = document.querySelectorAll(`.story-target[data-story="${storyKey}"]`);
  storyPlaying = true;
  scene.classList.add('story-lock');
  setStoryOverlay(story.title, story.intro, true);

  targets.forEach((element) => {
    element.classList.remove('active', 'correct', 'success');
    element.classList.add('success');
  });

  playTone({ frequency: 160, duration: 0.6, type: 'sawtooth', volume: 0.08 });
  playTone({ frequency: 230, duration: 0.5, type: 'triangle', volume: 0.07 });
  playTone({ frequency: 300, duration: 0.7, type: 'sine', volume: 0.06 });

  setHint(`${story.title} unfolds. The whole yard is holding its breath.`);

  window.setTimeout(() => {
    targets.forEach((element) => element.classList.remove('success'));
    setStoryOverlay(story.title, story.intro, false);
    scene.classList.remove('story-lock');
    storyPlaying = false;
    setHint('The scene is awake again. Something else is still watching.');
  }, 6200);
}

function handleTargetTap(event) {
  const target = event.currentTarget;
  if (isPaused || storyPlaying) return;

  const storyKey = target.dataset.story;
  const story = stories[storyKey];
  if (!story) return;

  const expected = story.sequence[story.current];
  const actual = target.dataset.target;

  if (expected && actual !== expected) {
    resetStoryProgress(storyKey);
    setHint('The signal changes. Try the sequence again.');
    playTone({ frequency: 120, duration: 0.18, type: 'square', volume: 0.05 });
    return;
  }

  triggerSuccessEffect(target);
  story.current += 1;

  if (story.current < story.sequence.length) {
    const nextHint = story.hints[Math.min(story.current, story.hints.length - 1)];
    setHint(nextHint);
    target.classList.add('active');
    playTone({ frequency: 260 + story.current * 40, duration: 0.22, type: 'triangle', volume: 0.07 });
    return;
  }

  story.done = true;
  setHint(`${story.title} complete. The grounds answer in a hush.`);
  showStorySequence(storyKey);
}

function bindInteractions() {
  document.querySelectorAll('.story-target').forEach((element) => {
    element.addEventListener('click', handleTargetTap);
    element.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        handleTargetTap({ currentTarget: element });
      }
    });
  });
}

function beginExperience() {
  isStarted = true;
  startScreen.classList.add('hidden');
  createAudioContext();
  startAmbientAudio();
  if (!reduceMotion) {
    setHint('The grounds are awake. Listen closely for the first clue.');
  }
}

enterButton.addEventListener('click', beginExperience);
pauseToggle.addEventListener('click', () => {
  if (!isStarted) return;
  setPaused(!isPaused);
});

createStoryTargetLookup();
bindInteractions();
setHint('The dark is listening for a first clue.');
if (reduceMotion) {
  setHint('Reduced motion mode is active. The story clues will still appear in text.');
}
