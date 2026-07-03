// ============================================================
// TEDxNITT — SITE CONTENT
// Everything on the site is driven from this single file.
// Replace the PLACEHOLDER entries (speakers, team, partners,
// social links, timeline) with real data when you have it.
// ============================================================

export const site = {
  name: "TEDxNITT",
  institute: "National Institute of Technology, Tiruchirappalli",
  city: "Tiruchirappalli, Tamil Nadu",
  tagline: "Ideas Worth Spreading",
  // PLACEHOLDER — update when the event date is announced
  email: "tedxnitt@nitt.edu",
  instagram: "https://www.instagram.com/tedxnittrichy/",
  // PLACEHOLDER links — replace with real profiles
  socials: [
    { label: "Instagram", href: "https://www.instagram.com/tedxnittrichy/" },
    { label: "Twitter / X", href: "#" },
    { label: "YouTube", href: "#" },
    { label: "LinkedIn", href: "#" },
  ],
};

export const nav = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Our Legacy", href: "/legacy" },
  { label: "Team", href: "/team" },
  { label: "Our Partners", href: "/partners" },
];

// ------------------------------------------------------------
// PAST SPEAKERS — PLACEHOLDERS
// Add: name, tagline (who they are), edition, and image path.
// Drop photos into /public/speakers/ and set image: "/speakers/filename.jpg"
// ------------------------------------------------------------
export type Speaker = {
  name: string;
  title: string;
  edition: string;
  image?: string;
};

// Real speakers from the event posters. Photos in /public/speakers/.
// NOTE: the downloaded file "anand_srinivas.png" is visually Vineet
// Patawari's poster cutout, so it's saved as vineet_patawari.png here.
export const speakers: Speaker[] = [
  {
    name: "Renita D'Souza",
    title: "Director, Formula Bharat",
    edition: "ODYZEA · 2025",
  },
  {
    name: "Vineet Patawari",
    title: "CEO — StockEdge, Elearnmarkets",
    edition: "NEXUS · 2024",
    image: "/speakers/vineet_patawari.png",
  },
  {
    name: "Aanand Srinivas",
    title: "Entrepreneur & Education Advocate",
    edition: "NEXUS · 2024",
  },
  {
    name: "Vijay Prateik",
    title: "Add title", // edition unconfirmed — update when known
    edition: "TEDxNITTrichy",
    image: "/speakers/vijay_prateik.png",
  },
  {
    name: "Shobhit Nirwan",
    title: "YouTuber",
    edition: "APRICITY · 2022",
  },
  {
    name: "Dr K Yeshoda",
    title: "Assoc. Professor of Speech Sciences, AIISH Mysore",
    edition: "APRICITY · 2022",
  },
  { name: "Speaker Name", title: "Add title", edition: "EQUINOX · 2023" },
  { name: "Speaker Name", title: "Add title", edition: "PYXIS · 2021" },
];

// ------------------------------------------------------------
// LEGACY TIMELINE — PLACEHOLDERS
// One entry per edition. Replace themes/descriptions with real ones.
// ------------------------------------------------------------
export type Edition = {
  year: string;
  theme: string;
  meaning?: string; // what the theme word means — shown as a subtitle
  description: string;
  poster?: string; // drop poster art in /public/editions/ → "/editions/nexus.jpg"
};

// Edition chronology confirmed by the user:
// 2025 ODYZEA · 2024 NEXUS (10th edition) · 2023 EQUINOX · 2022 APRICITY · 2021 PYXIS
export const timeline: Edition[] = [
  {
    year: "2025",
    theme: "ODYZEA",
    meaning: "an odyssey across uncharted seas",
    description:
      "A voyage after the ideas that live beyond the horizon. Held on 12 October at the EEE Auditorium, ODYZEA set sail into the unknown — because the most important discoveries are never found in familiar waters.",
    poster: "/editions/odyzea_2025.png",
  },
  {
    year: "2024",
    theme: "NEXUS",
    meaning: "the core where all connections meet",
    description:
      "A decade of ideas, converging. The 10th edition of TEDxNITTrichy — 20 October at Barn Hall — NEXUS marked the point where minds, disciplines and generations link into one.",
    poster: "/editions/nexus_2024.png",
  },
  {
    year: "2023",
    theme: "EQUINOX",
    meaning: "the perfect balance of light and dark",
    description:
      "The day the world stands in equilibrium. Held on 27 August 2023 at NIT Trichy (10.7612° N, 78.8090° E), EQUINOX explored the balance between opposing forces — light and shadow, chaos and order.",
    poster: "/editions/equinox_2023.png",
  },
  {
    year: "2022",
    theme: "APRICITY",
    meaning: "the warmth of the sun on a winter's day",
    description:
      "Comfort and hope in cold times. APRICITY — that rare, forgotten warmth of winter sunlight — was a search for the ideas that thaw us and light the way forward.",
    poster: "/editions/apricity_2022.png",
  },
  {
    year: "2021",
    theme: "PYXIS",
    meaning: "the mariner's compass, drawn in the stars",
    description:
      "Finding direction in an age with no fixed north. Named for the compass constellation, PYXIS was about the instincts and ideas that guide us when the map runs out.",
    poster: "/editions/pyxis_2021.png",
  },
];

// ------------------------------------------------------------
// TEAM — PLACEHOLDERS
// ------------------------------------------------------------
export type Member = {
  name: string;
  role: string;
  image?: string;
};

export const coreTeam: Member[] = [
  { name: "Member Name", role: "Organizer" },
  { name: "Member Name", role: "Co-Organizer" },
  { name: "Member Name", role: "Curation Head" },
  { name: "Member Name", role: "Design Head" },
  { name: "Member Name", role: "Sponsorship Head" },
  { name: "Member Name", role: "Marketing Head" },
  { name: "Member Name", role: "Operations Head" },
  { name: "Member Name", role: "Technical Head" },
];

// ------------------------------------------------------------
// PARTNERS — PLACEHOLDERS
// Drop logos into /public/partners/ and set logo: "/partners/filename.png"
// ------------------------------------------------------------
export type Partner = {
  name: string;
  tier: "Title Sponsor" | "Event Partner" | "Community Partner";
  description: string;
  logo?: string;
};

export const partners: Partner[] = [
  {
    name: "Sponsor Name",
    tier: "Title Sponsor",
    description:
      "Placeholder — one or two lines about the title sponsor and what they do.",
  },
  {
    name: "Partner Name",
    tier: "Event Partner",
    description: "Placeholder — a line about this partner and what they do.",
  },
  {
    name: "Partner Name",
    tier: "Event Partner",
    description: "Placeholder — a line about this partner and what they do.",
  },
  {
    name: "Partner Name",
    tier: "Community Partner",
    description: "Placeholder — a line about this partner and what they do.",
  },
];

// ------------------------------------------------------------
// STATS shown on the home page — PLACEHOLDER numbers
// ------------------------------------------------------------
export const stats = [
  { value: "10+", label: "Editions" },
  { value: "60+", label: "Speakers" },
  { value: "5000+", label: "Attendees" },
  { value: "1", label: "Stage. Infinite Ideas." },
];
