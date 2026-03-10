import { useState } from "react";
import { motion } from "framer-motion";
import { Lightbulb, Car, Shirt, PenTool, Monitor, Sun } from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const services = [
  {
    icon: Lightbulb,
    title: "Werbetechnik",
    tagline: "Leuchtende Zeichen setzen",
    items: ["Schilder", "Pylone", "3D-Buchstaben", "LEDs", "Folien", "Roll-ups", "Messebau", "Fahnen", "Bodenbeläge", "Möbelbeschriftung"],
  },
  {
    icon: Car,
    title: "Fahrzeugbeschriftung",
    tagline: "Ihre Marke auf der Straße",
    items: ["Car Wrapping", "Flottenbeschriftung", "Wohnmobile", "Teilfolierungen"],
  },
  {
    icon: Shirt,
    title: "Textilien & Veredelung",
    tagline: "Stil trifft Qualität",
    items: ["Stick", "Siebdruck", "Digitaldruck", "Arbeitskleidung", "Sportbekleidung"],
  },
  {
    icon: PenTool,
    title: "Design & Printmedien",
    tagline: "Von der Idee zum Druck",
    items: ["Logoentwicklung", "Flyer", "Visitenkarten", "Briefpapier", "Werbemittel"],
  },
  {
    icon: Monitor,
    title: "Webdesign & Websites",
    tagline: "Digital überzeugen",
    items: ["Corporate Websites", "Landingpages", "SEO", "Online-Auftritte"],
  },
  {
    icon: Sun,
    title: "Sonnenschutzfolien",
    tagline: "Schutz mit Stil",
    items: ["Sichtschutzfolien", "Sonnenschutz", "Dekorfolien"],
  },
];

function ServiceCard({ service, index }: { service: typeof services[0]; index: number }) {
  const [flipped, setFlipped] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="perspective-1000 h-72"
      onMouseEnter={() => setFlipped(true)}
      onMouseLeave={() => setFlipped(false)}
    >
      <div
        className={`relative w-full h-full transition-transform duration-500 preserve-3d ${
          flipped ? "rotate-y-180" : ""
        }`}
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* Front */}
        <div
          className="absolute inset-0 glass-card p-8 flex flex-col items-center justify-center text-center backface-hidden hover:red-glow-sm transition-shadow duration-300"
          style={{ backfaceVisibility: "hidden" }}
        >
          <service.icon className="w-12 h-12 text-primary mb-4" strokeWidth={1.5} />
          <h3 className="text-xl font-heading font-bold mb-2">{service.title}</h3>
          <p className="text-muted-foreground text-sm">{service.tagline}</p>
        </div>

        {/* Back */}
        <div
          className="absolute inset-0 glass-card p-6 flex flex-col justify-between backface-hidden red-glow-sm"
          style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
        >
          <div>
            <h3 className="text-lg font-heading font-bold text-primary mb-3">{service.title}</h3>
            <ul className="space-y-1.5">
              {service.items.map((item) => (
                <li key={item} className="text-sm text-muted-foreground flex items-center gap-2">
                  <span className="w-1 h-1 rounded-full bg-primary flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <a href="#" className="text-primary text-sm font-semibold hover:underline mt-3">
            Mehr erfahren →
          </a>
        </div>
      </div>
    </motion.div>
  );
}

export default function ServicesSection() {
  const { ref } = useScrollAnimation();

  return (
    <section id="leistungen" className="section-padding" ref={ref}>
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-heading font-black mb-4">
            Was wir für Sie <span className="text-gradient-red">tun</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Sechs Leistungsbereiche. Ein Partner. Von der Idee bis zur Umsetzung.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, i) => (
            <ServiceCard key={service.title} service={service} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
