import { motion } from "framer-motion";
import { MapPin } from "lucide-react";

export default function AboutSection() {
  return (
    <section className="section-padding">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
        {/* Image / Map side */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="relative rounded-2xl overflow-hidden h-[400px] lg:h-[500px] glass-card"
        >
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2635.5!2d9.385!3d48.71!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2sEsslinger+Stra%C3%9Fe+17%2C+73779+Deizisau!5e0!3m2!1sde!2sde!4v1"
            className="w-full h-full border-0 grayscale opacity-70"
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="SJ Design Standort"
          />
          <div className="absolute bottom-4 left-4 glass-card px-4 py-2 flex items-center gap-2">
            <MapPin className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium">Deizisau bei Stuttgart</span>
          </div>
        </motion.div>

        {/* Text side */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <h2 className="text-3xl md:text-5xl font-heading font-black mb-6">
            Das sind <span className="text-gradient-red">wir</span>
          </h2>
          <p className="text-muted-foreground leading-relaxed mb-6">
            SJ Design ist Ihr Full-Service Partner für Werbetechnik und Design direkt vor den Toren
            Stuttgarts. Seit über 20 Jahren verbinden wir handwerkliche Präzision mit kreativer
            Gestaltung — alles aus einer Hand, alles aus unserer eigenen Produktion.
          </p>
          <p className="text-muted-foreground leading-relaxed mb-6">
            Von der ersten Beratung über den Entwurf bis zur finalen Montage begleiten wir Sie
            persönlich. Ob Leuchtschild, Fahrzeugbeschriftung oder Corporate Website — bei uns
            bekommen Sie Qualität, die man sieht.
          </p>
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <MapPin className="w-4 h-4 text-primary flex-shrink-0" />
            <span>Esslinger Straße 17, 73779 Deizisau</span>
          </div>
          <p className="text-primary font-heading font-bold mt-4 text-lg">
            „Wir sind direkt vor den Toren Stuttgarts."
          </p>
        </motion.div>
      </div>
    </section>
  );
}
