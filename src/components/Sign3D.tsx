import { useRef, useMemo, Suspense, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Environment, ContactShadows } from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import * as THREE from "three";

// ── Face data ──────────────────────────────────────────────────────────────
const FACE_DATA = [
  { label: "Werbetechnik",           sub: "Schilder & Leuchtreklame", color: "#C0392B", icon: "sign"   },
  { label: "Fahrzeug-\nbeschriftung", sub: "Car Wrapping & Folie",    color: "#C0392B", icon: "car"    },
  { label: "Textilien\n& Druck",     sub: "Stick & Siebdruck",        color: "#C0392B", icon: "shirt"  },
  { label: "Webdesign\n& Print",     sub: "Logos & Websites",         color: "#C0392B", icon: "screen" },
] as const;

type IconType = "sign" | "car" | "shirt" | "screen";

// ── Icon drawing ───────────────────────────────────────────────────────────
function drawIcon(
  ctx: CanvasRenderingContext2D,
  icon: IconType,
  cx: number,
  cy: number,
  size: number,
  color: string,
) {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = size * 0.055;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.shadowColor = color;
  ctx.shadowBlur = 20;

  switch (icon) {
    case "sign": {
      const w = size * 0.72, h = size * 0.46;
      ctx.strokeRect(cx - w / 2, cy - h / 2, w, h);
      ctx.beginPath();
      ctx.moveTo(cx, cy - h / 2);
      ctx.lineTo(cx, cy - h / 2 - size * 0.2);
      ctx.stroke();
      for (let i = 0; i < 5; i++) {
        ctx.fillStyle = color;
        ctx.shadowBlur = 14;
        ctx.beginPath();
        ctx.arc(cx - w * 0.4 + i * w * 0.2, cy + h / 2 + size * 0.09, size * 0.03, 0, Math.PI * 2);
        ctx.fill();
      }
      break;
    }
    case "car": {
      const w = size * 0.76;
      ctx.beginPath();
      ctx.moveTo(cx - w / 2 + size * 0.04, cy + size * 0.08);
      ctx.lineTo(cx - w * 0.36, cy + size * 0.08);
      ctx.arc(cx - w * 0.25, cy + size * 0.08, w * 0.115, Math.PI, 0, true);
      ctx.lineTo(cx + w * 0.135, cy + size * 0.08);
      ctx.arc(cx + w * 0.25, cy + size * 0.08, w * 0.115, Math.PI, 0, true);
      ctx.lineTo(cx + w / 2, cy + size * 0.08);
      ctx.lineTo(cx + w * 0.3, cy - size * 0.07);
      ctx.lineTo(cx + w * 0.1, cy - size * 0.22);
      ctx.lineTo(cx - w * 0.08, cy - size * 0.22);
      ctx.lineTo(cx - w * 0.3, cy - size * 0.07);
      ctx.closePath();
      ctx.stroke();
      break;
    }
    case "shirt": {
      const w = size * 0.68, h = size * 0.62;
      ctx.beginPath();
      ctx.moveTo(cx - w * 0.22, cy - h / 2);
      ctx.lineTo(cx - w / 2, cy - h / 2 + h * 0.18);
      ctx.lineTo(cx - w * 0.34, cy - h / 2 + h * 0.1);
      ctx.lineTo(cx - w * 0.34, cy + h / 2);
      ctx.lineTo(cx + w * 0.34, cy + h / 2);
      ctx.lineTo(cx + w * 0.34, cy - h / 2 + h * 0.1);
      ctx.lineTo(cx + w / 2, cy - h / 2 + h * 0.18);
      ctx.lineTo(cx + w * 0.22, cy - h / 2);
      ctx.quadraticCurveTo(cx + w * 0.1, cy - h / 2 + h * 0.12, cx, cy - h / 2 + h * 0.08);
      ctx.quadraticCurveTo(cx - w * 0.1, cy - h / 2 + h * 0.12, cx - w * 0.22, cy - h / 2);
      ctx.stroke();
      break;
    }
    case "screen": {
      const w = size * 0.72, mh = size * 0.44;
      ctx.strokeRect(cx - w / 2, cy - mh / 2 - size * 0.04, w, mh);
      ctx.beginPath();
      ctx.moveTo(cx, cy + mh / 2 - size * 0.04);
      ctx.lineTo(cx, cy + size * 0.32);
      ctx.moveTo(cx - w * 0.22, cy + size * 0.32);
      ctx.lineTo(cx + w * 0.22, cy + size * 0.32);
      ctx.stroke();
      ctx.lineWidth = size * 0.025;
      ctx.shadowBlur = 8;
      const iy = cy - mh / 2 - size * 0.04 + size * 0.065;
      const ix = cx - w / 2 + size * 0.065;
      [0, 1, 2].forEach((i) => {
        ctx.beginPath();
        ctx.moveTo(ix, iy + i * size * 0.096);
        ctx.lineTo(ix + (i === 2 ? (w - size * 0.13) * 0.55 : w - size * 0.13), iy + i * size * 0.096);
        ctx.stroke();
      });
      break;
    }
  }
  ctx.restore();
}

// ── Face texture factory ───────────────────────────────────────────────────
function createFaceTexture(data: { label: string; sub: string; color: string; icon: IconType }): THREE.CanvasTexture {
  const S = 1024;
  const canvas = document.createElement("canvas");
  canvas.width = S;
  canvas.height = S;
  const ctx = canvas.getContext("2d")!;

  // Radial background
  const bg = ctx.createRadialGradient(S / 2, S * 0.38, 0, S / 2, S / 2, S * 0.78);
  bg.addColorStop(0, "#212121");
  bg.addColorStop(1, "#0a0a0a");
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, S, S);

  // Film grain
  for (let i = 0; i < 1400; i++) {
    ctx.fillStyle = `rgba(255,255,255,${Math.random() * 0.022})`;
    ctx.fillRect(Math.random() * S, Math.random() * S, 2, 2);
  }

  // Multi-layer border glow
  for (let w = 0; w < 5; w++) {
    const alpha = Math.round((0.65 - w * 0.1) * 255).toString(16).padStart(2, "0");
    ctx.strokeStyle = data.color + alpha;
    ctx.lineWidth = 2.2 - w * 0.28;
    ctx.strokeRect(10 + w * 5, 10 + w * 5, S - (20 + w * 10), S - (20 + w * 10));
  }

  // Corner accent marks
  const cM = 28, cS = 44;
  const corners = [
    [cM, cM, 1, 1], [S - cM, cM, -1, 1],
    [cM, S - cM, 1, -1], [S - cM, S - cM, -1, -1],
  ] as [number, number, number, number][];
  ctx.lineWidth = 3;
  ctx.shadowColor = data.color;
  ctx.shadowBlur = 14;
  corners.forEach(([x, y, dx, dy]) => {
    ctx.strokeStyle = data.color;
    ctx.beginPath();
    ctx.moveTo(x + dx * cS, y);
    ctx.lineTo(x, y);
    ctx.lineTo(x, y + dy * cS);
    ctx.stroke();
  });
  ctx.shadowBlur = 0;

  // Icon
  drawIcon(ctx, data.icon, S / 2, S * 0.295, S * 0.27, data.color);

  // Divider line with glow
  ctx.save();
  ctx.shadowColor = data.color;
  ctx.shadowBlur = 24;
  const dg = ctx.createLinearGradient(S * 0.08, 0, S * 0.92, 0);
  dg.addColorStop(0, "transparent");
  dg.addColorStop(0.25, data.color + "99");
  dg.addColorStop(0.5, data.color);
  dg.addColorStop(0.75, data.color + "99");
  dg.addColorStop(1, "transparent");
  ctx.strokeStyle = dg;
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(S * 0.08, S * 0.516);
  ctx.lineTo(S * 0.92, S * 0.516);
  ctx.stroke();
  ctx.restore();

  // Main label text
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  const lines = data.label.split("\n");
  const fz = lines.length > 1 ? 82 : 102;
  ctx.font = `900 ${fz}px Montserrat, Arial Black, sans-serif`;
  ctx.shadowColor = "rgba(255,255,255,0.1)";
  ctx.shadowBlur = 20;
  ctx.fillStyle = "#FFFFFF";
  const lh = fz * 1.15;
  const textY = S * 0.666 - ((lines.length - 1) * lh) / 2;
  lines.forEach((line, i) => ctx.fillText(line, S / 2, textY + i * lh));
  ctx.shadowBlur = 0;

  // Sub-label
  ctx.font = "500 24px Inter, Arial, sans-serif";
  ctx.fillStyle = data.color + "AA";
  ctx.fillText(data.sub.toUpperCase(), S / 2, S * 0.85);

  // SJ DESIGN badge
  const bW = 178, bH = 32, bX = S / 2 - bW / 2, bY = S - 55, rr = 16;
  ctx.fillStyle = data.color + "28";
  ctx.beginPath();
  ctx.moveTo(bX + rr, bY);
  ctx.arcTo(bX + bW, bY, bX + bW, bY + bH, rr);
  ctx.arcTo(bX + bW, bY + bH, bX, bY + bH, rr);
  ctx.arcTo(bX, bY + bH, bX, bY, rr);
  ctx.arcTo(bX, bY, bX + bW, bY, rr);
  ctx.closePath();
  ctx.fill();
  ctx.font = "700 18px Montserrat, Arial, sans-serif";
  ctx.fillStyle = data.color;
  ctx.fillText("SJ DESIGN", S / 2, bY + bH / 2);

  const tex = new THREE.CanvasTexture(canvas);
  tex.needsUpdate = true;
  return tex;
}

// ── 3D Floating particles ──────────────────────────────────────────────────
function Particles() {
  const COUNT = 90;
  const ref = useRef<THREE.Points>(null);
  const vel = useRef(new Float32Array(COUNT * 3));

  const [positions, colors] = useMemo(() => {
    const pos = new Float32Array(COUNT * 3);
    const col = new Float32Array(COUNT * 3);
    const v = vel.current;
    const RED  = new THREE.Color("#FF3322");
    const DIM  = new THREE.Color("#C0392B");
    const WHT  = new THREE.Color("#ffffff");
    for (let i = 0; i < COUNT; i++) {
      const r = 2.2 + Math.random() * 3.8;
      const theta = Math.random() * Math.PI * 2;
      const phi = (Math.random() - 0.5) * Math.PI * 1.4;
      pos[i * 3]     = r * Math.cos(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.sin(phi);
      pos[i * 3 + 2] = r * Math.cos(phi) * Math.sin(theta);
      v[i * 3]     = (Math.random() - 0.5) * 0.0035;
      v[i * 3 + 1] = (Math.random() - 0.5) * 0.003;
      v[i * 3 + 2] = (Math.random() - 0.5) * 0.0035;
      const c = Math.random() < 0.3 ? RED : Math.random() < 0.45 ? DIM : WHT;
      col[i * 3] = c.r; col[i * 3 + 1] = c.g; col[i * 3 + 2] = c.b;
    }
    return [pos, col];
  }, []);

  useFrame((_, dt) => {
    if (!ref.current) return;
    const pos = ref.current.geometry.attributes.position.array as Float32Array;
    const v = vel.current;
    for (let i = 0; i < COUNT; i++) {
      pos[i * 3]     += v[i * 3];
      pos[i * 3 + 1] += v[i * 3 + 1];
      pos[i * 3 + 2] += v[i * 3 + 2];
      const d = Math.sqrt(pos[i * 3] ** 2 + pos[i * 3 + 1] ** 2 + pos[i * 3 + 2] ** 2);
      if (d > 6.2 || d < 1.8) { v[i * 3] *= -1; v[i * 3 + 1] *= -1; v[i * 3 + 2] *= -1; }
    }
    ref.current.geometry.attributes.position.needsUpdate = true;
    ref.current.rotation.y += dt * 0.03;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.038} vertexColors transparent opacity={0.8} sizeAttenuation />
    </points>
  );
}

// ── Orbit ring ──────────────────────────────────────────────────────────────
function OrbitRing({ radius, rotX, rotZ, speed, opacity }: {
  radius: number; rotX: number; rotZ: number; speed: number; opacity: number;
}) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((_, dt) => { if (ref.current) ref.current.rotation.z += dt * speed; });
  return (
    <mesh ref={ref} rotation={[rotX, 0, rotZ]}>
      <torusGeometry args={[radius, 0.007, 6, 128]} />
      <meshStandardMaterial color="#FF3322" emissive="#FF3322" emissiveIntensity={4} transparent opacity={opacity} />
    </mesh>
  );
}

// ── Main rotating sign ──────────────────────────────────────────────────────
function RotatingSign({ scale = 1 }: { scale?: number }) {
  const groupRef  = useRef<THREE.Group>(null);
  const tiltRef   = useRef<THREE.Group>(null);
  const lightRef  = useRef<THREE.PointLight>(null);
  const mouse     = useRef({ x: 0, y: 0 });
  const tiltX     = useRef(0);
  const tiltZ     = useRef(0);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mouse.current.x = (e.clientX / window.innerWidth - 0.5) * 2;
      mouse.current.y = -(e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  const textures = useMemo(() => FACE_DATA.map(createFaceTexture), []);

  const signBodyMats = useMemo(() => {
    const fp = { emissive: new THREE.Color("#C0392B"), emissiveIntensity: 0.1, roughness: 0.55, metalness: 0.08 };
    const tb = new THREE.MeshStandardMaterial({ color: "#1a1a1a", metalness: 0.92, roughness: 0.12 });
    return [
      new THREE.MeshStandardMaterial({ map: textures[3], ...fp }), // +x right
      new THREE.MeshStandardMaterial({ map: textures[1], ...fp }), // -x left
      tb,                                                             // +y top
      tb,                                                             // -y bottom
      new THREE.MeshStandardMaterial({ map: textures[0], ...fp }), // +z front
      new THREE.MeshStandardMaterial({ map: textures[2], ...fp }), // -z back
    ];
  }, [textures]);

  useFrame((_, dt) => {
    if (!groupRef.current || !tiltRef.current) return;

    // Variable speed — slows dramatically near each 90° face position
    const y = groupRef.current.rotation.y;
    const phase = ((y % (Math.PI / 2)) + Math.PI / 2) % (Math.PI / 2);
    const distFromFace = Math.min(phase, Math.PI / 2 - phase) / (Math.PI / 4);
    groupRef.current.rotation.y += dt * (0.28 + distFromFace * 0.95);

    // Fill light follows front face direction
    if (lightRef.current) {
      lightRef.current.position.x = Math.sin(y) * 3.5;
      lightRef.current.position.z = Math.cos(y) * 3.5;
    }

    // Smooth mouse-driven parallax tilt
    tiltX.current = THREE.MathUtils.lerp(tiltX.current, mouse.current.y * 0.16, 0.05);
    tiltZ.current = THREE.MathUtils.lerp(tiltZ.current, -mouse.current.x * 0.09, 0.05);
    tiltRef.current.rotation.x = tiltX.current;
    tiltRef.current.rotation.z = tiltZ.current;
  });

  const SW = 2.8, SH = 2, SD = 0.24, FW = 0.062;

  return (
    <Float speed={1.4} rotationIntensity={0} floatIntensity={0.5} floatingRange={[-0.2, 0.2]}>
      <group ref={groupRef} scale={scale}>

        {/* Dynamic fill light that chases the lit face */}
        <pointLight ref={lightRef} position={[0, 0, 3.5]} intensity={2.2} color="#C0392B" distance={8} />

        <group ref={tiltRef}>

          {/* ── Sign body with multi-material faces ── */}
          <mesh material={signBodyMats} castShadow receiveShadow>
            <boxGeometry args={[SW, SH, SD]} />
          </mesh>

          {/* ── Aluminum frame bars ── */}
          <mesh position={[0,  SH / 2 + FW / 2, 0]} castShadow>
            <boxGeometry args={[SW + FW * 2, FW, SD + FW * 2]} />
            <meshStandardMaterial color="#1c1c1c" metalness={0.96} roughness={0.06} />
          </mesh>
          <mesh position={[0, -SH / 2 - FW / 2, 0]} castShadow>
            <boxGeometry args={[SW + FW * 2, FW, SD + FW * 2]} />
            <meshStandardMaterial color="#1c1c1c" metalness={0.96} roughness={0.06} />
          </mesh>
          <mesh position={[-SW / 2 - FW / 2, 0, 0]} castShadow>
            <boxGeometry args={[FW, SH, SD + FW * 2]} />
            <meshStandardMaterial color="#1c1c1c" metalness={0.96} roughness={0.06} />
          </mesh>
          <mesh position={[ SW / 2 + FW / 2, 0, 0]} castShadow>
            <boxGeometry args={[FW, SH, SD + FW * 2]} />
            <meshStandardMaterial color="#1c1c1c" metalness={0.96} roughness={0.06} />
          </mesh>

          {/* ── Corner bolts ── */}
          {([
            [-SW / 2 - FW / 2,  SH / 2 + FW / 2],
            [ SW / 2 + FW / 2,  SH / 2 + FW / 2],
            [-SW / 2 - FW / 2, -SH / 2 - FW / 2],
            [ SW / 2 + FW / 2, -SH / 2 - FW / 2],
          ] as [number, number][]).map(([bx, by], i) => (
            <mesh key={i} position={[bx, by, SD / 2 + FW / 2 + 0.02]} rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.036, 0.036, 0.042, 8]} />
              <meshStandardMaterial color="#555" metalness={1} roughness={0.03} />
            </mesh>
          ))}

          {/* ── LED strips — emissiveIntensity high so Bloom picks them up ── */}
          <mesh position={[0, -SH / 2 - FW - 0.022, 0]}>
            <boxGeometry args={[SW * 0.86, 0.026, 0.062]} />
            <meshStandardMaterial color="#FF2211" emissive="#FF2211" emissiveIntensity={8} transparent opacity={0.92} />
          </mesh>
          <mesh position={[0,  SH / 2 + FW + 0.022, 0]}>
            <boxGeometry args={[SW * 0.86, 0.026, 0.062]} />
            <meshStandardMaterial color="#FF2211" emissive="#FF2211" emissiveIntensity={8} transparent opacity={0.92} />
          </mesh>

          {/* ── Mounting bracket ── */}
          <mesh position={[0, SH / 2 + FW + 0.32, 0]} castShadow>
            <cylinderGeometry args={[0.038, 0.038, 0.56, 10]} />
            <meshStandardMaterial color="#333" metalness={0.95} roughness={0.1} />
          </mesh>
          <mesh position={[0, SH / 2 + FW + 0.61, 0]}>
            <sphereGeometry args={[0.068, 10, 10]} />
            <meshStandardMaterial color="#4a4a4a" metalness={1} roughness={0.04} />
          </mesh>

        </group>
      </group>
    </Float>
  );
}

// ── Scene ──────────────────────────────────────────────────────────────────
function Scene({ scale = 1, mini = false }: { scale?: number; mini?: boolean }) {
  return (
    <>
      <ambientLight intensity={0.18} />
      <directionalLight position={[6, 8, 6]} intensity={0.65} castShadow shadow-mapSize={[2048, 2048]} />
      <pointLight position={[-4, 2, 3]} intensity={0.3} color="#ffffff" />
      <pointLight position={[3, -2, -3]} intensity={0.2} color="#ffffff" />

      <RotatingSign scale={scale} />

      {!mini && (
        <>
          <Particles />
          <OrbitRing radius={2.55} rotX={Math.PI / 3}    rotZ={0}    speed={0.17}  opacity={0.38} />
          <OrbitRing radius={2.9}  rotX={-Math.PI / 4}  rotZ={0.45} speed={-0.11} opacity={0.22} />
          <OrbitRing radius={3.2}  rotX={Math.PI / 6}   rotZ={-0.6} speed={0.07}  opacity={0.12} />
        </>
      )}

      <ContactShadows position={[0, -2.4, 0]} opacity={0.6} scale={12} blur={3.5} far={6} color="#C0392B" />
      <Environment preset="warehouse" />

      <EffectComposer>
        <Bloom intensity={1.8} luminanceThreshold={0.52} luminanceSmoothing={0.88} height={400} />
      </EffectComposer>
    </>
  );
}

// ── Exports ────────────────────────────────────────────────────────────────
export function HeroSign3D() {
  return (
    <div className="w-full h-full">
      <Suspense
        fallback={
          <div className="w-full h-full flex items-center justify-center">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        }
      >
        <Canvas
          camera={{ position: [0, 0.5, 5.5], fov: 42 }}
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
          camera={{ position: [0, 0.3, 4.2], fov: 42 }}
          dpr={[1, 1.5]}
          gl={{ antialias: true, alpha: true }}
          style={{ background: "transparent" }}
        >
          <Scene scale={0.65} mini />
        </Canvas>
      </Suspense>
    </div>
  );
}
