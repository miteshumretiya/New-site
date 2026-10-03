/* Static scenes rendered offline into /public/art (see scripts/render-art.ts).
 * Coordinates are in figure units: ~1.0 = standing height, ground at y = 0,
 * side views face right (+x). */
import type { Pose, Prop, Scene, Vec2 } from "./shader.ts";
import { frontBarbell, heroScene, symmetric, thrusterPose } from "./poses.ts";

const side = (p: Pose): Pose => p;

function rope(from: Vec2, to: Vec2, amp: number, waves: number, phase: number, segs = 15): Prop[] {
  const pts: Vec2[] = [];
  for (let i = 0; i <= segs; i++) {
    const t = i / segs;
    const x = from[0] + (to[0] - from[0]) * t;
    const y = from[1] + (to[1] - from[1]) * t;
    const decay = 1 - t * 0.85;
    pts.push([x, y + Math.sin(t * waves * Math.PI * 2 + phase) * amp * decay]);
  }
  return pts.slice(0, -1).map((a, i) => ({ a, b: pts[i + 1], ra: 0.016, rb: 0.014, t: 0.36 }));
}

export type ArtJob = { file: string; w: number; h: number; scene: Scene; time?: number };

const deadlift: Scene = {
  pose: side({
    head: [0.205, 0.705],
    neck: [0.155, 0.665],
    chest: [0.03, 0.555],
    pelvis: [-0.12, 0.43],
    shL: [0.1, 0.62],
    shR: [0.12, 0.625],
    elL: [0.105, 0.45],
    elR: [0.125, 0.45],
    haL: [0.1, 0.285],
    haR: [0.12, 0.285],
    hiL: [-0.13, 0.42],
    hiR: [-0.11, 0.425],
    knL: [0.07, 0.27],
    knR: [0.09, 0.27],
    anL: [0, 0.05],
    anR: [0.02, 0.05],
    toeL: [0.085, 0.02],
    toeR: [0.105, 0.02],
  }),
  view: { zoom: 1.05, cx: 0.02, cy: 0.4 },
  body: { shirt: 0.7, shorts: 0.6, hair: 1, facing: 0, far: 0.9 },
  env: { room: 0.085, floor: 0.09 },
  discs: [
    { c: [0.11, 0.27], r: 0.13, t: 0.25, front: true },
    { c: [0.11, 0.27], r: 0.104, t: 0.29, ring: 0.005, front: true },
    { c: [0.11, 0.27], r: 0.024, t: 0.36, front: true },
  ],
};

const sled: Scene = {
  pose: side({
    head: [0.275, 0.615],
    neck: [0.225, 0.585],
    chest: [0.07, 0.47],
    pelvis: [-0.06, 0.37],
    shL: [0.18, 0.55],
    shR: [0.2, 0.555],
    elL: [0.29, 0.52],
    elR: [0.31, 0.525],
    haL: [0.39, 0.475],
    haR: [0.41, 0.48],
    hiL: [-0.07, 0.36],
    hiR: [-0.05, 0.365],
    knL: [0.1, 0.26],
    knR: [-0.17, 0.22],
    anL: [0.07, 0.05],
    anR: [-0.32, 0.075],
    toeL: [0.14, 0.02],
    toeR: [-0.28, 0.018],
  }),
  view: { zoom: 0.95, cx: 0.17, cy: 0.33 },
  body: { shirt: 0.72, shorts: 0.6, hair: 2, facing: 0, far: 0.88 },
  env: { room: 0.08, floor: 0.1 },
  caps: [
    { a: [0.33, 0.03], b: [0.78, 0.03], ra: 0.02, t: 0.24 },
    { a: [0.36, 0.04], b: [0.42, 0.5], ra: 0.016, t: 0.3 },
    { a: [0.48, 0.07], b: [0.72, 0.07], ra: 0.022, t: 0.24 },
    { a: [0.48, 0.118], b: [0.72, 0.118], ra: 0.022, t: 0.25 },
    { a: [0.5, 0.166], b: [0.7, 0.166], ra: 0.022, t: 0.26 },
    { a: [0.6, 0.03], b: [0.6, 0.25], ra: 0.014, t: 0.28 },
  ],
};

const boxing: Scene = {
  pose: side({
    head: [0.035, 0.885],
    neck: [0.012, 0.815],
    chest: [-0.01, 0.7],
    pelvis: [-0.04, 0.5],
    shL: [0.025, 0.79],
    shR: [-0.045, 0.78],
    elL: [0.2, 0.775],
    elR: [-0.03, 0.675],
    haL: [0.36, 0.775],
    haR: [0.06, 0.84],
    hiL: [-0.025, 0.495],
    hiR: [-0.055, 0.5],
    knL: [0.1, 0.27],
    knR: [-0.13, 0.27],
    anL: [0.08, 0.05],
    anR: [-0.19, 0.05],
    toeL: [0.15, 0.02],
    toeR: [-0.13, 0.02],
  }),
  view: { zoom: 0.9, cx: 0.17, cy: 0.55 },
  body: { shirt: 0.72, shorts: 0.6, hair: 1, facing: 0, far: 0.9, gloves: 1 },
  env: { room: 0.085, floor: 0.07 },
  caps: [
    { a: [0.53, 0.3], b: [0.53, 0.98], ra: 0.115, t: 0.22 },
    { a: [0.53, 0.98], b: [0.53, 1.3], ra: 0.006, t: 0.16 },
  ],
};

const cycle: Scene = {
  pose: side({
    head: [0.215, 0.985],
    neck: [0.165, 0.945],
    chest: [0.03, 0.81],
    pelvis: [-0.09, 0.7],
    shL: [0.12, 0.905],
    shR: [0.14, 0.91],
    elL: [0.22, 0.86],
    elR: [0.24, 0.865],
    haL: [0.32, 0.83],
    haR: [0.34, 0.835],
    hiL: [-0.09, 0.69],
    hiR: [-0.07, 0.695],
    knL: [0.01, 0.47],
    knR: [0.13, 0.6],
    anL: [0.095, 0.245],
    anR: [0.005, 0.395],
    toeL: [0.16, 0.225],
    toeR: [0.07, 0.385],
  }),
  view: { zoom: 0.92, cx: 0.06, cy: 0.52 },
  body: { shirt: 0.7, shorts: 0.58, hair: 2, facing: 0, far: 0.86 },
  env: { room: 0.08, floor: 0.06 },
  caps: [
    { a: [-0.26, 0.02], b: [0.0, 0.02], ra: 0.016, t: 0.24 },
    { a: [0.18, 0.02], b: [0.5, 0.02], ra: 0.016, t: 0.24 },
    { a: [-0.07, 0.3], b: [-0.13, 0.02], ra: 0.018, t: 0.25 },
    { a: [0.28, 0.3], b: [0.34, 0.02], ra: 0.018, t: 0.25 },
    { a: [0.28, 0.32], b: [-0.07, 0.3], ra: 0.02, t: 0.26 },
    { a: [-0.07, 0.3], b: [-0.1, 0.64], ra: 0.016, t: 0.27 },
    { a: [-0.19, 0.665], b: [-0.02, 0.675], ra: 0.02, t: 0.32 },
    { a: [0.27, 0.32], b: [0.3, 0.8], ra: 0.017, t: 0.27 },
    { a: [0.25, 0.82], b: [0.41, 0.825], ra: 0.017, t: 0.31 },
    { a: [0.095, 0.245], b: [0.005, 0.395], ra: 0.01, t: 0.3 },
  ],
  discs: [
    { c: [0.37, 0.2], r: 0.15, t: 0.27 },
    { c: [0.37, 0.2], r: 0.118, t: 0.31, ring: 0.005 },
    { c: [0.05, 0.32], r: 0.032, t: 0.32 },
  ],
};

const plunge: Scene = {
  pose: symmetric({
    head: [0, 0.6],
    neck: [0, 0.525],
    chest: [0, 0.38],
    pelvis: [0, 0.14],
    shL: [-0.12, 0.49],
    elL: [-0.3, 0.52],
    haL: [-0.4, 0.43],
    hiL: [-0.06, 0.13],
    knL: [-0.1, 0.32],
    anL: [-0.08, 0.06],
    toeL: [-0.1, 0.03],
  }),
  view: { zoom: 1.55, cx: 0, cy: 0.47, vignette: 1.1 },
  body: { shirt: 0, shorts: 0.6, hair: 2, far: 1 },
  env: { room: 0.1, floor: 0, water: 0.44 },
  caps: [
    { a: [-0.5, 0.505], b: [0.5, 0.505], ra: 0.022, t: 0.16 },
    { a: [-0.5, 0.0], b: [-0.5, 0.505], ra: 0.02, t: 0.14 },
    { a: [0.5, 0.0], b: [0.5, 0.505], ra: 0.02, t: 0.14 },
  ],
};

const ropesPose: Pose = side({
  head: [0.095, 0.815],
  neck: [0.055, 0.755],
  chest: [-0.035, 0.585],
  pelvis: [-0.11, 0.43],
  shL: [0.02, 0.705],
  shR: [0.04, 0.7],
  elL: [0.125, 0.72],
  elR: [0.105, 0.56],
  haL: [0.225, 0.75],
  haR: [0.2, 0.5],
  hiL: [-0.12, 0.42],
  hiR: [-0.1, 0.425],
  knL: [0.06, 0.25],
  knR: [0.09, 0.25],
  anL: [-0.05, 0.05],
  anR: [-0.02, 0.05],
  toeL: [0.03, 0.02],
  toeR: [0.06, 0.02],
});

const ropes: Scene = {
  pose: ropesPose,
  view: { zoom: 0.92, cx: 0.33, cy: 0.42 },
  body: { shirt: 0.72, shorts: 0.6, hair: 2, facing: 0, far: 0.88 },
  env: { room: 0.085, floor: 0.08 },
  caps: [
    ...rope([0.235, 0.75], [1.05, 0.12], 0.075, 2.2, 0.2),
    ...rope([0.21, 0.5], [1.05, 0.1], 0.07, 2.2, Math.PI * 0.9),
    { a: [1.05, 0.0], b: [1.05, 0.2], ra: 0.03, t: 0.2 },
  ],
};

const row: Scene = {
  pose: side({
    head: [-0.245, 0.735],
    neck: [-0.25, 0.665],
    chest: [-0.22, 0.47],
    pelvis: [-0.18, 0.31],
    shL: [-0.255, 0.59],
    shR: [-0.24, 0.595],
    elL: [-0.33, 0.45],
    elR: [-0.31, 0.455],
    haL: [-0.13, 0.475],
    haR: [-0.11, 0.48],
    hiL: [-0.185, 0.3],
    hiR: [-0.165, 0.305],
    knL: [0.05, 0.315],
    knR: [0.07, 0.32],
    anL: [0.27, 0.27],
    anR: [0.29, 0.275],
    toeL: [0.3, 0.33],
    toeR: [0.32, 0.335],
  }),
  view: { zoom: 1.05, cx: 0.02, cy: 0.38 },
  body: { shirt: 0.7, shorts: 0.6, hair: 1, facing: 0, far: 0.88 },
  env: { room: 0.085, floor: 0.05 },
  caps: [
    { a: [-0.6, 0.2], b: [0.56, 0.2], ra: 0.018, t: 0.24 },
    { a: [0.52, 0.2], b: [0.57, 0.0], ra: 0.015, t: 0.22 },
    { a: [-0.55, 0.2], b: [-0.6, 0.0], ra: 0.015, t: 0.22 },
    { a: [0.31, 0.22], b: [0.35, 0.39], ra: 0.016, t: 0.27 },
    { a: [-0.24, 0.245], b: [-0.12, 0.245], ra: 0.02, t: 0.3 },
    { a: [-0.11, 0.48], b: [0.52, 0.3], ra: 0.005, t: 0.2 },
  ],
  discs: [
    { c: [0.56, 0.29], r: 0.1, t: 0.25 },
    { c: [0.56, 0.29], r: 0.075, t: 0.28, ring: 0.004 },
  ],
};

const kettlebell: Scene = {
  pose: side({
    head: [0.005, 0.905],
    neck: [-0.005, 0.835],
    chest: [-0.02, 0.72],
    pelvis: [-0.01, 0.52],
    shL: [-0.015, 0.8],
    shR: [0.005, 0.805],
    elL: [0.165, 0.785],
    elR: [0.185, 0.79],
    haL: [0.325, 0.765],
    haR: [0.335, 0.77],
    hiL: [-0.02, 0.515],
    hiR: [0, 0.52],
    knL: [0.015, 0.285],
    knR: [0.03, 0.285],
    anL: [0, 0.05],
    anR: [0.02, 0.05],
    toeL: [0.085, 0.02],
    toeR: [0.105, 0.02],
  }),
  view: { zoom: 0.92, cx: 0.12, cy: 0.52 },
  body: { shirt: 0.7, shorts: 0.6, hair: 2, facing: 0, far: 0.9 },
  env: { room: 0.085, floor: 0.08 },
  discs: [
    { c: [0.415, 0.72], r: 0.065, t: 0.29 },
    { c: [0.36, 0.775], r: 0.032, t: 0.31, ring: 0.007 },
  ],
};

const flow: Scene = {
  pose: {
    head: [-0.02, 0.79],
    neck: [0, 0.715],
    chest: [0, 0.625],
    pelvis: [0, 0.43],
    shL: [-0.115, 0.7],
    shR: [0.115, 0.7],
    elL: [-0.3, 0.7],
    elR: [0.3, 0.7],
    haL: [-0.46, 0.7],
    haR: [0.46, 0.7],
    hiL: [-0.065, 0.425],
    hiR: [0.065, 0.425],
    knL: [-0.27, 0.27],
    knR: [0.18, 0.24],
    anL: [-0.3, 0.05],
    anR: [0.28, 0.05],
    toeL: [-0.37, 0.03],
    toeR: [0.31, 0.025],
  },
  view: { zoom: 0.95, cx: 0, cy: 0.47 },
  body: { shirt: 0.66, shorts: 0.62, hair: 2, pants: 0.68 },
  env: { room: 0.085, floor: 0.06 },
};

/* Coach portraits: full-body signature stances with distinct hair. */
const stance = { zoom: 0.86, cx: 0, cy: 0.56, vignette: 1.1 };
const standing = {
  head: [0, 0.905] as Vec2,
  neck: [0, 0.835] as Vec2,
  chest: [0, 0.725] as Vec2,
  pelvis: [0, 0.52] as Vec2,
  hiL: [-0.062, 0.515] as Vec2,
  knL: [-0.09, 0.29] as Vec2,
  anL: [-0.12, 0.05] as Vec2,
  toeL: [-0.142, 0.018] as Vec2,
};

const coachDara: Scene = {
  pose: {
    ...symmetric({ ...standing, shL: [-0.12, 0.81], elL: [-0.16, 0.655], haL: [0.095, 0.7] }),
    haR: [-0.095, 0.68],
  },
  view: stance,
  body: { shirt: 0.7, shorts: 0.6, hair: 0 },
  env: { room: 0.09, floor: 0.07 },
};

const coachMei: Scene = {
  pose: symmetric({ ...standing, shL: [-0.115, 0.81], elL: [-0.135, 0.62], haL: [-0.03, 0.7] }),
  view: stance,
  body: { shirt: 0.7, shorts: 0.6, hair: 2 },
  env: { room: 0.09, floor: 0.07 },
  discs: [
    { c: [0, 0.655], r: 0.062, t: 0.3, front: true },
    { c: [0, 0.712], r: 0.03, t: 0.32, ring: 0.007, front: true },
  ],
};

const coachLucas: Scene = {
  pose: {
    ...symmetric({
      ...standing,
      pelvis: [0, 0.5],
      hiL: [-0.065, 0.495],
      knL: [-0.12, 0.28],
      anL: [-0.16, 0.05],
      toeL: [-0.185, 0.018],
      chest: [0, 0.71],
      neck: [0, 0.82],
      head: [0, 0.89],
      shL: [-0.12, 0.795],
      elL: [-0.15, 0.655],
      haL: [-0.065, 0.855],
    }),
    haR: [0.075, 0.83],
  },
  view: stance,
  body: { shirt: 0, shorts: 0.6, hair: 1, gloves: 1 },
  env: { room: 0.09, floor: 0.07 },
};

const coachPriya: Scene = {
  pose: {
    ...symmetric({ ...standing, shL: [-0.112, 0.81], elL: [-0.165, 0.975], haL: [-0.014, 1.11] }),
    hiR: [0.062, 0.515],
    knR: [0.235, 0.4],
    anR: [-0.035, 0.375],
    toeR: [-0.06, 0.33],
  },
  view: { ...stance, zoom: 0.8, cy: 0.58 },
  body: { shirt: 0.68, shorts: 0.6, hair: 3, pants: 0.66 },
  env: { room: 0.09, floor: 0.07 },
};

const thrusterTop = heroScene(1);
const thrusterBottom = { ...heroScene(0), pose: thrusterPose(0) };
thrusterBottom.caps = frontBarbell(thrusterBottom.pose);

export const artJobs: ArtJob[] = [
  { file: "hero-poster", w: 2100, h: 900, scene: thrusterTop, time: 1.3 },
  { file: "thruster-bottom", w: 1200, h: 1500, scene: thrusterBottom, time: 2 },
  { file: "deadlift", w: 1200, h: 1500, scene: deadlift },
  { file: "sled", w: 1200, h: 1500, scene: sled },
  { file: "boxing", w: 1200, h: 1500, scene: boxing },
  { file: "cycle", w: 1200, h: 1500, scene: cycle },
  { file: "plunge", w: 1200, h: 1500, scene: plunge },
  { file: "ropes", w: 1200, h: 1500, scene: ropes },
  { file: "row", w: 1200, h: 1500, scene: row },
  { file: "kettlebell", w: 1200, h: 1500, scene: kettlebell },
  { file: "flow", w: 1200, h: 1500, scene: flow },
  { file: "coach-dara", w: 1200, h: 1600, scene: coachDara },
  { file: "coach-mei", w: 1200, h: 1600, scene: coachMei },
  { file: "coach-lucas", w: 1200, h: 1600, scene: coachLucas },
  { file: "coach-priya", w: 1200, h: 1600, scene: coachPriya },
];
