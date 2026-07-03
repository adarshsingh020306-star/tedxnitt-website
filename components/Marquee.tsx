export default function Marquee({
  items = ["Ideas Worth Spreading", "TEDxNITT", "NIT Tiruchirappalli"],
}: {
  items?: string[];
}) {
  const row = [...items, ...items, ...items, ...items];
  return (
    <div className="relative overflow-hidden border-y border-white/5 bg-ted-red py-4">
      <div className="flex w-max animate-marquee gap-8 will-change-transform">
        {[0, 1].map((half) => (
          <div key={half} className="flex shrink-0 gap-8">
            {row.map((item, i) => (
              <span
                key={`${half}-${i}`}
                className="font-display whitespace-nowrap text-xl uppercase tracking-wide text-white"
              >
                {item} <span className="mx-4 text-black">•</span>
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
