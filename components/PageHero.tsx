import Reveal from "./Reveal";

/** Shared header for inner pages — huge title over a ghost word. */
export default function PageHero({
  kicker,
  title,
  ghost,
  intro,
}: {
  kicker: string;
  title: string;
  ghost: string;
  intro?: string;
}) {
  return (
    <section className="section-pad relative overflow-hidden pb-16 pt-40 md:pb-24 md:pt-52">
      <span className="headline text-stroke pointer-events-none absolute -top-4 left-0 select-none whitespace-nowrap text-[22vw] opacity-30">
        {ghost}
      </span>
      <div className="pointer-events-none absolute -left-32 top-0 h-96 w-96 rounded-full bg-ted-red/10 blur-[120px]" />
      <Reveal>
        <p className="mb-4 flex items-center gap-3 text-xs uppercase tracking-[0.4em] text-ted-red">
          <span className="h-px w-10 bg-ted-red" />
          {kicker}
        </p>
        <h1 className="headline relative text-6xl md:text-8xl lg:text-9xl">
          {title}
        </h1>
        {intro && (
          <p className="mt-8 max-w-2xl text-base leading-relaxed text-ted-smoke md:text-lg">
            {intro}
          </p>
        )}
      </Reveal>
    </section>
  );
}
