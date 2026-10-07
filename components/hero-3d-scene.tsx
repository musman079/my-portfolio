"use client";

import React, { useRef, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import * as THREE from "three";

function GlowingCrystal() {
  const meshRef = useRef<THREE.Mesh>(null);
  const outerRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (meshRef.current) {
      meshRef.current.rotation.x = t * 0.2;
      meshRef.current.rotation.y = t * 0.28;
    }
    if (outerRef.current) {
      outerRef.current.rotation.x = -t * 0.15;
      outerRef.current.rotation.y = -t * 0.2;
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.4} floatIntensity={1}>
      <group>
        {/* Inner glowing faceted gem */}
        <mesh ref={meshRef}>
          <icosahedronGeometry args={[0.48, 0]} />
          <meshStandardMaterial
            color="#f59e0b"
            emissive="#f59e0b"
            emissiveIntensity={0.5}
            roughness={0.2}
            metalness={0.85}
          />
        </mesh>

        {/* Outer futuristic holographic wireframe cage */}
        <mesh ref={outerRef}>
          <icosahedronGeometry args={[0.72, 1]} />
          <meshStandardMaterial
            color="#0ea5e9"
            emissive="#0ea5e9"
            emissiveIntensity={0.4}
            wireframe
            transparent
            opacity={0.4}
            roughness={0.3}
          />
        </mesh>
      </group>
    </Float>
  );
}

function OrbitingRings() {
  const ring1 = useRef<THREE.Mesh>(null);
  const ring2 = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (ring1.current) {
      ring1.current.rotation.x = t * 0.3;
      ring1.current.rotation.z = t * 0.12;
    }
    if (ring2.current) {
      ring2.current.rotation.y = t * 0.25;
      ring2.current.rotation.x = Math.PI / 3 + t * 0.18;
    }
  });

  return (
    <>
      <mesh ref={ring1}>
        <torusGeometry args={[1.05, 0.007, 8, 48]} />
        <meshStandardMaterial
          color="#0ea5e9"
          emissive="#0ea5e9"
          emissiveIntensity={0.5}
          transparent
          opacity={0.4}
        />
      </mesh>
      <mesh ref={ring2}>
        <torusGeometry args={[1.28, 0.006, 8, 48]} />
        <meshStandardMaterial
          color="#8b5cf6"
          emissive="#8b5cf6"
          emissiveIntensity={0.4}
          transparent
          opacity={0.3}
        />
      </mesh>
    </>
  );
}

function FloatingParticles({ count = 20 }: { count?: number }) {
  const particlesRef = useRef<THREE.Points>(null);

  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = 1.1 + Math.random() * 0.7;
      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = r * Math.cos(phi);
    }
    return pos;
  }, [count]);

  const colors = useMemo(() => {
    const cols = new Float32Array(count * 3);
    const palette = [
      [0.96, 0.62, 0.04], // amber
      [0.05, 0.65, 0.91], // cyan
      [0.55, 0.36, 0.96], // violet
    ];
    for (let i = 0; i < count; i++) {
      const c = palette[i % palette.length];
      cols[i * 3] = c[0];
      cols[i * 3 + 1] = c[1];
      cols[i * 3 + 2] = c[2];
    }
    return cols;
  }, [count]);

  useFrame(({ clock }) => {
    if (particlesRef.current) {
      particlesRef.current.rotation.y = clock.getElapsedTime() * 0.06;
    }
  });

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.025}
        vertexColors
        transparent
        opacity={0.65}
        sizeAttenuation
      />
    </points>
  );
}

function Hero3DContent() {
  const { viewport } = useThree();
  const isDesktop = viewport.width > 7;

  // On desktop, shift rightwards to gracefully frame the code window
  const posX = isDesktop ? Math.min(viewport.width * 0.22, 2.5) : 0;
  const posY = isDesktop ? 0.1 : 1.1;
  const scale = isDesktop ? 0.85 : 0.6;

  return (
    <group position={[posX, posY, 0]} scale={scale}>
      <GlowingCrystal />
      <OrbitingRings />
      <FloatingParticles count={20} />
    </group>
  );
}

function MouseTracker() {
  const { camera } = useThree();

  useFrame(({ pointer }) => {
    camera.position.x = THREE.MathUtils.lerp(camera.position.x, pointer.x * 0.3, 0.04);
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, pointer.y * 0.15 + 0.3, 0.04);
    camera.lookAt(0, 0, 0);
  });

  return null;
}

export function Hero3DScene() {
  return (
    <div className="absolute inset-0 z-0 pointer-events-none">
      <Canvas
        camera={{ position: [0, 0.3, 5.5], fov: 45 }}
        style={{ pointerEvents: "auto" }}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        dpr={1}
      >
        <ambientLight intensity={0.4} />
        <pointLight position={[4, 4, 4]} intensity={0.8} color="#f59e0b" />
        <pointLight position={[-4, -2, 3]} intensity={0.5} color="#0ea5e9" />
        <pointLight position={[0, -3, -3]} intensity={0.3} color="#8b5cf6" />

        <Hero3DContent />
        <MouseTracker />
      </Canvas>
    </div>
  );
}
