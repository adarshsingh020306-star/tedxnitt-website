import type { Metadata } from "next";
import Image from "next/image";
import PageHero from "@/components/PageHero";
import Reveal from "@/components/Reveal";
import { partners, site } from "@/data/content";

export const metadata: Metadata = {
  title: "Our Partners — TEDxNITT",
};

const tiers: Array<(typeof partners)[number]["tier"]> = [
  "Title Sponsor",
  "Event Partner",
  "Community Partner",
];

export default function PartnersPage() {
  return (
    <main>
      <PageHero
        kicker="Our Partners"
        title="Allies of Ideas"
        ghost="ALLIES"
        intro="TEDxNITT is made possible by organizations that believe in the power of ideas. These are the partners who put the event on stage."
      />

      <section className="section-pad flex flex-col gap-20 pb-24">
        {tiers.map((tier) => {
          const group = partners.filter((p) => p.tier === tier);
          if (group.length === 0) return null;
          const isTitle = tier === "Title Sponsor";
          return (
            <div key={tier}>
              <Reveal>
                <p className="mb-8 flex items-center gap-3 text-xs uppercase tracking-[0.4em] text-ted-red">
                  <span className="h-px w-10 bg-ted-red" />
                  {tier}
                </p>
              </Reveal>
              <div
                className={`grid gap-6 ${
                  isTitle ? "" : "md:grid-cols-2 lg:grid-cols-3"
                }`}
              >
                {group.map((p, i) => (
                  <Reveal key={i} delay={i * 0.1}>
                    <article
                      className={`glass glass-hover relative overflow-hidden rounded-xl ${
                        isTitle ? "p-10 md:p-16" : "p-8"
                      }`}
                    >
                      {isTitle && (
                        <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-ted-red/15 blur-[90px]" />
                      )}
                      {/* logo slot */}
                      <div
                        className={`flex items-center justify-start ${
                          isTitle ? "h-24" : "h-16"
                        }`}
                      >
                        {p.logo ? (
                          <Image
                            src={p.logo}
                            alt={p.name}
                            width={isTitle ? 220 : 140}
                            height={isTitle ? 96 : 64}
                            className="object-contain object-left"
                          />
                        ) : (
                          <span
                            className={`font-display uppercase text-ted-bone/90 ${
                              isTitle ? "text-5xl" : "text-2xl"
                            }`}
                          >
                            {p.name}
                          </span>
                        )}
                      </div>
                      <p
                        className={`mt-4 leading-relaxed text-ted-smoke ${
                          isTitle ? "max-w-2xl text-base" : "text-sm"
                        }`}
                      >
                        {p.description}
                      </p>
                    </article>
                  </Reveal>
                ))}
              </div>
            </div>
          );
        })}
      </section>

      {/* become a partner CTA */}
      <section className="section-pad pb-32">
        <Reveal>
          <div className="glass relative overflow-hidden rounded-2xl p-10 text-center md:p-20">
            <div className="pointer-events-none absolute left-1/2 top-0 h-40 w-2/3 -translate-x-1/2 rounded-full bg-ted-red/15 blur-[100px]" />
            <h2 className="headline text-4xl md:text-6xl">
              Partner With <span className="text-ted-red">TEDxNITT</span>
            </h2>
            <p className="mx-auto mt-6 max-w-xl text-ted-smoke">
              Put your brand in front of the brightest minds at NIT Trichy and
              back a stage where ideas take flight.
            </p>
            <a
              href={`mailto:${site.email}`}
              className="mt-10 inline-block rounded-full bg-ted-red px-10 py-4 text-sm uppercase tracking-[0.25em] text-white transition-all duration-300 hover:shadow-[0_0_50px_-5px_rgba(235,0,40,0.7)]"
            >
              Get in touch
            </a>
          </div>
        </Reveal>
      </section>
    </main>
  );
}
