import Reveal from "./Reveal";

export default function SectionHeading({
  kicker,
  title,
  ghost,
}: {
  kicker: string;
  title: string;
  ghost?: string;
}) {
  return (
    <div className="relative mb-16">
      {ghost && (
        <span className="headline text-stroke pointer-events-none absolute -top-10 left-0 select-none text-[16vw] opacity-40 md:text-[10vw]">
          {ghost}
        </span>
      )}
      <Reveal>
        <p className="mb-3 flex items-center gap-3 text-xs uppercase tracking-[0.4em] text-ted-red">
          <span className="h-px w-10 bg-ted-red" />
          {kicker}
        </p>
        <h2 className="headline relative text-5xl md:text-7xl">{title}</h2>
      </Reveal>
    </div>
  );
}
