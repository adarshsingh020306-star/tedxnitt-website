import Link from "next/link";
import Hero from "@/components/Hero";
import Marquee from "@/components/Marquee";
import Reveal from "@/components/Reveal";
import SectionHeading from "@/components/SectionHeading";
import SpeakerCard from "@/components/SpeakerCard";
import { partners, speakers, stats } from "@/data/content";

export default function Home() {
  return (
    <main>
      <Hero />

      <Marquee />

      {/* ------------------------------------------------ intro */}
      <section className="section-pad py-28 md:py-40">
        <SectionHeading kicker="What is TEDxNITT" title="One Stage. Infinite Ideas." ghost="IDEAS" />
        <div className="grid gap-12 md:grid-cols-2">
          <Reveal>
            <p className="text-lg leading-relaxed text-ted-bone/80 md:text-xl">
              TEDxNITT brings together thinkers, innovators and storytellers on
              one stage at the National Institute of Technology,
              Tiruchirappalli — voices from technology and climate to art and
              social change, all under one roof.
            </p>
          </Reveal>
          <Reveal delay={0.15}>
            <blockquote className="border-l-2 border-ted-red pl-6 text-ted-smoke">
              <p className="text-base italic leading-relaxed md:text-lg">
                “Ideas worth spreading aren&apos;t just those that comfort us —
                they&apos;re the ones that disturb us just enough to make us
                grow.”
              </p>
            </blockquote>
          </Reveal>
        </div>

        {/* stats */}
        <div className="mt-24 grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-white/10 bg-white/10 md:grid-cols-4">
          {stats.map((s, i) => (
            <Reveal key={s.label} delay={i * 0.08} className="bg-ted-coal">
              <div className="p-8 transition-colors duration-500 hover:bg-ted-ash">
                <p className="font-display text-5xl text-ted-red md:text-6xl">
                  {s.value}
                </p>
                <p className="mt-2 text-xs uppercase tracking-[0.25em] text-ted-smoke">
                  {s.label}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ------------------------------------------- past speakers */}
      <section className="section-pad py-28">
        <SectionHeading kicker="Past Speakers" title="Voices That Shaped Us" ghost="VOICES" />
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
          {speakers.map((sp, i) => (
            <Reveal key={i} delay={(i % 4) * 0.08}>
              <SpeakerCard speaker={sp} />
            </Reveal>
          ))}
        </div>
      </section>

      {/* ------------------------------------------- early decision */}
      <section className="section-pad py-28">
        <Reveal>
          <div className="glass relative overflow-hidden rounded-2xl p-10 md:p-20">
            <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-ted-red/20 blur-[100px]" />
            <p className="mb-3 text-xs uppercase tracking-[0.4em] text-ted-red">
              Early Decision
            </p>
            <h2 className="headline max-w-2xl text-4xl md:text-6xl">
              The Next Edition Is Coming.
            </h2>
            <p className="mt-6 max-w-xl text-ted-smoke">
              Registrations for the next edition of TEDxNITT open soon. Watch
              this space — dates, speakers and the theme will be announced
              here.
            </p>
            <div className="mt-10 inline-flex cursor-not-allowed items-center gap-3 rounded-full border border-ted-red/50 px-8 py-4 text-sm uppercase tracking-[0.25em] text-ted-bone/60">
              Registrations opening soon
              <span className="h-2 w-2 animate-pulse-slow rounded-full bg-ted-red" />
            </div>
          </div>
        </Reveal>
      </section>

      {/* ------------------------------------------------ partners */}
      <section className="section-pad pb-32 pt-12">
        <SectionHeading kicker="Our Partners" title="Powered By" ghost="ALLIES" />
        <div className="grid gap-4 md:grid-cols-4">
          {partners.map((p, i) => (
            <Reveal key={i} delay={i * 0.08}>
              <div className="glass glass-hover flex h-36 flex-col items-center justify-center gap-2 rounded-lg p-6 text-center">
                <span className="font-display text-lg uppercase text-ted-bone/80">
                  {p.name}
                </span>
                <span className="text-[10px] uppercase tracking-widest text-ted-red">
                  {p.tier}
                </span>
              </div>
            </Reveal>
          ))}
        </div>
        <Reveal delay={0.2}>
          <div className="mt-12 text-center">
            <Link
              href="/partners"
              className="group inline-flex items-center gap-3 text-sm uppercase tracking-[0.3em] text-ted-smoke transition-colors hover:text-ted-red"
            >
              Meet all partners
              <span className="transition-transform group-hover:translate-x-2">
                →
              </span>
            </Link>
          </div>
        </Reveal>
      </section>
    </main>
  );
}
