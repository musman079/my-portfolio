"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useTheme } from "next-themes";
import * as THREE from "three";

/* ════════════════════════════════════════════════════════════════
   GLOBAL 3D SCENE
   A single fixed WebGL canvas behind the whole page:
   • liquid iridescent core (custom GLSL: simplex displacement + fresnel)
   • spiral galaxy disc, orbit rings with satellites, low-poly shards
   • deep parallax starfield
   Everything reacts to the pointer and is choreographed by scroll.
   ════════════════════════════════════════════════════════════════ */

type SceneInput = {
  px: number;
  py: number;
  energy: number;
  scrollY: number;
  vh: number;
  maxScroll: number;
};

const AMBER = "#f59e0b";
const CYAN = "#0ea5e9";
const VIOLET = "#8b5cf6";
const EMERALD = "#10b981";
const PINK = "#ec4899";

const rgb = (hex: string) => {
  const n = parseInt(hex.slice(1), 16);
  return new THREE.Vector3(((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255);
};

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const smooth = (v: number) => v * v * (3 - 2 * v);
const { damp, lerp } = THREE.MathUtils;

/* ─────────────────────────── GLSL ─────────────────────────── */

const SIMPLEX = /* glsl */ `
vec3 mod289(vec3 x){return x-floor(x*(1.0/289.0))*289.0;}
vec4 mod289(vec4 x){return x-floor(x*(1.0/289.0))*289.0;}
vec4 permute(vec4 x){return mod289(((x*34.0)+1.0)*x);}
vec4 taylorInvSqrt(vec4 r){return 1.79284291400159-0.85373472095314*r;}
float snoise(vec3 v){
  const vec2 C=vec2(1.0/6.0,1.0/3.0);
  const vec4 D=vec4(0.0,0.5,1.0,2.0);
  vec3 i=floor(v+dot(v,C.yyy));
  vec3 x0=v-i+dot(i,C.xxx);
  vec3 g=step(x0.yzx,x0.xyz);
  vec3 l=1.0-g;
  vec3 i1=min(g.xyz,l.zxy);
  vec3 i2=max(g.xyz,l.zxy);
  vec3 x1=x0-i1+C.xxx;
  vec3 x2=x0-i2+C.yyy;
  vec3 x3=x0-D.yyy;
  i=mod289(i);
  vec4 p=permute(permute(permute(
    i.z+vec4(0.0,i1.z,i2.z,1.0))
    +i.y+vec4(0.0,i1.y,i2.y,1.0))
    +i.x+vec4(0.0,i1.x,i2.x,1.0));
  float n_=0.142857142857;
  vec3 ns=n_*D.wyz-D.xzx;
  vec4 j=p-49.0*floor(p*ns.z*ns.z);
  vec4 x_=floor(j*ns.z);
  vec4 y_=floor(j-7.0*x_);
  vec4 x=x_*ns.x+ns.yyyy;
  vec4 y=y_*ns.x+ns.yyyy;
  vec4 h=1.0-abs(x)-abs(y);
  vec4 b0=vec4(x.xy,y.xy);
  vec4 b1=vec4(x.zw,y.zw);
  vec4 s0=floor(b0)*2.0+1.0;
  vec4 s1=floor(b1)*2.0+1.0;
  vec4 sh=-step(h,vec4(0.0));
  vec4 a0=b0.xzyw+s0.xzyw*sh.xxyy;
  vec4 a1=b1.xzyw+s1.xzyw*sh.zzww;
  vec3 p0=vec3(a0.xy,h.x);
  vec3 p1=vec3(a0.zw,h.y);
  vec3 p2=vec3(a1.xy,h.z);
  vec3 p3=vec3(a1.zw,h.w);
  vec4 norm=taylorInvSqrt(vec4(dot(p0,p0),dot(p1,p1),dot(p2,p2),dot(p3,p3)));
  p0*=norm.x;p1*=norm.y;p2*=norm.z;p3*=norm.w;
  vec4 m=max(0.6-vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)),0.0);
  m=m*m;
  return 42.0*dot(m*m,vec4(dot(p0,x0),dot(p1,x1),dot(p2,x2),dot(p3,x3)));
}`;

const CORE_VERT = /* glsl */ `
uniform float uTime;
uniform float uAmp;
varying vec3 vN;
varying vec3 vView;
varying float vDisp;
${SIMPLEX}
float field(vec3 n){
  return snoise(n*1.15+vec3(0.0,uTime*0.22,uTime*0.15))*0.75
       + snoise(n*2.7-vec3(uTime*0.3))*0.25;
}
vec3 displace(vec3 n){ return n*(1.0+field(n)*uAmp); }
void main(){
  vec3 n=normalize(position);
  vec3 p=displace(n);
  // Recompute the normal from two displaced neighbours for correct shading
  vec3 up=abs(n.y)>0.95?vec3(1.0,0.0,0.0):vec3(0.0,1.0,0.0);
  vec3 t=normalize(cross(up,n));
  vec3 b=cross(n,t);
  float e=0.05;
  vec3 pt=displace(normalize(n+t*e));
  vec3 pb=displace(normalize(n+b*e));
  vec3 dn=normalize(cross(pt-p,pb-p));
  if(dot(dn,n)<0.0) dn=-dn;
  vDisp=field(n);
  vN=normalize(normalMatrix*dn);
  vec4 mv=modelViewMatrix*vec4(p,1.0);
  vView=-mv.xyz;
  gl_Position=projectionMatrix*mv;
}`;

const CORE_FRAG = /* glsl */ `
uniform float uTime;
uniform float uOpacity;
uniform vec3 uA;
uniform vec3 uB;
uniform vec3 uC;
varying vec3 vN;
varying vec3 vView;
varying float vDisp;
void main(){
  vec3 N=normalize(vN);
  vec3 V=normalize(vView);
  float fr=pow(1.0-max(dot(N,V),0.0),2.2);
  float band=0.5+0.5*sin(vDisp*4.0+uTime*0.35);
  vec3 pal=mix(uA,uB,smoothstep(-0.45,0.45,vDisp));
  pal=mix(pal,uC,fr*0.85);
  vec3 L1=normalize(vec3(0.55,0.75,0.65));
  vec3 L2=normalize(vec3(-0.7,-0.3,0.5));
  float d1=max(dot(N,L1),0.0);
  float d2=max(dot(N,L2),0.0);
  float s1=pow(max(dot(reflect(-L1,N),V),0.0),48.0);
  float s2=pow(max(dot(reflect(-L2,N),V),0.0),24.0);
  vec3 col=vec3(0.02,0.03,0.08)*(1.0-fr);
  col+=pal*(0.12+0.38*d1+0.1*band);
  col+=uB*d2*0.22;
  col+=pal*fr*1.55;
  col+=vec3(1.0,0.95,0.85)*s1*0.9+uB*s2*0.35;
  gl_FragColor=vec4(col,uOpacity);
}`;

const STAR_VERT = /* glsl */ `
attribute float aSize;
attribute float aSeed;
attribute vec3 aColor;
uniform float uTime;
uniform float uPixel;
varying vec3 vColor;
varying float vAlpha;
void main(){
  vec4 mv=modelViewMatrix*vec4(position,1.0);
  float tw=0.62+0.38*sin(uTime*(0.6+aSeed*1.8)+aSeed*40.0);
  gl_PointSize=aSize*uPixel*tw*(6.0/max(-mv.z,0.1));
  gl_Position=projectionMatrix*mv;
  vColor=aColor;
  vAlpha=tw;
}`;

const STAR_FRAG = /* glsl */ `
uniform float uOpacity;
uniform float uTint;
varying vec3 vColor;
varying float vAlpha;
void main(){
  float d=length(gl_PointCoord-0.5);
  float a=smoothstep(0.5,0.0,d);
  a*=a;
  gl_FragColor=vec4(vColor*uTint,a*vAlpha*uOpacity);
}`;

/* ─────────────────────────── HELPERS ─────────────────────────── */

function makeStarMaterial(dark: boolean, opacity: number) {
  return new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
      uPixel: { value: 1 },
      uOpacity: { value: opacity },
      uTint: { value: dark ? 1 : 0.72 },
    },
    vertexShader: STAR_VERT,
    fragmentShader: STAR_FRAG,
    transparent: true,
    depthWrite: false,
    blending: dark ? THREE.AdditiveBlending : THREE.NormalBlending,
  });
}

function makePointsGeometry(
  count: number,
  fill: (i: number, pos: Float32Array, col: Float32Array, size: Float32Array) => void
) {
  const pos = new Float32Array(count * 3);
  const col = new Float32Array(count * 3);
  const size = new Float32Array(count);
  const seed = new Float32Array(count);
  for (let i = 0; i < count; i++) {
    fill(i, pos, col, size);
    seed[i] = Math.random();
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute("position", new THREE.BufferAttribute(pos, 3));
  g.setAttribute("aColor", new THREE.BufferAttribute(col, 3));
  g.setAttribute("aSize", new THREE.BufferAttribute(size, 1));
  g.setAttribute("aSeed", new THREE.BufferAttribute(seed, 1));
  return g;
}

const PALETTE = [AMBER, CYAN, VIOLET, EMERALD, PINK, "#fde68a", "#bae6fd"].map(rgb);

/* ─────────────────────────── STARFIELD ─────────────────────────── */

function Starfield({
  input,
  dark,
  count,
  still,
}: {
  input: React.RefObject<SceneInput>;
  dark: boolean;
  count: number;
  still: boolean;
}) {
  const group = useRef<THREE.Group>(null);

  const geometry = useMemo(
    () =>
      makePointsGeometry(count, (i, pos, col, size) => {
        pos[i * 3] = (Math.random() - 0.5) * 22;
        pos[i * 3 + 1] = 6 - Math.random() * 24;
        pos[i * 3 + 2] = 1.5 - Math.random() * 11;
        const c = PALETTE[Math.floor(Math.random() * PALETTE.length)];
        // Most stars are near-white, a few carry a brand colour
        const k = Math.random() < 0.35 ? 1 : 0.25;
        col[i * 3] = lerp(0.85, c.x, k);
        col[i * 3 + 1] = lerp(0.88, c.y, k);
        col[i * 3 + 2] = lerp(1.0, c.z, k);
        size[i] = 1.6 + Math.pow(Math.random(), 3) * 5.5;
      }),
    [count]
  );
  const material = useMemo(() => makeStarMaterial(dark, dark ? 0.85 : 0.5), [dark]);

  useEffect(() => () => geometry.dispose(), [geometry]);
  useEffect(() => () => material.dispose(), [material]);

  useFrame((st, rawDt) => {
    const g = group.current;
    const inp = input.current;
    if (!g || !inp) return;
    const dt = still ? 10 : Math.min(rawDt, 0.05);
    material.uniforms.uTime.value = st.clock.elapsedTime;
    material.uniforms.uPixel.value = st.gl.getPixelRatio();
    // Scrolling flies the camera "down" through the field
    g.position.y = damp(g.position.y, (inp.scrollY / inp.vh) * 1.25, 3, dt);
    g.rotation.y = damp(g.rotation.y, inp.px * 0.06, 2, dt);
    g.rotation.x = damp(g.rotation.x, -inp.py * 0.04, 2, dt);
  });

  return (
    <group ref={group}>
      <points geometry={geometry} material={material} frustumCulled={false} />
    </group>
  );
}

/* ─────────────────────────── CORE PARTS ─────────────────────────── */

function OrbitRing({
  radius,
  tilt,
  speed,
  color,
  dark,
}: {
  radius: number;
  tilt: [number, number, number];
  speed: number;
  color: string;
  dark: boolean;
}) {
  const spin = useRef<THREE.Group>(null);
  useFrame((_, dt) => {
    if (spin.current) spin.current.rotation.z += dt * speed;
  });
  return (
    <group rotation={tilt}>
      <group ref={spin}>
        <mesh>
          <torusGeometry args={[radius, 0.006, 8, 160]} />
          <meshBasicMaterial
            color={color}
            transparent
            opacity={dark ? 0.6 : 0.45}
            depthWrite={false}
            blending={dark ? THREE.AdditiveBlending : THREE.NormalBlending}
          />
        </mesh>
        <mesh position={[radius, 0, 0]}>
          <sphereGeometry args={[0.05, 16, 16]} />
          <meshBasicMaterial color={color} />
        </mesh>
        <mesh position={[-radius, 0, 0]}>
          <sphereGeometry args={[0.028, 12, 12]} />
          <meshBasicMaterial color="#ffffff" />
        </mesh>
      </group>
    </group>
  );
}

const SHARDS: {
  kind: "octa" | "tetra" | "box" | "dodeca" | "torus";
  r: number;
  size: number;
  speed: number;
  phase: number;
  tilt: [number, number, number];
  color: string;
}[] = [
  { kind: "octa", r: 2.05, size: 0.15, speed: 0.42, phase: 0.0, tilt: [0.5, 0, 0.3], color: AMBER },
  { kind: "tetra", r: 2.35, size: 0.14, speed: -0.33, phase: 2.1, tilt: [-0.7, 0, 0.5], color: CYAN },
  { kind: "box", r: 2.2, size: 0.13, speed: 0.27, phase: 4.0, tilt: [1.2, 0, -0.4], color: VIOLET },
  { kind: "dodeca", r: 2.6, size: 0.12, speed: -0.22, phase: 1.2, tilt: [0.2, 0, -0.9], color: EMERALD },
  { kind: "torus", r: 2.45, size: 0.1, speed: 0.36, phase: 5.2, tilt: [-0.3, 0, 1.1], color: PINK },
];

function Shard({ cfg }: { cfg: (typeof SHARDS)[number] }) {
  const orbit = useRef<THREE.Group>(null);
  const mesh = useRef<THREE.Mesh>(null);
  useFrame((st, dt) => {
    if (orbit.current) orbit.current.rotation.y = cfg.phase + st.clock.elapsedTime * cfg.speed;
    if (mesh.current) {
      mesh.current.rotation.x += dt * 1.1;
      mesh.current.rotation.y += dt * 0.8;
    }
  });
  return (
    <group rotation={cfg.tilt}>
      <group ref={orbit}>
        <mesh ref={mesh} position={[cfg.r, 0, 0]}>
          {cfg.kind === "octa" && <octahedronGeometry args={[cfg.size, 0]} />}
          {cfg.kind === "tetra" && <tetrahedronGeometry args={[cfg.size, 0]} />}
          {cfg.kind === "box" && <boxGeometry args={[cfg.size * 1.3, cfg.size * 1.3, cfg.size * 1.3]} />}
          {cfg.kind === "dodeca" && <dodecahedronGeometry args={[cfg.size, 0]} />}
          {cfg.kind === "torus" && <torusGeometry args={[cfg.size, cfg.size * 0.38, 8, 20]} />}
          <meshStandardMaterial
            color={cfg.color}
            emissive={cfg.color}
            emissiveIntensity={0.55}
            metalness={0.55}
            roughness={0.25}
            flatShading
          />
        </mesh>
      </group>
    </group>
  );
}

function useHaloTexture() {
  const texture = useMemo(() => {
    const c = document.createElement("canvas");
    c.width = c.height = 128;
    const ctx = c.getContext("2d")!;
    const g = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
    g.addColorStop(0, "rgba(255,255,255,0.55)");
    g.addColorStop(0.25, "rgba(245,158,11,0.32)");
    g.addColorStop(0.55, "rgba(14,165,233,0.12)");
    g.addColorStop(1, "rgba(14,165,233,0)");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, 128, 128);
    const t = new THREE.CanvasTexture(c);
    t.colorSpace = THREE.SRGBColorSpace;
    return t;
  }, []);
  useEffect(() => () => texture.dispose(), [texture]);
  return texture;
}

/* ─────────────────────────── CORE RIG ─────────────────────────── */

function CoreRig({
  input,
  dark,
  mobile,
  still,
}: {
  input: React.RefObject<SceneInput>;
  dark: boolean;
  mobile: boolean;
  still: boolean;
}) {
  const rig = useRef<THREE.Group>(null);
  const core = useRef<THREE.Mesh>(null);
  const cage = useRef<THREE.LineSegments>(null);
  const galaxy = useRef<THREE.Points>(null);
  const halo = useHaloTexture();

  const coreMaterial = useMemo(
    () =>
      new THREE.ShaderMaterial({
        uniforms: {
          uTime: { value: 0 },
          uAmp: { value: 0.16 },
          uOpacity: { value: 1 },
          uA: { value: rgb(AMBER) },
          uB: { value: rgb(CYAN) },
          uC: { value: rgb(VIOLET) },
        },
        vertexShader: CORE_VERT,
        fragmentShader: CORE_FRAG,
        transparent: true,
      }),
    []
  );

  const cageGeometry = useMemo(() => {
    const ico = new THREE.IcosahedronGeometry(1.42, 1);
    const wire = new THREE.WireframeGeometry(ico);
    ico.dispose();
    return wire;
  }, []);

  const galaxyCount = mobile ? 500 : 1100;
  const galaxyGeometry = useMemo(() => {
    const inner = rgb("#fde68a");
    const mid = rgb(AMBER);
    const outerA = rgb(CYAN);
    const outerB = rgb(VIOLET);
    return makePointsGeometry(galaxyCount, (i, pos, col, size) => {
      const arm = i % 3;
      const u = Math.random();
      const r = 1.55 + Math.pow(u, 0.85) * 1.5;
      const a = (arm * Math.PI * 2) / 3 + r * 1.25 + (Math.random() - 0.5) * 0.55;
      pos[i * 3] = Math.cos(a) * r;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 0.16 * (3.3 - r);
      pos[i * 3 + 2] = Math.sin(a) * r;
      const outer = Math.random() < 0.5 ? outerA : outerB;
      const c = u < 0.3 ? inner.clone().lerp(mid, u / 0.3) : mid.clone().lerp(outer, (u - 0.3) / 0.7);
      col[i * 3] = c.x;
      col[i * 3 + 1] = c.y;
      col[i * 3 + 2] = c.z;
      size[i] = 1.4 + Math.pow(Math.random(), 2.5) * 4;
    });
  }, [galaxyCount]);
  const galaxyMaterial = useMemo(() => makeStarMaterial(dark, dark ? 0.9 : 0.7), [dark]);

  useEffect(() => () => coreMaterial.dispose(), [coreMaterial]);
  useEffect(() => () => cageGeometry.dispose(), [cageGeometry]);
  useEffect(() => () => galaxyGeometry.dispose(), [galaxyGeometry]);
  useEffect(() => () => galaxyMaterial.dispose(), [galaxyMaterial]);

  useFrame((st, rawDt) => {
    const g = rig.current;
    const inp = input.current;
    if (!g || !inp) return;
    const dt = still ? 10 : Math.min(rawDt, 0.05);
    const t = st.clock.elapsedTime;
    const vw = st.viewport.width;
    const desktop = st.size.width >= 1024;

    // ── Scroll choreography: hero pose → roaming along the page edges
    const heroT = smooth(clamp01(inp.scrollY / inp.vh));
    const p = inp.maxScroll > 0 ? clamp01(inp.scrollY / inp.maxScroll) : 0;

    const heroX = desktop ? Math.min(vw * 0.31, 3.1) : 0;
    const heroY = desktop ? 0.05 : 1.25;
    const heroS = desktop ? 0.72 : 0.5;

    const roamX = Math.cos(p * Math.PI * 5) * vw * (desktop ? 0.42 : 0.38);
    const roamY = Math.sin(p * Math.PI * 3) * 0.7;
    const roamS = desktop ? 0.6 : 0.4;

    const k = 3.2;
    g.position.x = damp(g.position.x, lerp(heroX, roamX, heroT), k, dt);
    g.position.y = damp(g.position.y, lerp(heroY, roamY, heroT) + Math.sin(t * 0.7) * 0.07, k, dt);
    g.position.z = damp(g.position.z, lerp(0, -1.2, heroT), k, dt);
    g.scale.setScalar(damp(g.scale.x, lerp(heroS, roamS, heroT), 2.6, dt));

    // ── Pointer: the whole rig leans toward the cursor
    g.rotation.y = damp(g.rotation.y, inp.px * 0.5 + p * Math.PI * 2, 3, dt);
    g.rotation.x = damp(g.rotation.x, -inp.py * 0.32, 3, dt);

    // ── Liquid core: fast pointer / scroll movement makes it boil
    inp.energy *= Math.exp(-dt * 2.2);
    const u = coreMaterial.uniforms;
    u.uTime.value = t;
    u.uAmp.value = damp(u.uAmp.value, 0.15 + inp.energy * 0.24, 4, dt);
    u.uOpacity.value = damp(
      u.uOpacity.value,
      lerp(desktop ? 1 : 0.7, desktop ? 0.7 : 0.4, heroT),
      3,
      dt
    );
    if (core.current) core.current.rotation.y += dt * 0.1;
    if (cage.current) {
      cage.current.rotation.x = -t * 0.11;
      cage.current.rotation.y = -t * 0.15;
    }
    if (galaxy.current) galaxy.current.rotation.y = t * 0.09;
    galaxyMaterial.uniforms.uTime.value = t;
    galaxyMaterial.uniforms.uPixel.value = st.gl.getPixelRatio();

    // ── Camera parallax
    const cam = st.camera;
    cam.position.x = damp(cam.position.x, inp.px * 0.35, 2.5, dt);
    cam.position.y = damp(cam.position.y, inp.py * 0.2, 2.5, dt);
    cam.lookAt(0, 0, 0);
  });

  return (
    <group ref={rig} scale={0.001}>
      <sprite scale={[5.4, 5.4, 1]}>
        <spriteMaterial
          map={halo}
          transparent
          depthWrite={false}
          opacity={dark ? 0.55 : 0.3}
          blending={dark ? THREE.AdditiveBlending : THREE.NormalBlending}
        />
      </sprite>

      <mesh ref={core} material={coreMaterial}>
        <icosahedronGeometry args={[1, mobile ? 14 : 28]} />
      </mesh>

      <lineSegments ref={cage} geometry={cageGeometry}>
        <lineBasicMaterial
          color={CYAN}
          transparent
          opacity={dark ? 0.28 : 0.3}
          depthWrite={false}
          blending={dark ? THREE.AdditiveBlending : THREE.NormalBlending}
        />
      </lineSegments>

      <OrbitRing radius={1.7} tilt={[1.25, 0.2, 0]} speed={0.5} color={CYAN} dark={dark} />
      <OrbitRing radius={1.95} tilt={[0.5, -0.9, 0.3]} speed={-0.36} color={VIOLET} dark={dark} />
      <OrbitRing radius={2.25} tilt={[-0.9, 0.5, 0.2]} speed={0.26} color={AMBER} dark={dark} />

      <group rotation={[0.42, 0, 0.22]}>
        <points ref={galaxy} geometry={galaxyGeometry} material={galaxyMaterial} frustumCulled={false} />
      </group>

      {SHARDS.map((cfg) => (
        <Shard key={cfg.kind} cfg={cfg} />
      ))}
    </group>
  );
}

/* Reduced-motion mode renders on demand: redraw only when the page scrolls */
function ScrollInvalidator() {
  const invalidate = useThree((s) => s.invalidate);
  useEffect(() => {
    const on = () => invalidate();
    window.addEventListener("scroll", on, { passive: true });
    window.addEventListener("resize", on, { passive: true });
    return () => {
      window.removeEventListener("scroll", on);
      window.removeEventListener("resize", on);
    };
  }, [invalidate]);
  return null;
}

/* ─────────────────────────── ERROR BOUNDARY ─────────────────────────── */

class WebGLBoundary extends React.Component<{ children: React.ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch() {
    /* WebGL unavailable – the page simply renders without the 3D layer */
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}

/* ─────────────────────────── PUBLIC ─────────────────────────── */

export function Scene3D() {
  const { resolvedTheme } = useTheme();
  const dark = resolvedTheme !== "light";

  const [mobile] = useState(() => typeof window !== "undefined" && window.innerWidth < 768);
  const [reducedMotion, setReducedMotion] = useState(false);

  const input = useRef<SceneInput>({
    px: 0,
    py: 0,
    energy: 0,
    scrollY: 0,
    vh: 1,
    maxScroll: 1,
  });

  useEffect(() => {
    const inp = input.current;

    const measure = () => {
      inp.vh = Math.max(1, window.innerHeight);
      inp.maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    };
    const onScroll = () => {
      const y = window.scrollY;
      inp.energy = Math.min(1, inp.energy + Math.abs(y - inp.scrollY) * 0.0015);
      inp.scrollY = y;
      inp.maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    };
    const onPointer = (e: PointerEvent) => {
      const nx = (e.clientX / window.innerWidth) * 2 - 1;
      const ny = -((e.clientY / window.innerHeight) * 2 - 1);
      inp.energy = Math.min(1, inp.energy + Math.hypot(nx - inp.px, ny - inp.py) * 0.9);
      inp.px = nx;
      inp.py = ny;
    };

    measure();
    onScroll();
    window.addEventListener("resize", measure, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("pointermove", onPointer, { passive: true });

    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onMq = () => setReducedMotion(mq.matches);
    onMq();
    mq.addEventListener("change", onMq);

    return () => {
      window.removeEventListener("resize", measure);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("pointermove", onPointer);
      mq.removeEventListener("change", onMq);
    };
  }, []);

  return (
    <div className="fixed inset-0 z-0 pointer-events-none" aria-hidden>
      <WebGLBoundary>
        <Canvas
          flat
          dpr={mobile ? [1, 1.25] : [1, 1.6]}
          camera={{ position: [0, 0, 6], fov: 45, near: 0.1, far: 60 }}
          gl={{ antialias: !mobile, alpha: true, powerPreference: "high-performance" }}
          frameloop={reducedMotion ? "demand" : "always"}
          style={{ pointerEvents: "none" }}
        >
          <ambientLight intensity={0.7} />
          <directionalLight position={[3, 4, 5]} intensity={2.2} color="#ffe2a8" />
          <directionalLight position={[-4, -2, 2]} intensity={1.4} color={CYAN} />

          <Starfield input={input} dark={dark} count={mobile ? 600 : 1500} still={reducedMotion} />
          <CoreRig input={input} dark={dark} mobile={mobile} still={reducedMotion} />
          {reducedMotion && <ScrollInvalidator />}
        </Canvas>
      </WebGLBoundary>
    </div>
  );
}
