import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ArrowRight, ArrowLeft, CheckCircle2, Clock, Send } from "lucide-react";

const SERVICES = [
  { id: "werbetechnik", label: "Werbetechnik", desc: "Schilder, Pylone, 3D-Buchstaben, Leuchtreklame" },
  { id: "fahrzeug", label: "Fahrzeugbeschriftung", desc: "Car Wrapping, Flottenbeschriftung, Teilfolierung" },
  { id: "textilien", label: "Textilien & Druck", desc: "Stickerei, Siebdruck, Berufs- & Sportkleidung" },
  { id: "design", label: "Webdesign & Print", desc: "Logos, Websites, Flyer, Geschäftsausstattung" },
  { id: "sonnenschutz", label: "Sonnenschutz", desc: "Sichtschutzfolien, Dekorfolien, Sandstrahloptik" },
  { id: "messebau", label: "Messebau", desc: "Messewände, Roll-ups, Pop-up Displays" },
];

const BUDGETS = ["Unter 500 €", "500 – 2.000 €", "2.000 – 5.000 €", "5.000 – 10.000 €", "Über 10.000 €", "Noch unklar"];
const TIMELINES = ["So schnell wie möglich", "In 2–4 Wochen", "In 1–3 Monaten", "Kein Zeitdruck"];

interface FunnelProps {
  open: boolean;
  onClose: () => void;
}

export default function InquiryFunnel({ open, onClose }: FunnelProps) {
  const [step, setStep] = useState(0);
  const [service, setService] = useState("");
  const [budget, setBudget] = useState("");
  const [timeline, setTimeline] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const canNext =
    (step === 0 && service) ||
    (step === 1 && budget && timeline) ||
    (step === 2 && name && email) ||
    step === 3;

  const reset = () => {
    setStep(0);
    setService("");
    setBudget("");
    setTimeline("");
    setName("");
    setEmail("");
    setPhone("");
    setMessage("");
    setSubmitted(false);
  };

  const handleClose = () => {
    onClose();
    setTimeout(reset, 300);
  };

  const handleSubmit = () => {
    setSubmitted(true);
    // TODO: send data to backend
  };

  const steps = ["Leistung", "Details", "Kontakt", "Absenden"];

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[60] flex items-center justify-center p-4"
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={handleClose} />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.3 }}
            className="relative w-full max-w-lg rounded-2xl border border-foreground/10 bg-background/95 backdrop-blur-xl shadow-2xl overflow-hidden"
          >
            {/* Close */}
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors z-10"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Progress bar */}
            <div className="px-6 pt-6 pb-2">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-primary" />
                  <span className="text-xs font-semibold text-primary tracking-wide">
                    Schritt {step + 1} von 4
                  </span>
                </div>
                <span className="text-xs text-muted-foreground">~60 Sekunden</span>
              </div>
              <div className="flex gap-1.5">
                {steps.map((s, i) => (
                  <div key={s} className="flex-1 flex flex-col items-center gap-1">
                    <div
                      className="w-full h-1 rounded-full transition-all duration-500"
                      style={{
                        background: i <= step ? "hsl(var(--primary))" : "hsl(var(--foreground) / 0.1)",
                      }}
                    />
                    <span
                      className="text-[10px] font-medium transition-colors"
                      style={{ color: i <= step ? "hsl(var(--primary))" : "hsl(var(--muted-foreground))" }}
                    >
                      {s}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Content */}
            <div className="px-6 py-5 min-h-[320px]">
              <AnimatePresence mode="wait">
                {submitted ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center justify-center h-[280px] text-center gap-4"
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", delay: 0.1 }}
                    >
                      <CheckCircle2 className="w-16 h-16 text-primary" />
                    </motion.div>
                    <h3 className="text-xl font-heading font-bold text-foreground">Anfrage gesendet!</h3>
                    <p className="text-sm text-muted-foreground max-w-xs">
                      Vielen Dank, {name}! Wir melden uns innerhalb von 24 Stunden bei Ihnen.
                    </p>
                    <button
                      onClick={handleClose}
                      className="mt-2 px-6 py-2.5 bg-primary text-primary-foreground font-semibold rounded-xl text-sm hover:bg-primary/90 transition-colors"
                    >
                      Schließen
                    </button>
                  </motion.div>
                ) : (
                  <motion.div
                    key={step}
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -30 }}
                    transition={{ duration: 0.25 }}
                  >
                    {/* Step 0: Leistung wählen */}
                    {step === 0 && (
                      <div>
                        <h3 className="text-lg font-heading font-bold text-foreground mb-1">
                          Was können wir für Sie tun?
                        </h3>
                        <p className="text-sm text-muted-foreground mb-4">
                          Wählen Sie den passenden Leistungsbereich.
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                          {SERVICES.map((s) => (
                            <button
                              key={s.id}
                              onClick={() => setService(s.id)}
                              className={`text-left p-3.5 rounded-xl border transition-all duration-200 ${
                                service === s.id
                                  ? "border-primary bg-primary/10"
                                  : "border-foreground/10 hover:border-foreground/20 bg-foreground/[0.03]"
                              }`}
                            >
                              <div className="text-sm font-semibold text-foreground">{s.label}</div>
                              <div className="text-xs text-muted-foreground mt-0.5">{s.desc}</div>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Step 1: Details */}
                    {step === 1 && (
                      <div>
                        <h3 className="text-lg font-heading font-bold text-foreground mb-1">
                          Budget & Zeitrahmen
                        </h3>
                        <p className="text-sm text-muted-foreground mb-4">
                          Hilft uns bei der Planung — unverbindlich.
                        </p>

                        <div className="mb-4">
                          <label className="text-xs font-semibold text-foreground/70 uppercase tracking-wider mb-2 block">
                            Budget
                          </label>
                          <div className="flex flex-wrap gap-2">
                            {BUDGETS.map((b) => (
                              <button
                                key={b}
                                onClick={() => setBudget(b)}
                                className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                                  budget === b
                                    ? "border-primary bg-primary/10 text-primary"
                                    : "border-foreground/10 text-muted-foreground hover:border-foreground/20"
                                }`}
                              >
                                {b}
                              </button>
                            ))}
                          </div>
                        </div>

                        <div>
                          <label className="text-xs font-semibold text-foreground/70 uppercase tracking-wider mb-2 block">
                            Zeitrahmen
                          </label>
                          <div className="flex flex-wrap gap-2">
                            {TIMELINES.map((t) => (
                              <button
                                key={t}
                                onClick={() => setTimeline(t)}
                                className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                                  timeline === t
                                    ? "border-primary bg-primary/10 text-primary"
                                    : "border-foreground/10 text-muted-foreground hover:border-foreground/20"
                                }`}
                              >
                                {t}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Step 2: Kontaktdaten */}
                    {step === 2 && (
                      <div>
                        <h3 className="text-lg font-heading font-bold text-foreground mb-1">
                          Ihre Kontaktdaten
                        </h3>
                        <p className="text-sm text-muted-foreground mb-4">
                          Wie können wir Sie erreichen?
                        </p>
                        <div className="space-y-3">
                          <input
                            type="text"
                            placeholder="Ihr Name *"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl border border-foreground/10 bg-foreground/[0.03] text-foreground text-sm placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary transition-colors"
                          />
                          <input
                            type="email"
                            placeholder="E-Mail-Adresse *"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl border border-foreground/10 bg-foreground/[0.03] text-foreground text-sm placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary transition-colors"
                          />
                          <input
                            type="tel"
                            placeholder="Telefon (optional)"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl border border-foreground/10 bg-foreground/[0.03] text-foreground text-sm placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary transition-colors"
                          />
                          <textarea
                            placeholder="Kurze Beschreibung Ihres Projekts (optional)"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            rows={3}
                            className="w-full px-4 py-3 rounded-xl border border-foreground/10 bg-foreground/[0.03] text-foreground text-sm placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary transition-colors resize-none"
                          />
                        </div>
                      </div>
                    )}

                    {/* Step 3: Zusammenfassung */}
                    {step === 3 && (
                      <div>
                        <h3 className="text-lg font-heading font-bold text-foreground mb-1">
                          Zusammenfassung
                        </h3>
                        <p className="text-sm text-muted-foreground mb-4">
                          Prüfen Sie Ihre Angaben und senden Sie die Anfrage ab.
                        </p>
                        <div className="space-y-3 rounded-xl border border-foreground/10 bg-foreground/[0.03] p-4">
                          {[
                            ["Leistung", SERVICES.find((s) => s.id === service)?.label || "—"],
                            ["Budget", budget || "—"],
                            ["Zeitrahmen", timeline || "—"],
                            ["Name", name],
                            ["E-Mail", email],
                            ["Telefon", phone || "—"],
                            ["Nachricht", message || "—"],
                          ].map(([k, v]) => (
                            <div key={k} className="flex justify-between text-sm">
                              <span className="text-muted-foreground">{k}</span>
                              <span className="text-foreground font-medium text-right max-w-[60%] truncate">{v}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Footer buttons */}
            {!submitted && (
              <div className="px-6 pb-6 flex items-center justify-between">
                <button
                  onClick={() => setStep((s) => s - 1)}
                  disabled={step === 0}
                  className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground disabled:opacity-0 transition-all"
                >
                  <ArrowLeft className="w-4 h-4" /> Zurück
                </button>
                {step < 3 ? (
                  <button
                    onClick={() => setStep((s) => s + 1)}
                    disabled={!canNext}
                    className="flex items-center gap-2 px-6 py-2.5 bg-primary text-primary-foreground font-semibold rounded-xl text-sm hover:bg-primary/90 disabled:opacity-40 transition-all"
                  >
                    Weiter <ArrowRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    onClick={handleSubmit}
                    className="flex items-center gap-2 px-6 py-2.5 bg-primary text-primary-foreground font-semibold rounded-xl text-sm hover:bg-primary/90 transition-all"
                  >
                    Anfrage absenden <Send className="w-4 h-4" />
                  </button>
                )}
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
