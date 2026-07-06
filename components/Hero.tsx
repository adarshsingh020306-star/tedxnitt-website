"use client";

import dynamic from "next/dynamic";
import {
  AnimatePresence,
  motion,
  useInView,
  useScroll,
  useTransform,
} from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import NetflixWordmark from "./NetflixWordmark";

const Phoenix3D = dynamic(() => import("./Phoenix3D"), { ssr: false });

/**
 * Scroll-scrubbed hero (the Castimedia scrollytelling pattern):
 * a 300vh section with a sticky WebGL canvas. Scroll drives the
 * camera dolly, the phoenix rising, and the fire shifting from
 * TED-red inferno to blue-white plasma.
 *
 * Start-up lag fix: a black curtain covers the hero while the WebGL
 * scene compiles its shaders. Only when the scene reports ready (or a
 * 3s fallback fires) does the curtain lift and the ta-dum intro play —
 * so the letter animation never stutters against shader compilation.
 */
export default function Hero() {
  const ref = useRef<HTMLElement>(null);
  const visible = useInView(ref, { margin: "100px 0px" });
  const [ready, setReady] = useState(false);
  const onSceneReady = useCallback(() => setReady(true), []);

  // fallback: never hold the curtain longer than 3s (blocked WebGL,
  // hidden tab, ancient GPU — the show must go on regardless)
  useEffect(() => {
    const id = setTimeout(() => setReady(true), 3000);
    return () => clearTimeout(id);
  }, []);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  // act 1 — the wordmark
  const kickerOpacity = useTransform(scrollYProgress, [0, 0.1], [1, 0]);
  const wordmarkOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const wordmarkY = useTransform(scrollYProgress, [0, 0.22], [0, -90]);
  const wordmarkScale = useTransform(scrollYProgress, [0, 0.22], [1, 0.9]);
  const cueOpacity = useTransform(scrollYProgress, [0, 0.08], [1, 0]);

  // act 2 — the phoenix takes the stage
  const captionOpacity = useTransform(
    scrollYProgress,
    [0.34, 0.48, 0.78, 0.94],
    [0, 1, 1, 0]
  );
  const captionY = useTransform(scrollYProgress, [0.34, 0.48], [50, 0]);

  return (
    <section ref={ref} className="relative h-[300svh] bg-black">
      <div className="sticky top-0 h-[100svh] overflow-hidden">
        {/* the phoenix in the fire halo — scroll-scrubbed */}
        <Phoenix3D
          active={visible}
          progress={scrollYProgress}
          onReady={onSceneReady}
        />

        {/* scrim + page blend */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_55%_45%_at_50%_52%,rgba(0,0,0,0.55),transparent_75%)]" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-ted-dark to-transparent" />

        {/* act 1 — kicker + Netflix wordmark */}
        <motion.p
          style={{ opacity: kickerOpacity }}
          className="pointer-events-none absolute inset-x-0 top-20 z-10 px-6 text-center text-[10px] uppercase tracking-[0.5em] text-ted-smoke md:top-24 md:text-xs"
        >
          <motion.span
            initial={{ opacity: 0, y: -16 }}
            animate={ready ? { opacity: 1, y: 0 } : undefined}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="inline-block"
          >
            An independently organized TED event
          </motion.span>
        </motion.p>

        <motion.div
          style={{ opacity: wordmarkOpacity, y: wordmarkY, scale: wordmarkScale }}
          className="pointer-events-none absolute inset-0 z-10 flex flex-col items-center justify-center"
        >
          <NetflixWordmark start={ready} />
          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={ready ? { opacity: 1, y: 0 } : undefined}
            transition={{ delay: 2.3, duration: 0.9 }}
            className="mt-6 max-w-xl px-6 text-center text-sm leading-relaxed text-ted-bone/70 md:text-base"
          >
            Ideas Worth Spreading — National Institute of Technology,
            Tiruchirappalli.
          </motion.p>
        </motion.div>

        {/* act 2 — the phoenix caption */}
        <motion.div
          style={{ opacity: captionOpacity, y: captionY }}
          className="pointer-events-none absolute inset-x-0 bottom-24 z-10 flex flex-col items-center text-center md:bottom-32"
        >
          <p className="mb-3 text-xs uppercase tracking-[0.5em] text-ted-red">
            The Spirit of X
          </p>
          <h2 className="headline px-6 text-4xl text-ted-bone md:text-6xl">
            From the Ashes, <span className="text-ted-red">Ideas Rise</span>
          </h2>
          <p className="mt-4 max-w-md px-6 text-sm leading-relaxed text-ted-bone/60">
            Five editions. One flame — PYXIS to ODYZEA, and rising.
          </p>
        </motion.div>

        {/* scroll cue */}
        <motion.div
          style={{ opacity: cueOpacity }}
          className="absolute inset-x-0 bottom-8 z-10 flex flex-col items-center gap-2"
        >
          <motion.span
            initial={{ opacity: 0 }}
            animate={ready ? { opacity: 1 } : undefined}
            transition={{ delay: 2.8 }}
            className="text-[10px] uppercase tracking-[0.4em] text-ted-smoke"
          >
            Scroll
          </motion.span>
          <motion.span
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
            className="block h-8 w-px bg-gradient-to-b from-ted-red to-transparent"
          />
        </motion.div>

        {/* loading curtain — lifts once the GPU is warm */}
        <AnimatePresence>
          {!ready && (
            <motion.div
              key="curtain"
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black"
            >
              <p className="font-display text-3xl tracking-tight">
                <span className="text-ted-red">TED</span>
                <span className="text-ted-red">x</span>
                <span className="text-ted-bone">NITT</span>
              </p>
              <motion.span
                className="mt-6 block h-px w-24 origin-left bg-ted-red"
                animate={{ scaleX: [0, 1, 0] }}
                transition={{ repeat: Infinity, duration: 1.4, ease: "easeInOut" }}
              />
              <p className="mt-4 text-[10px] uppercase tracking-[0.4em] text-ted-smoke">
                Lighting the fire
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
