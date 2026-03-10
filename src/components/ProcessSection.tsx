import { motion } from "framer-motion";

const steps = [
  { number: "01", title: "Beratung", desc: "Persönliches Gespräch, Bedarfsanalyse und Beratung vor Ort." },
  { number: "02", title: "Konzept & Design", desc: "Kreative Entwürfe und maßgeschneiderte Gestaltung." },
  { number: "03", title: "Produktion", desc: "Hochwertige Fertigung in unserer eigenen Werkstatt." },
  { number: "04", title: "Montage & Übergabe", desc: "Professionelle Installation und saubere Übergabe." },
];

export default function ProcessSection() {
  return (
    <section className="section-padding">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-heading font-black mb-4">
            So arbeiten <span className="text-gradient-red">wir</span>
          </h2>
          <p className="text-muted-foreground text-lg">Von der ersten Idee bis zur fertigen Umsetzung.</p>
        </motion.div>

        <div className="relative">
          {/* Connecting line */}
          <div className="hidden md:block absolute top-12 left-0 right-0 h-px bg-border" />

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-4">
            {steps.map((step, i) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.15 }}
                className="relative text-center md:text-left"
              >
                <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground font-heading font-bold text-sm flex items-center justify-center mx-auto md:mx-0 mb-4 relative z-10">
                  {step.number}
                </div>
                <h3 className="text-lg font-heading font-bold mb-2">{step.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
