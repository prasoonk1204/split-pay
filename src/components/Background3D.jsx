import { useRef, useMemo, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/* ─────────────────────────────────────────────────────────────
   STAR FIELD  –  thousands of crisp white/blue points in depth
───────────────────────────────────────────────────────────── */
function StarField({ count = 1800 }) {
  const points = useRef();

  const { positions, sizes } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const sizes = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      // Distribute in a sphere shell so no stars appear directly in front
      const r = 18 + Math.random() * 28;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      positions[i * 3]     = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = r * Math.cos(phi);

      sizes[i] = Math.random() < 0.04 ? 2.5 : Math.random() * 1.2 + 0.3;
    }
    return { positions, sizes };
  }, [count]);

  useFrame(({ clock }) => {
    // Very slow majestic rotation — feels like drifting through space
    points.current.rotation.y = clock.getElapsedTime() * 0.006;
    points.current.rotation.x = clock.getElapsedTime() * 0.002;
  });

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
        <bufferAttribute attach="attributes-size"     count={count} array={sizes}     itemSize={1} />
      </bufferGeometry>
      <pointsMaterial
        color="#cce8ff"
        size={0.07}
        transparent
        opacity={0.85}
        sizeAttenuation
        vertexColors={false}
      />
    </points>
  );
}

/* ─────────────────────────────────────────────────────────────
   WORMHOLE RING  –  the iconic Interstellar gravitational ring
   Three nested tori with pulsing glow
───────────────────────────────────────────────────────────── */
function WormholeRing() {
  const group = useRef();
  const ring1 = useRef();
  const ring2 = useRef();
  const ring3 = useRef();

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();

    // Slow tilt rotation — majestic drift
    group.current.rotation.x = 0.4 + Math.sin(t * 0.08) * 0.06;
    group.current.rotation.y = t * 0.04;
    group.current.position.x = -5 + Math.sin(t * 0.05) * 0.3;
    group.current.position.y =  1 + Math.cos(t * 0.07) * 0.25;

    // Counter-rotate inner rings for depth
    ring1.current.rotation.z = t * 0.12;
    ring2.current.rotation.z = -t * 0.08;
    ring3.current.rotation.z = t * 0.05;

    // Pulse opacity
    const pulse = 0.5 + Math.sin(t * 0.6) * 0.12;
    ring1.current.material.opacity = pulse;
    ring2.current.material.opacity = pulse * 0.6;
    ring3.current.material.opacity = pulse * 0.3;
  });

  return (
    <group ref={group} position={[-5, 1, -6]}>
      {/* Outer ring — electric blue */}
      <mesh ref={ring1}>
        <torusGeometry args={[2.8, 0.018, 3, 120]} />
        <meshStandardMaterial
          color="#00d4ff"
          emissive="#00d4ff"
          emissiveIntensity={3.5}
          transparent
          opacity={0.55}
        />
      </mesh>

      {/* Mid ring — slightly smaller, violet */}
      <mesh ref={ring2}>
        <torusGeometry args={[2.2, 0.012, 3, 100]} />
        <meshStandardMaterial
          color="#a855f7"
          emissive="#a855f7"
          emissiveIntensity={3}
          transparent
          opacity={0.4}
        />
      </mesh>

      {/* Inner ring — white hot core */}
      <mesh ref={ring3}>
        <torusGeometry args={[1.5, 0.008, 3, 80]} />
        <meshStandardMaterial
          color="#e0f2ff"
          emissive="#ffffff"
          emissiveIntensity={4}
          transparent
          opacity={0.3}
        />
      </mesh>

      {/* Central lens flare disc */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <circleGeometry args={[1.45, 64]} />
        <meshStandardMaterial
          color="#001a33"
          emissive="#001a33"
          emissiveIntensity={0.5}
          transparent
          opacity={0.85}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
}

/* ─────────────────────────────────────────────────────────────
   NEBULA ORB  –  soft volumetric-like glowing cloud sphere
───────────────────────────────────────────────────────────── */
function NebulaOrb({ position, color, size = 4, speed = 0.04, phase = 0 }) {
  const mesh = useRef();

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime() * speed + phase;
    mesh.current.position.x = position[0] + Math.sin(t) * 0.4;
    mesh.current.position.y = position[1] + Math.cos(t * 0.7) * 0.3;

    const s = size + Math.sin(t * 1.2) * 0.15;
    mesh.current.scale.set(s, s, s);
    mesh.current.material.opacity = 0.04 + Math.sin(t * 0.8) * 0.012;
  });

  return (
    <mesh ref={mesh} position={position}>
      <sphereGeometry args={[1, 32, 32]} />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={1.2}
        transparent
        opacity={0.04}
        depthWrite={false}
      />
    </mesh>
  );
}

/* ─────────────────────────────────────────────────────────────
   DISTANT PLANET  –  single ringed planet silhouette far away
───────────────────────────────────────────────────────────── */
function DistantPlanet() {
  const group = useRef();
  const ring = useRef();

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    group.current.rotation.y = t * 0.015;
    group.current.position.y = 2.5 + Math.sin(t * 0.03) * 0.3;
    ring.current.rotation.z = t * 0.02;
  });

  return (
    <group ref={group} position={[8, 2.5, -10]}>
      {/* Planet body */}
      <mesh>
        <sphereGeometry args={[1.4, 48, 48]} />
        <meshStandardMaterial
          color="#0d1f3c"
          emissive="#0a2a4a"
          emissiveIntensity={0.6}
          roughness={0.9}
          metalness={0.1}
        />
      </mesh>

      {/* Planet atmosphere rim */}
      <mesh>
        <sphereGeometry args={[1.52, 48, 48]} />
        <meshStandardMaterial
          color="#1a4a7a"
          emissive="#00d4ff"
          emissiveIntensity={0.3}
          transparent
          opacity={0.12}
          side={THREE.BackSide}
        />
      </mesh>

      {/* Saturn-style ring */}
      <mesh ref={ring} rotation={[Math.PI * 0.35, 0, 0]}>
        <torusGeometry args={[2.6, 0.35, 2, 80]} />
        <meshStandardMaterial
          color="#1a3a5c"
          emissive="#0088bb"
          emissiveIntensity={0.5}
          transparent
          opacity={0.22}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
}

/* ─────────────────────────────────────────────────────────────
   FLOATING CRYSTAL  –  single elegant octahedron data crystal
───────────────────────────────────────────────────────────── */
function DataCrystal({ position, color, speed = 0.5, scale = 1 }) {
  const mesh = useRef();
  const glow = useRef();

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime() * speed;
    mesh.current.rotation.x = t * 0.4;
    mesh.current.rotation.y = t * 0.6;
    mesh.current.position.y = position[1] + Math.sin(t * 0.5) * 0.35;

    const pulse = 0.6 + Math.sin(t * 1.5) * 0.15;
    mesh.current.material.emissiveIntensity = pulse * 1.2;
    glow.current.material.opacity = 0.08 + Math.sin(t * 1.2) * 0.03;
    glow.current.scale.setScalar(1 + Math.sin(t * 0.8) * 0.08);
  });

  return (
    <group position={[position[0], position[1], position[2]]}>
      {/* Core crystal */}
      <mesh ref={mesh} scale={scale}>
        <octahedronGeometry args={[1, 0]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={1.0}
          transparent
          opacity={0.5}
          wireframe={false}
          roughness={0.1}
          metalness={0.8}
        />
      </mesh>

      {/* Wireframe overlay */}
      <mesh scale={scale * 1.01}>
        <octahedronGeometry args={[1, 0]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={2}
          transparent
          opacity={0.35}
          wireframe
        />
      </mesh>

      {/* Outer glow sphere */}
      <mesh ref={glow} scale={scale * 2.2}>
        <sphereGeometry args={[1, 16, 16]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.8}
          transparent
          opacity={0.08}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}

/* ─────────────────────────────────────────────────────────────
   FULL SCENE
───────────────────────────────────────────────────────────── */
function Scene() {
  return (
    <>
      {/* Lighting — cinematic dark with accent fills */}
      <ambientLight intensity={0.08} />
      <pointLight position={[-8, 4, -2]}  color="#00d4ff" intensity={3}   distance={30} />
      <pointLight position={[10, -4, -8]} color="#7c3aed" intensity={2.5} distance={25} />
      <pointLight position={[0,  8, -6]}  color="#3b82f6" intensity={1.5} distance={20} />

      {/* Background — star field */}
      <StarField count={1800} />

      {/* Nebula clouds — soft, barely-there glow */}
      <NebulaOrb position={[-9,  3, -12]} color="#00d4ff" size={5.5} speed={0.025} phase={0}   />
      <NebulaOrb position={[ 9, -2, -14]} color="#7c3aed" size={6}   speed={0.02}  phase={2.1} />
      <NebulaOrb position={[ 2,  6, -18]} color="#3b82f6" size={4.5} speed={0.03}  phase={4.5} />

      {/* Hero — wormhole gravitational ring */}
      <WormholeRing />

      {/* Distant ringed planet */}
      <DistantPlanet />

      {/* Two crisp data crystals — minimal, elegant */}
      <DataCrystal position={[ 6.5, -1.5, -4]} color="#00d4ff" speed={0.45} scale={0.75} />
      <DataCrystal position={[-3.5,  3.5, -5]} color="#a855f7" speed={0.35} scale={0.55} />
    </>
  );
}

/* ─────────────────────────────────────────────────────────────
   EXPORTED CANVAS
───────────────────────────────────────────────────────────── */
export default function Background3D() {
  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 0,
        pointerEvents: 'none',
      }}
    >
      <Canvas
        camera={{ position: [0, 0, 7], fov: 60 }}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        style={{ background: 'transparent' }}
        dpr={[1, 2]}
      >
        <Suspense fallback={null}>
          <Scene />
        </Suspense>
      </Canvas>
    </div>
  );
}
