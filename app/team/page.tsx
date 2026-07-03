import type { Metadata } from "next";
import Image from "next/image";
import PageHero from "@/components/PageHero";
import Reveal from "@/components/Reveal";
import { coreTeam } from "@/data/content";

export const metadata: Metadata = {
  title: "Team — TEDxNITT",
};

export default function TeamPage() {
  return (
    <main>
      <PageHero
        kicker="Team"
        title="The People Behind X"
        ghost="TEAM"
        intro="Curators, designers, engineers and storytellers — the students who build TEDxNITT from the ground up, every single year."
      />

      <section className="section-pad pb-32">
        <Reveal>
          <p className="mb-10 flex items-center gap-3 text-xs uppercase tracking-[0.4em] text-ted-red">
            <span className="h-px w-10 bg-ted-red" />
            Core Team
          </p>
        </Reveal>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
          {coreTeam.map((m, i) => (
            <Reveal key={i} delay={(i % 4) * 0.08}>
              <article className="glass glass-hover group relative aspect-square overflow-hidden rounded-lg">
                {m.image ? (
                  <Image
                    src={m.image}
                    alt={m.name}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    sizes="(max-width: 768px) 45vw, 22vw"
                  />
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-br from-ted-ash to-black">
                    <div className="absolute bottom-0 left-1/2 h-1/2 w-3/4 -translate-x-1/2 rounded-t-full bg-gradient-to-t from-white/10 to-transparent blur-sm" />
                    <div className="absolute bottom-[42%] left-1/2 h-1/6 w-1/4 -translate-x-1/2 rounded-full bg-white/10 blur-sm" />
                  </div>
                )}
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black via-black/70 to-transparent p-4 pt-10">
                  <h3 className="font-display text-lg uppercase leading-tight">
                    {m.name}
                  </h3>
                  <p className="mt-1 text-xs uppercase tracking-widest text-ted-red">
                    {m.role}
                  </p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.2}>
          <div className="glass mt-16 rounded-xl p-10 text-center">
            <p className="headline text-2xl md:text-3xl">
              + The entire volunteer force of{" "}
              <span className="text-ted-red">NIT Trichy</span>
            </p>
            <p className="mt-3 text-sm text-ted-smoke">
              Full team roster with names and photos coming soon.
            </p>
          </div>
        </Reveal>
      </section>
    </main>
  );
}
