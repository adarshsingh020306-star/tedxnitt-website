# TEDxNITT — Website

A cinematic, motion-heavy website for TEDxNITT (NIT Tiruchirappalli), built as a design prototype.

**Stack:** Next.js 14 (App Router) · TypeScript · Tailwind CSS · Framer Motion · Three.js (react-three-fiber) · Lenis smooth scroll

## Run it

```bash
npm install
npm run dev
```

Then open http://localhost:3000

## Pages

| Route | What's there |
|---|---|
| `/` | 3D WebGL hero (TEDxNITT wordmark + particles), marquee, intro + stats, past speakers, early-decision teaser, partners strip |
| `/about` | What is TED / TEDx / TEDxNITT / the license, mission statement |
| `/legacy` | Dotted timeline of past editions |
| `/team` | Core team grid |
| `/partners` | Tiered partner cards + "partner with us" CTA |

## Adding real content

Everything lives in **`data/content.ts`** — speakers, team, partners, timeline, social links, stats. Replace the `PLACEHOLDER` entries.

- **Speaker photos** → drop files in `public/speakers/`, set `image: "/speakers/name.jpg"` on the speaker entry.
- **Team photos** → `public/team/`, same pattern.
- **Partner logos** → `public/partners/`, set `logo: "/partners/logo.png"`.
- **Social links** → `site.socials` at the top of the file.

## Performance notes

- The 3D hero is lazy-loaded client-side only (`dynamic import, ssr: false`), capped at 1.5x DPR.
- Lenis handles smooth scrolling; all reveals are GPU-friendly transforms.
