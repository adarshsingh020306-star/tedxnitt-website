"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { MotionValue } from "framer-motion";
import { useMemo, useRef } from "react";
import * as THREE from "three";

/* ------------------------------------------------------------------ */
/* Shared flare clock — periodic power surges every ~10s + flicker.     */
/* Everything (fire, wings, embers, lights) pulses on this one beat.    */
/* ------------------------------------------------------------------ */
function flareAt(t: number): number {
  const surge = Math.pow(Math.max(0, Math.sin(t * 0.32)), 6);
  const shimmer = 0.5 + 0.5 * Math.sin(t * 3.1);
  return Math.min(1, surge + 0.12 * shimmer);
}

type Progress = MotionValue<number> | null;
const readProgress = (p: Progress) => (p ? p.get() : 0);

/* ------------------------------------------------------------------ */
/* Fire halo — a swirling ring of flame behind the phoenix.             */
/* Scroll (uMix) morphs the palette: TED-red inferno → blue-white       */
/* plasma. A different beast from the old rising wall of fire.          */
/* ------------------------------------------------------------------ */
const haloVertex = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const haloFragment = /* glsl */ `
  uniform float uTime;
  uniform float uFlare;
  uniform float uMix;
  uniform float uAspect;
  varying vec2 vUv;

  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
  }
  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
               mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
  }
  float fbm(vec2 p) {
    float v = 0.0;
    float a = 0.5;
    for (int i = 0; i < 5; i++) {
      v += a * noise(p);
      p = p * 2.03 + vec2(1.7, 9.2);
      a *= 0.5;
    }
    return v;
  }

  void main() {
    vec2 p = (vUv - 0.5) * 2.0;
    p.x *= uAspect;
    float r = length(p);
    float ang = atan(p.y, p.x);

    // swirling polar flame — rotates around the ring while licking outward
    float swirl = fbm(vec2(ang * 1.6 + uTime * 0.25 + r * 1.8,
                           r * 3.5 - uTime * 1.3));
    swirl += 0.45 * fbm(vec2(ang * 3.4 - uTime * 0.5, r * 7.0 - uTime * 2.4));

    // gaussian ring mask
    float ring = exp(-pow((r - 0.62) * 4.0, 2.0));
    float flame = swirl * ring * (1.7 + uFlare * 1.3);

    // soft molten core behind the bird
    float core = exp(-r * 2.6) * (0.5 + 0.35 * uFlare);
    flame += core * fbm(vec2(ang * 2.0, r * 5.0 - uTime * 1.6));

    // red inferno palette
    vec3 rDark  = vec3(0.03, 0.012, 0.012);
    vec3 rMid   = vec3(0.58, 0.0, 0.1);
    vec3 rHot   = vec3(0.98, 0.3, 0.04);
    vec3 rCore  = vec3(1.0, 0.85, 0.45);
    // blue plasma palette
    vec3 bDark  = vec3(0.008, 0.014, 0.035);
    vec3 bMid   = vec3(0.0, 0.16, 0.55);
    vec3 bHot   = vec3(0.15, 0.55, 1.0);
    vec3 bCore  = vec3(0.85, 0.95, 1.0);

    vec3 dark = mix(rDark, bDark, uMix);
    vec3 mid  = mix(rMid,  bMid,  uMix);
    vec3 hot  = mix(rHot,  bHot,  uMix);
    vec3 corC = mix(rCore, bCore, uMix);

    vec3 col = dark;
    col = mix(col, mid,  clamp(flame, 0.0, 1.0));
    col = mix(col, hot,  clamp(flame - 0.55, 0.0, 1.0));
    col = mix(col, corC, clamp((flame - 1.2) * 0.85, 0.0, 1.0));

    // vignette so edges melt into the page
    float vig = smoothstep(1.75, 0.55, r);
    col *= vig;

    gl_FragColor = vec4(col, 1.0);
  }
`;

function FireHalo({ progress }: { progress: Progress }) {
  const mat = useRef<THREE.ShaderMaterial>(null);
  const { viewport } = useThree();
  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uFlare: { value: 0 },
      uMix: { value: 0 },
      uAspect: { value: 1.6 },
    }),
    []
  );

  useFrame(({ clock }, delta) => {
    if (!mat.current) return;
    const u = mat.current.uniforms;
    u.uTime.value += delta;
    u.uFlare.value = flareAt(clock.elapsedTime);
    u.uMix.value = THREE.MathUtils.smoothstep(readProgress(progress), 0.3, 0.9);
    u.uAspect.value = viewport.width / viewport.height;
  });

  return (
    <mesh position={[0, 0, -2.6]}>
      <planeGeometry args={[viewport.width * 2.0, viewport.height * 2.0]} />
      <shaderMaterial
        ref={mat}
        vertexShader={haloVertex}
        fragmentShader={haloFragment}
        uniforms={uniforms}
        depthWrite={false}
      />
    </mesh>
  );
}

/* ------------------------------------------------------------------ */
/* The Phoenix — body + two independently flapping wings.               */
/* Silhouette tuned offline (scratchpad/phoenix_v1.png).                */
/* ------------------------------------------------------------------ */
function bodyShape(): THREE.Shape {
  const s = new THREE.Shape();
  s.moveTo(-0.2, 1.1);
  s.quadraticCurveTo(-0.16, 1.5, 0.0, 1.54); // back of crown
  s.lineTo(-0.1, 1.78); // crest flick
  s.lineTo(0.1, 1.56); // crest returns
  s.quadraticCurveTo(0.3, 1.5, 0.34, 1.36); // forehead
  s.lineTo(0.56, 1.26); // beak tip
  s.lineTo(0.34, 1.16); // under beak
  s.quadraticCurveTo(0.28, 1.0, 0.3, 0.85); // throat
  s.quadraticCurveTo(0.48, 0.45, 0.42, 0.0); // chest
  s.quadraticCurveTo(0.35, -0.4, 0.3, -0.6); // flank to tail base
  s.quadraticCurveTo(0.42, -1.0, 0.32, -1.5); // streamer 1 tip
  s.quadraticCurveTo(0.22, -1.05, 0.12, -0.95); // notch
  s.quadraticCurveTo(0.18, -1.6, 0.0, -2.15); // streamer 2 (longest)
  s.quadraticCurveTo(-0.12, -1.55, -0.13, -1.0); // up
  s.quadraticCurveTo(-0.3, -1.25, -0.38, -1.48); // streamer 3 tip
  s.quadraticCurveTo(-0.38, -1.0, -0.3, -0.62); // back up
  s.quadraticCurveTo(-0.46, -0.1, -0.46, 0.3); // left flank
  s.quadraticCurveTo(-0.4, 0.8, -0.2, 1.1); // left neck
  return s;
}

function wingShape(): THREE.Shape {
  const s = new THREE.Shape();
  s.moveTo(0.28, 0.78);
  s.quadraticCurveTo(1.1, 1.2, 1.9, 1.62); // leading edge
  s.quadraticCurveTo(2.35, 1.85, 2.72, 1.95); // wingtip
  s.quadraticCurveTo(2.5, 1.55, 2.32, 1.12); // feather 1
  s.quadraticCurveTo(2.18, 1.28, 2.02, 1.22); // notch
  s.quadraticCurveTo(1.96, 0.9, 1.86, 0.62); // feather 2
  s.quadraticCurveTo(1.72, 0.82, 1.6, 0.8); // notch
  s.quadraticCurveTo(1.5, 0.52, 1.4, 0.32); // feather 3
  s.quadraticCurveTo(1.28, 0.52, 1.18, 0.52); // notch
  s.quadraticCurveTo(1.06, 0.3, 0.95, 0.16); // feather 4
  s.quadraticCurveTo(0.85, 0.34, 0.74, 0.36); // notch
  s.quadraticCurveTo(0.62, 0.22, 0.5, 0.14); // feather 5
  s.quadraticCurveTo(0.32, 0.3, 0.28, 0.78); // underwing to shoulder
  return s;
}

const EXTRUDE: THREE.ExtrudeGeometryOptions = {
  depth: 0.3,
  bevelEnabled: true,
  bevelThickness: 0.045,
  bevelSize: 0.04,
  bevelSegments: 2,
  curveSegments: 20,
};

const SHOULDER = { x: 0.28, y: 0.6 };

function Phoenix({ progress }: { progress: Progress }) {
  const root = useRef<THREE.Group>(null);
  const rightWing = useRef<THREE.Group>(null);
  const leftWing = useRef<THREE.Group>(null);
  const chestCore = useRef<THREE.Mesh>(null);
  const eye = useRef<THREE.Mesh>(null);
  const { viewport, pointer } = useThree();
  // wingspan ~5.4 units — fit to screen
  const baseScale = Math.min(viewport.width / 7.2, viewport.height / 5.6, 1);

  const bodyGeo = useMemo(() => {
    const g = new THREE.ExtrudeGeometry(bodyShape(), EXTRUDE);
    g.translate(0, 0, -0.15);
    return g;
  }, []);
  const rightWingGeo = useMemo(() => {
    const g = new THREE.ExtrudeGeometry(wingShape(), EXTRUDE);
    // move pivot to the shoulder so rotation.z flaps the wing
    g.translate(-SHOULDER.x, -SHOULDER.y, -0.15);
    return g;
  }, []);
  const leftWingGeo = useMemo(() => {
    const g = rightWingGeo.clone();
    g.applyMatrix4(new THREE.Matrix4().makeScale(-1, 1, 1));
    return g;
  }, [rightWingGeo]);

  const warm = useMemo(() => new THREE.Color("#ff7a1a"), []);
  const cool = useMemo(() => new THREE.Color("#4db2ff"), []);
  const tint = useMemo(() => new THREE.Color(), []);

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    const flare = flareAt(t);
    const p = readProgress(progress);
    const mix = THREE.MathUtils.smoothstep(p, 0.3, 0.9);

    if (root.current) {
      // rises from the flames as you scroll; breathes on the flare beat
      const breath = 1 + 0.015 * Math.sin(t * 1.2) + 0.02 * flare;
      root.current.scale.setScalar(baseScale * (0.78 + p * 0.5) * breath);
      root.current.position.y = -1.15 + p * 1.35 + Math.sin(t * 0.8) * 0.06;
      root.current.rotation.y = THREE.MathUtils.lerp(
        root.current.rotation.y,
        pointer.x * 0.3,
        0.04
      );
      root.current.rotation.x = THREE.MathUtils.lerp(
        root.current.rotation.x,
        -pointer.y * 0.12,
        0.04
      );
    }

    // wingbeat — slow soar, deeper and faster during a surge
    const flap =
      Math.sin(t * (1.5 + flare * 1.6)) * (0.1 + flare * 0.22 + p * 0.06);
    if (rightWing.current) {
      rightWing.current.rotation.z = flap;
      rightWing.current.rotation.x = flap * 0.35;
    }
    if (leftWing.current) {
      leftWing.current.rotation.z = -flap;
      leftWing.current.rotation.x = flap * 0.35;
    }

    // burning heart + eye shift hue with the fire (red → blue plasma)
    tint.copy(warm).lerp(cool, mix);
    if (chestCore.current) {
      const m = chestCore.current.material as THREE.MeshBasicMaterial;
      m.color.copy(tint);
      m.opacity = 0.35 + 0.6 * flare;
      chestCore.current.scale.setScalar(1 + 0.5 * flare);
    }
    if (eye.current) {
      (eye.current.material as THREE.MeshBasicMaterial).color.copy(tint);
      eye.current.scale.setScalar(1 + 0.3 * flare);
    }
  });

  return (
    <group ref={root} scale={baseScale}>
      <mesh geometry={bodyGeo}>
        <meshStandardMaterial
          color="#0c0908"
          roughness={0.5}
          metalness={0.35}
          side={THREE.DoubleSide}
        />
      </mesh>
      <group ref={rightWing} position={[SHOULDER.x, SHOULDER.y, 0]}>
        <mesh geometry={rightWingGeo}>
          <meshStandardMaterial
            color="#0c0908"
            roughness={0.5}
            metalness={0.35}
            side={THREE.DoubleSide}
          />
        </mesh>
      </group>
      <group ref={leftWing} position={[-SHOULDER.x, SHOULDER.y, 0]}>
        <mesh geometry={leftWingGeo}>
          <meshStandardMaterial
            color="#0c0908"
            roughness={0.5}
            metalness={0.35}
            side={THREE.DoubleSide}
          />
        </mesh>
      </group>
      {/* burning eye */}
      <mesh ref={eye} position={[0.24, 1.32, 0.21]}>
        <sphereGeometry args={[0.05, 12, 10]} />
        <meshBasicMaterial color="#ffb25e" toneMapped={false} />
      </mesh>
      {/* molten heart glowing through the chest */}
      <mesh ref={chestCore} position={[0, 0.3, 0.18]}>
        <sphereGeometry args={[0.14, 16, 12]} />
        <meshBasicMaterial
          color="#ff7a1a"
          transparent
          opacity={0.5}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          toneMapped={false}
        />
      </mesh>
    </group>
  );
}

/* ------------------------------------------------------------------ */
/* Ember vortex — sparks spiralling around the phoenix, hue-shifting    */
/* ------------------------------------------------------------------ */
function EmberVortex({ count = 320, progress }: { count?: number; progress: Progress }) {
  const ref = useRef<THREE.Points>(null);
  const data = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const angle = new Float32Array(count);
    const radius = new Float32Array(count);
    const speed = new Float32Array(count);
    const rise = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      angle[i] = Math.random() * Math.PI * 2;
      radius[i] = 1.2 + Math.random() * 2.6;
      speed[i] = 0.25 + Math.random() * 0.6;
      rise[i] = 0.3 + Math.random() * 0.9;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 7;
    }
    return { pos, angle, radius, speed, rise };
  }, [count]);

  const warm = useMemo(() => new THREE.Color("#ff7a1a"), []);
  const cool = useMemo(() => new THREE.Color("#5cb8ff"), []);

  useFrame(({ clock }, delta) => {
    if (!ref.current) return;
    const t = clock.elapsedTime;
    const flare = flareAt(t);
    const mix = THREE.MathUtils.smoothstep(readProgress(progress), 0.3, 0.9);
    const arr = ref.current.geometry.attributes.position.array as Float32Array;
    for (let i = 0; i < count; i++) {
      data.angle[i] += data.speed[i] * (0.5 + flare * 1.2) * delta;
      arr[i * 3 + 1] += data.rise[i] * (0.6 + flare) * delta;
      if (arr[i * 3 + 1] > 3.6) arr[i * 3 + 1] = -3.6;
      arr[i * 3] = Math.cos(data.angle[i]) * data.radius[i];
      arr[i * 3 + 2] = Math.sin(data.angle[i]) * data.radius[i] * 0.5 - 0.8;
    }
    ref.current.geometry.attributes.position.needsUpdate = true;
    const mat = ref.current.material as THREE.PointsMaterial;
    mat.color.copy(warm).lerp(cool, mix);
    mat.opacity = 0.65 + 0.35 * flare;
    mat.size = 0.045 + 0.03 * flare;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[data.pos, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.045}
        color="#ff7a1a"
        transparent
        opacity={0.8}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

/* ------------------------------------------------------------------ */
/* Camera rig + lights that follow the scroll and the flare             */
/* ------------------------------------------------------------------ */
function ScrollRig({ progress }: { progress: Progress }) {
  const warmRim = useRef<THREE.PointLight>(null);
  const coolRim = useRef<THREE.PointLight>(null);
  const aura = useRef<THREE.PointLight>(null);

  useFrame(({ camera, clock }) => {
    const p = readProgress(progress);
    const flare = flareAt(clock.elapsedTime);
    const mix = THREE.MathUtils.smoothstep(p, 0.3, 0.9);
    // slow dolly-in as the phoenix rises
    camera.position.z = THREE.MathUtils.lerp(6.4, 4.6, p);
    camera.position.y = THREE.MathUtils.lerp(0, 0.25, p);
    camera.lookAt(0, 0, 0);

    if (warmRim.current)
      warmRim.current.intensity = (16 + 20 * flare) * (1 - mix);
    if (coolRim.current)
      coolRim.current.intensity = (14 + 18 * flare) * mix;
    if (aura.current) aura.current.intensity = 5 + 22 * flare;
  });

  return (
    <>
      <pointLight
        ref={warmRim}
        position={[2.5, -0.5, -1]}
        intensity={18}
        color="#ff5a00"
      />
      <pointLight
        ref={coolRim}
        position={[-2.5, 1.5, -1]}
        intensity={0}
        color="#3d8bff"
      />
      <pointLight
        ref={aura}
        position={[0, 0.3, -1]}
        intensity={6}
        color="#ff1a2e"
      />
      <pointLight position={[0, -3, 1.5]} intensity={7} color="#ff8c1a" />
    </>
  );
}

/* ------------------------------------------------------------------ */
export default function Phoenix3D({
  active = true,
  progress = null,
}: {
  active?: boolean;
  progress?: Progress;
}) {
  return (
    <Canvas
      dpr={[1, 1.5]}
      frameloop={active ? "always" : "never"}
      camera={{ position: [0, 0, 6.4], fov: 42 }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      className="!absolute inset-0"
    >
      <ambientLight intensity={0.15} />
      <ScrollRig progress={progress} />
      <FireHalo progress={progress} />
      <Phoenix progress={progress} />
      <EmberVortex progress={progress} />
    </Canvas>
  );
}
