import { useRef, useMemo, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface ParticleFieldProps {
  count?: number;
  mousePosition: React.MutableRefObject<{ x: number; y: number }>;
}

function ParticleField({ count = 200, mousePosition }: ParticleFieldProps) {
  const meshRef = useRef<THREE.Points>(null);
  const linesRef = useRef<THREE.LineSegments>(null);

  const [positions, velocities] = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const velocities = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 10;

      velocities[i * 3] = (Math.random() - 0.5) * 0.01;
      velocities[i * 3 + 1] = (Math.random() - 0.5) * 0.01;
      velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.005;
    }

    return [positions, velocities];
  }, [count]);

  const lineGeometry = useMemo(() => {
    const geometry = new THREE.BufferGeometry();
    const linePositions = new Float32Array(count * count * 6);
    geometry.setAttribute('position', new THREE.BufferAttribute(linePositions, 3));
    return geometry;
  }, [count]);

  useFrame(() => {
    if (!meshRef.current) return;

    const positionAttribute = meshRef.current.geometry.attributes.position;
    const posArray = positionAttribute.array as Float32Array;

    for (let i = 0; i < count; i++) {
      const idx = i * 3;

      // Update positions
      posArray[idx] += velocities[idx];
      posArray[idx + 1] += velocities[idx + 1];
      posArray[idx + 2] += velocities[idx + 2];

      // Mouse interaction
      const dx = posArray[idx] - mousePosition.current.x * 10;
      const dy = posArray[idx + 1] - mousePosition.current.y * 10;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < 3) {
        posArray[idx] += dx * 0.01;
        posArray[idx + 1] += dy * 0.01;
      }

      // Boundary wrap
      if (posArray[idx] > 10) posArray[idx] = -10;
      if (posArray[idx] < -10) posArray[idx] = 10;
      if (posArray[idx + 1] > 10) posArray[idx + 1] = -10;
      if (posArray[idx + 1] < -10) posArray[idx + 1] = 10;
    }

    positionAttribute.needsUpdate = true;

    // Update connections
    if (linesRef.current) {
      const linePos = lineGeometry.attributes.position.array as Float32Array;
      let lineIdx = 0;

      for (let i = 0; i < count && lineIdx < linePos.length - 6; i++) {
        for (let j = i + 1; j < count && lineIdx < linePos.length - 6; j++) {
          const dx = posArray[i * 3] - posArray[j * 3];
          const dy = posArray[i * 3 + 1] - posArray[j * 3 + 1];
          const dz = posArray[i * 3 + 2] - posArray[j * 3 + 2];
          const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

          if (dist < 2.5) {
            linePos[lineIdx++] = posArray[i * 3];
            linePos[lineIdx++] = posArray[i * 3 + 1];
            linePos[lineIdx++] = posArray[i * 3 + 2];
            linePos[lineIdx++] = posArray[j * 3];
            linePos[lineIdx++] = posArray[j * 3 + 1];
            linePos[lineIdx++] = posArray[j * 3 + 2];
          }
        }
      }

      // Clear remaining positions
      for (let i = lineIdx; i < linePos.length; i++) {
        linePos[i] = 0;
      }

      lineGeometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <>
      <points ref={meshRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[positions, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.08}
          color="#4A9EFF"
          transparent
          opacity={0.6}
          sizeAttenuation
        />
      </points>
      <lineSegments ref={linesRef} geometry={lineGeometry}>
        <lineBasicMaterial color="#4A9EFF" transparent opacity={0.15} />
      </lineSegments>
    </>
  );
}

export default function ParticleBackground() {
  const mousePosition = useRef({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        mousePosition.current = {
          x: ((e.clientX - rect.left) / rect.width - 0.5) * 2,
          y: -((e.clientY - rect.top) / rect.height - 0.5) * 2,
        };
      }
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div ref={containerRef} className="absolute inset-0 z-0">
      <Canvas
        camera={{ position: [0, 0, 8], fov: 60 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
      >
        <ambientLight intensity={0.5} />
        <ParticleField count={150} mousePosition={mousePosition} />
      </Canvas>
    </div>
  );
}
