import type { Metadata } from "next";
import Image from "next/image";
import PageHero from "@/components/PageHero";
import Reveal from "@/components/Reveal";
import { timeline } from "@/data/content";

export const metadata: Metadata = {
  title: "Our Legacy — TEDxNITT",
};

export default function LegacyPage() {
  return (
    <main>
      <PageHero
        kicker="Our Legacy"
        title="Years of Ideas"
        ghost="LEGACY"
        intro="Every edition of TEDxNITT has left its mark — a trail of talks, themes and moments that shaped our community. Trace the journey."
      />

      <section className="section-pad relative pb-32">
        {/* the dotted spine */}
        <div className="absolute bottom-32 left-10 top-0 hidden w-px border-l border-dashed border-ted-red/40 md:left-1/2 md:block" />

        <div className="flex flex-col gap-16 md:gap-24">
          {timeline.map((ed, i) => {
            const left = i % 2 === 0;
            return (
              <div
                key={ed.year}
                className={`relative flex md:w-1/2 ${
                  left ? "md:self-start md:pr-16" : "md:self-end md:pl-16"
                }`}
              >
                {/* node dot */}
                <span
                  className={`absolute top-2 hidden h-3 w-3 rounded-full bg-ted-red shadow-[0_0_20px_4px_rgba(235,0,40,0.5)] md:block ${
                    left ? "-right-[6.5px]" : "-left-[6.5px]"
                  }`}
                />
                <Reveal className="w-full">
                  <article className="glass glass-hover relative overflow-hidden rounded-xl p-8 md:p-10">
                    <span className="headline text-stroke pointer-events-none absolute -right-2 -top-8 select-none text-9xl opacity-40">
                      {ed.year.slice(2)}
                    </span>

                    {/* poster art (optional) */}
                    {ed.poster && (
                      <div className="relative mb-6 aspect-square w-full overflow-hidden rounded-lg border border-white/10">
                        <Image
                          src={ed.poster}
                          alt={`${ed.theme} — TEDxNITT ${ed.year}`}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 90vw, 45vw"
                        />
                      </div>
                    )}

                    <p className="font-display text-5xl text-ted-red">
                      {ed.year}
                    </p>
                    <h2 className="headline mt-3 text-4xl md:text-5xl">
                      {ed.theme}
                    </h2>
                    {ed.meaning && (
                      <p className="mt-2 text-sm italic text-ted-bone/60">
                        {ed.meaning}
                      </p>
                    )}
                    <p className="mt-4 text-sm leading-relaxed text-ted-smoke">
                      {ed.description}
                    </p>
                  </article>
                </Reveal>
              </div>
            );
          })}
        </div>

        {/* origin marker */}
        <Reveal>
          <div className="mt-24 text-center">
            <p className="text-xs uppercase tracking-[0.4em] text-ted-smoke">
              Where it all began
            </p>
            <p className="headline mt-3 text-3xl text-ted-red md:text-4xl">
              NIT Tiruchirappalli
            </p>
          </div>
        </Reveal>
      </section>
    </main>
  );
}
