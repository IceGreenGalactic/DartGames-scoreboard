import clickSound from "../../assets/sounds/Click.wav";
import bullSound from "../../assets/sounds/BullsEye.wav";
import missSound from "../../assets/sounds/Miss.wav";
import bustSound from "../../assets/sounds/Bust.wav";
import activatedSound from "../../assets/sounds/Activated.wav";
import winSound from "../../assets/sounds/Win.wav";

let ctx = null;
let unlocked = false;
let muteUntil = 0;

let resumeP = null;

const buffers = new Map();
const gains = new Map();
const playing = new Set();

const SOUND = {
  tick: { url: clickSound, vol: 0.3 },
  bull: { url: bullSound, vol: 1.0 },
  miss: { url: missSound, vol: 0.8 },
  bust: { url: bustSound, vol: 1.0 },
  activated: { url: activatedSound, vol: 0.6 },
  win: { url: winSound, vol: 0.9 },
};

function ensureCtx() {
  if (ctx) return ctx;
  const AC = window.AudioContext || window.webkitAudioContext;
  ctx = new AC();

  Object.entries(SOUND).forEach(([k, v]) => {
    const g = ctx.createGain();
    g.gain.value = v.vol ?? 1;
    g.connect(ctx.destination);
    gains.set(k, g);
  });

  return ctx;
}

function resumeOnce() {
  const c = ensureCtx();
  if (c.state === "running") return Promise.resolve();

  if (!resumeP) {
    resumeP = c
      .resume()
      .catch(() => {})
      .finally(() => {
        resumeP = null;
      });
  }
  return resumeP;
}

async function loadBuffer(key) {
  if (buffers.has(key)) return buffers.get(key);

  const c = ensureCtx();
  try {
    const res = await fetch(SOUND[key].url);
    if (!res.ok) throw new Error(`fetch failed ${key}: ${res.status}`);
    const ab = await res.arrayBuffer();
    const buf = await c.decodeAudioData(ab);
    buffers.set(key, buf);
    return buf;
  } catch (e) {
    console.error("[sfx] loadBuffer failed:", key, e);
    return null;
  }
}

export async function sfxPrime() {
  ensureCtx();
  await Promise.all(Object.keys(SOUND).map(loadBuffer));
}

export function sfxUnlock() {
  unlocked = true;
  resumeOnce();
}

function stopAll() {
  for (const s of Array.from(playing)) {
    try {
      s.stop();
    } catch {}
  }
  playing.clear();
}

function playKey(key, { ignoreMute = false, interrupt = false } = {}) {
  const c = ensureCtx();
  if (!unlocked) return;
  if (!ignoreMute && Date.now() < muteUntil) return;

  if (c.state !== "running") {
    resumeOnce().then(() => playKey(key, { ignoreMute, interrupt }));
    return;
  }

  const buf = buffers.get(key);
  if (!buf) {
    loadBuffer(key).then((b) => {
      if (b) playKey(key, { ignoreMute, interrupt });
    });
    return;
  }

  if (interrupt) stopAll();

  const src = c.createBufferSource();
  src.buffer = buf;

  const g = gains.get(key);
  src.connect(g);

  playing.add(src);
  src.onended = () => playing.delete(src);

  try {
    src.start(0);
  } catch {}
}

export const sfxTick = () => playKey("tick");
export const sfxBull = () => playKey("bull");
export const sfxMiss = () => playKey("miss");
export const sfxActivated = () => playKey("activated");
export const sfxWin = () => playKey("win", { interrupt: false });
export function sfxBust() {
  muteUntil = Date.now() + 500;
  playKey("bust", { ignoreMute: true, interrupt: true });
}

// ---------------- TTS ----------------
let ttsUnlocked = false;

export function ttsUnlock() {
  if (ttsUnlocked) return;
  if (!("speechSynthesis" in window)) return;
  ttsUnlocked = true;

  try {
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(" ");
    u.volume = 0;
    window.speechSynthesis.speak(u);
  } catch {}
}
// store/lib/sfx.js
import { useGameStore } from "../index";

function pickVoice(voices, lang, voiceURI) {
  if (!voices?.length) return null;

  if (voiceURI) {
    const v = voices.find((x) => x.voiceURI === voiceURI);
    if (v) return v;
  }

  const exact = voices.find((v) => v.lang === lang);
  if (exact) return exact;

  const base = lang?.split("-")[0];
  const baseMatch = voices.find((v) => v.lang?.startsWith(base));
  if (baseMatch) return baseMatch;

  return voices.find((v) => v.default) || voices[0];
}

export function speak(textOrNumber) {
  const text = String(textOrNumber ?? "").trim();
  if (!text) return 0;
  if (!("speechSynthesis" in window)) return 0;

  const s = useGameStore.getState();
  if (s.ttsEnabled === false) return 0;

  const voices = window.speechSynthesis.getVoices();
  const lang = s.ttsLang || "nb-NO";

  try {
    window.speechSynthesis.cancel();

    const u = new SpeechSynthesisUtterance(text);
    u.lang = lang;
    u.rate = s.ttsRate ?? 1;
    u.pitch = s.ttsPitch ?? 1;
    u.volume = s.ttsVolume ?? 1;

    const v = pickVoice(voices, lang, s.ttsVoiceURI);
    if (v) u.voice = v;

    window.speechSynthesis.speak(u);
  } catch {}

  return Math.max(500, text.length * 320);
}
