import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  ChevronDown,
  CheckCircle2,
  Layers,
  Car,
  Package,
  Globe,
  Sun,
  LayoutGrid,
} from "lucide-react";
import { Link } from "react-router-dom";

// ── Service data ────────────────────────────────────────────────────────────
const SERVICES = [
  {
    label: "Werbetechnik",
    sub:   "Schilder · Pylone · 3D-Buchstaben · Leuchtreklame",
    Icon:  Layers,
  },
  {
    label: "Fahrzeug­beschriftung",
    sub:   "Car Wrapping · Vollfolierung · Flottenbeschriftung",
    Icon:  Car,
  },
  {
    label: "Textilien & Druck",
    sub:   "Stickerei · Siebdruck · Berufs- & Sportkleidung",
    Icon:  Package,
  },
  {
    label: "Webdesign & Print",
    sub:   "Logos · Websites · Flyer · Geschäftsausstattung",
    Icon:  Globe,
  },
  {
    label: "Sonnenschutz",
    sub:   "Sichtschutzfolien · Dekorfolien · Sandstrahloptik",
    Icon:  Sun,
  },
  {
    label: "Messebau",
    sub:   "Messewände · Roll-ups · Pop-up Displays",
    Icon:  LayoutGrid,
  },
];

const CHECKS = [
  "Schilder & Leuchtreklame",
  "Car Wrapping & Folierung",
  "Textilien & Stickerei",
  "Webdesign & Print",
  "Sonnenschutzfolien",
  "Messebau & Roll-ups",
];

const TICKER = [
  "Werbetechnik", "Car Wrapping", "3D-Buchstaben", "Textilien",
  "Webdesign", "Pylone", "Sonnenschutz", "Messebau",
  "Stickerei", "Leuchtreklame", "Siebdruck", "Logodesign",
];

// ── CSS Leuchtkasten sign — no Three.js ────────────────────────────────────
function SignShowcase() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setActive((p) => (p + 1) % SERVICES.length), 3200);
    return () => clearInterval(t);
  }, []);

  const { label, sub, Icon } = SERVICES[active];

  return (
    <div className="flex flex-col items-center gap-5">

      {/* Outer Kasten — dark display panel */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
        className="relative w-full rounded-2xl overflow-visible"
        style={{
          background: "#0d0d0d",
          padding: "10px",
          boxShadow:
            "0 0 80px rgba(229,28,32,0.13), 0 50px 100px rgba(0,0,0,0.65), inset 0 0 0 1px rgba(255,255,255,0.04)",
          borderRadius: "16px",
        }}
      >
        {/* Red glow edges */}
        <div
          className="absolute top-0 left-[12%] right-[12%] h-px"
          style={{
            background:
              "linear-gradient(90deg, transparent, rgba(229,28,32,0.6), transparent)",
          }}
        />
        <div
          className="absolute bottom-0 left-[12%] right-[12%] h-px"
          style={{
            background:
              "linear-gradient(90deg, transparent, rgba(229,28,32,0.6), transparent)",
          }}
        />

        {/* Corner screw details (decorative) */}
        {[["top-2.5 left-2.5"], ["top-2.5 right-2.5"], ["bottom-2.5 left-2.5"], ["bottom-2.5 right-2.5"]].map(
          ([pos], i) => (
            <div
              key={i}
              className={`absolute ${pos} w-2 h-2 rounded-full`}
              style={{ background: "#2a2a2a", border: "1px solid #3a3a3a" }}
            />
          ),
        )}

        {/* ── Sign face ─────────────────────────────────────────────────── */}
        <div
          className="rounded-xl overflow-hidden"
          style={{
            background: "#F0F0F0",
            boxShadow: "inset 0 0 60px rgba(255,255,255,0.22)",
          }}
        >
          {/* Red header band */}
          <div
            className="flex items-center justify-between px-5 sm:px-7 py-3.5"
            style={{ background: "#E51C20" }}
          >
            <span
              className="font-black text-white tracking-tight"
              style={{ fontSize: "clamp(1rem, 2.5vw, 1.35rem)" }}
            >
              SJ DESIGN
            </span>
            <span className="text-white/65 text-xs font-medium tracking-widest uppercase hidden sm:block">
              Werbetechnik · Deizisau
            </span>
          </div>

          {/* Animated content */}
          <div className="relative px-6 sm:px-8 py-8 overflow-hidden min-h-[148px] flex items-center">
            {/* Left accent strip */}
            <div
              className="absolute left-0 top-0 bottom-0 w-[4px]"
              style={{ background: "#E51C20" }}
            />

            <AnimatePresence mode="wait">
              <motion.div
                key={active}
                initial={{ opacity: 0, x: 18 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -18 }}
                transition={{ duration: 0.38, ease: "easeInOut" }}
                className="flex items-center gap-5 pl-4 w-full"
              >
                {/* Icon badge */}
                <div
                  className="flex-shrink-0 w-14 h-14 rounded-xl flex items-center justify-center"
                  style={{ background: "rgba(229,28,32,0.1)" }}
                >
                  <Icon className="w-7 h-7" style={{ color: "#E51C20" }} />
                </div>

                {/* Text */}
                <div className="min-w-0">
                  <h3
                    className="font-black leading-tight text-gray-900"
                    style={{ fontSize: "clamp(1.15rem, 2.8vw, 1.65rem)" }}
                  >
                    {label}
                  </h3>
                  <p className="text-sm mt-1.5 text-gray-500 truncate">{sub}</p>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Bottom red bar */}
          <div className="h-2.5" style={{ background: "#E51C20" }} />
        </div>
      </motion.div>

      {/* Progress dots */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="flex items-center gap-2"
      >
        {SERVICES.map((_, i) => (
          <button
            key={i}
            onClick={() => setActive(i)}
            aria-label={`Service ${i + 1}`}
            className="rounded-full transition-all duration-350"
            style={{
              width:      i === active ? "22px" : "6px",
              height:     "6px",
              background: i === active ? "#E51C20" : "rgba(255,255,255,0.18)",
            }}
          />
        ))}
      </motion.div>
    </div>
  );
}

// ── Hero section ───────────────────────────────────────────────────────────
export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex flex-col overflow-hidden">

      {/* Background: CSS grid + radial blob */}
      <div className="absolute inset-0 hero-grid pointer-events-none" />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 70% 60% at 65% 50%, rgba(229,28,32,0.055) 0%, transparent 70%)",
        }}
      />

      {/* Main content */}
      <div className="relative z-10 flex-1 flex items-center">
        <div className="max-w-7xl mx-auto px-6 w-full grid lg:grid-cols-[1.1fr_0.9fr] gap-12 xl:gap-16 items-center pt-28 pb-16">

          {/* ── Left: copy ── */}
          <div className="space-y-8 order-2 lg:order-1">

            {/* Location badge */}
            <motion.div
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-primary/30 bg-primary/[0.08]"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              <span className="text-xs font-semibold text-primary tracking-widest uppercase">
                Full-Service Werbetechnik · Seit über 20 Jahren
              </span>
            </motion.div>

            {/* Headline */}
            <motion.div
              initial={{ opacity: 0, y: 32 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
            >
              <h1 className="font-heading font-black leading-[1.03] tracking-tight"
                  style={{ fontSize: "clamp(3rem, 7vw, 5.5rem)" }}>
                Wir machen
                <br />
                Sie{" "}
                <span className="relative inline-block">
                  <span className="text-gradient-red">sichtbar</span>
                  <motion.span
                    className="absolute -bottom-1 left-0 right-0 h-[3px] bg-primary rounded-full"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 0.85, delay: 0.95, ease: "easeOut" }}
                    style={{ originX: 0 }}
                  />
                </span>
                <span className="text-primary">.</span>
              </h1>
            </motion.div>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="text-base md:text-lg text-muted-foreground max-w-md leading-relaxed"
            >
              Ihr Partner für Werbetechnik in der Region Stuttgart. Von der Idee
              bis zur fertigen Montage —{" "}
              <span className="text-foreground/80 font-medium">alles aus einer Hand.</span>
            </motion.p>

            {/* Checklist */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.42 }}
              className="grid grid-cols-1 sm:grid-cols-2 gap-y-2.5 gap-x-4"
            >
              {CHECKS.map((s, i) => (
                <motion.div
                  key={s}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.42 + i * 0.07 }}
                  className="flex items-center gap-2.5"
                >
                  <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0" />
                  <span className="text-sm text-muted-foreground">{s}</span>
                </motion.div>
              ))}
            </motion.div>

            {/* CTA buttons */}
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.55 }}
              className="flex flex-wrap gap-3 pt-1"
            >
              <a
                href="#leistungen"
                className="group inline-flex items-center gap-2 px-7 py-4 bg-primary text-primary-foreground font-bold rounded-xl text-base hover:bg-primary/90 transition-all duration-300 hover:shadow-2xl hover:shadow-primary/30 hover:-translate-y-0.5"
              >
                Leistungen entdecken
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </a>
              <Link
                to="/kontakt"
                className="inline-flex items-center px-7 py-4 border border-foreground/15 text-foreground/80 font-bold rounded-xl text-base hover:border-primary/50 hover:text-primary hover:bg-primary/[0.05] transition-all duration-300"
              >
                Jetzt anfragen
              </Link>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.72 }}
              className="flex gap-10 pt-4 border-t border-foreground/[0.08]"
            >
              {[
                { n: "20+",    l: "Jahre Erfahrung" },
                { n: "1.000+", l: "Projekte" },
                { n: "100%",   l: "Inhouse-Produktion" },
              ].map(({ n, l }) => (
                <div key={l}>
                  <div className="text-3xl font-black text-foreground">{n}</div>
                  <div className="text-xs text-muted-foreground mt-0.5">{l}</div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* ── Right: CSS sign showcase ── */}
          <div className="order-1 lg:order-2">
            <SignShowcase />
          </div>
        </div>
      </div>

      {/* ── Scrolling service ticker ── */}
      <div className="relative z-10 border-t border-foreground/[0.07] py-4 overflow-hidden">
        <motion.div
          animate={{ x: ["0%", "-50%"] }}
          transition={{ duration: 28, repeat: Infinity, ease: "linear" }}
          className="flex gap-0 min-w-max"
        >
          {[...TICKER, ...TICKER].map((chip, i) => (
            <span
              key={i}
              className="text-[11px] font-semibold text-muted-foreground/40 uppercase tracking-[0.18em] px-6"
            >
              {chip}
              <span className="ml-6 text-primary/30">·</span>
            </span>
          ))}
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6 }}
        className="absolute bottom-16 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 pointer-events-none"
      >
        <span className="text-[10px] text-muted-foreground/35 tracking-[0.28em] uppercase">
          Scroll
        </span>
        <motion.div
          animate={{ y: [0, 5, 0] }}
          transition={{ duration: 1.7, repeat: Infinity, ease: "easeInOut" }}
        >
          <ChevronDown className="w-4 h-4 text-muted-foreground/30" />
        </motion.div>
      </motion.div>
    </section>
  );
}
