import React, { Component, Suspense, useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, RoundedBox, SpotLight, useGLTF } from '@react-three/drei';

const BODY_PARTS = [
  { key: 'chassis', args: [4.15, 0.22, 1.78], radius: 0.06, smoothness: 3, position: [0, 0.44, 0] },
  { key: 'lower-body', args: [4.26, 0.44, 1.84], radius: 0.12, smoothness: 4, position: [0, 0.72, 0] },
  {
    key: 'hood',
    args: [1.42, 0.24, 1.72],
    radius: 0.08,
    smoothness: 3,
    position: [-1.28, 0.94, 0],
    rotation: [0, 0, 0.1],
  },
  { key: 'cabin', args: [2.02, 0.48, 1.46], radius: 0.16, smoothness: 4, position: [0.2, 1.18, 0] },
  {
    key: 'fastback',
    args: [0.96, 0.25, 1.7],
    radius: 0.08,
    smoothness: 3,
    position: [1.52, 0.98, 0],
    rotation: [0, 0, -0.14],
  },
  {
    key: 'front-splitter',
    args: [0.42, 0.06, 1.78],
    radius: 0.02,
    smoothness: 2,
    position: [-2.02, 0.34, 0],
  },
  {
    key: 'rear-diffuser',
    args: [0.38, 0.08, 1.76],
    radius: 0.02,
    smoothness: 2,
    position: [2.04, 0.36, 0],
  },
];

const WHEEL_POSITIONS = [
  [-1.34, 0.42, 0.92],
  [-1.34, 0.42, -0.92],
  [1.34, 0.42, 0.92],
  [1.34, 0.42, -0.92],
];

const DIAGNOSTIC_NODES = [
  { id: 'motor', args: [0.68, 0.28, 0.78], position: [-1.26, 0.72, 0] },
  { id: 'chasis', args: [1.35, 0.12, 0.72], position: [0, 0.46, 0] },
  { id: 'electronica', args: [0.58, 0.24, 0.72], position: [1.08, 0.84, 0] },
];

class WebGLErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex h-full w-full items-center justify-center bg-[#050507]/90 px-6 text-center text-sm text-[#A1A1A6]">
          Vista 3D WebGL no disponible en este navegador. Los controles de diagnóstico siguen activos.
        </div>
      );
    }
    return this.props.children;
  }
}

function createHolographicMaterials() {
  const shellMaterial = new THREE.MeshStandardMaterial({
    color: '#06B6D4',
    emissive: '#06B6D4',
    emissiveIntensity: 0.22,
    metalness: 0.75,
    roughness: 0.22,
    transparent: true,
    opacity: 0.24,
  });

  const wireMaterial = new THREE.MeshStandardMaterial({
    color: '#06B6D4',
    emissive: '#06B6D4',
    emissiveIntensity: 0.65,
    metalness: 0.4,
    roughness: 0.25,
    wireframe: true,
    transparent: true,
    opacity: 0.78,
  });

  return { shellMaterial, wireMaterial };
}

function ExternalGltfCar({ url, wireMaterial }) {
  const { scene } = useGLTF(url);

  const clonedScene = useMemo(() => {
    const clone = scene.clone(true);
    clone.traverse((child) => {
      if (child.isMesh) {
        child.material = wireMaterial;
      }
    });
    return clone;
  }, [scene, wireMaterial]);

  return <primitive object={clonedScene} />;
}

function ProceduralCar({ activePointId, shellMaterial, wireMaterial }) {
  return (
    <group>
      {BODY_PARTS.map(({ key, args, radius, smoothness, position, rotation }) => (
        <group key={key} position={position} rotation={rotation}>
          <RoundedBox args={args} radius={radius} smoothness={smoothness} material={shellMaterial} />
          <RoundedBox args={args} radius={radius} smoothness={smoothness} material={wireMaterial} />
        </group>
      ))}

      {/* Firmas lumínicas LED delantera y trasera */}
      <mesh position={[-2.14, 0.68, 0]}>
        <boxGeometry args={[0.04, 0.05, 1.48]} />
        <meshStandardMaterial color="#22D3EE" emissive="#22D3EE" emissiveIntensity={1.6} />
      </mesh>
      <mesh position={[2.14, 0.78, 0]}>
        <boxGeometry args={[0.04, 0.05, 1.56]} />
        <meshStandardMaterial color="#3B82F6" emissive="#3B82F6" emissiveIntensity={1.6} />
      </mesh>

      {/* Ruedas cilíndricas y ejes */}
      {WHEEL_POSITIONS.map((pos, index) => (
        <group key={`wheel-${index}`} position={pos} rotation={[Math.PI / 2, 0, 0]}>
          <mesh>
            <cylinderGeometry args={[0.4, 0.4, 0.26, 24]} />
            <meshStandardMaterial
              color="#05080f"
              metalness={0.5}
              roughness={0.5}
              transparent
              opacity={0.62}
            />
          </mesh>
          <mesh material={wireMaterial}>
            <cylinderGeometry args={[0.42, 0.42, 0.28, 24]} />
          </mesh>
          <mesh>
            <cylinderGeometry args={[0.26, 0.26, 0.3, 12]} />
            <meshStandardMaterial
              color="#3B82F6"
              emissive="#3B82F6"
              emissiveIntensity={0.85}
              wireframe
            />
          </mesh>
        </group>
      ))}

      {[-1.34, 1.34].map((x) => (
        <mesh key={`axle-${x}`} position={[x, 0.42, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.04, 0.04, 1.84, 12]} />
          <meshStandardMaterial color="#06B6D4" emissive="#06B6D4" emissiveIntensity={0.5} />
        </mesh>
      ))}

      {/* Módulos internos de diagnóstico sincronizados con la UI */}
      {DIAGNOSTIC_NODES.map((node) => {
        const isActive = activePointId === node.id;
        return (
          <RoundedBox
            key={node.id}
            args={node.args}
            radius={0.04}
            smoothness={2}
            position={node.position}
          >
            <meshStandardMaterial
              color={isActive ? '#22D3EE' : '#3B82F6'}
              emissive={isActive ? '#22D3EE' : '#3B82F6'}
              emissiveIntensity={isActive ? 1.8 : 0.45}
              metalness={0.5}
              roughness={0.2}
              transparent
              opacity={isActive ? 0.92 : 0.42}
            />
          </RoundedBox>
        );
      })}
    </group>
  );
}

function LaserScanner({ paused }) {
  const lightRef = useRef(null);
  const beamGroupRef = useRef(null);
  const phaseRef = useRef(-0.8);
  const target = useMemo(() => new THREE.Object3D(), []);

  useFrame((_, delta) => {
    if (!paused) {
      phaseRef.current += Math.min(delta, 0.05) * 1.15;
    }
    const x = Math.sin(phaseRef.current) * 2.45;
    if (lightRef.current) {
      lightRef.current.position.x = x;
    }
    target.position.set(x, 0.3, 0);
    target.updateMatrixWorld();
    if (beamGroupRef.current) {
      beamGroupRef.current.position.x = x;
    }
  });

  return (
    <>
      <primitive object={target} />
      <SpotLight
        ref={lightRef}
        target={target}
        position={[-2.4, 3.6, 0]}
        color="#3B82F6"
        intensity={32}
        distance={9}
        decay={1.4}
        angle={0.42}
        penumbra={0.65}
        attenuation={4.4}
        anglePower={4.2}
        radiusTop={0.16}
        radiusBottom={1.35}
        opacity={0.5}
      />
      <group ref={beamGroupRef} position={[-2.4, 0, 0]}>
        <mesh position={[0, 1.18, 0]}>
          <boxGeometry args={[0.025, 2.35, 2.55]} />
          <meshBasicMaterial
            color="#3B82F6"
            transparent
            opacity={0.28}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>
        <mesh position={[0, 0.01, 0]}>
          <boxGeometry args={[0.035, 0.012, 2.6]} />
          <meshBasicMaterial
            color="#60A5FA"
            transparent
            opacity={0.85}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>
      </group>
    </>
  );
}

function StudioFloor() {
  const gridRef = useRef(null);

  useEffect(() => {
    const grid = gridRef.current;
    if (!grid) return;
    const materials = Array.isArray(grid.material) ? grid.material : [grid.material];
    materials.forEach((mat) => {
      mat.transparent = true;
      mat.opacity = 0.22;
    });
  }, []);

  return (
    <>
      <mesh position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[16, 10]} />
        <meshStandardMaterial
          color="#05080f"
          metalness={0.6}
          roughness={0.45}
          transparent
          opacity={0.35}
        />
      </mesh>
      <gridHelper ref={gridRef} args={[12, 24, '#06B6D4', '#0c2233']} position={[0, 0.002, 0]} />
    </>
  );
}

function ScannerScene({ paused, activePointId, gltfUrl }) {
  const { shellMaterial, wireMaterial } = useMemo(() => createHolographicMaterials(), []);

  useEffect(() => {
    return () => {
      shellMaterial.dispose();
      wireMaterial.dispose();
    };
  }, [shellMaterial, wireMaterial]);

  return (
    <>
      <ambientLight intensity={0.45} color="#0c2838" />
      <hemisphereLight args={['#22D3EE', '#050507', 0.65]} />
      <directionalLight position={[5, 6, 4]} intensity={1.15} color="#e0f7ff" />
      <directionalLight position={[-5, 3, -4]} intensity={0.6} color="#3B82F6" />

      <group position={[0, 0.12, 0]}>
        <StudioFloor />
        <LaserScanner paused={paused} />
        {gltfUrl ? (
          <Suspense
            fallback={
              <ProceduralCar
                activePointId={activePointId}
                shellMaterial={shellMaterial}
                wireMaterial={wireMaterial}
              />
            }
          >
            <ExternalGltfCar url={gltfUrl} wireMaterial={wireMaterial} />
          </Suspense>
        ) : (
          <ProceduralCar
            activePointId={activePointId}
            shellMaterial={shellMaterial}
            wireMaterial={wireMaterial}
          />
        )}
      </group>

      <OrbitControls
        makeDefault
        enableZoom={false}
        enablePan={false}
        autoRotate={!paused}
        autoRotateSpeed={0.85}
        enableDamping
        dampingFactor={0.06}
        minPolarAngle={Math.PI / 4.5}
        maxPolarAngle={Math.PI / 2.15}
        target={[0, 0.6, 0]}
      />
    </>
  );
}

export default function AutomotiveScanner3D({
  paused = false,
  activePointId = 'motor',
  gltfUrl = null,
}) {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const syncPreference = () => setPrefersReducedMotion(mq.matches);
    syncPreference();
    mq.addEventListener('change', syncPreference);
    return () => mq.removeEventListener('change', syncPreference);
  }, []);

  const effectivePaused = paused || prefersReducedMotion;

  return (
    <WebGLErrorBoundary>
      <div className="h-full w-full" aria-hidden="true">
        <Canvas
          className="h-full w-full block cursor-grab active:cursor-grabbing"
          dpr={[1, 2]}
          camera={{ position: [4.9, 2.25, 5.5], fov: 35, near: 0.1, far: 60 }}
          gl={{ alpha: true, antialias: true, powerPreference: 'high-performance' }}
          onCreated={({ gl }) => {
            gl.setClearColor(0x000000, 0);
          }}
        >
          <ScannerScene
            paused={effectivePaused}
            activePointId={activePointId}
            gltfUrl={gltfUrl}
          />
        </Canvas>
      </div>
    </WebGLErrorBoundary>
  );
}
