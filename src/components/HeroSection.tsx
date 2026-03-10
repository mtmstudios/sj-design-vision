import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { HeroSign3D } from "./Sign3D";
import { Link } from "react-router-dom";

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background particles */}
      <div className="absolute inset-0 overflow-hidden">
        {Array.from({ length: 30 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 rounded-full bg-muted-foreground/20"
            initial={{
              x: `${Math.random() * 100}%`,
              y: `${Math.random() * 100}%`,
              opacity: 0,
            }}
            animate={{
              y: [`${Math.random() * 100}%`, `${Math.random() * 100}%`],
              opacity: [0, 0.5, 0],
            }}
            transition={{
              duration: 8 + Math.random() * 8,
              repeat: Infinity,
              delay: Math.random() * 5,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 w-full grid lg:grid-cols-2 gap-8 items-center pt-20">
        {/* Left: Text */}
        <div className="order-2 lg:order-1">
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-heading font-black leading-[1.1] mb-6"
          >
            Wir machen Sie{" "}
            <span className="text-gradient-red">sichtbar.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.5 }}
            className="text-lg md:text-xl text-muted-foreground mb-10 max-w-lg leading-relaxed"
          >
            Schilder. Fahrzeuge. Textilien. Webdesign. Alles aus einer Hand.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="flex flex-wrap gap-4"
          >
            <a
              href="#leistungen"
              className="px-7 py-3.5 bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-primary/90 transition-all duration-300 hover:shadow-lg hover:shadow-primary/25"
            >
              Leistungen entdecken
            </a>
            <Link
              to="/kontakt"
              className="px-7 py-3.5 border border-foreground/20 text-foreground font-semibold rounded-lg hover:border-primary hover:text-primary transition-all duration-300"
            >
              Anfrage stellen
            </Link>
          </motion.div>
        </div>

        {/* Right: 3D Sign */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="order-1 lg:order-2 h-[350px] sm:h-[400px] lg:h-[500px]"
        >
          <HeroSign3D />
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="text-xs text-muted-foreground tracking-widest uppercase">Scroll</span>
        <ChevronDown className="w-5 h-5 text-muted-foreground animate-scroll-indicator" />
      </motion.div>
    </section>
  );
}
