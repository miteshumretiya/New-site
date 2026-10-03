/* Thermal-camera renderer.
 *
 * A figure is described by 18 2D joints (in "figure units": ~1.0 = standing
 * height, y up, ground at 0). The fragment shader builds a smooth signed
 * distance field for the body, assigns temperatures per region (skin cools
 * toward the extremities, clothing and hair run cooler, the face runs hot),
 * adds props (bars, plates, bikes, ropes…) and an environment, then maps
 * temperature through an ember "heat" ramp. Used live for the hero and
 * offline (scripts/render-art.ts) for every static image on the site. */

export const JOINTS = [
  "head",
  "neck",
  "chest",
  "pelvis",
  "shL",
  "shR",
  "elL",
  "elR",
  "haL",
  "haR",
  "hiL",
  "hiR",
  "knL",
  "knR",
  "anL",
  "anR",
  "toeL",
  "toeR",
] as const;
export type JointName = (typeof JOINTS)[number];
export type Vec2 = [number, number];
export type Pose = Record<JointName, Vec2>;

export const MAX_CAPS = 16;
export const MAX_DISCS = 8;

export const vertexShader = /* glsl */ `
attribute vec2 aPos;
void main(){ gl_Position = vec4(aPos, 0.0, 1.0); }
`;

export const fragmentShader = /* glsl */ `
precision highp float;
uniform vec2 uRes;
uniform float uTime;
uniform vec2 uJ[18];
uniform vec4 uView;   // zoom, centreX, centreY, vignette
uniform vec4 uBody;   // shirtT (0 = bare), shortsT, hairStyle, farSide
uniform vec4 uBody2;  // facing (1 front, 0 side), pantsT (0 = bare legs), gloves, skinBoost
uniform vec4 uEnv;    // roomT, floorWarmth, waterline (<0 none), rackPosts
uniform vec4 uCaps[${MAX_CAPS}];
uniform vec4 uCapsP[${MAX_CAPS}]; // ra, rb, temperature, unused
uniform int uCapN;
uniform vec4 uDisc[${MAX_DISCS}];  // centre.xy, radius, temperature
uniform vec4 uDiscP[${MAX_DISCS}]; // ring thickness (0 = filled), aspect, front (1 = over body), unused
uniform int uDiscN;

float hash(vec2 p){ p = fract(p*vec2(123.34,456.21)); p += dot(p,p+45.32); return fract(p.x*p.y); }
float noise(vec2 p){ vec2 i=floor(p), f=fract(p); f=f*f*(3.-2.*f);
  return mix(mix(hash(i),hash(i+vec2(1,0)),f.x), mix(hash(i+vec2(0,1)),hash(i+vec2(1,1)),f.x), f.y); }
float fbm(vec2 p){ float v=0., a=.5; for(int i=0;i<4;i++){ v+=a*noise(p); p*=2.07; a*=.5; } return v; }
float tcap(vec2 p, vec2 a, vec2 b, float ra, float rb){
  vec2 pa=p-a, ba=b-a; float h=clamp(dot(pa,ba)/max(dot(ba,ba),1e-6),0.,1.);
  return length(pa-ba*h) - mix(ra,rb,h);
}
float ell(vec2 p, vec2 c, vec2 r){ vec2 q=(p-c)/r; return (length(q)-1.)*min(r.x,r.y); }
float smin(float a, float b, float k){ float h=clamp(.5+.5*(b-a)/k,0.,1.); return mix(b,a,h)-k*h*(1.-h); }
float surf(float d, float t, float w){
  if(d < 0.) return t*(.66 + .34*smoothstep(0., w, -d));
  return t*.66*exp(-d/.016) + t*.13*exp(-d/.075);
}
vec3 ramp(float t){
  t = clamp(t,0.,1.);
  vec3 c0=vec3(.035,.025,.03), c1=vec3(.13,.03,.06), c2=vec3(.34,.045,.08), c3=vec3(.66,.10,.07),
       c4=vec3(.93,.27,.09), c5=vec3(1.,.50,.15), c6=vec3(1.,.74,.32), c7=vec3(1.,.93,.70);
  float s=t*7.;
  if(s<1.) return mix(c0,c1,s); if(s<2.) return mix(c1,c2,s-1.); if(s<3.) return mix(c2,c3,s-2.);
  if(s<4.) return mix(c3,c4,s-3.); if(s<5.) return mix(c4,c5,s-4.); if(s<6.) return mix(c5,c6,s-5.);
  return mix(c6,c7,s-6.);
}

void main(){
  vec2 uv = gl_FragCoord.xy / uRes;
  // figure space: 1 unit = viewport height / zoom, centred on uView.yz
  vec2 p = (gl_FragCoord.xy - .5*uRes) / uRes.y / uView.x + uView.yz;

  vec2 head=uJ[0], neck=uJ[1], chest=uJ[2], pel=uJ[3];
  vec2 shL=uJ[4], shR=uJ[5], elL=uJ[6], elR=uJ[7], haL=uJ[8], haR=uJ[9];
  vec2 hiL=uJ[10], hiR=uJ[11], knL=uJ[12], knR=uJ[13], anL=uJ[14], anR=uJ[15], toL=uJ[16], toR=uJ[17];

  float f = uBody2.x;                 // 1 front view, 0 side view
  float far = uBody.w;                // temperature multiplier for far-side limbs
  float n = fbm(p*14. + vec2(0., uTime*.2));
  float m = fbm(p*5. - vec2(uTime*.05, 0.));

  // ---- body parts
  float face  = ell(p, head, vec2(mix(.047,.052,f), .066));
  float neckD = tcap(p, neck, head - vec2(0.,.03), .034, .03);
  vec2 cr = mix(vec2(.078,.102), vec2(.118,.104), f);
  float torso = smin(ell(p, chest, cr), tcap(p, chest, pel + vec2(0.,.05), mix(.07,.095,f), mix(.064,.078,f)), .04);
  torso = smin(torso, tcap(p, shL, shR, .045, .045), .04);
  float pelvis = ell(p, pel, vec2(mix(.075,.11,f), .072));
  vec2 tqL = mix(hiL, knL, .42), tqR = mix(hiR, knR, .42);
  float thighUpL = tcap(p, hiL, tqL, .066, .058), thighUpR = tcap(p, hiR, tqR, .066, .058);
  float thighLoL = tcap(p, tqL, knL, .058, .044), thighLoR = tcap(p, tqR, knR, .058, .044);
  float shinL = tcap(p, knL, anL, .044, .03), shinR = tcap(p, knR, anR, .044, .03);
  float footL = tcap(p, anL, toL, .03, .022), footR = tcap(p, anR, toR, .03, .022);
  float uArmL = tcap(p, shL, elL, .043, .033), uArmR = tcap(p, shR, elR, .043, .033);
  float fArmL = tcap(p, elL, haL, .033, .026), fArmR = tcap(p, elR, haR, .033, .026);
  float hr = mix(.026, .055, uBody2.z); // gloves enlarge the hands
  float handL = ell(p, haL, vec2(hr, hr*1.12)), handR = ell(p, haR, vec2(hr, hr*1.12));
  float delt = min(ell(p, shL, vec2(.05,.048)), ell(p, shR, vec2(.05,.048)));

  float dBody = smin(torso, pelvis, .03);
  dBody = smin(dBody, min(min(thighUpL, thighUpR), min(thighLoL, thighLoR)), .03);
  dBody = smin(dBody, min(shinL, shinR), .02);
  dBody = min(dBody, min(footL, footR));
  dBody = smin(dBody, min(min(uArmL, uArmR), delt), .025);
  dBody = smin(dBody, min(fArmL, fArmR), .02);
  dBody = smin(dBody, min(handL, handR), .015);
  dBody = smin(dBody, neckD, .02);
  dBody = smin(dBody, face, .02);

  // ---- temperatures per region, blended by proximity
  float skin = (.95 + uBody2.w) - .28*smoothstep(.06, .62, length((p - chest)*vec2(1.,.82)));
  float shirtT = uBody.x > 0. ? uBody.x + .1*smoothstep(.13, 0., length((p-chest-vec2(0.,.02))*vec2(1.,.75))) : skin;
  float shortsT = uBody.y;
  float legsT = uBody2.y > 0. ? uBody2.y : skin;
  float gloveT = mix(skin*.84, .66, uBody2.z);
  float wsum = 0., tsum = 0., w;
  #define ADD(d, t) w = exp(-max(d, -.02)*60.); wsum += w; tsum += w*(t);
  ADD(torso, shirtT)
  ADD(pelvis, shortsT)
  ADD(thighUpL, shortsT) ADD(thighUpR, shortsT*far)
  ADD(thighLoL, legsT) ADD(thighLoR, legsT*far)
  ADD(shinL, legsT*.97) ADD(shinR, legsT*.97*far)
  ADD(footL, .42) ADD(footR, .42*far)
  ADD(delt, skin)
  ADD(uArmL, skin) ADD(uArmR, skin*far)
  ADD(fArmL, skin*.97) ADD(fArmR, skin*.97*far)
  ADD(handL, gloveT) ADD(handR, gloveT*far)
  ADD(neckD, .94)
  ADD(face, .98)
  float bodyT = tsum / max(wsum, 1e-5) + .04*(m-.5);
  float T = 0.;

  // ---- environment
  float bg = uEnv.x + .06*fbm(p*2.2 + vec2(uTime*.02, 0.));
  if(uEnv.w > 0.){
    float rack = min(tcap(p, vec2(-.52,0.), vec2(-.52,1.3), .018, .018), tcap(p, vec2(.52,0.), vec2(.52,1.3), .018, .018));
    bg = max(bg, .2*exp(-max(rack,0.)/.006));
  }
  bg += uEnv.y*exp(-abs(p.y - .01)*22.)*exp(-abs(p.x - pel.x)*2.5);
  float plume = exp(-pow((p.x-head.x)*5.5 + .15*sin(p.y*9. - uTime*1.6), 2.)) * smoothstep(head.y+1.2, head.y+.05, p.y) * smoothstep(head.y, head.y+.08, p.y);
  bg += .07*plume*(.6 + .8*fbm(vec2(p.x*7., p.y*5. - uTime*.9)));
  T = bg;

  // ---- props (drawn behind the body)
  for(int i=0; i<${MAX_CAPS}; i++){
    if(i >= uCapN) break;
    float d = tcap(p, uCaps[i].xy, uCaps[i].zw, uCapsP[i].x, uCapsP[i].y);
    T = max(T, surf(d, uCapsP[i].z + .03*m, .012));
  }
  for(int i=0; i<${MAX_DISCS}; i++){
    if(i >= uDiscN) break;
    if(uDiscP[i].z > .5) continue;
    vec2 q = p - uDisc[i].xy; q.x /= max(uDiscP[i].y, .05);
    float d = length(q) - uDisc[i].z;
    if(uDiscP[i].x > 0.) d = abs(d + uDiscP[i].x) - uDiscP[i].x;
    T = max(T, surf(d, uDisc[i].w + .03*m, .02));
  }

  // ---- body on top
  float bT = surf(dBody, bodyT, .045);
  // separation contours where near-side limbs (L) overlap the rest of the body
  float nearArm = min(uArmL, fArmL);
  float nearLeg = min(min(thighUpL, thighLoL), shinL);
  float dCore = smin(torso, pelvis, .03);
  float dFar = min(min(min(uArmR, fArmR), min(thighUpR, thighLoR)), shinR);
  float overA = smoothstep(.012, -.012, min(min(dCore, dFar), nearLeg));
  float overL = smoothstep(.012, -.012, min(dCore - .02, min(dFar, min(shinR, thighLoR))));
  float contour = exp(-abs(nearArm)/.0055)*overA + exp(-abs(nearLeg)/.0055)*overL;
  bT *= 1. - .2*clamp(contour, 0., 1.);

  // hair (1 short, 2 bun, 3 long); 0 = shaved / bald
  float hs = uBody.z;
  if(hs > .5){
    float crown = smoothstep(head.y - .005, head.y + .045, p.y);
    bT = mix(bT, bT*.7, crown*step(face, .012));
  }
  if(hs > 1.5 && hs < 2.5){
    float bun = ell(p, head + vec2(mix(-.045,0.,f), .075), vec2(.032,.03));
    bT = max(bT, surf(bun, .52, .02));
  }
  if(hs > 2.5){
    float hairD = smin(ell(p, head + vec2(0., .006), vec2(.07, .078)), tcap(p, head + vec2(0., -.03), neck + vec2(0., -.075), .066, .074), .03);
    bT = max(bT, surf(hairD, .55, .03)*smoothstep(-.004, .016, dBody));
  }
  T = max(T, bT);
  T += (n - .5)*.05*smoothstep(.02, -.02, dBody);

  // ---- props held in front of the body (occlude it)
  for(int i=0; i<${MAX_DISCS}; i++){
    if(i >= uDiscN) break;
    if(uDiscP[i].z < .5) continue;
    vec2 q = p - uDisc[i].xy; q.x /= max(uDiscP[i].y, .05);
    float d = length(q) - uDisc[i].z;
    if(uDiscP[i].x > 0.) d = abs(d + uDiscP[i].x) - uDiscP[i].x;
    float dt = surf(d, uDisc[i].w + .03*m, .02);
    T = mix(max(T, dt), dt, smoothstep(.004, -.004, d));
  }

  // ---- water (cold plunge): everything below the line reads as cold water
  if(uEnv.z > 0.){
    float wl = uEnv.z + .006*sin(p.x*40. + uTime*2.) + .004*sin(p.x*17. - uTime*1.3);
    float below = smoothstep(wl + .004, wl - .006, p.y);
    float water = .13 + .05*fbm(vec2(p.x*6. + uTime*.15, p.y*18.)) ;
    float rim = exp(-abs(p.y - wl)/.01)*smoothstep(.05, -.02, dBody)*.25;
    T = mix(T, water, below) + rim;
  }

  T += (hash(gl_FragCoord.xy + floor(uTime*24.)) - .5)*.025;
  vec3 col = ramp(T);
  vec2 q = uv - .5;
  col *= 1. - dot(q, q)*uView.w;
  gl_FragColor = vec4(col, 1.);
}
`;

export type Prop = { a: Vec2; b: Vec2; ra: number; rb?: number; t: number };
export type Disc = { c: Vec2; r: number; t: number; ring?: number; aspect?: number; front?: boolean };

export type Scene = {
  pose: Pose;
  view?: { zoom?: number; cx?: number; cy?: number; vignette?: number };
  body?: {
    shirt?: number;
    shorts?: number;
    hair?: 0 | 1 | 2 | 3;
    far?: number;
    facing?: number;
    pants?: number;
    gloves?: number;
    skin?: number;
  };
  env?: { room?: number; floor?: number; water?: number; rack?: boolean };
  caps?: Prop[];
  discs?: Disc[];
};

/** Flatten a scene into the uniform values the shader expects. */
export function sceneUniforms(s: Scene) {
  const j = new Float32Array(36);
  JOINTS.forEach((name, i) => {
    j[i * 2] = s.pose[name][0];
    j[i * 2 + 1] = s.pose[name][1];
  });
  const caps = new Float32Array(MAX_CAPS * 4);
  const capsP = new Float32Array(MAX_CAPS * 4);
  (s.caps ?? []).slice(0, MAX_CAPS).forEach((c, i) => {
    caps.set([c.a[0], c.a[1], c.b[0], c.b[1]], i * 4);
    capsP.set([c.ra, c.rb ?? c.ra, c.t, 0], i * 4);
  });
  const discs = new Float32Array(MAX_DISCS * 4);
  const discsP = new Float32Array(MAX_DISCS * 4);
  (s.discs ?? []).slice(0, MAX_DISCS).forEach((d, i) => {
    discs.set([d.c[0], d.c[1], d.r, d.t], i * 4);
    discsP.set([d.ring ?? 0, d.aspect ?? 1, d.front ? 1 : 0, 0], i * 4);
  });
  const v = s.view ?? {};
  const b = s.body ?? {};
  const e = s.env ?? {};
  return {
    uJ: j,
    uView: [v.zoom ?? 0.78, v.cx ?? 0, v.cy ?? 0.55, v.vignette ?? 1.0],
    uBody: [b.shirt ?? 0.7, b.shorts ?? 0.6, b.hair ?? 1, b.far ?? 1],
    uBody2: [b.facing ?? 1, b.pants ?? 0, b.gloves ?? 0, b.skin ?? 0],
    uEnv: [e.room ?? 0.085, e.floor ?? 0.08, e.water ?? -1, e.rack ? 1 : 0],
    uCaps: caps,
    uCapsP: capsP,
    uCapN: Math.min(s.caps?.length ?? 0, MAX_CAPS),
    uDisc: discs,
    uDiscP: discsP,
    uDiscN: Math.min(s.discs?.length ?? 0, MAX_DISCS),
  };
}

export type Uniforms = ReturnType<typeof sceneUniforms>;

/** Minimal WebGL1 renderer shared by the live hero and the offline renderer. */
export function createRenderer(canvas: HTMLCanvasElement) {
  const gl = canvas.getContext("webgl", {
    antialias: false,
    alpha: false,
    preserveDrawingBuffer: false,
    powerPreference: "low-power",
  });
  if (!gl) return null;
  const compile = (type: number, src: string) => {
    const sh = gl.createShader(type)!;
    gl.shaderSource(sh, src);
    gl.compileShader(sh);
    if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(sh) ?? "shader error");
    return sh;
  };
  const prog = gl.createProgram()!;
  gl.attachShader(prog, compile(gl.VERTEX_SHADER, vertexShader));
  gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, fragmentShader));
  gl.linkProgram(prog);
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(prog) ?? "link error");
  gl.useProgram(prog);
  const buf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  const loc = gl.getAttribLocation(prog, "aPos");
  gl.enableVertexAttribArray(loc);
  gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

  const u = (name: string) => gl.getUniformLocation(prog, name);
  const L = {
    uRes: u("uRes"),
    uTime: u("uTime"),
    uJ: u("uJ"),
    uView: u("uView"),
    uBody: u("uBody"),
    uBody2: u("uBody2"),
    uEnv: u("uEnv"),
    uCaps: u("uCaps"),
    uCapsP: u("uCapsP"),
    uCapN: u("uCapN"),
    uDisc: u("uDisc"),
    uDiscP: u("uDiscP"),
    uDiscN: u("uDiscN"),
  };

  function draw(un: Uniforms, time: number) {
    gl!.viewport(0, 0, canvas.width, canvas.height);
    gl!.uniform2f(L.uRes, canvas.width, canvas.height);
    gl!.uniform1f(L.uTime, time);
    gl!.uniform2fv(L.uJ, un.uJ);
    gl!.uniform4fv(L.uView, un.uView);
    gl!.uniform4fv(L.uBody, un.uBody);
    gl!.uniform4fv(L.uBody2, un.uBody2);
    gl!.uniform4fv(L.uEnv, un.uEnv);
    gl!.uniform4fv(L.uCaps, un.uCaps);
    gl!.uniform4fv(L.uCapsP, un.uCapsP);
    gl!.uniform1i(L.uCapN, un.uCapN);
    gl!.uniform4fv(L.uDisc, un.uDisc);
    gl!.uniform4fv(L.uDiscP, un.uDiscP);
    gl!.uniform1i(L.uDiscN, un.uDiscN);
    gl!.drawArrays(gl!.TRIANGLES, 0, 3);
  }

  function dispose() {
    gl!.deleteProgram(prog);
    gl!.deleteBuffer(buf);
    gl!.getExtension("WEBGL_lose_context")?.loseContext();
  }

  return { gl, draw, dispose };
}
