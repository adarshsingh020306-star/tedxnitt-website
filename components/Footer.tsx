import Link from "next/link";
import { nav, site } from "@/data/content";

export default function Footer() {
  return (
    <footer className="relative border-t border-white/5 bg-ted-coal">
      {/* giant ghost wordmark */}
      <div className="pointer-events-none select-none overflow-hidden">
        <p className="headline text-stroke whitespace-nowrap text-center text-[18vw]">
          TEDxNITT
        </p>
      </div>

      <div className="section-pad grid gap-12 pb-12 pt-4 md:grid-cols-4">
        <div className="md:col-span-2">
          <p className="font-display text-2xl">
            <span className="text-ted-red">TEDx</span>NITT
          </p>
          <p className="mt-4 max-w-md text-sm leading-relaxed text-ted-smoke">
            This independent TEDx event is operated under license from TED. Our
            mission: to spread ideas that challenge, inspire, and connect the
            NIT Trichy community.
          </p>
        </div>

        <div>
          <p className="mb-4 text-xs uppercase tracking-[0.3em] text-ted-smoke">
            Quick Links
          </p>
          <ul className="space-y-2">
            {nav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="text-sm text-ted-bone/70 transition-colors hover:text-ted-red"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="mb-4 text-xs uppercase tracking-[0.3em] text-ted-smoke">
            Connect
          </p>
          <ul className="space-y-2">
            {site.socials.map((s) => (
              <li key={s.label}>
                <a
                  href={s.href}
                  target="_blank"
                  rel="noreferrer"
                  className="text-sm text-ted-bone/70 transition-colors hover:text-ted-red"
                >
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
          <p className="mt-6 text-xs text-ted-smoke">{site.email}</p>
          <p className="mt-1 text-xs text-ted-smoke">{site.city}</p>
        </div>
      </div>

      <div className="section-pad flex flex-col items-center justify-between gap-2 border-t border-white/5 py-6 text-xs text-ted-smoke md:flex-row">
        <p>© {new Date().getFullYear()} TEDxNITT. All rights reserved.</p>
        <p>x = independently organized TED event</p>
      </div>
    </footer>
  );
}
