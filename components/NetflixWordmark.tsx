"use client";

import { motion } from "framer-motion";
import { useEffect, useRef } from "react";

/**
 * Netflix-style title reveal: a deep "ta-dum" (synthesized with WebAudio —
 * no audio file needed), then TEDx NITT stamps in letter by letter.
 *
 * The whole sequence is gated on the `start` prop: the hero flips it to
 * true only after the WebGL scene has compiled and rendered its first
 * frames, so the intro never fights the GPU for the main thread — this
 * is what killed the start-up lag.
 *
 * Browsers block sound before the first user gesture; if blocked, the
 * ta-dum fires on the first click / keypress / touch instead.
 */
function playTaDum() {
  type WindowWithWebkit = Window & { webkitAudioContext?: typeof AudioContext };
  const Ctx =
    window.AudioContext || (window as WindowWithWebkit).webkitAudioContext;
  if (!Ctx) return;
  const ctx = new Ctx();

  const strike = () => {
    const t0 = ctx.currentTime + 0.02;
    const hit = (
      t: number,
      f0: number,
      f1: number,
      dur: number,
      vol: number
    ) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(f0, t);
      osc.frequency.exponentialRampToValueAtTime(f1, t + dur);
      gain.gain.setValueAtTime(vol, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + dur);
      osc.connect(gain).connect(ctx.destination);
      osc.start(t);
      osc.stop(t + dur);
    };
    hit(t0, 170, 58, 0.4, 0.55); // ta
    hit(t0 + 0.22, 120, 42, 1.1, 0.8); // DUMMM
  };

  if (ctx.state === "suspended") {
    const unlock = () => {
      ctx.resume().then(strike);
      ["pointerdown", "keydown", "touchstart"].forEach((e) =>
        window.removeEventListener(e, unlock)
      );
    };
    ["pointerdown", "keydown", "touchstart"].forEach((e) =>
      window.addEventListener(e, unlock, { once: true })
    );
  } else {
    strike();
  }
}

const letters: { ch: string; red: boolean }[] = [
  { ch: "T", red: true },
  { ch: "E", red: true },
  { ch: "D", red: true },
  { ch: "x", red: true },
  { ch: "N", red: false },
  { ch: "I", red: false },
  { ch: "T", red: false },
  { ch: "T", red: false },
];

// timings are relative to the moment `start` flips true
const REVEAL_START = 0.55; // ta-dum lands, then the first letter
const STAGGER = 0.14;

export default function NetflixWordmark({ start = true }: { start?: boolean }) {
  const played = useRef(false);

  useEffect(() => {
    if (!start || played.current) return;
    played.current = true;
    const id = setTimeout(playTaDum, 120);
    return () => clearTimeout(id);
  }, [start]);

  return (
    <motion.h1
      className="headline flex items-baseline text-[19vw] leading-none md:text-[13vw]"
      initial={{ filter: "drop-shadow(0 0 0px rgba(235,0,40,0))" }}
      animate={
        start
          ? {
              filter: [
                "drop-shadow(0 0 0px rgba(235,0,40,0))",
                "drop-shadow(0 0 55px rgba(235,0,40,0.85))",
                "drop-shadow(0 0 22px rgba(235,0,40,0.45))",
              ],
            }
          : undefined
      }
      transition={{
        delay: REVEAL_START + letters.length * STAGGER,
        duration: 1.6,
        times: [0, 0.35, 1],
      }}
    >
      {letters.map((l, i) => (
        <motion.span
          key={i}
          className={l.red ? "text-ted-red" : "text-ted-bone"}
          style={{ display: "inline-block", transformOrigin: "50% 80%" }}
          initial={{ opacity: 0, scale: 3.2, filter: "blur(14px)" }}
          animate={
            start ? { opacity: 1, scale: 1, filter: "blur(0px)" } : undefined
          }
          transition={{
            delay: REVEAL_START + i * STAGGER,
            duration: 0.55,
            ease: [0.16, 1, 0.3, 1],
          }}
        >
          {l.ch}
        </motion.span>
      ))}
    </motion.h1>
  );
}
