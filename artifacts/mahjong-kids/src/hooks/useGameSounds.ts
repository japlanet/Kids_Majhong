import { useCallback, useRef } from "react";

type AudioContextWithWebkit = typeof AudioContext & {
  new (): AudioContext;
};

function getAudioContext(): AudioContext | null {
  if (typeof window === "undefined") return null;

  const AudioContextConstructor =
    window.AudioContext ??
    (window as Window & { webkitAudioContext?: AudioContextWithWebkit }).webkitAudioContext;

  if (!AudioContextConstructor) return null;
  return new AudioContextConstructor();
}

export function useGameSounds(enabled: boolean) {
  const contextRef = useRef<AudioContext | null>(null);

  const playTone = useCallback(
    (frequency: number, duration: number, startDelay = 0, type: OscillatorType = "sine") => {
      if (!enabled) return;

      try {
        const context = contextRef.current ?? getAudioContext();
        if (!context) return;
        contextRef.current = context;

        void context.resume();
        const oscillator = context.createOscillator();
        const gain = context.createGain();
        const startAt = context.currentTime + startDelay;

        oscillator.type = type;
        oscillator.frequency.setValueAtTime(frequency, startAt);
        gain.gain.setValueAtTime(0.0001, startAt);
        gain.gain.exponentialRampToValueAtTime(0.045, startAt + 0.015);
        gain.gain.exponentialRampToValueAtTime(0.0001, startAt + duration);

        oscillator.connect(gain);
        gain.connect(context.destination);
        oscillator.start(startAt);
        oscillator.stop(startAt + duration + 0.02);
      } catch {
        // Audio is an enhancement; a browser restriction should not affect play.
      }
    },
    [enabled],
  );

  const playSelect = useCallback(() => playTone(520, 0.1), [playTone]);
  const playMismatch = useCallback(() => {
    playTone(180, 0.14, 0, "triangle");
    playTone(140, 0.16, 0.1, "triangle");
  }, [playTone]);
  const playMatch = useCallback(() => {
    playTone(660, 0.12);
    playTone(880, 0.16, 0.08);
  }, [playTone]);
  const playComplete = useCallback(() => {
    playTone(523, 0.14);
    playTone(659, 0.14, 0.1);
    playTone(784, 0.2, 0.2);
  }, [playTone]);

  return { playSelect, playMismatch, playMatch, playComplete };
}