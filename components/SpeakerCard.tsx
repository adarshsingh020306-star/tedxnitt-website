import Image from "next/image";
import { Speaker } from "@/data/content";

/**
 * Placeholder-friendly speaker card: shows the photo if provided,
 * otherwise a stylized silhouette gradient with the edition badge.
 */
export default function SpeakerCard({ speaker }: { speaker: Speaker }) {
  return (
    <article className="glass glass-hover group relative aspect-[3/4] overflow-hidden rounded-lg">
      {/* backdrop — always present, sits behind photo cutouts too */}
      <div className="absolute inset-0 bg-gradient-to-br from-ted-ash via-ted-coal to-black">
        {speaker.image ? (
          <div className="absolute bottom-0 left-1/2 h-2/3 w-4/5 -translate-x-1/2 rounded-t-full bg-gradient-to-t from-ted-red/30 to-transparent blur-xl transition-all duration-700 group-hover:from-ted-red/50" />
        ) : (
          <>
            {/* abstract silhouette while the photo is missing */}
            <div className="absolute bottom-0 left-1/2 h-3/5 w-4/5 -translate-x-1/2 rounded-t-full bg-gradient-to-t from-ted-red/25 to-white/5 blur-sm transition-all duration-700 group-hover:from-ted-red/40" />
            <div className="absolute bottom-[52%] left-1/2 h-1/5 w-1/3 -translate-x-1/2 rounded-full bg-gradient-to-t from-white/10 to-white/5 blur-sm" />
          </>
        )}
      </div>
      {speaker.image && (
        <Image
          src={speaker.image}
          alt={speaker.name}
          fill
          className="object-contain object-bottom transition-transform duration-700 group-hover:scale-105"
          sizes="(max-width: 768px) 70vw, 25vw"
        />
      )}

      {/* edition badge */}
      <span className="absolute left-3 top-3 rounded-full border border-ted-red/40 bg-black/50 px-3 py-1 text-[10px] uppercase tracking-widest text-ted-red backdrop-blur-sm">
        {speaker.edition}
      </span>

      {/* name plate */}
      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black via-black/70 to-transparent p-4 pt-12">
        <h3 className="font-display text-xl uppercase leading-tight text-ted-bone">
          {speaker.name}
        </h3>
        <p className="mt-1 text-xs text-ted-smoke">{speaker.title}</p>
      </div>
    </article>
  );
}
