import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, ChevronDown, CheckCircle2, Clock } from "lucide-react";
import { Link } from "react-router-dom";
import heroUpload from "@/assets/hero-upload.jpg";
import InquiryFunnel from "./InquiryFunnel";

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

export default function HeroSection() {
  const [funnelOpen, setFunnelOpen] = useState(false);

  return (
    <section className="relative min-h-screen flex flex-col overflow-hidden">
      {/* Background image — darkened */}
      <div className="absolute inset-0">
        <img
          src={heroUpload}
          alt=""
          className="w-full h-full object-cover brightness-[0.35]"
          loading="eager"
        />
        <div className="absolute inset-0 bg-background/40" />
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 70% 60% at 50% 50%, rgba(192,57,43,0.06) 0%, transparent 70%)",
          }}
        />
      </div>

      {/* Main content */}
      <div className="relative z-10 flex-1 flex items-center">
        <div className="max-w-7xl mx-auto px-6 w-full pt-28 pb-16">
          <div className="max-w-2xl space-y-8">
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
              <h1
                className="font-heading font-black leading-[1.03] tracking-tight"
                style={{ fontSize: "clamp(3rem, 7vw, 5.5rem)" }}
              >
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
              {/* Funnel CTA */}
              <button
                onClick={() => setFunnelOpen(true)}
                className="group inline-flex items-center gap-2.5 px-7 py-4 bg-primary text-primary-foreground font-bold rounded-xl text-base hover:bg-primary/90 transition-all duration-300 hover:shadow-2xl hover:shadow-primary/30 hover:-translate-y-0.5"
              >
                <Clock className="w-4 h-4" />
                In 60 Sekunden anfragen
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
              <a
                href="#leistungen"
                className="inline-flex items-center px-7 py-4 border border-foreground/15 text-foreground/80 font-bold rounded-xl text-base hover:border-primary/50 hover:text-primary hover:bg-primary/[0.05] transition-all duration-300"
              >
                Leistungen entdecken
              </a>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.72 }}
              className="flex gap-10 pt-4 border-t border-foreground/[0.08]"
            >
              {[
                { n: "20+", l: "Jahre Erfahrung" },
                { n: "1.000+", l: "Projekte" },
                { n: "100%", l: "Inhouse-Produktion" },
              ].map(({ n, l }) => (
                <div key={l}>
                  <div className="text-3xl font-black text-foreground">{n}</div>
                  <div className="text-xs text-muted-foreground mt-0.5">{l}</div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>

      {/* Scrolling service ticker */}
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
        <span className="text-[10px] text-muted-foreground/35 tracking-[0.28em] uppercase">Scroll</span>
        <motion.div
          animate={{ y: [0, 5, 0] }}
          transition={{ duration: 1.7, repeat: Infinity, ease: "easeInOut" }}
        >
          <ChevronDown className="w-4 h-4 text-muted-foreground/30" />
        </motion.div>
      </motion.div>

      {/* Funnel Modal */}
      <InquiryFunnel open={funnelOpen} onClose={() => setFunnelOpen(false)} />
    </section>
  );
}
