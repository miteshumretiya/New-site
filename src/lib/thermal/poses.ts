import type { Pose, Prop, Scene, Vec2 } from "./shader.ts";

const add = (a: Vec2, b: Vec2): Vec2 => [a[0] + b[0], a[1] + b[1]];
const mix = (a: Vec2, b: Vec2, t: number): Vec2 => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];
const smooth = (e0: number, e1: number, x: number) => {
  const t = Math.min(1, Math.max(0, (x - e0) / (e1 - e0)));
  return t * t * (3 - 2 * t);
};

/** Mirror the left joints of a front-facing pose to build the right side. */
export function symmetric(p: Omit<Pose, "shR" | "elR" | "haR" | "hiR" | "knR" | "anR" | "toeR">): Pose {
  const m = (v: Vec2): Vec2 => [-v[0], v[1]];
  return {
    ...p,
    shR: m(p.shL),
    elR: m(p.elL),
    haR: m(p.haL),
    hiR: m(p.hiL),
    knR: m(p.knL),
    anR: m(p.anL),
    toeR: m(p.toeL),
  };
}

/**
 * Thruster (front squat → overhead press), s ∈ [0,1]: 0 = bottom of the
 * squat with the bar in the front rack, 1 = locked out overhead. Legs drive
 * first, the press follows — the way a good thruster actually moves.
 */
export function thrusterPose(s: number, breathe = 0): Pose {
  const eL = smooth(0, 0.62, s);
  const eA = smooth(0.38, 1, s);
  const pel = mix([0, 0.31], [0, 0.52], eL);
  const shL = mix([-0.112, 0.575], [-0.118, 0.81], eL);
  const elL = add(shL, mix([-0.175, -0.045], [-0.165, 0.155], eA));
  const haL = add(shL, mix([-0.145, 0.03], [-0.15, 0.31], eA));
  const anL: Vec2 = [-0.115, 0.05];
  return symmetric({
    head: mix([0, 0.665], [0, 0.905], eL),
    neck: mix([0, 0.595], [0, 0.835], eL),
    chest: add(mix([0, 0.505], [0, 0.725], eL), [0, breathe]),
    pelvis: pel,
    shL,
    elL,
    haL,
    hiL: add(pel, [-0.062, -0.005]),
    knL: mix([-0.175, 0.27], [-0.085, 0.29], eL),
    anL,
    toeL: add(anL, [-0.022, -0.034]),
  });
}

/** Barbell held across both hands, plates seen edge-on (front view). */
export function frontBarbell(pose: Pose, plateT = 0.27): Prop[] {
  const y = (pose.haL[1] + pose.haR[1]) / 2 + 0.012;
  const props: Prop[] = [{ a: [-0.4, y], b: [0.4, y], ra: 0.009, t: 0.36 }];
  for (const x of [0.3, 0.332]) {
    props.push({ a: [-x, y - 0.11], b: [-x, y + 0.11], ra: 0.013, t: plateT });
    props.push({ a: [x, y - 0.11], b: [x, y + 0.11], ra: 0.013, t: plateT });
  }
  props.push({ a: [-0.36, y], b: [-0.345, y], ra: 0.018, t: 0.3 }, { a: [0.36, y], b: [0.345, y], ra: 0.018, t: 0.3 });
  return props;
}

/** One full thruster rep every ~2.6s with a short pause at lockout. */
export function thrusterPhase(time: number) {
  const period = 2.6;
  const t = (time % period) / period;
  // up (0 → .38), hold (.38 → .5), down (.5 → .92), pause in the hole (.92 → 1)
  if (t < 0.38) return smooth(0, 0.38, t);
  if (t < 0.5) return 1;
  if (t < 0.92) return 1 - smooth(0.5, 0.92, t);
  return 0;
}

export function heroScene(s: number, breathe = 0): Scene {
  const pose = thrusterPose(s, breathe);
  return {
    pose,
    view: { zoom: 0.74, cx: 0, cy: 0.58, vignette: 0.9 },
    body: { shirt: 0.7, shorts: 0.6, hair: 1 },
    env: { room: 0.085, floor: 0.08, rack: true },
    caps: frontBarbell(pose),
  };
}
