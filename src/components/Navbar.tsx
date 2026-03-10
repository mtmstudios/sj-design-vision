import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Leistungen", href: "/leistungen" },
  { label: "Über uns", href: "/ueber-uns" },
  { label: "Referenzen", href: "/referenzen" },
  { label: "Blog", href: "/blog" },
  { label: "Karriere", href: "/karriere" },
  { label: "Kontakt", href: "/kontakt" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [location]);

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? "glass-nav" : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-16 md:h-20">
          <Link to="/" className="flex-shrink-0">
            <img src="/images/logo.png" alt="SJ Design Logo" className="h-10 md:h-12" />
          </Link>

          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={`relative text-sm font-medium tracking-wide transition-colors duration-300 hover:text-primary ${
                  location.pathname === link.href ? "text-primary" : "text-muted-foreground"
                }`}
              >
                {link.label}
                {location.pathname === link.href && (
                  <motion.span
                    layoutId="nav-underline"
                    className="absolute -bottom-1 left-0 right-0 h-0.5 bg-primary"
                  />
                )}
              </Link>
            ))}
          </div>

          <div className="hidden lg:block">
            <Link
              to="/kontakt"
              className="px-5 py-2.5 bg-primary text-primary-foreground text-sm font-semibold rounded-lg hover:bg-primary/90 transition-all duration-300 hover:shadow-lg hover:shadow-primary/25"
            >
              Anfrage stellen
            </Link>
          </div>

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden text-foreground p-2"
            aria-label="Menü öffnen"
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </motion.nav>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 bg-background/95 backdrop-blur-xl flex flex-col items-center justify-center gap-6"
          >
            {navLinks.map((link, i) => (
              <motion.div
                key={link.href}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ delay: i * 0.05, duration: 0.3 }}
              >
                <Link
                  to={link.href}
                  className={`text-2xl font-heading font-bold transition-colors ${
                    location.pathname === link.href ? "text-primary" : "text-foreground hover:text-primary"
                  }`}
                >
                  {link.label}
                </Link>
              </motion.div>
            ))}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.3 }}
            >
              <Link
                to="/kontakt"
                className="mt-4 px-8 py-3 bg-primary text-primary-foreground font-semibold rounded-lg text-lg"
              >
                Anfrage stellen
              </Link>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
