import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send, Bot, User, Minimize2 } from "lucide-react";

// ── Scripted Q&A knowledge base ────────────────────────────────────────────
type Reply = { text: string; quick?: string[] };

function getReply(input: string): Reply {
  const q = input.toLowerCase();

  if (/hallo|hi|guten (morgen|tag|abend)|hey/.test(q))
    return {
      text: "Hallo! 👋 Willkommen bei SJ Design. Ich helfe Ihnen gerne weiter. Was kann ich für Sie tun?",
      quick: ["Was bieten Sie an?", "Wo sind Sie?", "Wie anfragen?", "Öffnungszeiten"],
    };

  if (/leistung|angebot|was macht|was biet|service|was kann/.test(q))
    return {
      text: "Wir sind Ihr Full-Service-Partner für:\n\n• **Werbetechnik** – Schilder, Pylone, 3D-Buchstaben, Leuchtreklame\n• **Fahrzeugbeschriftung** – Car Wrapping, Folie, Flottenbeklebung\n• **Textilien & Druck** – Stickerei, Siebdruck, Berufskleidung\n• **Webdesign & Print** – Logos, Websites, Drucksachen\n• **Sonnenschutzfolien** – Sicht- und Dekorfolien\n• **Messebau** – Roll-ups, Pop-up Displays, Messewände",
      quick: ["Preise?", "Wie lange dauert's?", "Jetzt anfragen"],
    };

  if (/schild|leucht|neon|3d.buchst|pylon|fassade/.test(q))
    return {
      text: "Unsere Werbetechnik umfasst alles von einfachen Wegweisern bis zu großen Leuchtkasten-Anlagen. Wir produzieren Pylone, 3D-Buchstaben, LED-Leuchtreklame und Fassadenbeschriftungen — alles inhouse.",
      quick: ["Kosten?", "Beispiele?", "Anfragen"],
    };

  if (/auto|fahrzeug|car.wrap|folier|fleet|flotten/.test(q))
    return {
      text: "Von der Teil- bis zur Vollfolierung — wir beschriften Pkw, Transporter, LKW und ganze Fahrzeugflotten. Hochwertige Plotterfolien, Digitaldruck und professionelle Montage durch unsere Fachleute.",
      quick: ["Wie lange dauert's?", "Preise?", "Anfragen"],
    };

  if (/textil|shirt|kleid|stick|siebdruck|druck|arbeits/.test(q))
    return {
      text: "Ob Stickerei, Siebdruck oder Digitaldruck — wir veredeln T-Shirts, Poloshirts, Jacken, Caps und komplette Berufskleidung mit Ihrem Logo oder Design.",
      quick: ["Mindestmenge?", "Preise?", "Anfragen"],
    };

  if (/web|homepage|website|logo|print|flyer|visitenkarte/.test(q))
    return {
      text: "Unser Designteam erstellt für Sie professionelle Logos, Corporate Designs, Websites sowie Drucksachen wie Flyer, Visitenkarten und Geschäftsausstattungen.",
      quick: ["Portfolio sehen", "Anfragen"],
    };

  if (/preis|kost|euro|€|angebot|offert/.test(q))
    return {
      text: "Die Kosten hängen von Größe, Material und Auflage ab. Wir erstellen Ihnen gerne ein unverbindliches Angebot — einfach eine kurze Anfrage mit Ihren Vorstellungen schicken.",
      quick: ["Jetzt anfragen", "Kontakt"],
    };

  if (/wie lang|dauer|lieferzeit|wann fertig/.test(q))
    return {
      text: "Die Produktionszeit variiert je nach Umfang. Einfache Beschriftungen sind oft in 3–5 Werktagen fertig. Größere Anlagen oder Fahrzeugfolierungen planen wir gemeinsam mit Ihnen — rufen Sie uns einfach an.",
      quick: ["Kontakt", "Jetzt anfragen"],
    };

  if (/wo|adresse|standort|deizisau|stuttgart|anfahrt|lage/.test(q))
    return {
      text: "Sie finden uns in **Deizisau bei Stuttgart**:\n\nEsslinger Straße 17\n73779 Deizisau\n\nDirekt an der B10, gut erreichbar aus dem Großraum Stuttgart, Esslingen, Kirchheim und Göppingen.",
      quick: ["Öffnungszeiten", "Kontakt", "Anfahrt"],
    };

  if (/öffnung|wann offen|uhrzeit|betrieb/.test(q))
    return {
      text: "Unsere Geschäftszeiten:\n\nMo – Fr: 08:00 – 17:30 Uhr\nSa: nach Vereinbarung\n\nAußerhalb der Öffnungszeiten können Sie uns jederzeit über das Kontaktformular erreichen.",
      quick: ["Kontakt", "Wo sind Sie?"],
    };

  if (/kontakt|anfrage|anruf|telefon|mail|email|erreichen/.test(q))
    return {
      text: "Sie erreichen uns so:\n\n📞 Telefon: (bitte auf Website prüfen)\n📧 E-Mail: info@sj-design.de\n🌐 Kontaktformular auf unserer Website\n\nOder besuchen Sie uns direkt in Deizisau — wir freuen uns auf Sie!",
      quick: ["Wo sind Sie?", "Öffnungszeiten"],
    };

  if (/anfrag|bestell|buchen|beauftrag|jetzt/.test(q))
    return {
      text: "Super! Klicken Sie einfach auf den Button unten oder füllen Sie unser Kontaktformular aus. Wir melden uns in der Regel innerhalb von 24 Stunden bei Ihnen.",
      quick: ["Kontakt öffnen"],
    };

  if (/beispiel|referenz|portfolio|projekte|arbeit/.test(q))
    return {
      text: "Schauen Sie sich gerne unsere Referenzen im Portfolio-Bereich an — dort finden Sie Projekte aus allen unseren Leistungsbereichen: Werbetechnik, Fahrzeuge, Textilien und Webdesign.",
      quick: ["Portfolio ansehen", "Leistungen"],
    };

  if (/danke|super|toll|prima|klasse|perfekt/.test(q))
    return {
      text: "Gern geschehen! 😊 Wenn Sie noch Fragen haben oder ein Angebot wünschen, bin ich da.",
      quick: ["Jetzt anfragen", "Kontakt"],
    };

  if (/tschüss|bye|auf wiedersehen|ciao/.test(q))
    return {
      text: "Auf Wiedersehen! Besuchen Sie uns bald wieder — oder kommen Sie einfach persönlich in Deizisau vorbei. 👋",
    };

  // Default fallback
  return {
    text: "Das ist eine gute Frage! Am besten wenden Sie sich direkt an unser Team — wir beraten Sie persönlich und gehen auf Ihre individuelle Anfrage ein.",
    quick: ["Kontakt", "Was bieten Sie an?", "Jetzt anfragen"],
  };
}

// ── Types ──────────────────────────────────────────────────────────────────
interface Message {
  id: number;
  role: "bot" | "user";
  text: string;
  quick?: string[];
}

const WELCOME: Message = {
  id: 0,
  role: "bot",
  text: "Hallo! Ich bin der virtuelle Assistent von **SJ Design**. Wie kann ich Ihnen helfen?",
  quick: ["Was bieten Sie an?", "Wo sind Sie?", "Preise?", "Jetzt anfragen"],
};

// ── Chat widget ────────────────────────────────────────────────────────────
export default function ChatWidget() {
  const [open, setOpen]       = useState(false);
  const [messages, setMessages] = useState<Message[]>([WELCOME]);
  const [input, setInput]     = useState("");
  const [typing, setTyping]   = useState(false);
  const [unread, setUnread]   = useState(1);
  const bottomRef             = useRef<HTMLDivElement>(null);
  const inputRef              = useRef<HTMLInputElement>(null);
  const idRef                 = useRef(1);

  // Auto-scroll to bottom on new message
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  // Clear unread on open
  useEffect(() => {
    if (open) { setUnread(0); inputRef.current?.focus(); }
  }, [open]);

  function addBotReply(reply: Reply) {
    setTyping(true);
    const delay = 600 + Math.min(reply.text.length * 10, 1200);
    setTimeout(() => {
      setTyping(false);
      setMessages((prev) => [
        ...prev,
        { id: idRef.current++, role: "bot", text: reply.text, quick: reply.quick },
      ]);
      if (!open) setUnread((n) => n + 1);
    }, delay);
  }

  function send(text: string) {
    const trimmed = text.trim();
    if (!trimmed) return;
    setMessages((prev) => [...prev, { id: idRef.current++, role: "user", text: trimmed }]);
    setInput("");
    addBotReply(getReply(trimmed));
  }

  function handleQuick(label: string) {
    if (label === "Kontakt öffnen" || label === "Kontakt") {
      window.location.href = "/kontakt";
      return;
    }
    if (label === "Portfolio ansehen") {
      document.getElementById("referenzen")?.scrollIntoView({ behavior: "smooth" });
      setOpen(false);
      return;
    }
    if (label === "Leistungen") {
      document.getElementById("leistungen")?.scrollIntoView({ behavior: "smooth" });
      setOpen(false);
      return;
    }
    if (label === "Anfahrt") {
      window.open("https://maps.google.com/?q=Esslinger+Straße+17+Deizisau", "_blank");
      return;
    }
    send(label);
  }

  // Render message text with simple **bold** markdown
  function renderText(text: string) {
    return text.split("\n").map((line, i) => {
      const parts = line.split(/\*\*(.*?)\*\*/g);
      return (
        <span key={i}>
          {parts.map((p, j) =>
            j % 2 === 1 ? <strong key={j}>{p}</strong> : p,
          )}
          {i < text.split("\n").length - 1 && <br />}
        </span>
      );
    });
  }

  return (
    <>
      {/* ── Chat window ── */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.96 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            className="fixed bottom-24 right-5 z-50 flex flex-col rounded-2xl overflow-hidden shadow-2xl"
            style={{
              width: "clamp(320px, 90vw, 400px)",
              height: "clamp(440px, 65vh, 560px)",
              background: "hsl(0 0% 7%)",
              border: "1px solid hsl(0 0% 14%)",
              boxShadow: "0 0 60px rgba(229,28,32,0.1), 0 30px 60px rgba(0,0,0,0.7)",
            }}
          >
            {/* Header */}
            <div
              className="flex items-center justify-between px-4 py-3.5 flex-shrink-0"
              style={{ background: "#E51C20" }}
            >
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                  <Bot className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="text-sm font-bold text-white leading-none">SJ Design Assistent</p>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                    <span className="text-[11px] text-white/75">Online · antwortet sofort</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="text-white/70 hover:text-white transition-colors p-1"
                aria-label="Schließen"
              >
                <Minimize2 className="w-4 h-4" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin">
              {messages.map((msg) => (
                <div key={msg.id} className={`flex gap-2.5 ${msg.role === "user" ? "flex-row-reverse" : ""}`}>
                  {/* Avatar */}
                  <div
                    className="w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center mt-0.5"
                    style={{
                      background: msg.role === "bot" ? "#E51C20" : "hsl(0 0% 20%)",
                    }}
                  >
                    {msg.role === "bot"
                      ? <Bot className="w-3.5 h-3.5 text-white" />
                      : <User className="w-3.5 h-3.5 text-white/80" />
                    }
                  </div>

                  <div className={`flex flex-col gap-2 max-w-[82%] ${msg.role === "user" ? "items-end" : "items-start"}`}>
                    {/* Bubble */}
                    <div
                      className="px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed"
                      style={{
                        background:   msg.role === "bot" ? "hsl(0 0% 11%)" : "#E51C20",
                        color:        msg.role === "bot" ? "hsl(0 0% 88%)"  : "#fff",
                        borderRadius: msg.role === "bot" ? "4px 18px 18px 18px" : "18px 4px 18px 18px",
                        border:       msg.role === "bot" ? "1px solid hsl(0 0% 16%)" : "none",
                      }}
                    >
                      {renderText(msg.text)}
                    </div>

                    {/* Quick replies */}
                    {msg.quick && msg.role === "bot" && (
                      <div className="flex flex-wrap gap-1.5">
                        {msg.quick.map((q) => (
                          <button
                            key={q}
                            onClick={() => handleQuick(q)}
                            className="px-2.5 py-1 text-xs font-medium rounded-full border border-primary/35 text-primary/80 hover:bg-primary/10 hover:text-primary transition-all duration-200"
                          >
                            {q}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {/* Typing indicator */}
              {typing && (
                <div className="flex gap-2.5 items-end">
                  <div className="w-7 h-7 rounded-full bg-[#E51C20] flex items-center justify-center flex-shrink-0">
                    <Bot className="w-3.5 h-3.5 text-white" />
                  </div>
                  <div
                    className="px-4 py-3 rounded-2xl flex gap-1.5 items-center"
                    style={{
                      background: "hsl(0 0% 11%)",
                      border: "1px solid hsl(0 0% 16%)",
                      borderRadius: "4px 18px 18px 18px",
                    }}
                  >
                    {[0, 0.18, 0.36].map((d, i) => (
                      <motion.span
                        key={i}
                        className="w-1.5 h-1.5 rounded-full bg-muted-foreground/50"
                        animate={{ y: [0, -4, 0] }}
                        transition={{ duration: 0.55, repeat: Infinity, delay: d }}
                      />
                    ))}
                  </div>
                </div>
              )}

              <div ref={bottomRef} />
            </div>

            {/* Input */}
            <div
              className="flex items-center gap-2 px-3 py-3 flex-shrink-0"
              style={{ borderTop: "1px solid hsl(0 0% 13%)", background: "hsl(0 0% 6%)" }}
            >
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && send(input)}
                placeholder="Nachricht eingeben…"
                className="flex-1 bg-transparent text-sm text-foreground placeholder-muted-foreground/50 outline-none"
              />
              <button
                onClick={() => send(input)}
                disabled={!input.trim()}
                className="w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 disabled:opacity-30"
                style={{ background: input.trim() ? "#E51C20" : "hsl(0 0% 16%)" }}
                aria-label="Senden"
              >
                <Send className="w-3.5 h-3.5 text-white" />
              </button>
            </div>

            {/* Footer note */}
            <div
              className="text-center py-2 text-[10px]"
              style={{ color: "hsl(0 0% 35%)", borderTop: "1px solid hsl(0 0% 10%)" }}
            >
              🤖 Testversion · Ersetzt durch KI-Assistent
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Floating trigger button ── */}
      <motion.button
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 2, type: "spring", stiffness: 260, damping: 20 }}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.94 }}
        onClick={() => setOpen((o) => !o)}
        aria-label="Chat öffnen"
        className="fixed bottom-5 right-5 z-50 flex items-center gap-2.5 px-4 py-3 rounded-full shadow-2xl transition-all duration-200"
        style={{
          background:  open ? "hsl(0 0% 14%)" : "#E51C20",
          boxShadow:   "0 0 30px rgba(229,28,32,0.35), 0 8px 24px rgba(0,0,0,0.5)",
          border:      "1px solid rgba(255,255,255,0.08)",
        }}
      >
        <AnimatePresence mode="wait">
          {open ? (
            <motion.span key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.18 }}>
              <X className="w-5 h-5 text-white" />
            </motion.span>
          ) : (
            <motion.span key="open" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.18 }}>
              <MessageCircle className="w-5 h-5 text-white" />
            </motion.span>
          )}
        </AnimatePresence>
        <span className="text-sm font-semibold text-white whitespace-nowrap">
          {open ? "Schließen" : "Wie kann ich helfen?"}
        </span>

        {/* Unread badge */}
        {!open && unread > 0 && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-white text-[#E51C20] text-[10px] font-black flex items-center justify-center"
          >
            {unread}
          </motion.span>
        )}
      </motion.button>
    </>
  );
}
