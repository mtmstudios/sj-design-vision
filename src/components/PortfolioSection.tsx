import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const categories = ["Alle", "Werbetechnik", "Fahrzeuge", "Textilien", "Webdesign"];

const projects = [
  { title: "Leuchtschild Autohaus", category: "Werbetechnik", color: "from-primary/30 to-accent" },
  { title: "Flottenbeklebung Logistik", category: "Fahrzeuge", color: "from-primary/20 to-muted" },
  { title: "Teamwear Sportverein", category: "Textilien", color: "from-muted to-primary/20" },
  { title: "Corporate Website Handwerk", category: "Webdesign", color: "from-accent to-primary/30" },
  { title: "Pylone Einkaufszentrum", category: "Werbetechnik", color: "from-primary/25 to-muted" },
  { title: "Car Wrapping Sportwagen", category: "Fahrzeuge", color: "from-muted to-primary/25" },
  { title: "Messewand Startup", category: "Werbetechnik", color: "from-primary/30 to-accent" },
  { title: "Arbeitskleidung Gastronomie", category: "Textilien", color: "from-accent to-muted" },
];

export default function PortfolioSection() {
  const [filter, setFilter] = useState("Alle");

  const filtered = filter === "Alle" ? projects : projects.filter((p) => p.category === filter);

  return (
    <section className="section-padding">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-5xl font-heading font-black mb-4">
            Unsere <span className="text-gradient-red">Arbeiten</span>
          </h2>
          <p className="text-muted-foreground text-lg">Ausgewählte Projekte aus unserem Portfolio.</p>
        </motion.div>

        <div className="flex flex-wrap justify-center gap-3 mb-10">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                filter === cat
                  ? "bg-primary text-primary-foreground"
                  : "bg-accent text-muted-foreground hover:text-foreground"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          <AnimatePresence mode="popLayout">
            {filtered.map((project) => (
              <motion.div
                key={project.title}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                className="group relative aspect-[4/3] rounded-xl overflow-hidden cursor-pointer glass-card"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${project.color}`} />
                <div className="absolute inset-0 bg-background/60 group-hover:bg-background/30 transition-all duration-300" />
                <div className="absolute inset-0 flex flex-col justify-end p-5 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <span className="text-xs text-primary font-semibold mb-1">{project.category}</span>
                  <h3 className="text-base font-heading font-bold">{project.title}</h3>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
