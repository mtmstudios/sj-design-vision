import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";

const stats = [
  { value: 20, suffix: "+", label: "Jahre Erfahrung" },
  { value: 1000, suffix: "+", label: "Zufriedene Kunden" },
  { value: 6, suffix: "", label: "Leistungsbereiche" },
  { value: 100, suffix: "%", label: "Inhouse-Produktion" },
];

function AnimatedCounter({ value, suffix, label }: { value: number; suffix: string; label: string }) {
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) setStarted(true);
      },
      { threshold: 0.5 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    if (!started) return;
    const duration = 2000;
    const steps = 60;
    const increment = value / steps;
    let current = 0;
    const interval = setInterval(() => {
      current += increment;
      if (current >= value) {
        setCount(value);
        clearInterval(interval);
      } else {
        setCount(Math.floor(current));
      }
    }, duration / steps);
    return () => clearInterval(interval);
  }, [started, value]);

  return (
    <div ref={ref} className="text-center">
      <div className="text-4xl md:text-5xl font-heading font-black text-primary mb-2">
        {count}{suffix}
      </div>
      <div className="text-sm text-muted-foreground tracking-wide">{label}</div>
    </div>
  );
}

export default function StatsSection() {
  return (
    <section className="relative py-16 md:py-20">
      <div className="absolute inset-0 glass-card" />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
      <div className="relative max-w-5xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
        {stats.map((stat) => (
          <AnimatedCounter key={stat.label} {...stat} />
        ))}
      </div>
    </section>
  );
}
