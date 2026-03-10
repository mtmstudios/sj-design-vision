import { useRef, useMemo, Suspense, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Environment, ContactShadows } from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import * as THREE from "three";

// ── Brand constants ────────────────────────────────────────────────────────
const BRAND_RED  = "#E51C20";   // exact logo color
const FRAME_DARK = "#1e1e1e";
const FRAME_MID  = "#2a2a2a";
const FACE_BG    = "#F2F2F2";   // off-white acrylic face

// ── Face data ──────────────────────────────────────────────────────────────
const FACE_DATA = [
  { label: "Werbetechnik",             sub: "Schilder · Pylone · 3D-Buchstaben · LED",   icon: "sign"   },
  { label: "Fahrzeugbeschriftung",     sub: "Car Wrapping · Folie · Flottenbeschriftung", icon: "car"    },
  { label: "Textilien & Druck",        sub: "Stick · Siebdruck · Arbeitskleidung",        icon: "shirt"  },
  { label: "Webdesign & Print",        sub: "Logos · Websites · Werbemittel",             icon: "screen" },
] as const;

type IconType = "sign" | "car" | "shirt" | "screen";

// ── Icon drawing (dark on light background) ────────────────────────────────
function drawIcon(
  ctx: CanvasRenderingContext2D,
  icon: IconType,
  cx: number, cy: number,
  size: number,
) {
  ctx.save();
  ctx.strokeStyle = BRAND_RED;
  ctx.lineWidth = size * 0.06;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";

  switch (icon) {
    case "sign": {
      const w = size * 0.78, h = size * 0.52;
      ctx.strokeRect(cx - w / 2, cy - h / 2, w, h);
      ctx.beginPath();
      ctx.moveTo(cx, cy - h / 2);
      ctx.lineTo(cx, cy - h / 2 - size * 0.22);
      ctx.stroke();
      // LED dots along bottom edge of sign
      for (let i = 0; i < 5; i++) {
        ctx.fillStyle = BRAND_RED;
        ctx.beginPath();
        ctx.arc(cx - w * 0.4 + i * w * 0.2, cy + h / 2 + size * 0.1, size * 0.035, 0, Math.PI * 2);
        ctx.fill();
      }
      break;
    }
    case "car": {
      const w = size * 0.82;
      ctx.beginPath();
      ctx.moveTo(cx - w / 2 + size * 0.04, cy + size * 0.1);
      ctx.lineTo(cx - w * 0.36, cy + size * 0.1);
      ctx.arc(cx - w * 0.25, cy + size * 0.1, w * 0.12, Math.PI, 0, true);
      ctx.lineTo(cx + w * 0.13, cy + size * 0.1);
      ctx.arc(cx + w * 0.25, cy + size * 0.1, w * 0.12, Math.PI, 0, true);
      ctx.lineTo(cx + w / 2, cy + size * 0.1);
      ctx.lineTo(cx + w * 0.28, cy - size * 0.07);
      ctx.lineTo(cx + w * 0.09, cy - size * 0.24);
      ctx.lineTo(cx - w * 0.09, cy - size * 0.24);
      ctx.lineTo(cx - w * 0.3, cy - size * 0.07);
      ctx.closePath();
      ctx.stroke();
      break;
    }
    case "shirt": {
      const w = size * 0.74, h = size * 0.68;
      ctx.beginPath();
      ctx.moveTo(cx - w * 0.23, cy - h / 2);
      ctx.lineTo(cx - w / 2, cy - h / 2 + h * 0.19);
      ctx.lineTo(cx - w * 0.35, cy - h / 2 + h * 0.11);
      ctx.lineTo(cx - w * 0.35, cy + h / 2);
      ctx.lineTo(cx + w * 0.35, cy + h / 2);
      ctx.lineTo(cx + w * 0.35, cy - h / 2 + h * 0.11);
      ctx.lineTo(cx + w / 2, cy - h / 2 + h * 0.19);
      ctx.lineTo(cx + w * 0.23, cy - h / 2);
      ctx.quadraticCurveTo(cx + w * 0.1, cy - h / 2 + h * 0.13, cx, cy - h / 2 + h * 0.09);
      ctx.quadraticCurveTo(cx - w * 0.1, cy - h / 2 + h * 0.13, cx - w * 0.23, cy - h / 2);
      ctx.stroke();
      break;
    }
    case "screen": {
      const w = size * 0.76, mh = size * 0.5;
      ctx.strokeRect(cx - w / 2, cy - mh / 2 - size * 0.05, w, mh);
      ctx.beginPath();
      ctx.moveTo(cx, cy + mh / 2 - size * 0.05);
      ctx.lineTo(cx, cy + size * 0.36);
      ctx.moveTo(cx - w * 0.24, cy + size * 0.36);
      ctx.lineTo(cx + w * 0.24, cy + size * 0.36);
      ctx.stroke();
      ctx.lineWidth = size * 0.028;
      const iy = cy - mh / 2 - size * 0.05 + size * 0.07;
      const ix = cx - w / 2 + size * 0.07;
      [0, 1, 2].forEach((i) => {
        ctx.beginPath();
        ctx.moveTo(ix, iy + i * size * 0.1);
        ctx.lineTo(ix + (i === 2 ? (w - size * 0.14) * 0.55 : w - size * 0.14), iy + i * size * 0.1);
        ctx.stroke();
      });
      break;
    }
  }
  ctx.restore();
}

// ── Face texture — Leuchtkasten / backlit signage look ─────────────────────
// Texture aspect ratio matches the wide sign (3.8 : 1.5 ≈ 2.53 : 1)
function createFaceTexture(data: { label: string; sub: string; icon: IconType }): THREE.CanvasTexture {
  const W = 1900, H = 750;
  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d")!;

  // ── Off-white acrylic face ──────────────────────────────────────────────
  ctx.fillStyle = FACE_BG;
  ctx.fillRect(0, 0, W, H);

  // Subtle centre glow (backlight bleeding)
  const glow = ctx.createRadialGradient(W / 2, H / 2, 0, W / 2, H / 2, W * 0.55);
  glow.addColorStop(0, "rgba(255,255,255,0.55)");
  glow.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, W, H);

  // ── Red header band ─────────────────────────────────────────────────────
  const headerH = H * 0.2;
  ctx.fillStyle = BRAND_RED;
  ctx.fillRect(0, 0, W, headerH);

  // "SJ DESIGN" in white inside header
  ctx.textAlign = "left";
  ctx.textBaseline = "middle";
  ctx.fillStyle = "#FFFFFF";
  ctx.font = `800 ${Math.round(headerH * 0.52)}px Montserrat, Arial Black, sans-serif`;
  ctx.fillText("SJ DESIGN", W * 0.032, headerH / 2);

  // Right side of header: tagline
  ctx.font = `500 ${Math.round(headerH * 0.24)}px Inter, Arial, sans-serif`;
  ctx.fillStyle = "rgba(255,255,255,0.75)";
  ctx.textAlign = "right";
  ctx.fillText("Werbetechnik · Deizisau bei Stuttgart", W * 0.972, headerH / 2);

  // ── Thin divider below header ───────────────────────────────────────────
  ctx.fillStyle = BRAND_RED + "33";
  ctx.fillRect(0, headerH, W, 2);

  // ── Icon (right side, vertically centred in content area) ──────────────
  const contentCY = headerH + (H - headerH) / 2;
  drawIcon(ctx, data.icon, W * 0.85, contentCY, Math.min(H - headerH, W * 0.14) * 0.9);

  // ── Service label (left/centre aligned, bold, dark) ─────────────────────
  const textAreaW = W * 0.74;
  const lines = data.label.split("\n");
  const fz = lines.length > 1 ? Math.round((H - headerH) * 0.28) : Math.round((H - headerH) * 0.34);
  ctx.font = `900 ${fz}px Montserrat, Arial Black, sans-serif`;
  ctx.fillStyle = "#1a1a1a";
  ctx.textAlign = "left";
  ctx.textBaseline = "middle";
  const lh = fz * 1.12;
  const labelY = contentCY - (H - headerH) * 0.1 - ((lines.length - 1) * lh) / 2;
  lines.forEach((line, i) => ctx.fillText(line, W * 0.038, labelY + i * lh));

  // ── Sub-text ─────────────────────────────────────────────────────────────
  const subFz = Math.round((H - headerH) * 0.085);
  ctx.font = `400 ${subFz}px Inter, Arial, sans-serif`;
  ctx.fillStyle = "#666666";
  const subY = lines.length > 1 ? labelY + (lines.length - 1) * lh + fz * 0.62 : labelY + fz * 0.68;
  ctx.fillText(data.sub, W * 0.038, subY);

  // ── Thin red accent line left edge ──────────────────────────────────────
  ctx.fillStyle = BRAND_RED;
  ctx.fillRect(0, headerH + 2, 5, H - headerH - 2);

  // ── Subtle bottom red bar ────────────────────────────────────────────────
  ctx.fillStyle = BRAND_RED;
  ctx.fillRect(0, H - 10, W, 10);

  // ── Thin outer border ────────────────────────────────────────────────────
  ctx.strokeStyle = "rgba(0,0,0,0.12)";
  ctx.lineWidth = 3;
  ctx.strokeRect(1.5, 1.5, W - 3, H - 3);

  const tex = new THREE.CanvasTexture(canvas);
  tex.needsUpdate = true;
  return tex;
}

// ── Subtle floating particles (much fewer, softer) ─────────────────────────
function Particles() {
  const COUNT = 28;
  const ref   = useRef<THREE.Points>(null);
  const vel   = useRef(new Float32Array(COUNT * 3));

  const [positions, colors] = useMemo(() => {
    const pos = new Float32Array(COUNT * 3);
    const col = new Float32Array(COUNT * 3);
    const v   = vel.current;
    const RED = new THREE.Color(BRAND_RED);
    const WHT = new THREE.Color("#ffffff");
    for (let i = 0; i < COUNT; i++) {
      const r = 3.0 + Math.random() * 3.0;
      const theta = Math.random() * Math.PI * 2;
      const phi   = (Math.random() - 0.5) * Math.PI;
      pos[i * 3]     = r * Math.cos(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.sin(phi);
      pos[i * 3 + 2] = r * Math.cos(phi) * Math.sin(theta);
      v[i * 3]     = (Math.random() - 0.5) * 0.002;
      v[i * 3 + 1] = (Math.random() - 0.5) * 0.0015;
      v[i * 3 + 2] = (Math.random() - 0.5) * 0.002;
      const c = Math.random() < 0.35 ? RED : WHT;
      col[i * 3] = c.r; col[i * 3 + 1] = c.g; col[i * 3 + 2] = c.b;
    }
    return [pos, col];
  }, []);

  useFrame((_, dt) => {
    if (!ref.current) return;
    const pos = ref.current.geometry.attributes.position.array as Float32Array;
    const v   = vel.current;
    for (let i = 0; i < COUNT; i++) {
      pos[i * 3]     += v[i * 3];
      pos[i * 3 + 1] += v[i * 3 + 1];
      pos[i * 3 + 2] += v[i * 3 + 2];
      const d = Math.sqrt(pos[i * 3] ** 2 + pos[i * 3 + 1] ** 2 + pos[i * 3 + 2] ** 2);
      if (d > 7 || d < 2.5) { v[i * 3] *= -1; v[i * 3 + 1] *= -1; v[i * 3 + 2] *= -1; }
    }
    ref.current.geometry.attributes.position.needsUpdate = true;
    ref.current.rotation.y += dt * 0.02;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color"   args={[colors, 3]}    />
      </bufferGeometry>
      <pointsMaterial size={0.028} vertexColors transparent opacity={0.55} sizeAttenuation />
    </points>
  );
}

// ── Main sign ──────────────────────────────────────────────────────────────
function RotatingSign({ scale = 1 }: { scale?: number }) {
  const groupRef = useRef<THREE.Group>(null);
  const tiltRef  = useRef<THREE.Group>(null);
  const lightRef = useRef<THREE.PointLight>(null);
  const innerLightRef = useRef<THREE.PointLight>(null);
  const mouse  = useRef({ x: 0, y: 0 });
  const tiltX  = useRef(0);
  const tiltZ  = useRef(0);
  const pulseT = useRef(0);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mouse.current.x = (e.clientX / window.innerWidth - 0.5) * 2;
      mouse.current.y = -(e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  const textures = useMemo(() => FACE_DATA.map(createFaceTexture), []);

  // Wide landscape sign: 3.8 × 1.5 × 0.42 (Leuchtkasten proportions)
  const SW = 3.8, SH = 1.5, SD = 0.42, FW = 0.07;

  const signBodyMats = useMemo(() => {
    // Faces glow warm-white (backlit acrylic)
    const faceProp = {
      emissive: new THREE.Color("#FFFDF5"),
      emissiveIntensity: 0.45,
      roughness: 0.85,
      metalness: 0.0,
    };
    const topBot = new THREE.MeshStandardMaterial({
      color: FRAME_DARK,
      metalness: 0.88,
      roughness: 0.18,
    });
    return [
      new THREE.MeshStandardMaterial({ map: textures[3], ...faceProp }), // +x right (90°)
      new THREE.MeshStandardMaterial({ map: textures[1], ...faceProp }), // -x left  (270°)
      topBot,                                                              // +y top
      topBot,                                                              // -y bottom
      new THREE.MeshStandardMaterial({ map: textures[0], ...faceProp }), // +z front (0°)
      new THREE.MeshStandardMaterial({ map: textures[2], ...faceProp }), // -z back  (180°)
    ];
  }, [textures]);

  useFrame((_, dt) => {
    if (!groupRef.current || !tiltRef.current) return;
    pulseT.current += dt;

    // Variable-speed rotation: slows smoothly near each 90° face
    const y     = groupRef.current.rotation.y;
    const phase = ((y % (Math.PI / 2)) + Math.PI / 2) % (Math.PI / 2);
    const dist  = Math.min(phase, Math.PI / 2 - phase) / (Math.PI / 4);
    groupRef.current.rotation.y += dt * (0.22 + dist * 0.85);

    // Fill light follows front face
    if (lightRef.current) {
      lightRef.current.position.x = Math.sin(y) * 4.0;
      lightRef.current.position.z = Math.cos(y) * 4.0;
    }

    // Subtle breathing of interior backlight
    if (innerLightRef.current) {
      innerLightRef.current.intensity = 1.6 + Math.sin(pulseT.current * 0.8) * 0.18;
    }

    // Mouse-driven parallax tilt
    tiltX.current = THREE.MathUtils.lerp(tiltX.current, mouse.current.y * 0.13, 0.05);
    tiltZ.current = THREE.MathUtils.lerp(tiltZ.current, -mouse.current.x * 0.07, 0.05);
    tiltRef.current.rotation.x = tiltX.current;
    tiltRef.current.rotation.z = tiltZ.current;
  });

  return (
    <Float speed={1.2} rotationIntensity={0} floatIntensity={0.4} floatingRange={[-0.15, 0.15]}>
      <group ref={groupRef} scale={scale}>

        {/* Warm fill light that follows the lit face outward */}
        <pointLight ref={lightRef} position={[0, 0, 4.0]} intensity={1.4} color="#FFF8F0" distance={9} />

        {/* Interior backlight — subtle breathing pulse */}
        <pointLight ref={innerLightRef} position={[0, 0, 0]} intensity={1.6} color="#FFF5E8" distance={2} />

        <group ref={tiltRef}>

          {/* ── Sign cabinet face ── */}
          <mesh material={signBodyMats} castShadow receiveShadow>
            <boxGeometry args={[SW, SH, SD]} />
          </mesh>

          {/* ── Aluminium frame — 4 bars ── */}
          {/* Top */}
          <mesh position={[0, SH / 2 + FW / 2, 0]} castShadow>
            <boxGeometry args={[SW + FW * 2, FW, SD + FW * 2]} />
            <meshStandardMaterial color={FRAME_DARK} metalness={0.94} roughness={0.08} />
          </mesh>
          {/* Bottom */}
          <mesh position={[0, -SH / 2 - FW / 2, 0]} castShadow>
            <boxGeometry args={[SW + FW * 2, FW, SD + FW * 2]} />
            <meshStandardMaterial color={FRAME_DARK} metalness={0.94} roughness={0.08} />
          </mesh>
          {/* Left */}
          <mesh position={[-SW / 2 - FW / 2, 0, 0]} castShadow>
            <boxGeometry args={[FW, SH, SD + FW * 2]} />
            <meshStandardMaterial color={FRAME_DARK} metalness={0.94} roughness={0.08} />
          </mesh>
          {/* Right */}
          <mesh position={[SW / 2 + FW / 2, 0, 0]} castShadow>
            <boxGeometry args={[FW, SH, SD + FW * 2]} />
            <meshStandardMaterial color={FRAME_DARK} metalness={0.94} roughness={0.08} />
          </mesh>

          {/* ── Corner hex-bolts ── */}
          {([
            [-SW / 2 - FW / 2,  SH / 2 + FW / 2],
            [ SW / 2 + FW / 2,  SH / 2 + FW / 2],
            [-SW / 2 - FW / 2, -SH / 2 - FW / 2],
            [ SW / 2 + FW / 2, -SH / 2 - FW / 2],
          ] as [number, number][]).map(([bx, by], i) => (
            <mesh key={i} position={[bx, by, SD / 2 + FW / 2 + 0.015]} rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.042, 0.042, 0.035, 6]} />
              <meshStandardMaterial color="#555" metalness={1} roughness={0.04} />
            </mesh>
          ))}

          {/* ── LED glow strip — bottom edge ── */}
          <mesh position={[0, -SH / 2 - FW - 0.018, 0]}>
            <boxGeometry args={[SW * 0.9, 0.022, 0.05]} />
            <meshStandardMaterial color={BRAND_RED} emissive={BRAND_RED} emissiveIntensity={6} transparent opacity={0.9} />
          </mesh>
          {/* ── LED glow strip — top edge ── */}
          <mesh position={[0, SH / 2 + FW + 0.018, 0]}>
            <boxGeometry args={[SW * 0.9, 0.022, 0.05]} />
            <meshStandardMaterial color={BRAND_RED} emissive={BRAND_RED} emissiveIntensity={6} transparent opacity={0.9} />
          </mesh>

          {/* ── Wall mounting bracket (L-arm, visible from side) ── */}
          {/* Vertical back plate */}
          <mesh position={[0, 0, -SD / 2 - 0.12]} castShadow>
            <boxGeometry args={[SW * 0.4, SH * 0.7, 0.06]} />
            <meshStandardMaterial color={FRAME_MID} metalness={0.9} roughness={0.15} />
          </mesh>
          {/* Horizontal arm connecting plate to sign */}
          <mesh position={[0, 0, -SD / 2 - 0.06]} castShadow>
            <boxGeometry args={[SW * 0.35, 0.055, 0.18]} />
            <meshStandardMaterial color={FRAME_MID} metalness={0.9} roughness={0.15} />
          </mesh>

          {/* ── Mounting screws on bracket ── */}
          {([-SW * 0.15, SW * 0.15] as number[]).map((bx, i) => (
            <mesh key={i} position={[bx, 0, -SD / 2 - 0.16]} rotation={[0, 0, 0]}>
              <cylinderGeometry args={[0.028, 0.028, 0.04, 8]} />
              <meshStandardMaterial color="#666" metalness={1} roughness={0.06} />
            </mesh>
          ))}

        </group>
      </group>
    </Float>
  );
}

// ── Scene ──────────────────────────────────────────────────────────────────
function Scene({ scale = 1, mini = false }: { scale?: number; mini?: boolean }) {
  return (
    <>
      <ambientLight intensity={0.22} />
      <directionalLight position={[5, 7, 5]}  intensity={0.55} castShadow shadow-mapSize={[2048, 2048]} />
      <pointLight       position={[-5, 2, 4]}  intensity={0.25} color="#ffffff" />
      <pointLight       position={[4, -2, -3]} intensity={0.18} color="#ffffff" />

      <RotatingSign scale={scale} />

      {/* A handful of subtle ambient particles — no rings */}
      {!mini && <Particles />}

      <ContactShadows
        position={[0, -1.5, 0]}
        opacity={0.45}
        scale={14}
        blur={4}
        far={5}
        color={BRAND_RED}
      />

      <Environment preset="warehouse" />

      {/* Bloom: gentle — makes face glow & LED strips shine */}
      <EffectComposer>
        <Bloom intensity={1.1} luminanceThreshold={0.6} luminanceSmoothing={0.9} height={350} />
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
          camera={{ position: [0, 0.2, 5.8], fov: 40 }}
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
          camera={{ position: [0, 0.1, 5.0], fov: 40 }}
          dpr={[1, 1.5]}
          gl={{ antialias: true, alpha: true }}
          style={{ background: "transparent" }}
        >
          <Scene scale={0.6} mini />
        </Canvas>
      </Suspense>
    </div>
  );
}
