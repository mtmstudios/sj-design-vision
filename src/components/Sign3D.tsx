import { useRef, useMemo, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Environment, ContactShadows } from "@react-three/drei";
import * as THREE from "three";

const faceLabels = [
  "Werbetechnik",
  "Fahrzeug-\nbeschriftung",
  "Textilien\n& Druck",
  "Webdesign\n& Print",
];

const faceColors = [
  "#C0392B",
  "#E74C3C",
  "#C0392B",
  "#E74C3C",
];

function createTextTexture(text: string, bgColor: string) {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext("2d")!;

  // Dark background
  ctx.fillStyle = "#1a1a1a";
  ctx.fillRect(0, 0, 512, 512);

  // Subtle border glow
  const gradient = ctx.createLinearGradient(0, 0, 512, 512);
  gradient.addColorStop(0, bgColor + "40");
  gradient.addColorStop(1, bgColor + "10");
  ctx.strokeStyle = gradient;
  ctx.lineWidth = 4;
  ctx.strokeRect(8, 8, 496, 496);

  // Text
  ctx.fillStyle = "#F5F5F5";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  
  const lines = text.split("\n");
  const fontSize = lines.length > 1 ? 42 : 52;
  ctx.font = `800 ${fontSize}px Montserrat, sans-serif`;
  
  const lineHeight = fontSize * 1.3;
  const startY = 256 - ((lines.length - 1) * lineHeight) / 2;
  
  lines.forEach((line, i) => {
    ctx.fillText(line, 256, startY + i * lineHeight);
  });

  // Small SJ logo text
  ctx.font = "600 18px Inter, sans-serif";
  ctx.fillStyle = bgColor;
  ctx.fillText("SJ DESIGN", 256, 460);

  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

function RotatingSign({ scale = 1 }: { scale?: number }) {
  const groupRef = useRef<THREE.Group>(null);

  const textures = useMemo(() => {
    return faceLabels.map((label, i) => createTextTexture(label, faceColors[i]));
  }, []);

  const materials = useMemo(() => {
    const metalMat = new THREE.MeshStandardMaterial({
      color: "#3a3a3a",
      metalness: 0.9,
      roughness: 0.3,
    });

    const faceMats = textures.map(
      (tex) =>
        new THREE.MeshStandardMaterial({
          map: tex,
          emissive: new THREE.Color("#C0392B"),
          emissiveIntensity: 0.08,
          metalness: 0.2,
          roughness: 0.5,
        })
    );

    // Box has 6 faces: +x, -x, +y, -y, +z, -z
    // We want textures on +z, -z, +x, -x and metal on top/bottom
    return [faceMats[3], faceMats[1], metalMat, metalMat, faceMats[0], faceMats[2]];
  }, [textures]);

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.8;
    }
  });

  return (
    <Float speed={2} rotationIntensity={0} floatIntensity={0.5} floatingRange={[-0.1, 0.1]}>
      <group ref={groupRef} scale={scale}>
        {/* Main sign box */}
        <mesh material={materials} castShadow>
          <boxGeometry args={[2.8, 2, 0.3]} />
        </mesh>
        
        {/* Top mounting bracket */}
        <mesh position={[0, 1.2, 0]} castShadow>
          <cylinderGeometry args={[0.04, 0.04, 0.5, 8]} />
          <meshStandardMaterial color="#555" metalness={0.9} roughness={0.2} />
        </mesh>

        {/* Red LED strip glow */}
        <mesh position={[0, -1.05, 0]}>
          <boxGeometry args={[2.6, 0.04, 0.35]} />
          <meshStandardMaterial
            color="#C0392B"
            emissive="#C0392B"
            emissiveIntensity={2}
            transparent
            opacity={0.7}
          />
        </mesh>
      </group>
    </Float>
  );
}

function Scene({ scale = 1 }: { scale?: number }) {
  return (
    <>
      <ambientLight intensity={0.3} />
      <directionalLight position={[5, 5, 5]} intensity={0.8} castShadow />
      <pointLight position={[0, -2, 2]} intensity={0.5} color="#C0392B" />
      <pointLight position={[0, 2, -2]} intensity={0.3} color="#ffffff" />
      <RotatingSign scale={scale} />
      <ContactShadows
        position={[0, -1.8, 0]}
        opacity={0.4}
        scale={8}
        blur={2}
        far={4}
        color="#C0392B"
      />
      <Environment preset="city" />
    </>
  );
}

export function HeroSign3D() {
  return (
    <div className="w-full h-full">
      <Suspense fallback={<div className="w-full h-full flex items-center justify-center"><div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" /></div>}>
        <Canvas
          camera={{ position: [0, 0.5, 5], fov: 45 }}
          shadows
          dpr={[1, 2]}
          gl={{ antialias: true, alpha: true }}
          style={{ background: "transparent" }}
        >
          <Scene scale={1} />
        </Canvas>
      </Suspense>
    </div>
  );
}

export function MiniSign3D() {
  return (
    <div className="w-full h-full">
      <Suspense fallback={null}>
        <Canvas
          camera={{ position: [0, 0.3, 4], fov: 45 }}
          dpr={[1, 1.5]}
          gl={{ antialias: true, alpha: true }}
          style={{ background: "transparent" }}
        >
          <Scene scale={0.7} />
        </Canvas>
      </Suspense>
    </div>
  );
}
