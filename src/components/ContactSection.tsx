import { useState } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { Phone, Mail, MapPin, Clock, CheckCircle } from "lucide-react";

interface ContactForm {
  name: string;
  email: string;
  phone: string;
  service: string;
  message: string;
}

export default function ContactSection() {
  const [submitted, setSubmitted] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm<ContactForm>();

  const onSubmit = (_data: ContactForm) => {
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <section id="kontakt" className="section-padding">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-heading font-black mb-4">
            Jetzt <span className="text-gradient-red">anfragen</span>
          </h2>
          <p className="text-muted-foreground text-lg">Wir freuen uns auf Ihre Nachricht.</p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-8"
          >
            <div className="flex items-start gap-4">
              <Phone className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
              <div>
                <h4 className="font-semibold mb-1">Telefon</h4>
                <p className="text-muted-foreground text-sm">+49 (0) 711 123456</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <Mail className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
              <div>
                <h4 className="font-semibold mb-1">E-Mail</h4>
                <p className="text-muted-foreground text-sm">info@sj-design.de</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <MapPin className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
              <div>
                <h4 className="font-semibold mb-1">Adresse</h4>
                <p className="text-muted-foreground text-sm">Esslinger Straße 17<br />73779 Deizisau</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <Clock className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
              <div>
                <h4 className="font-semibold mb-1">Öffnungszeiten</h4>
                <p className="text-muted-foreground text-sm">Mo–Fr: 08:00–17:00 Uhr</p>
              </div>
            </div>
          </motion.div>

          {/* Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            {submitted ? (
              <div className="glass-card p-12 flex flex-col items-center justify-center text-center h-full">
                <CheckCircle className="w-16 h-16 text-primary mb-4" />
                <h3 className="text-xl font-heading font-bold mb-2">Vielen Dank!</h3>
                <p className="text-muted-foreground">Wir melden uns schnellstmöglich bei Ihnen.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="glass-card p-8 space-y-5">
                <div>
                  <input
                    {...register("name", { required: true, maxLength: 100 })}
                    placeholder="Ihr Name *"
                    className="w-full bg-accent/50 border border-border rounded-lg px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
                  />
                  {errors.name && <span className="text-primary text-xs mt-1">Bitte ausfüllen</span>}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <input
                      {...register("email", { required: true, pattern: /^\S+@\S+$/i, maxLength: 255 })}
                      placeholder="E-Mail *"
                      className="w-full bg-accent/50 border border-border rounded-lg px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
                    />
                    {errors.email && <span className="text-primary text-xs mt-1">Ungültige E-Mail</span>}
                  </div>
                  <input
                    {...register("phone", { maxLength: 30 })}
                    placeholder="Telefon"
                    className="w-full bg-accent/50 border border-border rounded-lg px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
                  />
                </div>
                <select
                  {...register("service")}
                  className="w-full bg-accent/50 border border-border rounded-lg px-4 py-3 text-sm text-foreground focus:outline-none focus:border-primary transition-colors"
                >
                  <option value="">Leistung wählen</option>
                  <option value="werbetechnik">Werbetechnik</option>
                  <option value="fahrzeuge">Fahrzeugbeschriftung</option>
                  <option value="textilien">Textilien & Veredelung</option>
                  <option value="design">Design & Printmedien</option>
                  <option value="webdesign">Webdesign & Websites</option>
                  <option value="sonnenschutz">Sonnenschutzfolien</option>
                </select>
                <textarea
                  {...register("message", { required: true, maxLength: 2000 })}
                  placeholder="Ihre Nachricht *"
                  rows={4}
                  className="w-full bg-accent/50 border border-border rounded-lg px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors resize-none"
                />
                {errors.message && <span className="text-primary text-xs mt-1">Bitte ausfüllen</span>}
                <button
                  type="submit"
                  className="w-full py-3.5 bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-primary/90 transition-all duration-300 hover:shadow-lg hover:shadow-primary/25"
                >
                  Anfrage absenden
                </button>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
