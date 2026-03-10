import { useRef, useMemo, Suspense, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Environment, ContactShadows, RoundedBox } from "@react-three/drei";
import { EffectComposer, Bloom, Vignette } from "@react-three/postprocessing";
import * as THREE from "three";

// ── Brand constants ────────────────────────────────────────────────────────
const BRAND_RED  = "#E51C20";
const FRAME_DARK = "#1c1c1c";
const FRAME_MID  = "#282828";
const FACE_BG    = "#F0F0F0";

// ── Sign dimensions (landscape Leuchtkasten) ───────────────────────────────
const SW = 3.8, SH = 1.5, SD = 0.42;

// ── Face data ──────────────────────────────────────────────────────────────
const FACE_DATA = [
  { label: "Werbetechnik",         sub: "Schilder · Pylone · 3D-Buchstaben · LED",    icon: "sign"   },
  { label: "Fahrzeug-\nbeschriftung", sub: "Car Wrapping · Folie · Flottenbeschriftung", icon: "car"  },
  { label: "Textilien & Druck",    sub: "Stick · Siebdruck · Arbeitskleidung",          icon: "shirt" },
  { label: "Webdesign & Print",    sub: "Logos · Websites · Werbemittel",               icon: "screen"},
] as const;

type IconType = "sign" | "car" | "shirt" | "screen";

// ── Icon drawing (red on light background) ─────────────────────────────────
function drawIcon(ctx: CanvasRenderingContext2D, icon: IconType, cx: number, cy: number, size: number) {
  ctx.save();
  ctx.strokeStyle = BRAND_RED;
  ctx.lineWidth   = size * 0.06;
  ctx.lineCap     = "round";
  ctx.lineJoin    = "round";

  switch (icon) {
    case "sign": {
      const w = size * 0.78, h = size * 0.52;
      ctx.strokeRect(cx - w / 2, cy - h / 2, w, h);
      ctx.beginPath(); ctx.moveTo(cx, cy - h / 2); ctx.lineTo(cx, cy - h / 2 - size * 0.22); ctx.stroke();
      for (let i = 0; i < 5; i++) {
        ctx.fillStyle = BRAND_RED;
        ctx.beginPath();
        ctx.arc(cx - w * 0.4 + i * w * 0.2, cy + h / 2 + size * 0.1, size * 0.033, 0, Math.PI * 2);
        ctx.fill();
      }
      break;
    }
    case "car": {
      const w = size * 0.84;
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
      ctx.closePath(); ctx.stroke();
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
      ctx.stroke(); break;
    }
    case "screen": {
      const w = size * 0.76, mh = size * 0.5;
      ctx.strokeRect(cx - w / 2, cy - mh / 2 - size * 0.05, w, mh);
      ctx.beginPath();
      ctx.moveTo(cx, cy + mh / 2 - size * 0.05); ctx.lineTo(cx, cy + size * 0.36);
      ctx.moveTo(cx - w * 0.24, cy + size * 0.36); ctx.lineTo(cx + w * 0.24, cy + size * 0.36);
      ctx.stroke();
      ctx.lineWidth = size * 0.028;
      const iy = cy - mh / 2 - size * 0.05 + size * 0.07;
      const ix = cx - w / 2 + size * 0.07;
      [0, 1, 2].forEach(i => {
        ctx.beginPath();
        ctx.moveTo(ix, iy + i * size * 0.1);
        ctx.lineTo(ix + (i === 2 ? (w - size * 0.14) * 0.55 : w - size * 0.14), iy + i * size * 0.1);
        ctx.stroke();
      }); break;
    }
  }
  ctx.restore();
}

// ── Face texture — backlit acrylic sign face ───────────────────────────────
function createFaceTexture(data: { label: string; sub: string; icon: IconType }): THREE.CanvasTexture {
  const W = 1900, H = 750;
  const canvas = document.createElement("canvas");
  canvas.width = W; canvas.height = H;
  const ctx = canvas.getContext("2d")!;

  // Off-white acrylic
  ctx.fillStyle = FACE_BG; ctx.fillRect(0, 0, W, H);

  // Backlight centre glow
  const glow = ctx.createRadialGradient(W / 2, H / 2, 0, W / 2, H / 2, W * 0.5);
  glow.addColorStop(0, "rgba(255,255,255,0.5)");
  glow.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = glow; ctx.fillRect(0, 0, W, H);

  // Red header band
  const hH = H * 0.2;
  ctx.fillStyle = BRAND_RED; ctx.fillRect(0, 0, W, hH);

  // "SJ DESIGN" in header
  ctx.textAlign = "left"; ctx.textBaseline = "middle";
  ctx.fillStyle = "#FFFFFF";
  ctx.font = `800 ${Math.round(hH * 0.52)}px Montserrat, Arial Black, sans-serif`;
  ctx.fillText("SJ DESIGN", W * 0.032, hH / 2);

  // Tagline right in header
  ctx.font = `400 ${Math.round(hH * 0.23)}px Inter, Arial, sans-serif`;
  ctx.fillStyle = "rgba(255,255,255,0.7)"; ctx.textAlign = "right";
  ctx.fillText("Werbetechnik · Deizisau bei Stuttgart", W * 0.972, hH / 2);

  // Divider below header
  ctx.fillStyle = "rgba(0,0,0,0.06)"; ctx.fillRect(0, hH, W, 2);

  // Icon (right column)
  const contentCY = hH + (H - hH) / 2;
  drawIcon(ctx, data.icon, W * 0.855, contentCY, Math.min(H - hH, W * 0.14) * 0.88);

  // Service label
  const lines = data.label.split("\n");
  const fz = lines.length > 1 ? Math.round((H - hH) * 0.28) : Math.round((H - hH) * 0.34);
  ctx.font = `900 ${fz}px Montserrat, Arial Black, sans-serif`;
  ctx.fillStyle = "#1a1a1a"; ctx.textAlign = "left"; ctx.textBaseline = "middle";
  const lh = fz * 1.12;
  const labelY = contentCY - (H - hH) * 0.1 - ((lines.length - 1) * lh) / 2;
  lines.forEach((line, i) => ctx.fillText(line, W * 0.038, labelY + i * lh));

  // Sub-text
  const subFz = Math.round((H - hH) * 0.085);
  ctx.font = `400 ${subFz}px Inter, Arial, sans-serif`;
  ctx.fillStyle = "#777";
  const subY = lines.length > 1 ? labelY + (lines.length - 1) * lh + fz * 0.62 : labelY + fz * 0.68;
  ctx.fillText(data.sub, W * 0.038, subY);

  // Left edge red accent strip
  ctx.fillStyle = BRAND_RED; ctx.fillRect(0, hH + 2, 5, H - hH - 2);

  // Bottom red bar
  ctx.fillStyle = BRAND_RED; ctx.fillRect(0, H - 10, W, 10);

  // Outer border
  ctx.strokeStyle = "rgba(0,0,0,0.1)"; ctx.lineWidth = 3;
  ctx.strokeRect(1.5, 1.5, W - 3, H - 3);

  const tex = new THREE.CanvasTexture(canvas);
  tex.needsUpdate = true;
  return tex;
}

// ── Background display Kasten (fixed, doesn't rotate) ─────────────────────
function BackKasten() {
  const PW = SW + 1.6, PH = SH + 0.8, PD = 0.055;
  const Z  = -SD / 2 - 0.52;
  const GLOW_ALPHA = 0.45;

  return (
    <group position={[0, 0, Z]}>

      {/* Main dark panel */}
      <RoundedBox args={[PW, PH, PD]} radius={0.06} smoothness={4} receiveShadow>
        <meshStandardMaterial color="#0d0d0d" metalness={0.18} roughness={0.82} />
      </RoundedBox>

      {/* Subtle inner shadow/vignette plane on front face */}
      <mesh position={[0, 0, PD / 2 + 0.001]}>
        <planeGeometry args={[PW, PH]} />
        <meshBasicMaterial transparent opacity={0.08} color="#000000" />
      </mesh>

      {/* ── Red glow edges — top & bottom only (clean look) ── */}
      {/* Top edge */}
      <mesh position={[0, PH / 2 + 0.001, PD / 2]}>
        <boxGeometry args={[PW * 0.88, 0.014, 0.014]} />
        <meshStandardMaterial color={BRAND_RED} emissive={BRAND_RED} emissiveIntensity={3} transparent opacity={GLOW_ALPHA} />
      </mesh>
      {/* Bottom edge */}
      <mesh position={[0, -PH / 2 - 0.001, PD / 2]}>
        <boxGeometry args={[PW * 0.88, 0.014, 0.014]} />
        <meshStandardMaterial color={BRAND_RED} emissive={BRAND_RED} emissiveIntensity={3} transparent opacity={GLOW_ALPHA} />
      </mesh>

      {/* Subtle red point light from the panel glow */}
      <pointLight position={[0, 0, PD / 2 + 0.2]} intensity={0.35} color={BRAND_RED} distance={3.5} />
    </group>
  );
}

// ── Rotating sign ─────────────────────────────────────────────────────────
function RotatingSign({ scale = 1 }: { scale?: number }) {
  const groupRef = useRef<THREE.Group>(null);
  const tiltRef  = useRef<THREE.Group>(null);
  const lightRef = useRef<THREE.PointLight>(null);
  const innerRef = useRef<THREE.PointLight>(null);
  const mouse    = useRef({ x: 0, y: 0 });
  const tiltX    = useRef(0);
  const tiltZ    = useRef(0);
  const time     = useRef(0);

  useEffect(() => {
    const fn = (e: MouseEvent) => {
      mouse.current.x = (e.clientX / window.innerWidth - 0.5) * 2;
      mouse.current.y = -(e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener("mousemove", fn);
    return () => window.removeEventListener("mousemove", fn);
  }, []);

  const textures = useMemo(() => FACE_DATA.map(createFaceTexture), []);

  const FW = 0.07;
  const signBodyMats = useMemo(() => {
    const fp = { emissive: new THREE.Color("#FFFDF5"), emissiveIntensity: 0.38, roughness: 0.82, metalness: 0.0 };
    const tb = new THREE.MeshStandardMaterial({ color: FRAME_DARK, metalness: 0.88, roughness: 0.18 });
    return [
      new THREE.MeshStandardMaterial({ map: textures[3], ...fp }), // +x
      new THREE.MeshStandardMaterial({ map: textures[1], ...fp }), // -x
      tb, tb,                                                        // top, bottom
      new THREE.MeshStandardMaterial({ map: textures[0], ...fp }), // +z front
      new THREE.MeshStandardMaterial({ map: textures[2], ...fp }), // -z back
    ];
  }, [textures]);

  useFrame((_, dt) => {
    if (!groupRef.current || !tiltRef.current) return;
    time.current += dt;

    // Smooth variable-speed rotation — slows near each face cardinal
    const y     = groupRef.current.rotation.y;
    const phase = ((y % (Math.PI / 2)) + Math.PI / 2) % (Math.PI / 2);
    const dist  = Math.min(phase, Math.PI / 2 - phase) / (Math.PI / 4);
    groupRef.current.rotation.y += dt * (0.18 + dist * 0.72);

    // Warm fill light follows lit face
    if (lightRef.current) {
      lightRef.current.position.x = Math.sin(y) * 4.0;
      lightRef.current.position.z = Math.cos(y) * 4.0;
    }

    // Gentle interior breathing
    if (innerRef.current) {
      innerRef.current.intensity = 1.4 + Math.sin(time.current * 0.7) * 0.14;
    }

    // Mouse parallax tilt — very subtle
    tiltX.current = THREE.MathUtils.lerp(tiltX.current, mouse.current.y * 0.1, 0.04);
    tiltZ.current = THREE.MathUtils.lerp(tiltZ.current, -mouse.current.x * 0.06, 0.04);
    tiltRef.current.rotation.x = tiltX.current;
    tiltRef.current.rotation.z = tiltZ.current;
  });

  return (
    <Float speed={0.8} rotationIntensity={0} floatIntensity={0.28} floatingRange={[-0.1, 0.1]}>
      <group ref={groupRef} scale={scale}>

        {/* Warm white fill light (follows front face) */}
        <pointLight ref={lightRef} position={[0, 0, 4.0]} intensity={1.2} color="#FFF8F0" distance={9} />
        {/* Interior backlight pulse */}
        <pointLight ref={innerRef} position={[0, 0, 0]} intensity={1.4} color="#FFF5E8" distance={2} />

        <group ref={tiltRef}>

          {/* ── Sign face ── */}
          <mesh material={signBodyMats} castShadow receiveShadow>
            <boxGeometry args={[SW, SH, SD]} />
          </mesh>

          {/* ── Aluminium frame ── */}
          {[
            { pos: [0,  SH / 2 + FW / 2, 0] as [number,number,number], size: [SW + FW * 2, FW, SD + FW * 2] },
            { pos: [0, -SH / 2 - FW / 2, 0] as [number,number,number], size: [SW + FW * 2, FW, SD + FW * 2] },
            { pos: [-SW / 2 - FW / 2, 0, 0] as [number,number,number], size: [FW, SH, SD + FW * 2] },
            { pos: [ SW / 2 + FW / 2, 0, 0] as [number,number,number], size: [FW, SH, SD + FW * 2] },
          ].map(({ pos, size }, i) => (
            <mesh key={i} position={pos} castShadow>
              <boxGeometry args={size as [number,number,number]} />
              <meshStandardMaterial color={FRAME_DARK} metalness={0.94} roughness={0.08} />
            </mesh>
          ))}

          {/* ── Corner bolts ── */}
          {([
            [-SW / 2 - FW / 2,  SH / 2 + FW / 2],
            [ SW / 2 + FW / 2,  SH / 2 + FW / 2],
            [-SW / 2 - FW / 2, -SH / 2 - FW / 2],
            [ SW / 2 + FW / 2, -SH / 2 - FW / 2],
          ] as [number, number][]).map(([bx, by], i) => (
            <mesh key={i} position={[bx, by, SD / 2 + FW / 2 + 0.012]} rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.04, 0.04, 0.032, 6]} />
              <meshStandardMaterial color="#4a4a4a" metalness={1} roughness={0.05} />
            </mesh>
          ))}

          {/* ── LED strips (Bloom picks these up) ── */}
          <mesh position={[0, -SH / 2 - FW - 0.016, 0]}>
            <boxGeometry args={[SW * 0.88, 0.02, 0.048]} />
            <meshStandardMaterial color={BRAND_RED} emissive={BRAND_RED} emissiveIntensity={5} transparent opacity={0.9} />
          </mesh>
          <mesh position={[0,  SH / 2 + FW + 0.016, 0]}>
            <boxGeometry args={[SW * 0.88, 0.02, 0.048]} />
            <meshStandardMaterial color={BRAND_RED} emissive={BRAND_RED} emissiveIntensity={5} transparent opacity={0.9} />
          </mesh>

          {/* ── Wall mounting bracket ── */}
          <mesh position={[0, 0, -SD / 2 - 0.12]} castShadow>
            <boxGeometry args={[SW * 0.38, SH * 0.68, 0.055]} />
            <meshStandardMaterial color={FRAME_MID} metalness={0.9} roughness={0.18} />
          </mesh>
          <mesh position={[0, 0, -SD / 2 - 0.055]}>
            <boxGeometry args={[SW * 0.32, 0.05, 0.17]} />
            <meshStandardMaterial color={FRAME_MID} metalness={0.9} roughness={0.18} />
          </mesh>

        </group>
      </group>
    </Float>
  );
}

// ── Scene ─────────────────────────────────────────────────────────────────
function Scene({ scale = 1, mini = false }: { scale?: number; mini?: boolean }) {
  return (
    <>
      {/* 3-point lighting rig */}
      <ambientLight intensity={0.2} />
      {/* Key light */}
      <directionalLight position={[4, 6, 5]}  intensity={0.6} castShadow shadow-mapSize={[2048, 2048]} />
      {/* Fill light */}
      <pointLight       position={[-5, 1, 4]}  intensity={0.22} color="#d0e8ff" />
      {/* Rim light */}
      <pointLight       position={[2, -3, -4]} intensity={0.18} color="#ffffff" />

      {/* Background display panel — fixed, doesn't rotate */}
      {!mini && <BackKasten />}

      <RotatingSign scale={scale} />

      <ContactShadows
        position={[0, -1.45, 0]}
        opacity={0.35}
        scale={12}
        blur={4.5}
        far={4}
        color={BRAND_RED}
      />

      <Environment preset="warehouse" />

      {/* Gentle bloom — face glows, LED strips shine, nothing more */}
      <EffectComposer>
        <Bloom intensity={0.9} luminanceThreshold={0.62} luminanceSmoothing={0.92} height={300} />
        <Vignette eskil={false} offset={0.35} darkness={0.65} />
      </EffectComposer>
    </>
  );
}

// ── Exports ───────────────────────────────────────────────────────────────
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
          camera={{ position: [0, 0.15, 5.8], fov: 38 }}
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
          camera={{ position: [0, 0.1, 5.2], fov: 38 }}
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
