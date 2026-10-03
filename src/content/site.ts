/* All copy and structured content for the site lives here so sections stay
   presentational. Contact details are placeholders in the 555-01xx fiction
   range — swap them for real ones before launch. */

export const site = {
  name: "Rhinos",
  legalName: "Rhinos Athletic Club",
  // Canonical origin: explicit override, else Vercel's production domain.
  url:
    process.env.NEXT_PUBLIC_SITE_URL ??
    (process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : "https://rhinos-gym-two.vercel.app"),
  tagline: "Built for the last rep.",
  description:
    "Rhinos is a strength & conditioning club in the Arts District, Los Angeles. Coached classes, open gym, boxing, cycling and a recovery lab. Your first week is free.",
  phone: { display: "(213) 555-0148", href: "tel:+12135550148" },
  email: {
    display: "hello@rhinosgym.com",
    href: "mailto:hello@rhinosgym.com?subject=Free%20week%20at%20Rhinos",
  },
  address: { line1: "Arts District", line2: "Los Angeles, CA 90021" },
  hours: [
    { days: "Mon – Fri", time: "05:00 – 23:00" },
    { days: "Sat – Sun", time: "07:00 – 21:00" },
  ],
  social: "@rhinos.la",
} as const;

export const nav = [
  { label: "Facilities", href: "#facilities" },
  { label: "Classes", href: "#classes" },
  { label: "Coaches", href: "#coaches" },
  { label: "Timetable", href: "#timetable" },
  { label: "Membership", href: "#membership" },
] as const;

export const disciplines = ["Strength", "Conditioning", "Boxing", "Cycle", "Mobility", "Recovery", "Open gym"] as const;

export type Facility = {
  id: string;
  name: string;
  body: string;
  specs: string[];
  art: string;
  alt: string;
};

export const facilities: Facility[] = [
  {
    id: "strength",
    name: "Strength Floor",
    body: "Twelve competition racks, six lifting platforms and calibrated plates up to 250 kg. Chalk is not just allowed — it's encouraged.",
    specs: ["12 racks", "6 platforms", "Calibrated plates"],
    art: "/art/deadlift.webp",
    alt: "Thermal render of an athlete pulling a heavy deadlift, plates glowing faintly",
  },
  {
    id: "turf",
    name: "Conditioning Turf",
    body: "A 40-metre turf lane for sled pushes, carries and sprints, flanked by rowers, ski ergs and air bikes.",
    specs: ["40 m turf lane", "18 ergs", "Sleds & carries"],
    art: "/art/sled.webp",
    alt: "Thermal render of an athlete driving a weighted sled forward",
  },
  {
    id: "combat",
    name: "Combat Room",
    body: "A full-size ring, eighteen heavy bags and coaches who learned the craft on the canvas, not on a course.",
    specs: ["Full-size ring", "18 heavy bags", "Pad work daily"],
    art: "/art/boxing.webp",
    alt: "Thermal render of a boxer throwing a jab beside a heavy bag",
  },
  {
    id: "cycle",
    name: "Cycle Studio",
    body: "Forty power-meter bikes, club-grade sound and lighting that follows the beat. Bring water. Leave everything else.",
    specs: ["40 bikes", "Live power data", "Club sound"],
    art: "/art/cycle.webp",
    alt: "Thermal render of a rider climbing out of the saddle on a studio bike",
  },
  {
    id: "recovery",
    name: "Recovery Lab",
    body: "A Finnish sauna at 90°C, two cold plunges at 4°C and a physio on the floor every weekday evening.",
    specs: ["Sauna 90°C", "Plunge 4°C", "Physio 17:00 – 21:00"],
    art: "/art/plunge.webp",
    alt: "Thermal render of an athlete sitting in a cold plunge, the water line cutting the heat",
  },
];

export const classCategories = [
  "All",
  "Signature",
  "Strength & Conditioning",
  "Mind & Body",
  "Cycling",
  "Cardio",
] as const;

export type ClassCategory = Exclude<(typeof classCategories)[number], "All">;

export type GymClass = {
  id: string;
  name: string;
  category: ClassCategory;
  minutes: number;
  intensity: 1 | 2 | 3 | 4 | 5;
  coach: string;
  body: string;
  art: string;
  alt: string;
};

export const classes: GymClass[] = [
  {
    id: "crash-course",
    name: "Crash Course",
    category: "Signature",
    minutes: 45,
    intensity: 5,
    coach: "Mei Tanaka",
    body: "Our signature team workout. Groups of four rotate through sleds, ropes and sandbags — and nobody finishes alone.",
    art: "/art/ropes.webp",
    alt: "Thermal render of an athlete whipping battle ropes",
  },
  {
    id: "iron-hour",
    name: "Iron Hour",
    category: "Strength & Conditioning",
    minutes: 60,
    intensity: 4,
    coach: "Dara Okafor",
    body: "Barbell strength in a small group: squat, press and pull on a six-week cycle, with every lift logged.",
    art: "/art/thruster-bottom.webp",
    alt: "Thermal render of an athlete at the bottom of a front squat, bar racked on the shoulders",
  },
  {
    id: "combat-lab",
    name: "Combat Lab",
    category: "Signature",
    minutes: 50,
    intensity: 4,
    coach: "Lucas Ferreira",
    body: "Boxing fundamentals, pad work and bag rounds. Learn the jab properly — then throw a thousand of them.",
    art: "/art/boxing.webp",
    alt: "Thermal render of a boxer throwing a jab beside a heavy bag",
  },
  {
    id: "engine-room",
    name: "Engine Room",
    category: "Cardio",
    minutes: 45,
    intensity: 5,
    coach: "Mei Tanaka",
    body: "Heart-rate-zoned intervals on the rower, ski erg and air bike. Your screen shows your zone; your coach shows you how to hold it.",
    art: "/art/row.webp",
    alt: "Thermal render of an athlete driving through a stroke on a rowing machine",
  },
  {
    id: "ride-45",
    name: "Ride 45",
    category: "Cycling",
    minutes: 45,
    intensity: 4,
    coach: "Sam Reyes",
    body: "Rhythm and power on a forty-bike stage. Live wattage, real climbs and a playlist you'll be asking about afterwards.",
    art: "/art/cycle.webp",
    alt: "Thermal render of a rider climbing out of the saddle on a studio bike",
  },
  {
    id: "kettlebell-club",
    name: "Kettlebell Club",
    category: "Strength & Conditioning",
    minutes: 45,
    intensity: 3,
    coach: "Dara Okafor",
    body: "Swings, cleans and get-ups. One bell, total-body strength, and it fits neatly into a lunch break.",
    art: "/art/kettlebell.webp",
    alt: "Thermal render of an athlete swinging a kettlebell to chest height",
  },
  {
    id: "flow-restore",
    name: "Flow & Restore",
    category: "Mind & Body",
    minutes: 50,
    intensity: 2,
    coach: "Priya Raman",
    body: "Mobility flow and breathwork that ends in the sauna. The class your hips have been quietly asking for.",
    art: "/art/flow.webp",
    alt: "Thermal render of an athlete holding a wide warrior pose",
  },
];

export type Coach = {
  id: string;
  name: string;
  role: string;
  number: string;
  specialties: string[];
  stat: { label: string; value: string };
  years: number;
  bio: string;
  art: string;
  alt: string;
};

export const coaches: Coach[] = [
  {
    id: "dara",
    name: "Dara Okafor",
    role: "Head of Strength",
    number: "01",
    specialties: ["Powerlifting", "Barbell technique", "Strength cycles"],
    stat: { label: "Best deadlift", value: "260 kg" },
    years: 12,
    bio: "Dara built the strength program from a single rack in 2014. Expect patient cues, honest numbers and a playlist that skews heavy.",
    art: "/art/coach-dara.webp",
    alt: "Thermal portrait of coach Dara Okafor standing with arms folded",
  },
  {
    id: "mei",
    name: "Mei Tanaka",
    role: "Conditioning Lead",
    number: "07",
    specialties: ["Intervals", "Rowing", "Team training"],
    stat: { label: "2K row", value: "6:58" },
    years: 9,
    bio: "A former collegiate rower who programs every Crash Course. Mei will find a gear you didn't know you had — politely.",
    art: "/art/coach-mei.webp",
    alt: "Thermal portrait of coach Mei Tanaka holding a kettlebell at her chest",
  },
  {
    id: "lucas",
    name: "Lucas Ferreira",
    role: "Combat Coach",
    number: "11",
    specialties: ["Boxing", "Footwork", "Pad work"],
    stat: { label: "Amateur bouts", value: "38" },
    years: 15,
    bio: "Lucas boxed out of São Paulo before landing in LA. His Combat Lab is technical, fast and much more fun than it looks.",
    art: "/art/coach-lucas.webp",
    alt: "Thermal portrait of coach Lucas Ferreira in his boxing guard",
  },
  {
    id: "priya",
    name: "Priya Raman",
    role: "Mobility & Recovery",
    number: "23",
    specialties: ["Mobility", "Breathwork", "Injury prevention"],
    stat: { label: "Credentials", value: "DPT" },
    years: 8,
    bio: "Priya runs the Recovery Lab and the evening physio clinic. Come in with a niggle, leave with a plan.",
    art: "/art/coach-priya.webp",
    alt: "Thermal portrait of coach Priya Raman balancing in tree pose",
  },
];

export const stats = [
  { value: 1900, suffix: "+", label: "Classes every month" },
  { value: 38, suffix: "", label: "Coaches on the floor" },
  { value: 2400, suffix: "\u00a0m²", label: "Of training space" },
  { value: 5, prefix: "0", suffix: ":00", label: "Doors open, every day" },
] as const;

export type Session = {
  time: string;
  classId: string;
  room: string;
  coach: string;
  spots: number; // 0 = waitlist
};

const rooms: Record<string, string> = {
  "crash-course": "Turf",
  "iron-hour": "Strength Floor",
  "combat-lab": "Combat Room",
  "engine-room": "Turf",
  "ride-45": "Cycle Studio",
  "kettlebell-club": "Strength Floor",
  "flow-restore": "Studio Two",
};

/* A believable week: early, lunch and evening blocks, rotating by day. */
const weekPlan: [string, string, number][][] = [
  [
    ["06:00", "iron-hour", 4],
    ["07:15", "ride-45", 11],
    ["12:15", "kettlebell-club", 6],
    ["17:30", "crash-course", 0],
    ["18:45", "combat-lab", 3],
    ["20:00", "flow-restore", 9],
  ],
  [
    ["06:00", "engine-room", 7],
    ["07:15", "flow-restore", 12],
    ["12:15", "iron-hour", 2],
    ["17:30", "ride-45", 5],
    ["18:45", "crash-course", 1],
    ["20:00", "combat-lab", 8],
  ],
  [
    ["06:00", "crash-course", 3],
    ["07:15", "kettlebell-club", 9],
    ["12:15", "ride-45", 14],
    ["17:30", "iron-hour", 0],
    ["18:45", "engine-room", 6],
    ["20:00", "flow-restore", 10],
  ],
  [
    ["06:00", "ride-45", 8],
    ["07:15", "iron-hour", 5],
    ["12:15", "combat-lab", 7],
    ["17:30", "engine-room", 2],
    ["18:45", "kettlebell-club", 4],
    ["20:00", "crash-course", 0],
  ],
  [
    ["06:00", "iron-hour", 6],
    ["07:15", "engine-room", 10],
    ["12:15", "flow-restore", 13],
    ["17:30", "combat-lab", 3],
    ["18:45", "ride-45", 0],
  ],
  [
    ["08:00", "crash-course", 2],
    ["09:15", "ride-45", 6],
    ["10:30", "iron-hour", 4],
    ["11:45", "flow-restore", 15],
  ],
  [
    ["08:30", "flow-restore", 11],
    ["09:45", "kettlebell-club", 8],
    ["11:00", "engine-room", 5],
    ["17:00", "combat-lab", 9],
  ],
];

const coachFor: Record<string, string> = Object.fromEntries(classes.map((c) => [c.id, c.coach]));

export const week = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day, i) => ({
  day,
  sessions: weekPlan[i].map(([time, classId, spots]) => ({
    time,
    classId,
    room: rooms[classId],
    coach: coachFor[classId],
    spots,
  })) satisfies Session[],
}));

export const plans = [
  {
    id: "base",
    name: "Base",
    tag: "Basic plan",
    monthly: 69,
    annual: 59,
    features: ["Open gym 05:00 – 23:00", "2 classes a week", "Lockers & towels"],
  },
  {
    id: "unlimited",
    name: "Unlimited",
    tag: "Most popular",
    monthly: 139,
    annual: 118,
    features: ["Every class, every day", "Recovery Lab access", "1 guest pass a month"],
  },
  {
    id: "coached",
    name: "Coached",
    tag: "Full support",
    monthly: 239,
    annual: 203,
    features: ["Everything in Unlimited", "4 personal sessions a month", "Nutrition check-ins"],
  },
] as const;

export const classById = Object.fromEntries(classes.map((c) => [c.id, c])) as Record<string, GymClass>;
