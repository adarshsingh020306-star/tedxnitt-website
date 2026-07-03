"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";

/* ------------------------------------------------------------------ */
/* Shared "flare" — a slow-breathing shimmer with periodic power surges */
/* Every component reads the same clock so the fire, eye, lights and    */
/* embers all pulse in sync, like the elder is channelling the blaze.   */
/* ------------------------------------------------------------------ */
function flareAt(t: number): number {
  const surge = Math.pow(Math.max(0, Math.sin(t * 0.32)), 6); // sharp peaks ~ every 10s
  const shimmer = 0.5 + 0.5 * Math.sin(t * 3.1); // constant candle flicker
  return Math.min(1, surge + 0.12 * shimmer);
}

/* ------------------------------------------------------------------ */
/* Procedural GLSL fire — fbm noise flames rising behind the figure    */
/* ------------------------------------------------------------------ */
const fireVertex = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fireFragment = /* glsl */ `
  uniform float uTime;
  uniform float uFlare;
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
    vec2 uv = vUv;
    // heat haze — horizontal wobble that intensifies during a surge
    uv.x += (0.006 + 0.01 * uFlare) * sin(uv.y * 34.0 + uTime * 3.0);

    // flames rise: sample noise scrolling downward over time (faster on surge)
    float rise = uTime * (1.1 + uFlare * 0.9);
    float n = fbm(vec2(uv.x * 4.0, uv.y * 3.0 - rise));
    n += 0.5 * fbm(vec2(uv.x * 9.0 + 13.0, uv.y * 6.0 - rise * 2.0));

    // intensity: strong at the bottom, licking upward, boosted on surge
    float flame = n * (1.35 - uv.y * 1.15);
    flame = pow(max(flame, 0.0), 1.6) * 2.4 * (1.0 + uFlare * 1.15);

    vec3 dark   = vec3(0.025, 0.012, 0.012);
    vec3 blood  = vec3(0.55, 0.0, 0.09);   // deep TED red
    vec3 ember  = vec3(0.95, 0.25, 0.03);  // orange
    vec3 flash  = vec3(1.0, 0.85, 0.45);   // hot core

    vec3 col = dark;
    col = mix(col, blood, clamp(flame, 0.0, 1.0));
    col = mix(col, ember, clamp(flame - 0.55, 0.0, 1.0));
    col = mix(col, flash, clamp((flame - 1.25) * 0.8, 0.0, 1.0));

    // vignette so edges melt into the page
    float vig = smoothstep(0.0, 0.28, uv.x) * smoothstep(1.0, 0.72, uv.x)
              * smoothstep(1.0, 0.62, uv.y);
    col *= vig;

    gl_FragColor = vec4(col, 1.0);
  }
`;

function FireBackdrop() {
  const mat = useRef<THREE.ShaderMaterial>(null);
  const { viewport } = useThree();
  const uniforms = useMemo(
    () => ({ uTime: { value: 0 }, uFlare: { value: 0 } }),
    []
  );

  useFrame(({ clock }, delta) => {
    if (!mat.current) return;
    mat.current.uniforms.uTime.value += delta;
    mat.current.uniforms.uFlare.value = flareAt(clock.elapsedTime);
  });

  return (
    <mesh position={[0, 0, -2.5]}>
      <planeGeometry args={[viewport.width * 1.9, viewport.height * 1.9]} />
      <shaderMaterial
        ref={mat}
        vertexShader={fireVertex}
        fragmentShader={fireFragment}
        uniforms={uniforms}
        depthWrite={false}
      />
    </mesh>
  );
}

/* ------------------------------------------------------------------ */
/* The Elder — extruded profile silhouette of a stern, bearded old man */
/* ------------------------------------------------------------------ */
function elderShape(): THREE.Shape {
  const s = new THREE.Shape();
  // profile facing right; y up; ~4 units tall (visually tuned offline)
  s.moveTo(-1.55, -2.0); // back of cloak, bottom
  s.lineTo(-1.42, -0.35); // back edge rising, slight taper
  s.quadraticCurveTo(-1.38, 0.0, -1.15, 0.15); // angular shoulder point
  s.quadraticCurveTo(-0.75, 0.32, -0.55, 0.52); // trapezius up to neck
  s.quadraticCurveTo(-0.62, 0.75, -0.66, 0.95); // back of neck
  s.quadraticCurveTo(-0.78, 1.35, -0.45, 1.62); // back of skull
  s.quadraticCurveTo(-0.02, 1.88, 0.28, 1.62); // bald dome
  s.quadraticCurveTo(0.45, 1.42, 0.42, 1.15); // forehead slope
  s.lineTo(0.6, 1.02); // heavy brow ledge
  s.quadraticCurveTo(0.48, 0.96, 0.46, 0.9); // deep eye-socket notch
  s.quadraticCurveTo(0.82, 0.84, 0.72, 0.64); // hooked nose
  s.quadraticCurveTo(0.62, 0.56, 0.48, 0.56); // under the nose
  s.quadraticCurveTo(0.84, 0.5, 0.86, 0.4); // moustache sweeps out
  s.quadraticCurveTo(0.78, 0.32, 0.7, 0.28); // nick before the beard
  s.quadraticCurveTo(1.02, 0.0, 0.94, -0.55); // beard bulges forward
  s.quadraticCurveTo(0.84, -1.0, 0.6, -1.42); // beard tapers to a point
  s.lineTo(0.22, -0.7); // beard back edge — sharp notch
  s.quadraticCurveTo(0.32, -1.28, 0.46, -1.52); // chest re-emerges
  s.quadraticCurveTo(0.66, -1.8, 0.64, -2.0); // cloak front, bottom
  s.lineTo(-1.55, -2.0); // close along the base
  return s;
}

/** Raised facial details; the ember eye pulses and flares with the fire. */
function FaceDetails({ offset }: { offset: THREE.Vector3 }) {
  const eyeCore = useRef<THREE.Mesh>(null);
  const eyeGlow = useRef<THREE.Mesh>(null);

  const z = 0.63 - offset.z; // just proud of the extrusion's front face
  const at = (x: number, y: number): [number, number, number] => [
    x - offset.x,
    y - offset.y,
    z,
  ];
  const crease = (
    key: string,
    x: number,
    y: number,
    w: number,
    rot: number,
    color: string,
    intensity: number
  ) => (
    <mesh key={key} position={at(x, y)} rotation={[0, 0, rot]}>
      <boxGeometry args={[w, 0.028, 0.015]} />
      <meshStandardMaterial
        color="#050303"
        emissive={color}
        emissiveIntensity={intensity}
        roughness={0.8}
      />
    </mesh>
  );

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    const flare = flareAt(t);
    const flick = 0.5 + 0.5 * Math.sin(t * 7.0); // fast eye flicker
    if (eyeCore.current) {
      eyeCore.current.scale.setScalar(1 + 0.18 * flare + 0.04 * flick);
    }
    if (eyeGlow.current) {
      const mat = eyeGlow.current.material as THREE.MeshBasicMaterial;
      mat.opacity = 0.28 + 0.55 * flare + 0.1 * flick;
      eyeGlow.current.scale.set(
        1.9 + flare * 1.1,
        1.15 + flare * 0.6,
        1
      );
    }
  });

  return (
    <>
      {/* burning ember eye under the brow ledge */}
      <mesh ref={eyeCore} position={at(0.41, 0.82)}>
        <sphereGeometry args={[0.075, 16, 12]} />
        <meshBasicMaterial color="#ffd08a" toneMapped={false} />
      </mesh>
      <mesh ref={eyeGlow} position={at(0.41, 0.82)} scale={[1.9, 1.15, 1]}>
        <sphereGeometry args={[0.085, 16, 12]} />
        <meshBasicMaterial
          color="#ff5a00"
          transparent
          opacity={0.35}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          toneMapped={false}
        />
      </mesh>
      {/* shadowing brow bar over the eye */}
      <mesh position={at(0.44, 0.97)} rotation={[0, 0, -0.12]}>
        <boxGeometry args={[0.34, 0.07, 0.05]} />
        <meshStandardMaterial color="#070404" roughness={0.6} />
      </mesh>
      {/* crossed scar on the forehead — ember cracks */}
      {crease("scar-a", 0.08, 1.32, 0.3, 0.65, "#c2330f", 0.9)}
      {crease("scar-b", 0.08, 1.32, 0.3, -0.65, "#c2330f", 0.9)}
      {/* age creases on the cheek */}
      {crease("cheek-1", 0.34, 0.52, 0.17, -0.35, "#6e180a", 0.5)}
      {crease("cheek-2", 0.3, 0.38, 0.14, -0.5, "#6e180a", 0.4)}
      {/* flowing streaks through the beard */}
      {crease("beard-1", 0.62, -0.25, 0.5, -1.25, "#58120a", 0.45)}
      {crease("beard-2", 0.7, -0.62, 0.45, -1.15, "#58120a", 0.4)}
      {crease("beard-3", 0.5, -0.95, 0.4, -1.3, "#58120a", 0.35)}
    </>
  );
}

function Elder() {
  const group = useRef<THREE.Group>(null);
  const { viewport, pointer } = useThree();
  const baseScale = Math.min(viewport.height / 5.4, viewport.width / 6.5, 1);

  const { geometry, offset } = useMemo(() => {
    const geo = new THREE.ExtrudeGeometry(elderShape(), {
      depth: 0.55,
      bevelEnabled: true,
      bevelThickness: 0.07,
      bevelSize: 0.06,
      bevelSegments: 3,
      curveSegments: 24,
    });
    geo.computeBoundingBox();
    const c = new THREE.Vector3();
    geo.boundingBox!.getCenter(c);
    geo.translate(-c.x, -c.y, -c.z);
    return { geometry: geo, offset: c };
  }, []);

  useFrame(({ clock }) => {
    if (!group.current) return;
    const t = clock.elapsedTime;
    const flare = flareAt(t);

    // slow menacing sway + mouse parallax
    group.current.rotation.y = THREE.MathUtils.lerp(
      group.current.rotation.y,
      pointer.x * 0.35 + Math.sin(t * 0.4) * 0.06,
      0.04
    );
    group.current.rotation.x = THREE.MathUtils.lerp(
      group.current.rotation.x,
      -pointer.y * 0.12,
      0.04
    );
    // he leans into the fire as power builds
    group.current.rotation.z = -0.05 * flare;

    // breathing — the whole bust swells ~1.5% on a slow rhythm, more on surge
    const breath = 1 + 0.014 * Math.sin(t * 1.1) + 0.02 * flare;
    group.current.scale.setScalar(baseScale * breath);

    group.current.position.y = Math.sin(t * 0.8) * 0.05 - 0.1;
  });

  return (
    <group ref={group} scale={baseScale}>
      <mesh geometry={geometry}>
        <meshStandardMaterial color="#0c0908" roughness={0.5} metalness={0.35} />
      </mesh>
      <FaceDetails offset={offset} />
    </group>
  );
}

/* ------------------------------------------------------------------ */
/* Reactive lights — the red aura swells around the elder on each surge */
/* ------------------------------------------------------------------ */
function ReactiveLights() {
  const rim = useRef<THREE.PointLight>(null);
  const aura = useRef<THREE.PointLight>(null);

  useFrame(({ clock }) => {
    const flare = flareAt(clock.elapsedTime);
    if (rim.current) rim.current.intensity = 18 + 22 * flare;
    if (aura.current) aura.current.intensity = 4 + 26 * flare;
  });

  return (
    <>
      {/* fire rim light from behind-right */}
      <pointLight
        ref={rim}
        position={[2.5, -0.5, -1]}
        intensity={22}
        color="#ff5a00"
      />
      {/* red aura that charges up right behind him */}
      <pointLight
        ref={aura}
        position={[0.4, 0.4, -0.8]}
        intensity={6}
        color="#ff1a2e"
      />
      <pointLight position={[-3, 1, -0.5]} intensity={10} color="#eb0028" />
      <pointLight position={[0, -3, 1]} intensity={7} color="#ff8c1a" />
    </>
  );
}

/* ------------------------------------------------------------------ */
/* Embers drifting upward — rise faster and glow brighter on a surge    */
/* ------------------------------------------------------------------ */
function Embers({ count = 350 }) {
  const ref = useRef<THREE.Points>(null);
  const data = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const speed = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 12;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 8;
      pos[i * 3 + 2] = -1.5 + Math.random() * 3;
      speed[i] = 0.4 + Math.random() * 1.2;
    }
    return { pos, speed };
  }, [count]);

  useFrame(({ clock }, delta) => {
    if (!ref.current) return;
    const flare = flareAt(clock.elapsedTime);
    const boost = 1 + flare * 1.6;
    const arr = ref.current.geometry.attributes.position.array as Float32Array;
    for (let i = 0; i < count; i++) {
      arr[i * 3 + 1] += data.speed[i] * boost * delta;
      arr[i * 3] += Math.sin(arr[i * 3 + 1] * 2.0 + i) * delta * 0.15;
      if (arr[i * 3 + 1] > 4.5) {
        arr[i * 3 + 1] = -4.5;
        arr[i * 3] = (Math.random() - 0.5) * 12;
      }
    }
    ref.current.geometry.attributes.position.needsUpdate = true;
    const mat = ref.current.material as THREE.PointsMaterial;
    mat.opacity = 0.7 + 0.3 * flare;
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
        opacity={0.85}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

/* ------------------------------------------------------------------ */
export default function Inferno3D({ active = true }: { active?: boolean }) {
  return (
    <Canvas
      dpr={[1, 1.5]}
      frameloop={active ? "always" : "never"}
      camera={{ position: [0, 0, 5], fov: 42 }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      className="!absolute inset-0"
    >
      <ambientLight intensity={0.15} />
      <ReactiveLights />
      <FireBackdrop />
      <Elder />
      <Embers />
    </Canvas>
  );
}
