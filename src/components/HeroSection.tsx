import { motion } from "framer-motion";
import { ChevronDown, ArrowRight } from "lucide-react";
import { HeroSign3D } from "./Sign3D";
import { Link } from "react-router-dom";

const serviceChips = ["Werbetechnik", "Car Wrapping", "Textilien & Druck", "Webdesign", "Sonnenschutz", "Messebau"];

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">

      {/* Animated CSS grid background */}
      <div className="absolute inset-0 hero-grid pointer-events-none" />

      {/* Radial red glow behind sign area */}
      <div className="absolute top-1/2 right-[20%] -translate-y-1/2 w-[700px] h-[700px] rounded-full bg-primary/6 blur-[140px] pointer-events-none" />

      {/* Scanline beam — sweeps top → bottom */}
      <motion.div
        className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/35 to-transparent pointer-events-none"
        initial={{ top: "5%" }}
        animate={{ top: "95%" }}
        transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
      />

      {/* Drifting background particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 22 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-0.5 h-0.5 rounded-full bg-primary/50"
            initial={{ x: `${Math.random() * 100}%`, y: `${Math.random() * 100}%`, opacity: 0 }}
            animate={{
              y: [`${Math.random() * 100}%`, `${Math.random() * 100}%`],
              opacity: [0, 0.7, 0],
            }}
            transition={{ duration: 10 + Math.random() * 10, repeat: Infinity, delay: Math.random() * 8 }}
          />
        ))}
      </div>

      {/* Main content grid */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 w-full grid lg:grid-cols-2 gap-6 items-center pt-20">

        {/* ── Left: copy ── */}
        <div className="order-2 lg:order-1 space-y-7">

          {/* Location chip */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-primary/30 bg-primary/10"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            <span className="text-xs font-medium text-primary tracking-widest uppercase">
              Full-Service Werbetechnik · Deizisau bei Stuttgart
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-5xl sm:text-6xl lg:text-7xl xl:text-[82px] font-heading font-black leading-[1.04] tracking-tight"
          >
            Wir machen{" "}
            <br className="hidden sm:block" />
            Sie{" "}
            <span className="relative inline-block">
              <span className="text-gradient-red">sichtbar</span>
              <motion.span
                className="absolute -bottom-1 left-0 right-0 h-[3px] bg-primary rounded-full origin-left"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.9, delay: 1.1 }}
              />
            </span>
            <span className="text-primary">.</span>
          </motion.h1>

          {/* Sub-copy */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.5 }}
            className="text-base md:text-lg text-muted-foreground max-w-md leading-relaxed"
          >
            Schilder. Fahrzeuge. Textilien. Webdesign.{" "}
            <span className="text-foreground/80 font-medium">Alles aus einer Hand</span>{" "}
            — direkt vor den Toren Stuttgarts.
          </motion.p>

          {/* Service chips */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.65 }}
            className="flex flex-wrap gap-2"
          >
            {serviceChips.map((s) => (
              <span
                key={s}
                className="px-3 py-1 text-xs font-medium border border-foreground/10 rounded-full text-muted-foreground bg-foreground/[0.03] hover:border-primary/40 hover:text-primary/80 transition-colors duration-200"
              >
                {s}
              </span>
            ))}
          </motion.div>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="flex flex-wrap gap-3"
          >
            <a
              href="#leistungen"
              className="group flex items-center gap-2 px-6 py-3.5 bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-primary/90 transition-all duration-300 hover:shadow-2xl hover:shadow-primary/30 hover:-translate-y-0.5"
            >
              Leistungen entdecken
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
            </a>
            <Link
              to="/kontakt"
              className="px-6 py-3.5 border border-foreground/15 text-foreground/80 font-semibold rounded-lg hover:border-primary/60 hover:text-primary hover:bg-primary/5 transition-all duration-300"
            >
              Anfrage stellen
            </Link>
          </motion.div>

          {/* Mini stats */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.1 }}
            className="flex gap-8 pt-1"
          >
            {[
              { n: "20+", l: "Jahre Erfahrung" },
              { n: "6",   l: "Leistungsbereiche" },
              { n: "100%", l: "Inhouse-Produktion" },
            ].map(({ n, l }) => (
              <div key={l}>
                <div className="text-2xl font-black text-foreground">{n}</div>
                <div className="text-xs text-muted-foreground">{l}</div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* ── Right: 3D sign ── */}
        <motion.div
          initial={{ opacity: 0, scale: 0.85, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="order-1 lg:order-2 h-[420px] sm:h-[500px] lg:h-[640px] relative"
        >
          <HeroSign3D />

          {/* Decorative corner accents */}
          <div className="absolute top-4 left-4 w-8 h-8 border-t-2 border-l-2 border-primary/35 rounded-tl pointer-events-none" />
          <div className="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 border-primary/35 rounded-tr pointer-events-none" />
          <div className="absolute bottom-4 left-4 w-8 h-8 border-b-2 border-l-2 border-primary/35 rounded-bl pointer-events-none" />
          <div className="absolute bottom-4 right-4 w-8 h-8 border-b-2 border-r-2 border-primary/35 rounded-br pointer-events-none" />

          {/* Face label badge — updates as sign rotates */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-[10px] tracking-[0.22em] text-primary/50 uppercase font-medium pointer-events-none">
            Wir zeigen alles was wir können
          </div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.8 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="text-[10px] text-muted-foreground/50 tracking-[0.25em] uppercase">Scroll</span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
        >
          <ChevronDown className="w-4 h-4 text-muted-foreground/40" />
        </motion.div>
      </motion.div>
    </section>
  );
}
