import { useRef } from "react";
import { motion } from "framer-motion";
import { Star, ChevronLeft, ChevronRight } from "lucide-react";

const testimonials = [
  { name: "Markus W.", company: "Autohaus Esslingen", text: "SJ Design hat unsere komplette Flottenbeklebung übernommen. Erstklassige Qualität und super schnelle Umsetzung!", rating: 5 },
  { name: "Sandra K.", company: "Bäckerei Krone", text: "Von der Leuchtreklame bis zur Website — alles aus einer Hand. Wir sind begeistert vom Ergebnis!", rating: 5 },
  { name: "Thomas R.", company: "Sportverein Deizisau", text: "Die Teamtrikots und Vereinsfahnen sehen fantastisch aus. Zuverlässig und professionell.", rating: 5 },
  { name: "Petra H.", company: "Praxis Dr. Müller", text: "Praxisbeschilderung, Visitenkarten und Webauftritt — perfekt aufeinander abgestimmt.", rating: 5 },
];

export default function TestimonialsSection() {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: "left" | "right") => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: dir === "left" ? -350 : 350, behavior: "smooth" });
    }
  };

  return (
    <section className="section-padding overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-5xl font-heading font-black mb-4">
            Was unsere Kunden <span className="text-gradient-red">sagen</span>
          </h2>
        </motion.div>

        <div className="relative">
          <div ref={scrollRef} className="flex gap-6 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide" style={{ scrollbarWidth: "none" }}>
            {testimonials.map((t, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass-card p-6 min-w-[300px] md:min-w-[350px] snap-start flex-shrink-0"
              >
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <Star key={j} className="w-4 h-4 fill-primary text-primary" />
                  ))}
                </div>
                <p className="text-muted-foreground text-sm leading-relaxed mb-4">„{t.text}"</p>
                <div>
                  <p className="font-semibold text-sm">{t.name}</p>
                  <p className="text-xs text-muted-foreground">{t.company}</p>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="flex justify-center gap-3 mt-6">
            <button onClick={() => scroll("left")} className="w-10 h-10 rounded-full bg-accent flex items-center justify-center hover:bg-primary/20 transition-colors" aria-label="Zurück">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button onClick={() => scroll("right")} className="w-10 h-10 rounded-full bg-accent flex items-center justify-center hover:bg-primary/20 transition-colors" aria-label="Weiter">
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
