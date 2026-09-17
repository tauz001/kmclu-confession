"use client";

import React, { useRef, useMemo, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

// -------------------------------------------------------------
// Elegant 3D Origami Paper Airplane Geometry
// -------------------------------------------------------------
function createOrigamiPlane(): THREE.BufferGeometry {
  const geom = new THREE.BufferGeometry();
  // Refined folded paper airplane vertices
  const vertices = new Float32Array([
    // Left Wing: Nose -> Wingtip -> Crease
    0, 0.08, 1.4,   -1.15, 0.28, -0.85,   0, 0.04, -0.65,
    // Right Wing: Nose -> Crease -> Wingtip
    0, 0.08, 1.4,    0, 0.04, -0.65,      1.15, 0.28, -0.85,
    // Keel Left: Nose -> Underbody -> Crease
    0, 0.08, 1.4,    0, -0.38, -0.35,     0, 0.04, -0.65,
    // Keel Right: Nose -> Crease -> Underbody
    0, 0.08, 1.4,    0, 0.04, -0.65,      0, -0.38, -0.35,
  ]);

  geom.setAttribute("position", new THREE.BufferAttribute(vertices, 3));
  geom.computeVertexNormals();
  return geom;
}

// -------------------------------------------------------------
// Minimalist 3D Paperclip
// -------------------------------------------------------------
function createPaperClip(): THREE.BufferGeometry {
  const path = new THREE.CurvePath<THREE.Vector3>();
  const p1 = new THREE.Vector3(-0.2, -0.6, 0);
  const p2 = new THREE.Vector3(-0.2, 0.5, 0);
  const p3 = new THREE.Vector3(0.2, 0.5, 0);
  const p4 = new THREE.Vector3(0.2, -0.4, 0);
  const p5 = new THREE.Vector3(-0.08, -0.4, 0);
  const p6 = new THREE.Vector3(-0.08, 0.3, 0);

  path.add(new THREE.LineCurve3(p1, p2));
  path.add(new THREE.QuadraticBezierCurve3(p2, new THREE.Vector3(0, 0.72, 0), p3));
  path.add(new THREE.LineCurve3(p3, p4));
  path.add(new THREE.QuadraticBezierCurve3(p4, new THREE.Vector3(0.06, -0.6, 0), p5));
  path.add(new THREE.LineCurve3(p5, p6));

  return new THREE.TubeGeometry(path, 36, 0.03, 8, false);
}

interface FloatingElement {
  type: "plane" | "clip";
  pos: [number, number, number];
  rot: [number, number, number];
  scale: number;
  color: string;
  speed: number;
  offset: number;
}

function MinimalDreamyScene({ elements }: { elements: FloatingElement[] }) {
  const groupRef = useRef<THREE.Group>(null);
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });

  const planeGeo = useMemo(() => createOrigamiPlane(), []);
  const clipGeo = useMemo(() => createPaperClip(), []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.targetX = (e.clientX / window.innerWidth - 0.5) * 2;
      mouseRef.current.targetY = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.getElapsedTime();

    // Gentle, cinematic mouse parallax
    mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.03;
    mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.03;

    groupRef.current.rotation.y = mouseRef.current.x * 0.12;
    groupRef.current.rotation.x = -mouseRef.current.y * 0.1;

    groupRef.current.children.forEach((child, i) => {
      const el = elements[i];
      if (!el) return;

      // Slow, relaxing bobbing
      child.position.y =
        el.pos[1] + Math.sin(t * el.speed + el.offset) * 0.35;
      child.position.x =
        el.pos[0] + Math.cos(t * el.speed * 0.7 + el.offset) * 0.2;

      // Gentle airplane banking roll
      if (el.type === "plane") {
        child.rotation.z = Math.sin(t * el.speed * 0.8 + el.offset) * 0.18;
        child.rotation.y = el.rot[1] + Math.cos(t * el.speed * 0.5) * 0.1;
      } else {
        child.rotation.z += 0.003;
        child.rotation.y += 0.004;
      }
    });
  });

  return (
    <group ref={groupRef}>
      {elements.map((el, idx) => {
        if (el.type === "plane") {
          return (
            <mesh
              key={idx}
              geometry={planeGeo}
              position={el.pos}
              rotation={el.rot}
              scale={el.scale}
            >
              <meshStandardMaterial
                color={el.color}
                roughness={0.65}
                metalness={0.05}
                side={THREE.DoubleSide}
              />
            </mesh>
          );
        }

        return (
          <mesh
            key={idx}
            geometry={clipGeo}
            position={el.pos}
            rotation={el.rot}
            scale={el.scale}
          >
            <meshStandardMaterial
              color={el.color}
              metalness={0.8}
              roughness={0.25}
            />
          </mesh>
        );
      })}
    </group>
  );
}

export default function ParticleBackground() {
  // Just 3 elegant paper airplanes and 2 metallic clips — clean, minimal, non-distracting
  const elements = useMemo<FloatingElement[]>(() => {
    return [
      // 1. Origami Plane - Top Right (Soft cream paper)
      {
        type: "plane",
        pos: [7.5, 4.2, -2.5],
        rot: [0.25, -0.85, 0.15],
        scale: 1.15,
        color: "#fffbeb",
        speed: 0.45,
        offset: 0.5,
      },
      // 2. Origami Plane - Left Middle (Soft pastel pink paper)
      {
        type: "plane",
        pos: [-7.8, -0.5, -2],
        rot: [-0.15, 0.75, -0.2],
        scale: 1.05,
        color: "#fce7f3",
        speed: 0.38,
        offset: 2.8,
      },
      // 3. Origami Plane - Bottom Right (Soft acid lime accent)
      {
        type: "plane",
        pos: [8.2, -5.2, -3],
        rot: [0.1, -0.65, 0.1],
        scale: 0.95,
        color: "#bef264",
        speed: 0.4,
        offset: 4.5,
      },
      // 4. Shiny Steel Paperclip - Upper Left
      {
        type: "clip",
        pos: [-8.2, 5.5, -2.2],
        rot: [0.6, 0.4, 0.8],
        scale: 1.2,
        color: "#e2e8f0",
        speed: 0.5,
        offset: 1.2,
      },
      // 5. Golden Metallic Paperclip - Lower Left
      {
        type: "clip",
        pos: [-7.2, -5.8, -2.5],
        rot: [0.4, -0.5, -0.6],
        scale: 1.1,
        color: "#fbbf24",
        speed: 0.42,
        offset: 3.6,
      },
    ];
  }, []);

  return (
    <div
      className="pointer-events-none fixed inset-0 z-0 h-full w-full overflow-hidden opacity-75 transition-opacity duration-1000"
      aria-hidden="true"
    >
      <Canvas
        camera={{ position: [0, 0, 12], fov: 45 }}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        dpr={[1, 1.5]}
      >
        {/* Soft, warm ambient studio lighting */}
        <ambientLight intensity={0.9} />
        <directionalLight position={[6, 12, 8]} intensity={1.3} color="#fffbee" />
        <directionalLight position={[-8, -5, -4]} intensity={0.5} color="#e0e7ff" />

        {/* Minimal 3D Origami & Clips */}
        <MinimalDreamyScene elements={elements} />
      </Canvas>
    </div>
  );
}
