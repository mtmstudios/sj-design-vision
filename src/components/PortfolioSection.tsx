import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ExternalLink } from "lucide-react";

const categories = ["Alle", "Werbetechnik", "Fahrzeuge", "Textilien", "Webdesign"];

// Curated Unsplash photos per category (free-to-use)
const projects = [
  {
    title: "Leuchtschild Autohaus",
    category: "Werbetechnik",
    img: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80&auto=format&fit=crop",
  },
  {
    title: "Pylone Einkaufszentrum",
    category: "Werbetechnik",
    img: "https://images.unsplash.com/photo-1586864387789-628af9feed72?w=600&q=80&auto=format&fit=crop",
  },
  {
    title: "Fassadenbeschriftung Stuttgart",
    category: "Werbetechnik",
    img: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&q=80&auto=format&fit=crop",
  },
  {
    title: "Messewand Startup",
    category: "Werbetechnik",
    img: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&q=80&auto=format&fit=crop",
  },
  {
    title: "Flottenbeschriftung Logistik",
    category: "Fahrzeuge",
    img: "https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=600&q=80&auto=format&fit=crop",
  },
  {
    title: "Car Wrapping Sportwagen",
    category: "Fahrzeuge",
    img: "https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=600&q=80&auto=format&fit=crop",
  },
  {
    title: "Nutzfahrzeug Vollfolierung",
    category: "Fahrzeuge",
    img: "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=600&q=80&auto=format&fit=crop",
  },
  {
    title: "Teamwear Sportverein",
    category: "Textilien",
    img: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&q=80&auto=format&fit=crop",
  },
  {
    title: "Arbeitskleidung Gastronomie",
    category: "Textilien",
    img: "https://images.unsplash.com/photo-1556742031-c6961e8560b0?w=600&q=80&auto=format&fit=crop",
  },
  {
    title: "Stick-Veredelung Firma",
    category: "Textilien",
    img: "https://images.unsplash.com/photo-1607346256330-dee7af15f7c5?w=600&q=80&auto=format&fit=crop",
  },
  {
    title: "Corporate Website Handwerk",
    category: "Webdesign",
    img: "https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=600&q=80&auto=format&fit=crop",
  },
  {
    title: "Logodesign & Rebranding",
    category: "Webdesign",
    img: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=600&q=80&auto=format&fit=crop",
  },
];

export default function PortfolioSection() {
  const [filter, setFilter] = useState("Alle");

  const filtered = filter === "Alle" ? projects : projects.filter((p) => p.category === filter);

  return (
    <section id="referenzen" className="section-padding">
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
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            Ausgewählte Projekte aus über 20 Jahren Erfahrung in der Werbetechnik und darüber hinaus.
          </p>
        </motion.div>

        {/* Filter tabs */}
        <div className="flex flex-wrap justify-center gap-2.5 mb-10">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                filter === cat
                  ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25"
                  : "bg-accent text-muted-foreground hover:text-foreground hover:bg-accent/80"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Grid */}
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
                className="group relative aspect-[4/3] rounded-xl overflow-hidden cursor-pointer"
              >
                {/* Image */}
                <img
                  src={project.img}
                  alt={project.title}
                  loading="lazy"
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />

                {/* Dark overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-90 transition-opacity duration-300" />

                {/* Red accent line bottom */}
                <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-primary scale-x-0 group-hover:scale-x-100 transition-transform duration-400 origin-left" />

                {/* Content */}
                <div className="absolute inset-0 flex flex-col justify-end p-5">
                  <span className="text-xs text-primary font-semibold mb-1 uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity duration-300 translate-y-2 group-hover:translate-y-0">
                    {project.category}
                  </span>
                  <h3 className="text-sm font-heading font-bold text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 translate-y-2 group-hover:translate-y-0 delay-75">
                    {project.title}
                  </h3>
                </div>

                {/* Link icon */}
                <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="w-8 h-8 rounded-full bg-primary/80 flex items-center justify-center backdrop-blur-sm">
                    <ExternalLink className="w-3.5 h-3.5 text-white" />
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-center mt-12"
        >
          <p className="text-muted-foreground mb-4">Interesse? Wir freuen uns auf Ihr Projekt.</p>
          <a
            href="/kontakt"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-primary/90 transition-all duration-300 hover:shadow-lg hover:shadow-primary/25"
          >
            Jetzt anfragen
          </a>
        </motion.div>
      </div>
    </section>
  );
}
