import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import Reveal from "@/components/Reveal";
import Marquee from "@/components/Marquee";

export const metadata: Metadata = {
  title: "About — TEDxNITT",
};

const blocks = [
  {
    index: "01",
    title: "What is TED?",
    body: "TED is a nonprofit organization devoted to Ideas Worth Spreading — usually in the form of short, powerful talks of 18 minutes or fewer. TED began in 1984 as a conference where Technology, Entertainment and Design converged, and today covers almost every topic — from science to business to global issues — in more than 100 languages.",
  },
  {
    index: "02",
    title: "What is TEDx?",
    body: "In the spirit of ideas worth spreading, TEDx is a program of local, self-organized events that bring people together to share a TED-like experience. The 'x' stands for an independently organized TED event. TEDx events give communities a stage for emerging voices — often before they reach the global TED platform.",
  },
  {
    index: "03",
    title: "What is TEDxNITT?",
    body: "TEDxNITT is an independently organized TED event held at the National Institute of Technology, Tiruchirappalli. It is a platform built by students to surface the most compelling local and national voices — people doing transformative work who haven't yet found a large enough stage. To think, to learn, to ideate.",
  },
  {
    index: "04",
    title: "The License",
    body: "TEDxNITT is organized under a license from TED. That means we operate independently, but within TED's established guidelines and Code of Conduct — maintaining the quality and integrity of the TEDx brand while giving it a voice that is unmistakably NIT Trichy.",
  },
];

export default function AboutPage() {
  return (
    <main>
      <PageHero
        kicker="About"
        title="The Idea Behind It"
        ghost="ABOUT"
        intro="Short, powerful talks. One red circle. A community that believes ideas change everything."
      />

      <section className="section-pad pb-28">
        <div className="grid gap-6 md:grid-cols-2">
          {blocks.map((b, i) => (
            <Reveal key={b.index} delay={(i % 2) * 0.12}>
              <article className="glass glass-hover group relative h-full overflow-hidden rounded-xl p-8 md:p-12">
                <span className="headline text-stroke-red pointer-events-none absolute -right-2 -top-6 select-none text-8xl opacity-60 transition-opacity duration-500 group-hover:opacity-100">
                  {b.index}
                </span>
                <h2 className="headline mb-5 max-w-[80%] text-3xl md:text-4xl">
                  {b.title}
                </h2>
                <p className="leading-relaxed text-ted-smoke">{b.body}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </section>

      <Marquee items={["To Think", "To Learn", "To Ideate", "TEDxNITT"]} />

      {/* mission statement */}
      <section className="section-pad py-28 md:py-40">
        <Reveal>
          <p className="mb-6 text-xs uppercase tracking-[0.4em] text-ted-red">
            Our Mission
          </p>
          <p className="headline max-w-5xl text-4xl leading-[1.05] md:text-6xl">
            To surface the most compelling voices —{" "}
            <span className="text-ted-red">people doing transformative
            work</span>{" "}
            who haven&apos;t yet found a large enough stage.
          </p>
        </Reveal>
      </section>
    </main>
  );
}
